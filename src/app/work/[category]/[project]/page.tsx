import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import ReelShowcase from '@/components/work/ReelShowcase';
import { prisma } from '@/lib/db';
import { proxyImage } from '@/lib/imageProxy';

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

  let videos: string[] = [];
  try {
    videos = JSON.parse(project.videos || '[]');
  } catch {
    videos = [];
  }

  const hasBody = Boolean(project.body && project.body !== '[]');
  const backHref = project.category ? `/work/${project.category.slug}` : '/work';
  const backLabel = project.category ? `← ${project.category.label}` : '← All work';
  const orientation = project.videoOrientation === 'horizontal' ? 'horizontal' : 'vertical';

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap">
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              <Link href={backHref} style={{ color: 'inherit', textDecoration: 'none' }}>{backLabel}</Link>
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.1, marginBottom: 28 }}>{project.title}</h1>
          </Reveal>

          <Reveal>
            <ReelShowcase
              client={project.client}
              year={project.year}
              summary={project.summary}
              videos={videos}
              orientation={orientation}
              externalUrl={project.externalUrl}
            />
          </Reveal>
        </div>
      </section>

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
