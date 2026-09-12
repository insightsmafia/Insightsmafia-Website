import { prisma } from '@/lib/db';

export default async function ClientsMarquee() {
  const clients = await prisma.clientLogo.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  if (clients.length === 0) return null;

  const track = [...clients, ...clients];

  return (
    <section style={{ padding: '36px 0', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)', background: 'var(--surface)', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 22 }}>
        Brands we&apos;ve worked with
      </p>
      <div className="marquee-mask">
        <div className="marquee-track">
          {track.map((c, i) => {
            const item = c.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logoUrl} alt={c.name} style={{ height: 32, maxWidth: 140, objectFit: 'contain' }} />
            ) : (
              <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{c.name}</span>
            );
            return c.linkUrl ? (
              <a key={`${c.id}-${i}`} href={c.linkUrl} target="_blank" rel="noreferrer" className="marquee-item">
                {item}
              </a>
            ) : (
              <div key={`${c.id}-${i}`} className="marquee-item">
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
