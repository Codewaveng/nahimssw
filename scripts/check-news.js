if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { News, Executive } = require('../models');

async function run() {
  await connectDB();
  console.log('\n── NEWS ──────────────────────────────────');
  const news = await News.find().sort({ date: -1 });
  news.forEach(n => {
    console.log(`[${n._id}] ${n.title}`);
    console.log(`  slug: ${n.slug}  image: ${n.image || '(none)'}\n`);
  });
  console.log('\n── EXECUTIVES ────────────────────────────');
  const execs = await Executive.find().sort({ type: 1, order: 1 });
  execs.forEach(e => {
    console.log(`[${e._id}] ${e.name} — ${e.position}`);
    console.log(`  image: ${e.image || '(none)'}\n`);
  });
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
