import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import ProjectTile from '@/components/home/ProjectTile';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'What We Did? — Insights Mafia',
  description: 'Real shoots, campaigns and builds from the brands Insights Mafia has run film, social, design, code and paid media for.',
};

export default async function WorkPage() {
  const projects = await prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } });

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
              Real shoots, campaigns and builds from the brands we&apos;ve run film, social, design, code and paid media for.
            </p>
          </Reveal>

          {projects.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Case studies are on their way — check back soon.</p>
          ) : (
            <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProjectTile p={p} i={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
