import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/settings';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = (settings.siteUrl || 'https://insightsmafia.com').replace(/\/$/, '');

  const staticRoutes = ['', '/why-us', '/testimonials', '/lets-create', '/privacy-policy'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const services = await prisma.service.findMany({ where: { published: true }, select: { slug: true } });
  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes];
}
