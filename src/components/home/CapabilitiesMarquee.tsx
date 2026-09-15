const capabilities = [
  { label: 'Film & Ad Shoots', color: 'var(--coral)' },
  { label: 'Social Media', color: 'var(--purple)' },
  { label: 'Web Dev', color: 'var(--yellow)' },
  { label: 'Performance Ads', color: 'var(--purple)' },
  { label: 'Branding', color: 'var(--coral)' },
];

function CapabilityPill({ c }: { c: (typeof capabilities)[number] }) {
  return (
    <div className="marquee-item" style={{ '--pill-color': c.color } as React.CSSProperties}>
      <span className="capability-pill">{c.label}</span>
    </div>
  );
}

export default function CapabilitiesMarquee() {
  const track = [...capabilities, ...capabilities];

  return (
    <div className="marquee-mask">
      <div className="marquee-track pill-track">
        {track.map((c, i) => (
          <CapabilityPill key={`${c.label}-${i}`} c={c} />
        ))}
      </div>
    </div>
  );
}
