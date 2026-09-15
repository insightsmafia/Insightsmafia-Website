'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

const links = [
  { href: '/#services', label: 'What we do?' },
  { href: '/#work', label: 'What we did?' },
  { href: '/why-us', label: 'Why Us?' },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!menuOpen) return;
    const onScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <header ref={headerRef} style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '2px solid var(--ink)' }}>
      <div className="header-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 14, gap: 24 }}>
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
      {menuOpen && (
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
      )}
    </header>
  );
}
