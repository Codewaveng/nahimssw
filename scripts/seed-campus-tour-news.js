require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { News } = require('../models');

const date = '2026-10-18';
const author = 'NAHIMS SW Media Team';
const articles = [
  {
    title: 'NAHIMS SW and Onboard3 Bring AI and Web3 Campus Tour to POGIL College on 20 October',
    slug: 'nahims-sw-onboard3-connect-pogil-college-health-technology-october-20-2026',
    category: 'Campus Tour', date, author, image: '/pogil-institure.jpg',
    excerpt: 'The Onboard3 Connect campus tour opens at POGIL College of Health Technology on 20 October, bringing practical AI, Web3 and digital skills learning to students.',
    content: `NAHIMS Southwest Zone (NAHIMS SW), in collaboration with Onboard3, begins its Southwest campus technology tour at POGIL College of Health Technology on 20 October 2026. The event, Onboard3 Connect: POGIL #1, invites students to learn, earn, build and onboard into new technology opportunities.

The session is part of NAHIMS SW’s effort to make practical technology learning more accessible to Health Information Management students. Participants will explore emerging digital skills, including artificial intelligence (AI) and Web3, and how these tools can support innovation in health information management.

The campus tour is led by Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS SW, and Comrade Kolawole Abdullahi Adeshina, Director of Technology. Their work is helping turn the administration’s technology focus into direct campus engagement and student learning opportunities.

POGIL is the opening stop in a wider tour of Southwest campuses. NAHIMS SW plans to reach at least 50 schools across the zone, with further campus activities planned for November and December 2026. The aim is to reach students throughout the Southwest and support positive development in AI, Web3 and other technical skills.

Event: Onboard3 Connect — POGIL #1
Date: 20 October 2026
Venue: POGIL College of Health Technology, Oke-Eri, Ijebu-Ode, Ogun State
Hosts: Comrade Abdulfatah Abdullahi and Comrade Kolawole Abdullahi Adeshina`
  },
  {
    title: 'Onboard3 Connect Comes to Royal Institute of Health Technology, Ifo on 21 October',
    slug: 'nahims-sw-onboard3-connect-royal-institute-health-technology-ifo-october-21-2026',
    category: 'Campus Tour', date, author, image: '/royal.jpg',
    excerpt: 'Royal Institute of Health Technology, Ifo is the second stop on the NAHIMS SW and Onboard3 campus tour, with an AI and Web3 event on 21 October 2026.',
    content: `The NAHIMS SW and Onboard3 campus tour continues at Royal Institute of Health Technology, Ifo, on 21 October 2026. Onboard3 Connect: Royal Institute #1 brings students together for a practical introduction to digital skills and emerging technology.

The tour encourages students to learn, earn, build and onboard through activities focused on technology, including artificial intelligence (AI) and Web3. The programme supports the growing role of technology in health information management and gives students a starting point for exploring these skills.

Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS SW, and Comrade Kolawole Abdullahi Adeshina, Director of Technology, are leading the campus engagement. Their commitment to student-focused technology activities is helping take the learning opportunity directly to schools across the zone.

Royal Institute of Health Technology, Ifo is the second scheduled campus stop, following POGIL College on 20 October. The tour continues to De Potter College of Health Technology on 22 October. NAHIMS SW plans to reach at least 50 Southwest schools, with more visits and events planned for November and December 2026.

Event: Onboard3 Connect — Royal Institute #1
Date: 21 October 2026
Venue: Royal Institute of Health Technology, Ifo, Ogun State
Hosts: Comrade Abdulfatah Abdullahi and Comrade Kolawole Abdullahi Adeshina`
  },
  {
    title: 'NAHIMS SW Campus Tech Tour Reaches De Potter College of Health Technology on 22 October',
    slug: 'nahims-sw-onboard3-connect-de-potter-college-health-technology-october-22-2026',
    category: 'Campus Tour', date, author, image: '/depotter.jpg',
    excerpt: 'De Potter College of Health Technology hosts the third October stop of the NAHIMS SW and Onboard3 tour in Ijebu-Ode on 22 October 2026.',
    content: `The NAHIMS SW and Onboard3 campus tour arrives at De Potter College of Health Technology in Ijebu-Ode on 22 October 2026. Onboard3 Connect: De Potter #1 brings the tour’s technology learning and student engagement activities to another Southwest campus.

The programme is designed to help Health Information Management students explore practical technical skills in artificial intelligence (AI), Web3 and digital innovation. Its message — learn, earn, build and onboard — reflects the goal of helping students move from curiosity to active participation in technology.

Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS SW, is hosting the campus tour with Comrade Kolawole Abdullahi Adeshina, Director of Technology. NAHIMS SW commends the General Secretary’s work in securing student opportunities and advancing a campus-by-campus technology programme, alongside the technical leadership of the Director of Technology.

The POGIL, Royal Institute and De Potter visits are the opening phase of a wider Southwest campus tour. NAHIMS SW plans events at at least 50 schools across the zone, with more campus activities planned for November and December 2026. The aim is to reach students throughout the Southwest and make a positive impact through technical skills and learning.

Event: Onboard3 Connect — De Potter #1
Date: 22 October 2026
Venue: De Potter College of Health Technology, Ijebu-Ode, Ogun State
Hosts: Comrade Abdulfatah Abdullahi and Comrade Kolawole Abdullahi Adeshina`
  },
  {
    title: '₦2 Million STX Buzz Rewards Campaign Opens to NAHIMS Southwest Students',
    slug: 'nahims-sw-naira-2-million-stx-buzz-rewards-southwest-students-2026',
    category: 'Announcement', date, author, image: '/2m.jpg',
    excerpt: 'NAHIMS SW students can join the free STX Buzz academic trivia campaign for a chance to share ₦2,000,000 in prizes. School participation is open across the Southwest.',
    content: `NAHIMS SW is inviting students and schools across the Southwest Zone to take part in a free-to-join STX Buzz academic trivia campaign, with ₦2,000,000 in prizes up for grabs. The promotion challenges participants to answer daily academic trivia in 90 seconds and gives students a way to learn, compete and take part in association activities.

The campaign is open to NAHIMS SW students from schools across the Southwest. It is intended to widen student involvement, give participants an opportunity to earn rewards and connect more chapters to upcoming learning and technology activities. Rewards are an opportunity to share; participation does not guarantee an individual prize.

Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS SW, secured the campaign for students and continues to support practical opportunities that combine learning, participation and student development. NAHIMS SW commends his work in bringing this opportunity to the zone and building a broader campus tour that aims to reach at least 50 schools across the Southwest.

To learn how your school can participate, contact your chapter president or message Comrade Abdulfatah Abdullahi, General Secretary of NAHIMS SW, on WhatsApp at 07048594341. The campaign poster lists 22 October 2026 as the registration closing date; students should contact the General Secretary promptly for current participation details.

Campaign: STX Buzz academic trivia and rewards
Entry: Free to join
Challenge: Daily academic trivia in 90 seconds
Prizes: ₦2,000,000 up for grabs
Contact: Comrade Abdulfatah Abdullahi, General Secretary, NAHIMS SW — WhatsApp 07048594341`
  }
];

async function seed() {
  await connectDB();
  for (const article of articles) {
    const result = await News.updateOne(
      { slug: article.slug },
      { $set: { ...article, published: true } },
      { upsert: true }
    );
    console.log(`${result.upsertedCount ? 'Created' : 'Updated'}: ${article.title}`);
  }
}

seed()
  .catch(error => { console.error('Campus tour news seed failed:', error); process.exitCode = 1; })
  .finally(async () => { if (mongoose.connection.readyState) await mongoose.disconnect(); });
