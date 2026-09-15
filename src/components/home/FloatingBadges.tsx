'use client';

import { useEffect, useRef } from 'react';

const badges = [
  {
    label: 'Film & Ad Shoots',
    color: 'var(--coral)',
    rotate: -6,
    depth: 30,
    bobDelay: '0s',
    desktop: { top: '6%', left: '58%' },
    // mobile: anchored to the fixed top-padding zone reserved on .hero-section
    mobile: { top: '18px', left: '56%' },
  },
  {
    label: 'Social Media',
    color: 'var(--purple)',
    rotate: 4,
    depth: 55,
    bobDelay: '0.6s',
    desktop: { top: '28%', left: '78%' },
    mobile: { top: '62px', left: '6%' },
  },
  {
    label: 'Web Dev',
    color: 'var(--yellow)',
    rotate: -3,
    depth: 20,
    bobDelay: '1.2s',
    desktop: { top: '52%', left: '60%' },
    // mobile: anchored to the fixed bottom-padding zone instead — a bottom
    // anchor stays clear of the buttons regardless of device height, unlike
    // a top-percentage which drifts as the section's total height changes
    mobile: { bottom: '110px', left: '6%' },
  },
  {
    label: 'Performance Ads',
    color: 'var(--purple)',
    rotate: 5,
    depth: 45,
    bobDelay: '1.8s',
    desktop: { top: '70%', left: '82%' },
    mobile: { bottom: '68px', left: '50%' },
  },
  {
    label: 'Branding',
    color: 'var(--coral)',
    rotate: -4,
    depth: 35,
    bobDelay: '2.4s',
    desktop: { top: '85%', left: '55%' },
    mobile: { bottom: '18px', left: '26%' },
  },
];

export default function FloatingBadges() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]'));

    function onMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      items.forEach((item) => {
        const depth = Number(item.dataset.depth || 20);
        const rotate = item.dataset.rotate || '0';
        item.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${rotate}deg)`;
      });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={ref} className="floating-badges" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {badges.map((b) => (
        <div
          key={b.label}
          className="floating-badge"
          style={
            {
              '--top-desktop': b.desktop.top,
              '--left-desktop': b.desktop.left,
              '--top-mobile': 'top' in b.mobile ? b.mobile.top : 'auto',
              '--bottom-mobile': 'bottom' in b.mobile ? b.mobile.bottom : 'auto',
              '--left-mobile': b.mobile.left,
              '--bob-delay': b.bobDelay,
            } as React.CSSProperties
          }
        >
          <span
            data-depth={b.depth}
            data-rotate={b.rotate}
            style={{
              display: 'inline-block',
              background: b.color,
              color: '#fff',
              fontWeight: 700,
              fontSize: 13.5,
              padding: '9px 16px',
              borderRadius: 100,
              border: '2px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
              transform: `rotate(${b.rotate}deg)`,
              whiteSpace: 'nowrap',
              transition: 'transform 0.05s linear',
            }}
          >
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
