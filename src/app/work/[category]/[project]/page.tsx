import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import { proxyImage } from '@/lib/imageProxy';
import { getVideoEmbed } from '@/lib/videoEmbed';

export async function generateMetadata({ params }: { params: { project: string } }): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.project } });
  if (!project) return {};
  return {
    title: project.seoTitle || `${project.title} — Insights Mafia`,
    description: project.seoDescription || project.summary || undefined,
  };
}

export default async function ProjectPage({ params }: { params: { category: string; project: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.project },
    include: { category: true },
  });
  if (!project || !project.published) notFound();

  let gallery: string[] = [];
  try {
    gallery = JSON.parse(project.gallery || '[]');
  } catch {
    gallery = [];
  }

  const hasBody = Boolean(project.body && project.body !== '[]');
  const video = project.videoUrl ? getVideoEmbed(project.videoUrl) : null;
  const backHref = project.category ? `/work/${project.category.slug}` : '/work';
  const backLabel = project.category ? `← ${project.category.label}` : '← All work';

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              <Link href={backHref} style={{ color: 'inherit', textDecoration: 'none' }}>{backLabel}</Link>
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 12 }}>{project.title}</h1>
            <p style={{ color: 'var(--muted)', fontWeight: 600, marginBottom: 20 }}>
              {[project.client, project.year].filter(Boolean).join(' · ')}
            </p>
            {project.summary && <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 36 }}>{project.summary}</p>}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
              {project.externalUrl && (
                <Button href={project.externalUrl}>View Live ↗</Button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {project.coverImage && (
        <section className="wrap" style={{ marginBottom: 48 }}>
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

      {video && (
        <section className="wrap" style={{ marginBottom: 48 }}>
          <Reveal>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 'var(--radius)', border: '2px solid var(--ink)', overflow: 'hidden', background: '#000' }}>
              {video.type === 'iframe' ? (
                <iframe
                  src={video.src}
                  title={`${project.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              ) : (
                <video controls src={video.src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              )}
            </div>
          </Reveal>
        </section>
      )}

      {hasBody && (
        <section className="wrap" style={{ maxWidth: 720, marginBottom: 48 }}>
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
