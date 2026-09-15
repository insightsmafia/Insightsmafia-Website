import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { prisma } from '@/lib/db';

const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];
const tiltFor = (i: number) => [-2, 1.5, -1, 2, -1.5, 1][i % 6];

export default async function ServicesList() {
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } });

  return (
    <section className="section-pad services-section" id="services">
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>Six disciplines. One team.</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            No hand-offs between five different agencies — we run your content, campaigns and code end to end.
          </p>
        </Reveal>

        <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <Link
                href={`/services/${s.slug}`}
                className="card-flat svc-card"
                style={{
                  display: 'block',
                  padding: 28,
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                  ['--accent' as string]: colorFor(i),
                  ['--tilt' as string]: `${tiltFor(i)}deg`,
                } as React.CSSProperties}
              >
                <div style={{ width: 40, height: 8, background: colorFor(i), borderRadius: 4, marginBottom: 20 }} />
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 14 }}>{s.excerpt}</p>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: colorFor(i) }}>See work →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
