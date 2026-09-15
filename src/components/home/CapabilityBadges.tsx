const capabilities = [
  { label: 'Film & Ad Shoots', color: 'var(--coral)' },
  { label: 'Social Media', color: 'var(--purple)' },
  { label: 'Web Dev', color: 'var(--yellow)' },
  { label: 'Performance Ads', color: 'var(--purple)' },
  { label: 'Branding', color: 'var(--coral)' },
];

// Mobile-only: a static, centered, wrapped row below the hero CTAs — see
// .hero-badges-row. Desktop shows the floating badges instead.
export default function CapabilityBadges() {
  return (
    <div className="hero-badges-row">
      {capabilities.map((c) => (
        <span key={c.label} className="capability-pill" style={{ '--pill-color': c.color } as React.CSSProperties}>
          {c.label}
        </span>
      ))}
    </div>
  );
}
