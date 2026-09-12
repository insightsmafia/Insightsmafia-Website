'use client';

import { useEffect, useRef } from 'react';

const badges = [
  { label: 'Film & Ad Shoots', color: 'var(--coral)', rotate: -6, top: '6%', left: '58%', depth: 30 },
  { label: 'Social Media', color: 'var(--purple)', rotate: 4, top: '28%', left: '78%', depth: 55 },
  { label: 'Web Dev', color: 'var(--yellow)', rotate: -3, top: '52%', left: '60%', depth: 20 },
  { label: 'Performance Ads', color: 'var(--purple)', rotate: 5, top: '70%', left: '82%', depth: 45 },
  { label: 'Branding', color: 'var(--coral)', rotate: -4, top: '85%', left: '55%', depth: 35 },
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
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {badges.map((b) => (
        <span
          key={b.label}
          data-depth={b.depth}
          data-rotate={b.rotate}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
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
      ))}
    </div>
  );
}
