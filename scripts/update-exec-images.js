if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDB = require('../config/db');
const { Executive } = require('../models');

async function run() {
  await connectDB();

  // List all executives so we can confirm the right ones
  const all = await Executive.find().sort({ order: 1 });
  console.log('\nAll executives in DB:');
  all.forEach(e => console.log(`  [${e._id}] ${e.name} — ${e.position} | image: "${e.image}"`));

  // Update Gen Sec SW (Abdulfatah)
  const genSec = await Executive.findOneAndUpdate(
    { name: { $regex: /Abdulfatah/i } },
    { image: '/gen%20sec.jpg' },
    { new: true }
  );
  if (genSec) console.log(`\nUpdated Gen Sec SW: ${genSec.name} → ${genSec.image}`);
  else console.log('\nGen Sec SW not found — check name in DB above');

  // Update Director of Technology (Kolawole)
  const dot = await Executive.findOneAndUpdate(
    { name: { $regex: /Kolawole/i } },
    { image: '/dot.jpg' },
    { new: true }
  );
  if (dot) console.log(`Updated Director of Tech: ${dot.name} → ${dot.image}`);
  else console.log('Director of Tech not found — check name in DB above');

  console.log('\nDone.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
