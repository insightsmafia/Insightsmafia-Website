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
import { normalizeVideos, normalizeImages } from '@/lib/normalizeVideos';

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

  // Which category page a case study appears on is decided entirely by
  // its individual videos/images: each one carries the set of work
  // categories it should show under (set in the admin form - a video can
  // show on more than one). A case study shows here only if at least one
  // of its videos or images is tagged for this category - there's no
  // separate case-study-level category setting to keep in sync with those
  // tags, which was the source of an earlier bug (a video tagged for a
  // category wouldn't show unless the case study was *also* separately
  // checked into that category).
  const [allPublished, settings] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    }),
    getSettings(),
  ]);

  const projects = allPublished
    .map((p) => {
      const videos = normalizeVideos(p.videos).filter((v) => v.categories.includes(category.id));
      const images = normalizeImages(p.gallery).filter((img) => img.categories.includes(category.id));
      return {
        id: p.id,
        client: p.client,
        summary: p.summary,
        videos: videos.map((v) => ({ url: v.url, views: v.views })),
        images: images.map((img) => img.url),
        videoOrientation: p.videoOrientation === 'horizontal' ? ('horizontal' as const) : ('vertical' as const),
        industry: p.industry || null,
      };
    })
    .filter((p) => p.videos.length > 0 || p.images.length > 0);

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
            // Not wrapped in <Reveal> - its fade-in animation applies a
            // CSS transform to this subtree, which creates a new
            // containing block for position:fixed descendants and breaks
            // the reel showcase's fullscreen overlay positioning.
            <CategoryCaseStudyBrowser projects={projects} instagramUrl={settings.social?.instagram} />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
