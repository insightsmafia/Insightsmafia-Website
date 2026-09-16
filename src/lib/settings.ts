import { cache } from 'react';
import { prisma } from '@/lib/db';

export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  siteUrl?: string;
  searchConsoleProperty?: string;
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

// Multiple components on the same page (root layout, Footer, a page's own
// generateMetadata) each call this - React's cache() dedupes those into a
// single DB round trip per request instead of one per caller.
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const row = await prisma.content.findUnique({ where: { key: 'settings' } });
  if (!row) return defaults;
  try {
    return { ...defaults, ...JSON.parse(row.data) };
  } catch {
    return defaults;
  }
});
