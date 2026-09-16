import { prisma } from '@/lib/db';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { proxyImage } from '@/lib/imageProxy';

const tiltFor = (i: number) => [-2, 1.5, -1, 2][i % 4];
const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

export default async function TestimonialsList({ limit, showAllLink }: { limit?: number; showAllLink?: boolean }) {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    take: limit,
  });

  if (testimonials.length === 0) return null;

  return (
    <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
      {testimonials.map((t, i) => (
        <Reveal key={t.id} delay={i * 80}>
          <div className="card-flat" style={{ padding: 26, height: '100%', transform: `rotate(${tiltFor(i)}deg)`, boxShadow: `6px 6px 0 ${colorFor(i)}` }}>
            {t.rating && (
              <div style={{ color: 'var(--yellow)', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>
                {'★'.repeat(Math.max(0, Math.min(5, t.rating)))}
                <span style={{ color: 'var(--line)', opacity: 0.25 }}>{'★'.repeat(5 - Math.max(0, Math.min(5, t.rating)))}</span>
              </div>
            )}
            <p style={{ fontSize: 15.5, lineHeight: 1.6, marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proxyImage(t.photo)}
                  alt={t.author}
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--ink)', flexShrink: 0 }}
                />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.author}</div>
                {t.roleCompany && <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t.roleCompany}</div>}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
      {showAllLink && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <Button href="/testimonials">Read all stories</Button>
        </div>
      )}
    </div>
  );
}
