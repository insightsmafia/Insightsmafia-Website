import { prisma } from '@/lib/db';
import { proxyImage } from '@/lib/imageProxy';

type Client = {
  id: string;
  name: string;
  logoUrl: string | null;
  linkUrl: string | null;
};

function ClientItem({ c }: { c: Client }) {
  const item = c.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={proxyImage(c.logoUrl)} alt={c.name} className="marquee-logo-img" />
  ) : (
    <span className="marquee-logo-text" style={{ fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{c.name}</span>
  );
  return c.linkUrl ? (
    <a href={c.linkUrl} target="_blank" rel="noreferrer" className="marquee-item">
      {item}
    </a>
  ) : (
    <div className="marquee-item">{item}</div>
  );
}

export default async function ClientsMarquee() {
  const clients = await prisma.clientLogo.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  if (clients.length === 0) return null;

  // Always scroll as a single continuous line — same pattern as the hero's
  // capability-badges marquee — regardless of how many logos there are.
  const track = [...clients, ...clients];

  return (
    <section style={{ padding: '32px 0 44px', background: 'var(--bg)', overflow: 'hidden', borderTop: '2px solid var(--line)' }}>
      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 36 }}>
        Brands we&apos;ve worked with
      </p>
      <div className="marquee-mask">
        <div className="marquee-track">
          {track.map((c, i) => (
            <ClientItem key={`${c.id}-${i}`} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
