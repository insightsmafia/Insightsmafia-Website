import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import CategoryCaseStudyBrowser from '@/components/work/CategoryCaseStudyBrowser';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/settings';
import { INDUSTRIES } from '@/lib/industries';
import { normalizeVideos } from '@/lib/normalizeVideos';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await prisma.projectCategory.findUnique({ where: { slug: params.category } });
  if (!category) return {};
  return {
    title: `${category.label} — Insights Mafia`,
    description: `Case studies from Insights Mafia's ${category.label.toLowerCase()} work.`,
  };
}

export default async function WorkCategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.projectCategory.findUnique({ where: { slug: params.category } });
  if (!category) notFound();

  // A case study can be assigned to more than one work category, so we fetch
  // every published project and filter by whether its categoryIds includes
  // this category, rather than a single-category DB-level where clause.
  const [allPublished, settings] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    getSettings(),
  ]);

  const rawProjects = allPublished.filter((p) => {
    try {
      return JSON.parse(p.categoryIds || '[]').includes(category.id);
    } catch {
      return false;
    }
  });

  const projects = rawProjects.map((p) => ({
    id: p.id,
    client: p.client,
    summary: p.summary,
    videos: normalizeVideos(p.videos),
    videoOrientation: p.videoOrientation === 'horizontal' ? ('horizontal' as const) : ('vertical' as const),
    industry: p.industry || null,
  }));

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap">
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              <Link href="/work" style={{ color: 'inherit', textDecoration: 'none' }}>← All work</Link>
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>{category.label}</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560, marginBottom: 20 }}>
              Case studies from our {category.label.toLowerCase()} work — for brands across industries like Jewellery, Fashion, Beauty, Automotive, Real Estate, Food & Beverage, Healthcare, Pharmaceuticals, Education, Hospitality, FMCG and E-commerce.
            </p>
            <div className="industry-chip-row">
              {INDUSTRIES.map((i) => (
                <span key={i} className="industry-chip">{i}</span>
              ))}
            </div>
          </Reveal>

          {projects.length === 0 ? (
            <div className="card-flat" style={{ padding: 40, textAlign: 'center', boxShadow: '6px 6px 0 var(--ink)' }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>Case studies coming soon</p>
              <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>We&apos;re adding {category.label.toLowerCase()} work here shortly.</p>
            </div>
          ) : (
            <Reveal>
              <CategoryCaseStudyBrowser projects={projects} instagramUrl={settings.social?.instagram} />
            </Reveal>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
