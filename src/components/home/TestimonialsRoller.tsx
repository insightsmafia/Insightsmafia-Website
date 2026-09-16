'use client';

import { useEffect, useRef, useState } from 'react';

type T = {
  id: string;
  author: string;
  roleCompany: string | null;
  quote: string;
  rating: number | null;
};

const HOLD_MS = 3000;
const STEP_MS = 600;

const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

function Card({ t, color }: { t: T; color: string }) {
  return (
    <div className="testimonial-roller-card">
      <div className="testimonial-roller-card-inner card-flat" style={{ boxShadow: `6px 6px 0 ${color}` }}>
        {t.rating && (
          <div style={{ color: 'var(--yellow)', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>
            {'★'.repeat(Math.max(0, Math.min(5, t.rating)))}
            <span style={{ color: 'var(--line)', opacity: 0.25 }}>{'★'.repeat(5 - Math.max(0, Math.min(5, t.rating)))}</span>
          </div>
        )}
        <p style={{ fontSize: 15.5, lineHeight: 1.6, marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.author}</div>
        {t.roleCompany && <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t.roleCompany}</div>}
      </div>
    </div>
  );
}

export default function TestimonialsRoller({ testimonials }: { testimonials: T[] }) {
  const n = testimonials.length;
  // Duplicate the first item at the end so stepping past the last one lands
  // on a visual twin of the first - the snap-back to index 0 is then invisible.
  const items = n > 1 ? [...testimonials, testimonials[0]] : testimonials;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [itemHeight, setItemHeight] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // translateY(-100%) resolves against the track's own total stacked height,
  // not one card's height, so stepping by percentage jumps the whole stack
  // off-screen after a single move - step in measured pixels instead.
  useEffect(() => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | undefined;
    if (!firstCard) return undefined;
    const ro = new ResizeObserver(() => setItemHeight(firstCard.offsetHeight));
    ro.observe(firstCard);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (n <= 1 || paused) return undefined;
    const timer = setTimeout(() => setIndex((i) => i + 1), HOLD_MS);
    return () => clearTimeout(timer);
  }, [index, n, paused]);

  useEffect(() => {
    if (animate) return undefined;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  if (n === 0) return null;

  function handleTransitionEnd() {
    if (index === n) {
      setAnimate(false);
      setIndex(0);
    }
  }

  // Only real pointer devices (mouse/trackpad) get hover-to-pause - on touch
  // screens a tap/scroll can leave :hover "stuck" with nothing to un-hover it.
  function handlePointerEnter(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') setPaused(true);
  }
  function handlePointerLeave(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') setPaused(false);
  }

  return (
    <div className="testimonial-roller" onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <div
        ref={trackRef}
        className="testimonial-roller-track"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateY(-${index * itemHeight}px)`,
          transition: animate ? `transform ${STEP_MS}ms cubic-bezier(0.65,0,0.35,1)` : 'none',
        }}
      >
        {items.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} color={colorFor(i % n)} />
        ))}
      </div>
    </div>
  );
}
