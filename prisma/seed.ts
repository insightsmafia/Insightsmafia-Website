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

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
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
          contactEmail: 'hello@insightsmafia.com',
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
