import Button from '@/components/ui/Button';
import CapabilitiesMarquee from './CapabilitiesMarquee';

export default function Hero() {
  return (
    <section
      className="section-pad hero-section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* background blobs */}
      <div className="hero-blob-yellow" style={{ position: 'absolute', top: '-10%', right: '-10%', borderRadius: '50%', background: 'var(--yellow)', opacity: 0.35, filter: 'blur(2px)' }} />
      <div className="hero-blob-purple" style={{ position: 'absolute', bottom: '-15%', left: '-10%', borderRadius: '50%', background: 'var(--purple)', opacity: 0.15 }} />

      <div className="wrap" style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
        <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 28 }}>
          You Dream. We Create!
        </p>
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(38px,6vw,68px)', lineHeight: 1.05, marginBottom: 24 }}>
          <span style={{ display: 'block' }}>Every brand needs</span>
          <span style={{ display: 'block', color: 'var(--purple)' }}>a crew that delivers.</span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 480, marginBottom: 36 }}>
          Insights Mafia is a full-service creative and growth agency — film, social, design, code and paid media, run by one tight team.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button href="#work">See the work</Button>
          <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginTop: 48 }}>
        <CapabilitiesMarquee />
      </div>
    </section>
  );
}
