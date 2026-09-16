import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = (settings.siteUrl || 'https://insightsmafia.com').replace(/\/$/, '');

  const staticRoutes = ['', '/why-us', '/testimonials', '/work', '/lets-create', '/privacy-policy'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const services = await prisma.service.findMany({ where: { published: true }, select: { slug: true } });
  const serviceRoutes = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const projects = await prisma.project.findMany({ where: { published: true }, select: { slug: true } });
  const projectRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
