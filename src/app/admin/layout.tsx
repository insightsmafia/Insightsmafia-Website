'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/projects', label: 'Work / Projects' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/faq', label: 'FAQs' },
  { href: '/admin/clients', label: 'Client logos' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

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

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return null;

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
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14.5,
                textDecoration: 'none',
                background: pathname === n.href ? 'var(--purple)' : 'transparent',
                color: pathname === n.href ? '#fff' : 'var(--ink)',
              }}
            >
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
