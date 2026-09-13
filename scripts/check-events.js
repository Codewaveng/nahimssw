if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { Event } = require('../models');

async function run() {
  await connectDB();
  const events = await Event.find().sort({ date: -1 });
  console.log(`\nTotal events: ${events.length}\n`);
  events.forEach(e => {
    console.log(`[${e._id}]`);
    console.log(`  title:     ${e.title}`);
    console.log(`  category:  ${e.category}`);
    console.log(`  featured:  ${e.featured}`);
    console.log(`  published: ${e.published}`);
    console.log(`  date:      ${e.date}`);
    console.log(`  slug:      ${e.slug}`);
    console.log(`  image:     ${e.image}`);
    console.log(`  fullContent length: ${(e.fullContent||'').length} chars\n`);
  });
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
