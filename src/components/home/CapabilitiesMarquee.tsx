const capabilities = [
  { label: 'Film & Ad Shoots', color: 'var(--coral)', rotate: -3 },
  { label: 'Social Media', color: 'var(--purple)', rotate: 2 },
  { label: 'Web Dev', color: 'var(--yellow)', rotate: -2 },
  { label: 'Performance Ads', color: 'var(--purple)', rotate: 3 },
  { label: 'Branding', color: 'var(--coral)', rotate: -2 },
];

function CapabilityPill({ c }: { c: (typeof capabilities)[number] }) {
  return (
    <div
      className="marquee-item"
      style={
        {
          '--pill-color': c.color,
          '--pill-rotate': `${c.rotate}deg`,
        } as React.CSSProperties
      }
    >
      <span className="capability-pill">{c.label}</span>
    </div>
  );
}

export default function CapabilitiesMarquee() {
  const track = [...capabilities, ...capabilities];

  return (
    <section style={{ paddingTop: 8, paddingBottom: 8, background: 'var(--bg)', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 22 }}>
        What we do
      </p>
      <div className="marquee-mask">
        <div className="marquee-track pill-track">
          {track.map((c, i) => (
            <CapabilityPill key={`${c.label}-${i}`} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
