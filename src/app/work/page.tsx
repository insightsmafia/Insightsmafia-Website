import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import WorkCategoryTile from '@/components/home/WorkCategoryTile';
import { workCategories } from '@/lib/workCategories';
import { getSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.workTitle || 'What We Did? — Insights Mafia',
    description: settings.workDescription || 'Real shoots, campaigns and builds from the brands Insights Mafia has run film, social, design, code and paid media for.',
  };
}

export default function WorkPage() {
  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap">
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              Our work
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>What we did?</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560, marginBottom: 56 }}>
              Pick a discipline to see the case studies behind it — real shoots, campaigns and builds from the brands we&apos;ve worked with.
            </p>
          </Reveal>

          <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {workCategories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <WorkCategoryTile slug={c.slug} label={c.label} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
