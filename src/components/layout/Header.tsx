'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

const links = [
  { href: '/what-we-do', label: 'What we do?' },
  { href: '/work', label: 'What we did?' },
  { href: '/why-us', label: 'Why Us?' },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  // Close the menu once the user actually scrolls again - but not
  // instantly: opening the menu often follows a scroll-up gesture (the one
  // that just brought the bar back into view), and on iOS that gesture's
  // momentum/inertial scrolling keeps firing 'scroll' events for a few
  // hundred ms after the finger lifts. Without a grace period, that leftover
  // momentum closes the menu the same instant it opens.
  useEffect(() => {
    if (!menuOpen) return undefined;
    let attached = false;
    const onScroll = () => setMenuOpen(false);
    const timer = setTimeout(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      attached = true;
    }, 400);
    return () => {
      clearTimeout(timer);
      if (attached) window.removeEventListener('scroll', onScroll);
    };
  }, [menuOpen]);

  // Hide the bar on any meaningful downward scroll, bring it back on the
  // slightest upward scroll - and always show it near the very top.
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 60) {
        setNavHidden(false);
      } else if (delta > 8) {
        setNavHidden(true);
      } else if (delta < -1) {
        setNavHidden(false);
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '2px solid var(--ink)',
        transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}
    >
      <div className="header-wrap" style={{ paddingTop: 14, paddingBottom: 14 }}>
        <a href="/" aria-label="Insights Mafia" style={{ textDecoration: 'none' }}>
          <Logo showTagline={false} />
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ fontWeight: 700, fontSize: 14.5, textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="nav-cta">
            <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu-fold${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-fold-inner">
          <div className="mobile-menu">
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ fontWeight: 700, fontSize: 16, textDecoration: 'none', padding: '12px 0' }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
