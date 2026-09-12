import { prisma } from '@/lib/db';

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  siteUrl?: string;
  homeTitle?: string;
  homeDescription?: string;
  social?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
};

const defaults: SiteSettings = {
  siteName: 'Insights Mafia',
  tagline: 'You Dream. We Create!',
  contactEmail: 'connect@insightsmafia.com',
  homeTitle: 'Insights Mafia — You Dream. We Create.',
  homeDescription:
    'Full-service creative and growth agency — content creation, social media management, web development, performance marketing, and branding.',
};

export async function getSettings(): Promise<SiteSettings> {
  const row = await prisma.content.findUnique({ where: { key: 'settings' } });
  if (!row) return defaults;
  try {
    return { ...defaults, ...JSON.parse(row.data) };
  } catch {
    return defaults;
  }
}
