import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = (settings.siteUrl || 'https://insightsmafia.com').replace(/\/$/, '');

  const staticRoutes = ['', '/why-us', '/testimonials', '/what-we-do', '/work', '/lets-create', '/privacy-policy'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const services = await prisma.service.findMany({ where: { published: true }, select: { slug: true } });
  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const categories = await prisma.projectCategory.findMany({ select: { slug: true } });
  const categoryRoutes = categories.map((c) => ({
    url: `${base}/work/${c.slug}`,
    lastModified: new Date(),
  }));

  // Case studies no longer have their own page - they're browsed one at a
  // time within their category page - so there's nothing per-project to list.
  return [...staticRoutes, ...serviceRoutes, ...categoryRoutes];
}
