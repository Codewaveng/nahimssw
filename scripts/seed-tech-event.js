if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { Event, News } = require('../models');

const SLUG_SUFFIX = '1781500000000';

const eventData = {
  title: 'AI & Web3 Launchpad — NAHIMS Tech Hub Virtual Event',
  slug: 'ai-web3-launchpad-nahims-tech-hub-virtual-event-' + SLUG_SUFFIX,
  category: 'Technology',
  eventType: 'general',
  organizer: 'Comrade Adedayo Mayowa & Comrade Abdulfatah Abdullahi',
  organizerRole: 'General Secretary, NAHIMS & General Secretary, NAHIMS SW',
  date: '2026-09-13',
  location: 'Virtual (Online)',
  description:
    'The first-ever virtual tech event under the NAHIMS SW New Dawn administration, co-hosted by NAHIMS Techub and NAHIMS SW Tech Hub. Themed "AI & Web3 Launchpad", this landmark event is co-hosted by Comrade Adedayo Mayowa (Gen Sec, NAHIMS), Comrade Abdulfatah Abdullahi (Gen Sec, NAHIMS SW), and Comrade Kolawole Abdullahi Adeshina (Director of Technology). Comrade Abdulfatah is personally sponsoring N100,000 to encourage student participation and foster collaboration.',
  fullContent: `<h2>About the Event</h2>
<p>The <strong>AI &amp; Web3 Launchpad</strong> is a groundbreaking virtual tech event jointly organised by <strong>NAHIMS Techub</strong> and <strong>NAHIMS SW Tech Hub</strong> — two of the most forward-thinking technology platforms within the National Association of Health Information Management Students (NAHIMS) ecosystem.</p>

<p>This historic event marks the <strong>first-ever virtual tech event</strong> to be held under the current NAHIMS SW New Dawn administration, setting a new standard for innovation-driven programming and academic enrichment across the Southwest Zone.</p>

<h2>Theme: AI &amp; Web3 Launchpad</h2>
<p>The theme reflects a collective vision to position NAHIMS students at the frontier of emerging technologies. Artificial Intelligence and Web3 are no longer distant concepts — they are reshaping healthcare records, data management, and digital infrastructure worldwide. This event brings those conversations directly to students.</p>

<h2>Event Hosts</h2>
<ul>
  <li><strong>Comrade Adedayo Mayowa</strong> — General Secretary, NAHIMS</li>
  <li><strong>Comrade Abdulfatah Abdullahi</strong> — General Secretary, NAHIMS Southwest Zone</li>
  <li><strong>Comrade Kolawole Abdullahi Adeshina</strong> — Director of Technology, NAHIMS SW</li>
</ul>

<h2>N100,000 Sponsorship by Comrade Abdulfatah Abdullahi</h2>
<p>In a powerful demonstration of leadership and student-first commitment, <strong>Comrade Abdulfatah Abdullahi</strong>, the General Secretary of NAHIMS Southwest, is personally sponsoring <strong>₦100,000</strong> to support this event. This contribution is designed to:</p>
<ul>
  <li>Remove financial barriers to student participation</li>
  <li>Fund prizes, incentives, and learning resources for attendees</li>
  <li>Foster meaningful collaboration between chapters across the zone</li>
</ul>

<p>"This is more than an event — it is a movement. We want our students to not just consume technology but to build with it. AI and Web3 are reshaping every industry, including health information management, and we cannot afford to be left behind," — <em>Comrade Abdulfatah Abdullahi</em>.</p>

<h2>Why Attend?</h2>
<ul>
  <li>Learn directly from tech leaders and innovators</li>
  <li>Explore the intersection of AI, Web3, and health informatics</li>
  <li>Network with students and professionals across the Southwest Zone</li>
  <li>Access exclusive learning resources and opportunities</li>
</ul>

<p><strong>Date &amp; registration details coming soon. Stay tuned on all NAHIMS SW official channels.</strong></p>`,
  image: '/techevnt.jpg',
  featured: true,
  published: true
};

const newsData = {
  title: 'NAHIMS SW Gen Sec Pledges ₦100,000 to Sponsor Landmark AI & Web3 Launchpad Virtual Tech Event',
  slug: 'nahims-sw-gen-sec-pledges-100k-ai-web3-launchpad-' + SLUG_SUFFIX,
  category: 'Technology',
  date: '2026-09-13',
  author: 'NAHIMS SW Media Team',
  excerpt:
    'Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS Southwest, has pledged a ₦100,000 personal sponsorship for the upcoming AI & Web3 Launchpad — the first-ever virtual tech event under the New Dawn administration, co-hosted by NAHIMS Techub and NAHIMS SW Tech Hub.',
  content: `<p>In a bold demonstration of commitment to technological advancement and student empowerment, <strong>Comrade Abdulfatah Abdullahi</strong>, the General Secretary of the National Association of Health Information Management Students, Southwest Zone (NAHIMS SW), has pledged a <strong>₦100,000</strong> personal sponsorship for the upcoming <strong>AI &amp; Web3 Launchpad</strong> — a historic virtual tech event set to make its debut under the current New Dawn administration.</p>

<p>The event is a joint initiative between <strong>NAHIMS Techub</strong> and <strong>NAHIMS SW Tech Hub</strong>, two vibrant technology platforms within the NAHIMS ecosystem, united by a shared mission to prepare the next generation of health information professionals for a digitally driven world.</p>

<h3>A First in the Administration</h3>
<p>The <strong>AI &amp; Web3 Launchpad</strong> holds the distinction of being the <strong>first-ever virtual tech event</strong> organised under the current NAHIMS SW administration — a milestone that underscores the New Dawn team's dedication to innovation, inclusivity, and academic excellence.</p>

<h3>Meet the Hosts</h3>
<p>The event is being co-hosted by three distinguished student leaders who bring both technical expertise and institutional authority to the programme:</p>
<ul>
  <li><strong>Comrade Adedayo Mayowa</strong> — General Secretary, NAHIMS</li>
  <li><strong>Comrade Abdulfatah Abdullahi</strong> — General Secretary, NAHIMS Southwest Zone</li>
  <li><strong>Comrade Kolawole Abdullahi Adeshina</strong> — Director of Technology, NAHIMS SW</li>
</ul>

<h3>The N100,000 Pledge</h3>
<p>Speaking on his personal ₦100,000 sponsorship, Comrade Abdulfatah expressed that the investment is driven by a genuine desire to lower the barriers to student participation in the digital economy and foster meaningful cross-chapter collaboration across the zone.</p>

<blockquote>
  <p>"This is more than an event — it is a movement. We want our students to not just consume technology but to build with it. AI and Web3 are reshaping every industry, including health information management, and we cannot afford to be left behind."</p>
  <footer>— <strong>Comrade Abdulfatah Abdullahi</strong>, General Secretary, NAHIMS SW</footer>
</blockquote>

<p>The funds are intended to cover participation incentives, prizes, and resources that make the experience rewarding and accessible for students from all chapters within the Southwest Zone.</p>

<h3>About the Theme: AI &amp; Web3 Launchpad</h3>
<p>The theme reflects a carefully chosen focus on two of the most transformative technology paradigms of our time. Artificial Intelligence is already being used to streamline medical records, predict patient outcomes, and automate administrative processes — all core concerns for health information management professionals. Web3, meanwhile, introduces decentralised models of data ownership and transparency that are beginning to influence how health data is stored and shared.</p>

<p>By bringing these conversations to NAHIMS students through a virtual platform, the organisers aim to spark curiosity, build competency, and inspire the next wave of tech-forward health informatics leaders from within the association.</p>

<h3>Stay Connected</h3>
<p>Registration details, speaker announcements, and the confirmed event date will be shared across all official NAHIMS SW channels. Students are encouraged to follow NAHIMS SW on all social media platforms and join the official WhatsApp community to stay updated.</p>

<p><em>This is NAHIMS SW — building leaders, bridging futures.</em></p>`,
  image: '/techevnt.jpg',
  published: true
};

async function seed() {
  await connectDB();

  // Remove any existing entry with the same slug to allow re-runs
  await Event.deleteOne({ slug: eventData.slug });
  await News.deleteOne({ slug: newsData.slug });

  const ev   = await Event.create(eventData);
  const news = await News.create(newsData);

  console.log('✅ Event created:', ev.title);
  console.log('✅ News created: ', news.title);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
