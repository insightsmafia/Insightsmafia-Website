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

  // Fewer than this many logos doesn't leave enough content to loop seamlessly —
  // duplicating them for the scroll animation would just repeat the same few right next to each other.
  const enoughToScroll = clients.length >= 6;
  const track = enoughToScroll ? [...clients, ...clients] : clients;

  return (
    <section style={{ padding: '44px 0', background: 'var(--bg)', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 22 }}>
        Brands we&apos;ve worked with
      </p>
      {enoughToScroll ? (
        <div className="marquee-mask">
          <div className="marquee-track">
            {track.map((c, i) => (
              <ClientItem key={`${c.id}-${i}`} c={c} />
            ))}
          </div>
        </div>
      ) : (
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 56 }}>
          {track.map((c) => (
            <ClientItem key={c.id} c={c} />
          ))}
        </div>
      )}
    </section>
  );
}
