import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { prisma } from '@/lib/db';
import { proxyImage } from '@/lib/imageProxy';

const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

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

  const projects = await prisma.project.findMany({
    where: { categoryId: category.id, published: true },
    orderBy: { order: 'asc' },
  });

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
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560, marginBottom: 56 }}>
              Case studies from our {category.label.toLowerCase()} work.
            </p>
          </Reveal>

          {projects.length === 0 ? (
            <div className="card-flat" style={{ padding: 40, textAlign: 'center', boxShadow: '6px 6px 0 var(--ink)' }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>Case studies coming soon</p>
              <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>We&apos;re adding {category.label.toLowerCase()} work here shortly.</p>
            </div>
          ) : (
            <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Link
                    href={`/work/${category.slug}/${p.slug}`}
                    className="card-flat svc-card"
                    style={{
                      display: 'flex',
                      aspectRatio: '4/3',
                      alignItems: 'flex-end',
                      padding: 20,
                      textDecoration: 'none',
                      color: 'inherit',
                      background: p.coverImage ? `url(${proxyImage(p.coverImage)}) center/cover` : colorFor(i),
                      ['--accent' as string]: 'var(--ink)',
                    } as React.CSSProperties}
                  >
                    <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{p.title}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>{p.client || p.summary || 'Case study'}</div>
                    </div>
                  </Link>
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
