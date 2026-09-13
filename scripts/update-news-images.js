if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { News } = require('../models');

const imageMap = {
  'due-notice-2025':                   '/images/news/due-notice.svg',
  'world-blood-donor-day-2026':        '/images/news/blood-donor.svg',
  'world-no-tobacco-day-2026':         '/images/news/no-tobacco.svg',
  'who-global-health-statistics-2026': '/images/news/who-stats.svg',
  'world-hypertension-day-2026':       '/images/news/hypertension.svg',
  'world-malaria-day-2026':            '/images/news/malaria.svg',
  'world-health-day-2026':             '/images/news/world-health.svg',
  'nigeria-nhia-expansion-2026':       '/images/news/nhia.svg',
  'dhis2-nigeria-rollout-2026':        '/images/news/dhis2.svg',
  'due-registration-2026':             '/images/news/due-notice.svg',
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
