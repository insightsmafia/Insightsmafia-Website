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

  // No duplication — the real client list just slides across once per loop.
  // As more logos get published this naturally fills the loop out on its own.
  return (
    <section style={{ padding: '32px 0 44px', background: 'var(--bg)', overflow: 'hidden', borderTop: '2px solid var(--line)' }}>
      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 36 }}>
        Brands we&apos;ve worked with
      </p>
      <div className="marquee-mask">
        <div className="marquee-track client-track">
          {clients.map((c) => (
            <ClientItem key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
