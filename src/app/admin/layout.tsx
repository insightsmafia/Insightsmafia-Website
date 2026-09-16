'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { workCategories } from '@/lib/workCategories';

const navBefore = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/services', label: 'Services' },
];

const navAfter = [
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/faq', label: 'FAQs' },
  { href: '/admin/clients', label: 'Client logos' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/settings', label: 'Settings' },
];

function navLinkStyle(active: boolean) {
  return {
    padding: '10px 12px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14.5,
    textDecoration: 'none',
    background: active ? 'var(--purple)' : 'transparent',
    color: active ? '#fff' : 'var(--ink)',
  } as const;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (pathname.startsWith('/admin/work')) setWorkOpen(true);
  }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return null;

  const workActive = pathname.startsWith('/admin/work');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{ width: 220, borderRight: '2px solid var(--ink)', padding: '28px 20px', background: 'var(--surface)' }}>
        <div style={{ marginBottom: 14 }}>
          <Logo size="sm" showTagline={false} />
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', fontSize: 13, marginBottom: 20, textDecoration: 'none' }}
        >
          Visit site
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navBefore.map((n) => (
            <a key={n.href} href={n.href} style={navLinkStyle(pathname === n.href)}>
              {n.label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => setWorkOpen((v) => !v)}
            style={{
              ...navLinkStyle(workActive),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            Work / Projects
            <span style={{ display: 'inline-block', transform: workOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }}>
              ›
            </span>
          </button>
          {workOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 10, paddingLeft: 10, borderLeft: '2px solid var(--line)' }}>
              {workCategories.map((c) => {
                const href = `/admin/work/${c.slug}`;
                const active = pathname === href;
                return (
                  <a
                    key={c.slug}
                    href={href}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13.5,
                      textDecoration: 'none',
                      background: active ? 'var(--purple)' : 'transparent',
                      color: active ? '#fff' : 'var(--muted)',
                    }}
                  >
                    {c.label}
                  </a>
                );
              })}
            </div>
          )}

          {navAfter.map((n) => (
            <a key={n.href} href={n.href} style={navLinkStyle(pathname === n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('admin_token');
            router.push('/admin/login');
          }}
          style={{ marginTop: 28, fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Log out
        </button>
      </aside>
      <main style={{ flex: 1, padding: 36 }}>{children}</main>
    </div>
  );
}
