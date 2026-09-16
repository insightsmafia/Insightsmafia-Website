import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) return {};
  return {
    title: service.seoTitle || `${service.title} — Insights Mafia`,
    description: service.seoDescription || service.excerpt,
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service || !service.published) notFound();

  const hasBody = Boolean(service.body && service.body !== '[]');

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              Service
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>{service.title}</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', marginBottom: hasBody ? 28 : 36 }}>{service.excerpt}</p>
            {hasBody && <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 36 }}>{service.body}</p>}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
              <Button href="/work">See Work</Button>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
