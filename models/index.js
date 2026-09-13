const mongoose = require('mongoose');
const { Schema } = mongoose;

// ── Site (singleton) ──────────────────────────────────────────
const SiteSchema = new Schema({
  name: { type: String, default: 'NAHIMS SW' },
  fullName: { type: String, default: 'National Association of Health Information Management Students' },
  zone: { type: String, default: 'Southwest Zone (Zone D)' },
  email: String,
  phone: String,
  twitter: String,
  instagram: String,
  facebook: String,
  tiktok: String,
  whatsapp: String,
  youtubeTV: String,
  stats: {
    chapters: { type: String, default: '12' },
    members:  { type: String, default: '3,000+' },
    states:   { type: String, default: '7' },
    years:    { type: String, default: '12' }
  },
  popup: {
    enabled:      { type: Boolean, default: true },
    whatsappUrl:  { type: String, default: '' },
    xUrl:         { type: String, default: '' },
    facebookUrl:  { type: String, default: '' },
    tiktokUrl:    { type: String, default: '' },
    youtubeTVUrl: { type: String, default: '' }
  },
  announcements: [String]
});

// ── Executive ─────────────────────────────────────────────────
const ExecutiveSchema = new Schema({
  name:     { type: String, required: true },
  position: { type: String, required: true },
  school:   { type: String, required: true },
  initials: String,
  color:    { type: String, default: '#0B6E4F' },
  image:    { type: String, default: '' },
  type:     { type: String, enum: ['main', 'appointee'], default: 'main' },
  order:    { type: Number, default: 0 }
});

// ── Event ─────────────────────────────────────────────────────
const EventSchema = new Schema({
  title:         { type: String, required: true },
  slug:          String,
  category:      String,
  eventType:     { type: String, enum: ['general', 'academic'], default: 'general' },
  organizer:     String,
  organizerRole: String,
  date:          String,
  location:      String,
  description:   String,
  fullContent:   String,
  image:         { type: String, default: '' },
  featured:      { type: Boolean, default: false },
  published:     { type: Boolean, default: true }
});

// ── News ──────────────────────────────────────────────────────
const NewsSchema = new Schema({
  title:     { type: String, required: true },
  slug:      String,
  category:  String,
  date:      String,
  author:    String,
  excerpt:   String,
  content:   String,
  image:     { type: String, default: '' },
  published: { type: Boolean, default: true }
});

// ── Chapter ───────────────────────────────────────────────────
const ChapterSchema = new Schema({
  school:    { type: String, required: true },
  state:     String,
  president: String,
  phone:     String,
  due:       { type: String, enum: ['Paid', 'Pending', 'Unpaid'], default: 'Unpaid' }
});

// ── Material ──────────────────────────────────────────────────
const MaterialSchema = new Schema({
  title:       { type: String, required: true },
  description: String,
  category:    String,
  icon:        { type: String, default: 'file-text' },
  file:        { type: String, default: '' }
});

// ── Video Lecture ─────────────────────────────────────────────
const VideoLectureSchema = new Schema({
  title:      { type: String, required: true },
  lecturer:   String,
  duration:   String,
  youtubeUrl: { type: String, default: '' },
  thumbnail:  { type: String, default: '' },
  icon:       { type: String, default: 'play-circle' },
  order:      { type: Number, default: 0 }
});

// ── Sports (singleton) ────────────────────────────────────────
const SportsSchema = new Schema({
  schools: [String],
  sportLeague: [{
    pos: Number, team: String,
    p: Number, w: Number, d: Number, l: Number,
    gf: Number, ga: Number, pts: Number,
    form: [String]
  }],
  fixtures: [{
    home: String, away: String,
    date: String, time: String,
    venue: String, matchday: Number,
    status: { type: String, default: 'upcoming' }
  }],
  results: [{
    home: String, away: String,
    homeScore: Number, awayScore: Number,
    date: String, matchday: Number,
    scorers: String
  }],
  liveMatch: {
    enabled:   { type: Boolean, default: false },
    home:      String,
    away:      String,
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    minute:    { type: Number, default: 0 },
    status:    { type: String, default: '' }
  }
});

// ── Admin (singleton) ─────────────────────────────────────────
const AdminSchema = new Schema({
  username: String,
  password: String,
  name:     String
});

// ── Event Registration ────────────────────────────────────────
const RegistrationSchema = new Schema({
  fullName:    { type: String, required: true },
  school:      { type: String, required: true },
  region:      { type: String, required: true },
  state:       { type: String, required: true },
  knowsWeb3:   { type: Boolean, default: false },
  knowsAI:     { type: Boolean, default: false },
  knowsTech:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

// ── Letter History ────────────────────────────────────────────
const LetterSchema = new Schema({
  subject:     { type: String, required: true },
  toName:      { type: String, default: '' },
  signatories: [{ name: String, position: String }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = {
  Site:         mongoose.model('Site',         SiteSchema),
  Registration: mongoose.model('Registration', RegistrationSchema),
  Executive:    mongoose.model('Executive',    ExecutiveSchema),
  Event:        mongoose.model('Event',        EventSchema),
  News:         mongoose.model('News',         NewsSchema),
  Chapter:      mongoose.model('Chapter',      ChapterSchema),
  Material:     mongoose.model('Material',     MaterialSchema),
  VideoLecture: mongoose.model('VideoLecture', VideoLectureSchema),
  Sports:       mongoose.model('Sports',       SportsSchema),
  Admin:        mongoose.model('Admin',        AdminSchema),
  Letter:       mongoose.model('Letter',       LetterSchema)
};
