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

  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, category: { select: { slug: true } } },
  });
  const projectRoutes = projects
    .filter((p) => p.category)
    .map((p) => ({
      url: `${base}/work/${p.category!.slug}/${p.slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...serviceRoutes, ...categoryRoutes, ...projectRoutes];
}
