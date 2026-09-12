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

  const projects = await prisma.project.findMany({
    where: { serviceId: service.id, published: true },
    orderBy: { order: 'asc' },
  });

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
            <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
          </Reveal>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
        <div className="wrap">
          <Reveal>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, marginBottom: 40 }}>Work in {service.title.toLowerCase()}</h2>
          </Reveal>

          {projects.length === 0 ? (
            <div className="card-flat" style={{ padding: 40, textAlign: 'center', boxShadow: '6px 6px 0 var(--ink)' }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>Case studies coming soon</p>
              <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>We&apos;re adding work from this discipline here shortly.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <div
                    className="card-flat"
                    style={{
                      aspectRatio: '4/3',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 20,
                      background: p.coverImage ? `url(${p.coverImage}) center/cover` : ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3],
                      boxShadow: '6px 6px 0 var(--ink)',
                    }}
                  >
                    <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{p.title}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>{p.client || p.summary || 'Case study coming soon'}</div>
                    </div>
                  </div>
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
