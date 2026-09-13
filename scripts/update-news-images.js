if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { News } = require('../models');

const imageMap = {
  'due-notice-2025':                   '/images/news/due-notice.png',
  'world-blood-donor-day-2026':        '/images/news/blood-donor.png',
  'world-no-tobacco-day-2026':         '/images/news/no-tobacco.png',
  'who-global-health-statistics-2026': '/images/news/who-stats.png',
  'world-hypertension-day-2026':       '/images/news/hypertension.png',
  'world-malaria-day-2026':            '/images/news/malaria.png',
  'world-health-day-2026':             '/images/news/world-health.png',
  'nigeria-nhia-expansion-2026':       '/images/news/nhia.png',
  'dhis2-nigeria-rollout-2026':        '/images/news/dhis2.png',
  'due-registration-2026':             '/images/news/due-notice.png',
  'nahims-sw-gen-sec-pledges-100k-ai-web3-launchpad-1781500000000': '/techevnt.jpg',
};

async function run() {
  await connectDB();
  for (const [slug, image] of Object.entries(imageMap)) {
    const r = await News.findOneAndUpdate({ slug }, { $set: { image } });
    console.log(r ? `✅ ${slug}` : `⚠️  not found: ${slug}`);
  }
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
