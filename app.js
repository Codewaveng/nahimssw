if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs-extra');
const bcrypt     = require('bcryptjs');
const connectDB  = require('./config/db');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const {
  Site, Executive, Event, News, Chapter,
  Material, VideoLecture, Sports, Admin, Letter, Registration
} = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── View engine ───────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body parsers ──────────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ── Session ───────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'nahims-sw-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// ── File upload ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/images', req.uploadFolder || 'general');
    fs.ensureDirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    if (allowed) cb(null, true);
    else cb(new Error('Only images and PDFs are allowed'));
  }
});

// Wrap multer to handle errors without crashing the request
function handleUpload(field) {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) console.error('[upload]', err.message);
      next(); // always continue; req.file will be undefined on error
    });
  };
}

// ── Auth middleware ───────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin/login');
}

// ── Global locals middleware ──────────────────────────────────
app.use(async (req, res, next) => {
  try {
    const site = await Site.findOne().lean();
    const defaults = { stats: {}, announcements: [], popup: {}, social: {} };
    res.locals.site = site ? { ...defaults, ...site } : defaults;
    res.locals.isAdmin = !!(req.session && req.session.admin);
    next();
  } catch (err) { next(err); }
});

// helper: make slug
function makeSlug(text, suffix) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + suffix;
}

// ═══════════════════════ PUBLIC ROUTES ═══════════════════════

// Home
app.get('/', async (req, res) => {
  const [mainExecs, featuredEvents, latestNews] = await Promise.all([
    Executive.find({ type: 'main' }).sort({ order: 1 }).limit(3),
    Event.find({ published: true, featured: true }).sort({ date: -1 }),
    News.find({ published: true }).sort({ date: -1 }).limit(3)
  ]);
  res.render('index', { site: res.locals.site, page: 'home', executives: mainExecs, featuredEvents, latestNews });
});

// Executives page
app.get('/executives', async (req, res) => {
  const [mainExecs, appointees] = await Promise.all([
    Executive.find({ type: 'main' }).sort({ order: 1 }),
    Executive.find({ type: 'appointee' }).sort({ order: 1 })
  ]);
  res.render('executives', { site: res.locals.site, page: 'executives', mainExecs, appointees });
});

// Sports
app.get('/sports', async (req, res) => {
  const sports = await Sports.findOne().lean();
  res.render('sports', { site: res.locals.site, page: 'sports', sports: sports || {} });
});

// Academic
app.get('/academic', async (req, res) => {
  const [materials, videos, academicEvents] = await Promise.all([
    Material.find().sort({ _id: 1 }),
    VideoLecture.find().sort({ order: 1 }),
    Event.find({ eventType: 'academic', published: true }).sort({ date: -1 })
  ]);
  res.render('academic', { site: res.locals.site, page: 'academic', materials, videos, academicEvents });
});

// News list
app.get('/news', async (req, res) => {
  const articles = await News.find({ published: true }).sort({ date: -1 });
  res.render('news', { site: res.locals.site, page: 'news', articles });
});

// News single
app.get('/news/:slug', async (req, res) => {
  const article = await News.findOne({ slug: req.params.slug, published: true });
  if (!article) return res.redirect('/news');
  res.render('news-single', { site: res.locals.site, page: 'news', article });
});

// Event single
app.get('/events/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug, published: true });
  if (!event) return res.redirect('/');
  res.render('event-single', { site: res.locals.site, page: 'events', event });
});

// Chapters
app.get('/chapters', async (req, res) => {
  const chapters = await Chapter.find().sort({ state: 1 });
  res.render('chapters', { site: res.locals.site, page: 'chapters', chapters });
});

// Blog
app.get('/blog', async (req, res) => {
  res.render('blog', { site: res.locals.site, page: 'blog' });
});

// ═══════════════════════ ADMIN ROUTES ════════════════════════

app.get('/admin/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const adminDoc = await Admin.findOne({ username });
  if (adminDoc) {
    const valid = await bcrypt.compare(password, adminDoc.password);
    if (valid) {
      req.session.admin = true;
      req.session.adminName = adminDoc.name;
      return res.redirect('/admin');
    }
  }
  res.render('admin/login', { error: 'Invalid username or password' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── Admin: Dashboard ──────────────────────────────────────────
app.get('/admin', requireAdmin, async (req, res) => {
  const [chapters, events, news, videos] = await Promise.all([
    Chapter.find(),
    Event.find().sort({ date: -1 }),
    News.find().sort({ date: -1 }),
    VideoLecture.find()
  ]);
  const db = { chapters, events, news, videos };
  res.render('admin/dashboard', { db, adminName: req.session.adminName });
});

// ── Admin: Settings ───────────────────────────────────────────
app.get('/admin/settings', requireAdmin, async (req, res) => {
  const site = await Site.findOne();
  res.render('admin/settings', { db: { site }, success: null });
});

app.post('/admin/settings', requireAdmin, async (req, res) => {
  const site = await Site.findOne();
  Object.assign(site, {
    email: req.body.email,
    phone: req.body.phone,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    facebook: req.body.facebook,
    tiktok: req.body.tiktok,
    whatsapp: req.body.whatsapp,
    youtubeTV: req.body.youtubeTV,
    'stats.chapters': req.body.statChapters,
    'stats.members':  req.body.statMembers,
    'stats.states':   req.body.statStates,
    'stats.years':    req.body.statYears,
    'popup.enabled':      req.body.popupEnabled === 'on',
    'popup.whatsappUrl':  req.body.popupWhatsapp || '',
    'popup.xUrl':         req.body.popupX || '',
    'popup.facebookUrl':  req.body.popupFacebook || '',
    'popup.tiktokUrl':    req.body.popupTiktok || '',
    'popup.youtubeTVUrl': req.body.popupYoutubeTV || '',
    announcements: (req.body.announcements || '').split('\n').map(a => a.trim()).filter(Boolean)
  });
  site.stats = {
    chapters: req.body.statChapters,
    members:  req.body.statMembers,
    states:   req.body.statStates,
    years:    req.body.statYears
  };
  site.popup = {
    enabled:      req.body.popupEnabled === 'on',
    whatsappUrl:  req.body.popupWhatsapp  || '',
    xUrl:         req.body.popupX         || '',
    facebookUrl:  req.body.popupFacebook  || '',
    tiktokUrl:    req.body.popupTiktok    || '',
    youtubeTVUrl: req.body.popupYoutubeTV || ''
  };
  await site.save();
  res.render('admin/settings', { db: { site }, success: 'Settings saved successfully!' });
});

app.post('/admin/settings/password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminDoc = await Admin.findOne();
  const valid = await bcrypt.compare(currentPassword, adminDoc.password);
  const site = await Site.findOne();
  if (!valid) return res.render('admin/settings', { db: { site }, success: null, error: 'Current password incorrect' });
  adminDoc.password = await bcrypt.hash(newPassword, 10);
  await adminDoc.save();
  res.render('admin/settings', { db: { site }, success: 'Password changed successfully!' });
});

// ── Admin: Executives ─────────────────────────────────────────
app.get('/admin/executives', requireAdmin, async (req, res) => {
  const executives = await Executive.find().sort({ type: 1, order: 1 });
  res.render('admin/executives', { db: { executives }, success: req.query.success || null });
});

app.post('/admin/executives/add', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'executives'; next(); },
  handleUpload('image'),
  async (req, res) => {
    const count = await Executive.countDocuments({ type: req.body.type || 'main' });
    await Executive.create({
      name:     req.body.name,
      position: req.body.position,
      school:   req.body.school,
      initials: req.body.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      color:    '#0B6E4F',
      image:    req.file ? '/images/executives/' + req.file.filename : '',
      type:     req.body.type || 'main',
      order:    count + 1
    });
    res.redirect('/admin/executives?success=Executive added');
  }
);

app.post('/admin/executives/update/:id', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'executives'; next(); },
  handleUpload('image'),
  async (req, res) => {
    const exec = await Executive.findById(req.params.id);
    if (exec) {
      exec.name     = req.body.name;
      exec.position = req.body.position;
      exec.school   = req.body.school;
      exec.type     = req.body.type || exec.type;
      exec.initials = req.body.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      if (req.file) exec.image = '/images/executives/' + req.file.filename;
      else if (req.body.clearImage) exec.image = '';
      await exec.save();
    }
    res.redirect('/admin/executives?success=Executive updated');
  }
);

app.post('/admin/executives/delete/:id', requireAdmin, async (req, res) => {
  const doc = await Executive.findByIdAndDelete(req.params.id);
  if (doc?.image) fs.remove(path.join(__dirname, 'public', doc.image)).catch(() => {});
  res.redirect('/admin/executives?success=Executive removed');
});

// ── Admin: Events ─────────────────────────────────────────────
app.get('/admin/events', requireAdmin, async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.render('admin/events', { db: { events }, success: req.query.success || null });
});

app.get('/admin/events/new', requireAdmin, (req, res) => {
  res.render('admin/event-form', { db: {}, event: null, action: '/admin/events/add' });
});

app.get('/admin/events/edit/:id', requireAdmin, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.redirect('/admin/events');
  res.render('admin/event-form', { db: {}, event, action: `/admin/events/update/${event._id}` });
});

app.post('/admin/events/add', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'events'; next(); },
  handleUpload('image'),
  async (req, res) => {
    const ev = await Event.create({
      title:         req.body.title,
      slug:          makeSlug(req.body.title, Date.now()),
      category:      req.body.category,
      eventType:     req.body.eventType || 'general',
      organizer:     req.body.organizer,
      organizerRole: req.body.organizerRole,
      date:          req.body.date,
      location:      req.body.location,
      description:   req.body.description,
      fullContent:   req.body.fullContent,
      image:         req.file ? '/images/events/' + req.file.filename : '',
      featured:      req.body.featured === 'on',
      published:     req.body.published === 'on'
    });
    res.redirect('/admin/events?success=Event added');
  }
);

app.post('/admin/events/update/:id', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'events'; next(); },
  handleUpload('image'),
  async (req, res) => {
    const ev = await Event.findById(req.params.id);
    if (ev) {
      ev.title         = req.body.title;
      ev.category      = req.body.category;
      ev.eventType     = req.body.eventType || ev.eventType;
      ev.organizer     = req.body.organizer;
      ev.organizerRole = req.body.organizerRole;
      ev.date          = req.body.date;
      ev.location      = req.body.location;
      ev.description   = req.body.description;
      ev.fullContent   = req.body.fullContent;
      ev.featured      = req.body.featured === 'on';
      ev.published     = req.body.published === 'on';
      if (req.file) {
        if (ev.image) fs.remove(path.join(__dirname, 'public', ev.image)).catch(() => {});
        ev.image = '/images/events/' + req.file.filename;
      }
      await ev.save();
    }
    res.redirect('/admin/events?success=Event updated');
  }
);

app.post('/admin/events/delete/:id', requireAdmin, async (req, res) => {
  const doc = await Event.findByIdAndDelete(req.params.id);
  if (doc?.image) fs.remove(path.join(__dirname, 'public', doc.image)).catch(() => {});
  res.redirect('/admin/events?success=Event deleted');
});

// ── Admin: News ───────────────────────────────────────────────
app.get('/admin/news', requireAdmin, async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.render('admin/news', { db: { news }, success: req.query.success || null });
});

app.get('/admin/news/new', requireAdmin, (req, res) => {
  res.render('admin/news-form', { db: {}, article: null, action: '/admin/news/add' });
});

app.get('/admin/news/edit/:id', requireAdmin, async (req, res) => {
  const article = await News.findById(req.params.id);
  if (!article) return res.redirect('/admin/news');
  res.render('admin/news-form', { db: {}, article, action: `/admin/news/update/${article._id}` });
});

app.post('/admin/news/add', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'news'; next(); },
  handleUpload('image'),
  async (req, res) => {
    await News.create({
      title:     req.body.title,
      slug:      makeSlug(req.body.title, Date.now()),
      category:  req.body.category,
      date:      req.body.date || new Date().toISOString().split('T')[0],
      author:    req.body.author,
      excerpt:   req.body.excerpt,
      content:   req.body.content,
      image:     req.file ? '/images/news/' + req.file.filename : '',
      published: req.body.published === 'on'
    });
    res.redirect('/admin/news?success=Article added');
  }
);

app.post('/admin/news/update/:id', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'news'; next(); },
  handleUpload('image'),
  async (req, res) => {
    const article = await News.findById(req.params.id);
    if (article) {
      article.title     = req.body.title;
      article.category  = req.body.category;
      article.date      = req.body.date;
      article.author    = req.body.author;
      article.excerpt   = req.body.excerpt;
      article.content   = req.body.content;
      article.published = req.body.published === 'on';
      if (req.file) {
        if (article.image) fs.remove(path.join(__dirname, 'public', article.image)).catch(() => {});
        article.image = '/images/news/' + req.file.filename;
      }
      await article.save();
    }
    res.redirect('/admin/news?success=Article updated');
  }
);

app.post('/admin/news/delete/:id', requireAdmin, async (req, res) => {
  const doc = await News.findByIdAndDelete(req.params.id);
  if (doc?.image) fs.remove(path.join(__dirname, 'public', doc.image)).catch(() => {});
  res.redirect('/admin/news?success=Article deleted');
});

// ── Admin: Chapters ───────────────────────────────────────────
app.get('/admin/chapters', requireAdmin, async (req, res) => {
  const chapters = await Chapter.find().sort({ state: 1 });
  res.render('admin/chapters', { db: { chapters }, success: req.query.success || null });
});

app.post('/admin/chapters/add', requireAdmin, async (req, res) => {
  await Chapter.create({
    school:    req.body.school,
    state:     req.body.state,
    president: req.body.president,
    phone:     req.body.phone,
    due:       req.body.due
  });
  res.redirect('/admin/chapters?success=Chapter added');
});

app.post('/admin/chapters/update/:id', requireAdmin, async (req, res) => {
  await Chapter.findByIdAndUpdate(req.params.id, {
    school:    req.body.school,
    state:     req.body.state,
    president: req.body.president,
    phone:     req.body.phone,
    due:       req.body.due
  });
  res.redirect('/admin/chapters?success=Chapter updated');
});

app.post('/admin/chapters/delete/:id', requireAdmin, async (req, res) => {
  await Chapter.findByIdAndDelete(req.params.id);
  res.redirect('/admin/chapters?success=Chapter removed');
});

// ── Admin: Materials ──────────────────────────────────────────
app.get('/admin/materials', requireAdmin, async (req, res) => {
  const materials = await Material.find();
  res.render('admin/materials', { db: { materials }, success: req.query.success || null });
});

app.post('/admin/materials/add', requireAdmin,
  (req, res, next) => { req.uploadFolder = 'materials'; next(); },
  handleUpload('file'),
  async (req, res) => {
    await Material.create({
      title:       req.body.title,
      description: req.body.description,
      category:    req.body.category,
      icon:        req.body.icon || 'file-text',
      file:        req.file ? '/images/materials/' + req.file.filename : ''
    });
    res.redirect('/admin/materials?success=Material added');
  }
);

app.post('/admin/materials/delete/:id', requireAdmin, async (req, res) => {
  const doc = await Material.findByIdAndDelete(req.params.id);
  if (doc?.file) fs.remove(path.join(__dirname, 'public', doc.file)).catch(() => {});
  res.redirect('/admin/materials?success=Material deleted');
});

// ── Admin: Video Lectures ─────────────────────────────────────
app.get('/admin/videos', requireAdmin, async (req, res) => {
  const videos = await VideoLecture.find().sort({ order: 1 });
  res.render('admin/videos', { db: { videos }, success: req.query.success || null });
});

app.post('/admin/videos/add', requireAdmin, async (req, res) => {
  const count = await VideoLecture.countDocuments();
  await VideoLecture.create({
    title:      req.body.title,
    lecturer:   req.body.lecturer,
    duration:   req.body.duration,
    youtubeUrl: req.body.youtubeUrl || '',
    icon:       req.body.icon || 'play-circle',
    order:      count + 1
  });
  res.redirect('/admin/videos?success=Video lecture added');
});

app.post('/admin/videos/update/:id', requireAdmin, async (req, res) => {
  await VideoLecture.findByIdAndUpdate(req.params.id, {
    title:      req.body.title,
    lecturer:   req.body.lecturer,
    duration:   req.body.duration,
    youtubeUrl: req.body.youtubeUrl || '',
    icon:       req.body.icon || 'play-circle'
  });
  res.redirect('/admin/videos?success=Video updated');
});

app.post('/admin/videos/delete/:id', requireAdmin, async (req, res) => {
  await VideoLecture.findByIdAndDelete(req.params.id);
  res.redirect('/admin/videos?success=Video deleted');
});

// ── Admin: Sports ─────────────────────────────────────────────
app.get('/admin/sports', requireAdmin, async (req, res) => {
  const sports = await Sports.findOne();
  res.render('admin/sports', { db: { sports: sports || {} }, success: req.query.success || null });
});

// Add school
app.post('/admin/sports/school/add', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, { $addToSet: { schools: req.body.school } }, { upsert: true });
  res.redirect('/admin/sports?success=School added');
});

app.post('/admin/sports/school/delete', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, { $pull: { schools: req.body.school } });
  res.redirect('/admin/sports?success=School removed');
});

// Live match
app.post('/admin/sports/live/update', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, {
    liveMatch: {
      enabled:   req.body.liveEnabled === 'on',
      home:      req.body.liveHome,
      away:      req.body.liveAway,
      homeScore: parseInt(req.body.liveHomeScore) || 0,
      awayScore: parseInt(req.body.liveAwayScore) || 0,
      minute:    parseInt(req.body.liveMinute) || 0,
      status:    req.body.liveStatus || ''
    }
  }, { upsert: true });
  res.redirect('/admin/sports?success=Live score updated');
});

// League table
app.post('/admin/sports/league/update', requireAdmin, async (req, res) => {
  const teams = Array.isArray(req.body.team) ? req.body.team : [req.body.team];
  const sportLeague = teams.map((team, i) => ({
    pos: i + 1, team,
    p:   parseInt(req.body.p[i])    || 0,
    w:   parseInt(req.body.w[i])    || 0,
    d:   parseInt(req.body.d[i])    || 0,
    l:   parseInt(req.body.l[i])    || 0,
    gf:  parseInt(req.body.gf[i])   || 0,
    ga:  parseInt(req.body.ga[i])   || 0,
    pts: (parseInt(req.body.w[i]) || 0) * 3 + (parseInt(req.body.d[i]) || 0),
    form: (req.body.form[i] || '').split(',').map(f => f.trim()).filter(Boolean)
  }));
  await Sports.findOneAndUpdate({}, { sportLeague }, { upsert: true });
  res.redirect('/admin/sports?success=League table updated');
});

// Fixtures
app.post('/admin/sports/fixture/add', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, {
    $push: {
      fixtures: {
        home: req.body.home, away: req.body.away,
        date: req.body.date, time: req.body.time,
        venue: req.body.venue, matchday: parseInt(req.body.matchday),
        status: 'upcoming'
      }
    }
  }, { upsert: true });
  res.redirect('/admin/sports?success=Fixture added');
});

app.post('/admin/sports/fixture/delete/:subid', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, { $pull: { fixtures: { _id: req.params.subid } } });
  res.redirect('/admin/sports?success=Fixture deleted');
});

// Results
app.post('/admin/sports/result/add', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, {
    $push: {
      results: {
        home: req.body.home, away: req.body.away,
        homeScore: parseInt(req.body.homeScore),
        awayScore: parseInt(req.body.awayScore),
        date: req.body.date,
        matchday: parseInt(req.body.matchday),
        scorers: req.body.scorers || ''
      }
    }
  }, { upsert: true });
  res.redirect('/admin/sports?success=Result added');
});

app.post('/admin/sports/result/delete/:subid', requireAdmin, async (req, res) => {
  await Sports.findOneAndUpdate({}, { $pull: { results: { _id: req.params.subid } } });
  res.redirect('/admin/sports?success=Result deleted');
});

// ── Admin: Letter Generator ───────────────────────────────────
app.get('/admin/letters', requireAdmin, async (req, res) => {
  const [president, genSec, history] = await Promise.all([
    Executive.findOne({ type: 'main', position: /president/i }).sort({ order: 1 }),
    Executive.findOne({ type: 'main', position: /general secretary/i }),
    Letter.find().sort({ createdAt: -1 }).limit(50)
  ]);
  res.render('admin/letters', { active: 'letters', president, genSec, history, success: req.query.success || null, error: null });
});

app.post('/admin/letters/generate', requireAdmin, async (req, res) => {
  try {
    const { date, refNo, salutation, toName, toAddress, subject, body } = req.body;
    let sigs = req.body['signatories'] || [];
    if (!Array.isArray(sigs)) sigs = [sigs];

    const letterheadPath = path.join(__dirname, 'public', 'nahims.pdf');
    const letterheadBytes = fs.readFileSync(letterheadPath);
    const pdfDoc = await PDFDocument.load(letterheadBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black    = rgb(0, 0, 0);
    const darkGray = rgb(0.25, 0.25, 0.25);

    const marginL = 65;
    const marginR = 65;
    const maxW    = width - marginL - marginR;
    const fSize   = 10.5;
    const lh      = 16;

    function wrap(text, f, size, mw) {
      const lines = [];
      for (const para of text.split('\n')) {
        if (!para.trim()) { lines.push(''); continue; }
        const words = para.split(' ');
        let cur = '';
        for (const w of words) {
          const test = cur ? cur + ' ' + w : w;
          if (f.widthOfTextAtSize(test, size) > mw && cur) { lines.push(cur); cur = w; }
          else cur = test;
        }
        if (cur) lines.push(cur);
      }
      return lines;
    }

    function drawText(text, x, y, f, size, color) {
      page.drawText(String(text), { x, y, font: f, size, color });
    }

    let y = height - 190;

    // Date (right-aligned)
    if (date) {
      const dw = font.widthOfTextAtSize(date, fSize);
      drawText(date, width - marginR - dw, y, font, fSize, black);
      y -= lh * 1.8;
    }

    // Ref No
    if (refNo) {
      drawText('Ref: ' + refNo, marginL, y, boldFont, fSize, black);
      y -= lh * 1.8;
    }

    // Recipient
    if (salutation) { drawText(salutation, marginL, y, font, fSize, black); y -= lh; }
    if (toName)     { drawText(toName, marginL, y, boldFont, fSize, black); y -= lh; }
    if (toAddress) {
      for (const line of toAddress.split('\n')) {
        drawText(line, marginL, y, font, fSize, black); y -= lh;
      }
    }
    y -= lh * 0.6;

    // Dear line
    drawText('Dear Sir/Ma,', marginL, y, font, fSize, black);
    y -= lh * 1.8;

    // Subject
    if (subject) {
      drawText('RE: ' + subject.toUpperCase(), marginL, y, boldFont, fSize, black);
      y -= lh * 1.8;
    }

    // Body
    if (body) {
      const lines = wrap(body, font, fSize, maxW);
      for (const line of lines) {
        if (!line) { y -= lh * 0.5; continue; }
        drawText(line, marginL, y, font, fSize, black);
        y -= lh;
      }
    }

    y -= lh * 2.5;

    // Signatories
    const colW = maxW / Math.min(sigs.length, 3);
    sigs.forEach((sig, i) => {
      const col  = i % 3;
      const sigX = marginL + col * colW;
      const sigY = i < 3 ? y : y - lh * 5;
      const lineEnd = sigX + colW - 30;

      page.drawLine({ start: { x: sigX, y: sigY }, end: { x: lineEnd, y: sigY }, thickness: 0.6, color: black });
      if (sig.name)     drawText(sig.name,     sigX, sigY - 14, boldFont, 9,   black);
      if (sig.position) drawText(sig.position, sigX, sigY - 26, font,     8.5, darkGray);
    });

    const pdfBytes = await pdfDoc.save();

    // Save to history
    await Letter.create({ subject: subject || 'Untitled', toName: toName || '', signatories: sigs.filter(s => s && s.name) });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="NAHIMS-SW-Letter-${Date.now()}.pdf"`);
    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>PDF Error</h1><p>' + err.message + '</p>');
  }
});

app.post('/admin/letters/delete/:id', requireAdmin, async (req, res) => {
  await Letter.findByIdAndDelete(req.params.id);
  res.redirect('/admin/letters?success=Letter record deleted');
});

// ── Registration: AI & Web3 Launchpad ────────────────────────
app.get('/register/ai-web3-launchpad', (req, res) => {
  res.render('register', { site: res.locals.site });
});

app.post('/register/ai-web3-launchpad', async (req, res) => {
  const { fullName, school, region, state, knowsWeb3, knowsAI, knowsTech } = req.body;
  if (!fullName || !school || !region || !state) {
    return res.render('register', { site: res.locals.site, error: 'Please fill in all required fields.' });
  }
  await Registration.create({
    fullName: fullName.trim(),
    school:   school.trim(),
    region, state,
    knowsWeb3:  knowsWeb3  === 'yes',
    knowsAI:    knowsAI    === 'yes',
    knowsTech:  knowsTech  === 'yes'
  });
  res.redirect('/register/ai-web3-launchpad/success');
});

app.get('/register/ai-web3-launchpad/success', (req, res) => {
  res.render('register-success', { site: res.locals.site });
});

// ── Admin: Registrations ──────────────────────────────────────
app.get('/admin/registrations', requireAdmin, async (req, res) => {
  const registrations = await Registration.find().sort({ createdAt: -1 });
  const stats = {
    total:    registrations.length,
    web3:     registrations.filter(r => r.knowsWeb3).length,
    ai:       registrations.filter(r => r.knowsAI).length,
    tech:     registrations.filter(r => r.knowsTech).length,
    sw:       registrations.filter(r => r.region === 'Southwest (Zone D)').length
  };
  res.render('admin/registrations', { active: 'registrations', registrations, stats, success: req.query.success || null });
});

app.post('/admin/registrations/delete/:id', requireAdmin, async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.redirect('/admin/registrations?success=Registration deleted');
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('<h1>Server Error</h1><p>' + err.message + '</p>');
});

// ── Start ─────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌿 NAHIMS SW NEW DAWN running at http://localhost:${PORT}`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`   Username: admin | Password: admin123\n`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  console.error('Please set MONGODB_URI in your .env file');
  process.exit(1);
});
