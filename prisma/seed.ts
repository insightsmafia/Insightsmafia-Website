import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  {
    slug: 'content-creation',
    title: 'Content Creation',
    excerpt: 'Filmmaking and ad shoots — from brand films to social-first video.',
    order: 1,
    featured: true,
  },
  {
    slug: 'content-planning',
    title: 'Content Planning',
    excerpt: 'Calendars built for socials that carry a brand voice across months.',
    order: 2,
    featured: true,
  },
  {
    slug: 'social-media-management',
    title: 'Social Media Management',
    excerpt: 'Day-to-day handling of your channels — posting, replying, growing.',
    order: 3,
    featured: true,
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    excerpt: 'Sites and platforms built to load fast and turn visitors into leads.',
    order: 4,
    featured: true,
  },
  {
    slug: 'performance-marketing',
    title: 'Performance Marketing',
    excerpt: 'Campaigns that drive results — measured against revenue.',
    order: 5,
    featured: true,
  },
  {
    slug: 'branding-logo-design',
    title: 'Branding & Logo Design',
    excerpt: 'Identity systems — logo, colour, type — that make a business recognisable.',
    order: 6,
    featured: true,
  },
];

const faqs = [
  {
    question: 'What does Insights Mafia actually do?',
    answer: 'We run content creation, content planning, social media management, web development, performance marketing and branding as one team — no hand-offs between separate agencies.',
    order: 1,
  },
  {
    question: 'How fast can we start?',
    answer: 'Most projects kick off within a week of the discovery call — we send a plan to approve before any shoot, build or campaign begins.',
    order: 2,
  },
  {
    question: 'Do you work with early-stage brands or only established ones?',
    answer: 'Both. We tailor scope and pricing to where you are — a first brand film and a full always-on retainer get the same rigor.',
    order: 3,
  },
  {
    question: 'How do you price projects?',
    answer: 'Project-based for one-off shoots, sites or campaigns; retainer-based for ongoing social, content or performance marketing work. You get a fixed quote before anything starts.',
    order: 4,
  },
  {
    question: 'Where are you based, and do you work with brands outside India?',
    answer: 'We’re based in India and work with brands everywhere — shoots and on-site work are scheduled around your location, everything else runs remotely.',
    order: 5,
  },
  {
    question: 'How do we get in touch?',
    answer: 'Use the Let’s Create page to send us what you’re building — we reply within one business day.',
    order: 6,
  },
];

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  const existingFaqCount = await prisma.faq.count();
  if (existingFaqCount === 0) {
    await prisma.faq.createMany({ data: faqs });
  }

  const existingSettings = await prisma.content.findUnique({ where: { key: 'settings' } });
  if (!existingSettings) {
    await prisma.content.create({
      data: {
        key: 'settings',
        data: JSON.stringify({
          siteName: 'Insights Mafia',
          tagline: 'You Dream. We Create!',
          logo: '/logo.jpg',
          contactEmail: 'connect@insightsmafia.com',
          homeTitle: 'Insights Mafia — You Dream. We Create.',
          homeDescription:
            'Full-service creative and growth agency — content creation, social media management, web development, performance marketing, and branding.',
        }),
      },
    });
  }

  const email = process.env.ADMIN_EMAIL || 'admin@insightsmafia.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name: process.env.ADMIN_NAME || 'Neeraj',
        role: 'owner',
      },
    });
    console.log(`Admin user created: ${email} / ${password} — change this password after first login.`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
