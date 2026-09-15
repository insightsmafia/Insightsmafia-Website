const capabilities = [
  { label: 'Film & Ad Shoots', color: 'var(--coral)' },
  { label: 'Social Media', color: 'var(--purple)' },
  { label: 'Web Dev', color: 'var(--yellow)' },
  { label: 'Performance Ads', color: 'var(--purple)' },
  { label: 'Branding', color: 'var(--coral)' },
];

// Mobile-only: a single continuously auto-scrolling line below the hero
// CTAs, vertically centered in the remaining hero space — see
// .hero-badges-mobile / .pill-mask. Desktop shows the floating badges instead.
export default function CapabilityBadges() {
  const track = [...capabilities, ...capabilities];

  return (
    <div className="marquee-mask pill-mask">
      <div className="marquee-track pill-track">
        {track.map((c, i) => (
          <span
            key={`${c.label}-${i}`}
            className="capability-pill"
            style={{ '--pill-color': c.color } as React.CSSProperties}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
