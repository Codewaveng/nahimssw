if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const connectDB = require('../config/db');
const { Event } = require('../models');

const updates = [
  {
    slug: 'convention-2026',
    description: 'The NAHIMS SW Annual Convention 2026 brought together student leaders, chapter presidents, and delegates from all seven Southwest states for a landmark gathering of minds under the New Dawn Administration.',
    fullContent: `<h2>About the NAHIMS SW Annual Convention 2026</h2>
<p>The <strong>NAHIMS SW Annual Convention 2026</strong> stands as one of the most significant gatherings in the history of the National Association of Health Information Management Students, Southwest Zone. Held under the banner of the New Dawn Administration, the convention convened student leaders, chapter presidents, and delegates from all seven states within the Southwest Zone — bringing together the brightest and most committed voices in health information management education.</p>

<p>The event served as the apex of student governance for the zone, combining official business sessions with academic enrichment, professional networking, and cultural celebration of the bond that unites NAHIMS SW members across state lines.</p>

<h2>Theme & Focus</h2>
<p>The convention centred on the vision of the New Dawn Administration: building a stronger, more united, and academically excellent NAHIMS Southwest. Sessions covered constitutional matters, financial reports, chapter performance reviews, and strategic planning for the 2026/2027 academic year.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Formal inauguration proceedings under the New Dawn Administration</li>
  <li>Chapter-by-chapter progress report presentations</li>
  <li>Welfare review: student dues, chapter needs, and support framework</li>
  <li>Sports zonal delegation and inter-chapter competition planning</li>
  <li>Academic calendar alignment and examination support structures</li>
  <li>Networking dinner and cultural evening celebrating Southwest unity</li>
</ul>

<h2>Delegation from Seven States</h2>
<p>Delegates travelled from institutions across <strong>Lagos, Ogun, Oyo, Osun, Ondo, Ekiti, and Kwara</strong> states to participate in deliberations that would shape the direction of NAHIMS SW for the coming year. Each chapter presented their progress, challenges, and aspirations — reaffirming the collective spirit of the zone.</p>

<h2>Resolutions Passed</h2>
<p>At the close of the convention, delegates unanimously adopted a series of resolutions aimed at strengthening the academic, welfare, and sports machinery of the zone. These included commitments to timely dues remittance, greater inter-chapter collaboration, and full support for the landmark AI & Web3 Launchpad tech initiative.</p>

<p><em>The NAHIMS SW Annual Convention 2026 — a milestone in student governance, unity, and the pursuit of excellence.</em></p>`
  },
  {
    slug: 'him-tech-summit-2024',
    description: 'The Onboard3 Web3 Meetup at OSCOHEALTH brought health information management students and professionals face-to-face with the transformative potential of blockchain technology, decentralised data systems, and Web3 tools in modern healthcare delivery.',
    fullContent: `<h2>Onboard3 Web3 Meetup — OSCOHEALTH</h2>
<p>The <strong>Onboard3 Web3 Meetup at OSCOHEALTH</strong> was a pioneering technology event that placed health information management students at the intersection of two of the most disruptive forces in modern healthcare: <strong>blockchain technology</strong> and <strong>Web3 infrastructure</strong>. Hosted within the ecosystem of one of Nigeria's leading health institutions, this meetup was a defining moment in the NAHIMS SW technology agenda.</p>

<p>Organized through the partnership of NAHIMS Techub and the NAHIMS SW Tech Hub, the event drew students, clinical staff, digital health advocates, and Web3 builders into a single conversation about the future of health data management in a decentralised world.</p>

<h2>Why OSCOHEALTH?</h2>
<p>OSCOHEALTH was chosen as the venue because of its unique position as both a centre of clinical excellence and a hub of progressive thinking on digital health transformation in Southwest Nigeria. Bringing Web3 conversations into this environment allowed students to see directly how decentralised technologies could address real challenges in patient record management, interoperability, and health data sovereignty.</p>

<h2>What Was Covered</h2>
<ul>
  <li><strong>Introduction to Web3 for Health Professionals</strong> — demystifying blockchain, smart contracts, and decentralised identity for HIM students</li>
  <li><strong>Health Data on the Blockchain</strong> — exploring how distributed ledger technology can secure, verify, and share patient records without central authority risks</li>
  <li><strong>NFTs & Digital Credentials</strong> — the emerging use of NFTs for academic certificates and professional licences in healthcare</li>
  <li><strong>DeFi in Healthcare Financing</strong> — how decentralised finance models can fund community health initiatives</li>
  <li><strong>Hands-on Wallet Setup</strong> — participants onboarded to Web3 wallets, completed their first on-chain transactions, and explored a live dApp</li>
  <li><strong>Open Q&A with Web3 Builders</strong> — direct interaction with developers building health-focused Web3 applications</li>
</ul>

<h2>Impact & Takeaways</h2>
<p>The OSCOHEALTH meetup left attendees with a concrete understanding of how Web3 is not a distant concept but an active, evolving ecosystem with specific applications in the healthcare sector. Students who attended left with:
</p>
<ul>
  <li>Live Web3 wallet addresses and their first on-chain experience</li>
  <li>A clear mental model of how blockchain solves health data interoperability problems</li>
  <li>Direct connections with Web3 professionals and developers in the health tech space</li>
  <li>Resources to continue their Web3 learning journey through the NAHIMS Techub community</li>
</ul>

<h2>The Onboard3 Vision</h2>
<p>The Onboard3 series is a NAHIMS SW Tech Hub initiative designed to onboard health information management students into the Web3 ecosystem through accessible, hands-on events held at major health institutions across the Southwest. The OSCOHEALTH edition was one of a series of meetups bringing this vision to life, with more planned across the zone.</p>

<p><em>Onboard3 — where healthcare meets the decentralised future.</em></p>`
  },
  {
    slug: 'digital-health-workshop-2024',
    description: 'The Onboard3 Web3 Meetup at the University of Ilorin Teaching Hospital (UITH) introduced HIM students and healthcare professionals to the practical applications of blockchain and decentralised technology in clinical data management and health informatics.',
    fullContent: `<h2>Onboard3 Web3 Meetup — UITH</h2>
<p>The <strong>Onboard3 Web3 Meetup at the University of Ilorin Teaching Hospital (UITH)</strong> was the second major event in the Onboard3 series — a NAHIMS SW Tech Hub flagship initiative designed to bring Web3 education directly to the doorstep of health information management students and healthcare professionals across Nigeria's Southwest Zone.</p>

<p>UITH, as one of Nigeria's premier tertiary health institutions and a major training ground for health information management professionals, provided the ideal setting for this conversation. The event drew enthusiastic participation from HIM students, clinical record officers, IT staff, and healthcare administrators eager to understand how decentralised technology is reshaping their field.</p>

<h2>Why UITH?</h2>
<p>The University of Ilorin Teaching Hospital occupies a special place in the health information management landscape — it trains some of the most capable HIM professionals in the country and serves as a live environment where the challenges of health data management play out every day. By hosting an Onboard3 meetup within this environment, NAHIMS SW brought the Web3 conversation directly to students who can see — and solve — real-world data management problems.</p>

<h2>Event Programme</h2>
<ul>
  <li><strong>Opening Address by NAHIMS SW Tech Hub</strong> — the vision behind Onboard3 and why Web3 matters for HIM</li>
  <li><strong>Web3 Fundamentals for HIM Students</strong> — blockchain basics, consensus mechanisms, and how they apply to health records</li>
  <li><strong>Electronic Health Records (EHR) on the Blockchain</strong> — a deep dive into decentralised EHR architectures and why they outperform centralised alternatives in interoperability and security</li>
  <li><strong>Patient Data Ownership & Consent on Web3</strong> — how smart contracts enable patients to control who sees their records</li>
  <li><strong>Real-world Case Studies</strong> — Web3 health projects from Africa and globally that are solving HIM challenges</li>
  <li><strong>Practical Onboarding Session</strong> — wallet creation, testnet transactions, and exploring a live health data dApp</li>
  <li><strong>Networking & Mentorship</strong> — open floor session with tech professionals and NAHIMS SW leadership</li>
</ul>

<h2>Key Outcomes</h2>
<p>The UITH Onboard3 Meetup was more than an event — it was a movement moment. Outcomes included:</p>
<ul>
  <li>Over 50 students and health workers successfully onboarded to Web3 wallets</li>
  <li>Formation of a UITH-based Web3 study group linked to the NAHIMS Techub network</li>
  <li>Deepened awareness of the intersection between health informatics and emerging technologies</li>
  <li>Commitment from UITH chapter leadership to host quarterly digital health workshops</li>
  <li>Live showcase of a blockchain-based patient records prototype built by NAHIMS SW tech community members</li>
</ul>

<h2>Quotes from Attendees</h2>
<blockquote>
  <p>"I came in thinking blockchain was only for cryptocurrency. I left knowing it could solve the record duplication problems we see every day in this hospital."</p>
  <footer>— HIM Student, UITH</footer>
</blockquote>
<blockquote>
  <p>"The Onboard3 meetup at UITH showed us that the future of health records is decentralised. NAHIMS SW is ahead of the curve."</p>
  <footer>— Clinical Records Officer, UITH</footer>
</blockquote>

<h2>The Onboard3 Legacy</h2>
<p>Together with the OSCOHEALTH edition, the UITH meetup established Onboard3 as the most impactful tech education series in NAHIMS SW history. Both events are part of a broader strategy by the NAHIMS SW Tech Hub and NAHIMS Techub to build a generation of health information management professionals who are not just consumers of digital health tools, but builders and advocates for a decentralised health data ecosystem.</p>

<p><em>Onboard3 UITH — knowledge that transforms, technology that heals.</em></p>`
  }
];

async function run() {
  await connectDB();
  for (const u of updates) {
    const result = await Event.findOneAndUpdate(
      { slug: u.slug },
      { $set: { description: u.description, fullContent: u.fullContent } },
      { new: true }
    );
    if (result) {
      console.log(`✅ Updated: ${result.title}`);
    } else {
      console.log(`⚠️  Not found: slug = ${u.slug}`);
    }
  }
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
