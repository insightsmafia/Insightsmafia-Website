import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import { proxyImage } from '@/lib/imageProxy';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return {};
  return {
    title: project.seoTitle || `${project.title} — Insights Mafia`,
    description: project.seoDescription || project.summary || undefined,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project || !project.published) notFound();

  let gallery: string[] = [];
  try {
    gallery = JSON.parse(project.gallery || '[]');
  } catch {
    gallery = [];
  }

  const hasBody = Boolean(project.body && project.body !== '[]');

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              {project.client || 'Case study'}
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>{project.title}</h1>
            {project.summary && <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 36 }}>{project.summary}</p>}
            <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
          </Reveal>
        </div>
      </section>

      {project.coverImage && (
        <section className="wrap" style={{ marginBottom: 56 }}>
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proxyImage(project.coverImage)}
              alt={project.title}
              style={{ width: '100%', borderRadius: 'var(--radius)', border: '2px solid var(--ink)', display: 'block' }}
            />
          </Reveal>
        </section>
      )}

      {hasBody && (
        <section className="wrap" style={{ maxWidth: 720, marginBottom: 56 }}>
          <Reveal>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{project.body}</p>
          </Reveal>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="wrap" style={{ marginBottom: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={proxyImage(src)} alt="" style={{ width: '100%', borderRadius: 'var(--radius)', border: '2px solid var(--ink)', display: 'block' }} />
            ))}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}
