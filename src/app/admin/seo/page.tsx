'use client';

import { useEffect, useState } from 'react';
import { workCategories } from '@/lib/workCategories';

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

type Status = { configured: boolean; siteUrl: string | null; searchConsoleProperty: string | null };
type RankRow = { query: string; clicks: number; impressions: number; ctr: number; position: number };
type PageRow = { page: string; clicks: number; impressions: number; position: number };
type Service = { slug: string; title: string };

export default function AdminSeoPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [rankings, setRankings] = useState<RankRow[] | null>(null);
  const [rankError, setRankError] = useState('');
  const [pages, setPages] = useState<PageRow[] | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [copiedPath, setCopiedPath] = useState('');

  useEffect(() => {
    fetch('/api/admin/seo/status', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => json.ok && setStatus(json));

    fetch('/api/admin/services', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => json.ok && setServices(json.items.filter((s: any) => s.published)));
  }, []);

  useEffect(() => {
    if (!status?.configured) return;
    fetch('/api/admin/seo/rankings', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => (json.ok ? setRankings(json.rows) : setRankError(json.error)));
    fetch('/api/admin/seo/indexed-pages', { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => json.ok && setPages(json.rows));
  }, [status]);

  const base = status?.siteUrl?.replace(/\/$/, '') || '';
  const keyPages = [
    { label: 'Homepage', path: '/' },
    { label: 'What we do?', path: '/what-we-do' },
    { label: 'What we did?', path: '/work' },
    { label: 'Why Us?', path: '/why-us' },
    { label: 'What clients say?', path: '/testimonials' },
    { label: "Let's Create", path: '/lets-create' },
    ...services.map((s) => ({ label: s.title, path: `/services/${s.slug}` })),
    ...workCategories.map((c) => ({ label: c.label, path: `/work/${c.slug}` })),
  ];

  const searchConsoleDashboardUrl = status?.searchConsoleProperty
    ? `https://search.google.com/search-console?resource_id=${encodeURIComponent(status.searchConsoleProperty)}`
    : 'https://search.google.com/search-console';

  async function copyAndOpen(path: string) {
    // open synchronously first — a delayed window.open() after an await can get popup-blocked
    window.open(searchConsoleDashboardUrl, '_blank');
    await navigator.clipboard.writeText(`${base}${path}`);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(''), 2500);
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>SEO</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
        Sitemap, indexing requests and keyword rankings from Google Search Console.
      </p>

      <div className="card-flat" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <a href="/sitemap.xml" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700, fontSize: 14 }}>
          View sitemap.xml →
        </a>
        <a href="/robots.txt" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)', fontWeight: 700, fontSize: 14 }}>
          View robots.txt →
        </a>
      </div>

      {status === null ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : !status.configured ? (
        <div className="card-flat" style={{ padding: 24, boxShadow: '6px 6px 0 var(--yellow)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>Google Search Console isn&apos;t connected yet</h2>
          <ol style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
            <li>
              In <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)' }}>Google Cloud Console</a>,
              create a project, then enable the <strong>Search Console API</strong> and <strong>Web Search Indexing API</strong>.
            </li>
            <li>Create a Service Account, then create a JSON key for it and download the file.</li>
            <li>
              In <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)' }}>Search Console</a> →
              Settings → Users and permissions, add the service account&apos;s email (looks like{' '}
              <code>name@project.iam.gserviceaccount.com</code>) as a user with <strong>Owner</strong> access.
            </li>
            <li>
              On your server, set the environment variable <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> to the full contents of the
              downloaded JSON key (as one line), then restart the app.
            </li>
            <li>
              Set your <strong>Site URL</strong> in <a href="/admin/settings" style={{ color: 'var(--purple)' }}>Settings</a> to match
              your Search Console property exactly.
            </li>
          </ol>
        </div>
      ) : (
        <>
          {!status.siteUrl && (
            <div className="card-flat" style={{ padding: 16, marginBottom: 20, boxShadow: '4px 4px 0 var(--coral)' }}>
              <p style={{ fontSize: 14 }}>
                Google is connected, but your Site URL isn&apos;t set. Add it in{' '}
                <a href="/admin/settings" style={{ color: 'var(--purple)', fontWeight: 700 }}>Settings</a> first.
              </p>
            </div>
          )}

          <div className="card-flat" style={{ padding: 20, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Request indexing</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>
              Google has no way to link straight into an indexing request for a specific page — this is a Google limitation, not
              something we can bypass. Click a page below: it copies the URL <strong>and</strong> opens Search Console in one step.
              Once there, press <kbd style={kbdStyle}>⌘V</kbd> in the search bar at the top, hit Enter, then click{' '}
              <strong>Request Indexing</strong>.
            </p>
            <div className="seo-rows" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {keyPages.map((p) => (
                <div key={p.path} className="seo-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{p.path}</div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: 13, flexShrink: 0 }}
                    onClick={() => copyAndOpen(p.path)}
                    disabled={!status.siteUrl}
                  >
                    {copiedPath === p.path ? 'Copied — paste in the tab that opened ✓' : 'Copy & open Search Console'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-flat" style={{ padding: 20, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Keyword rankings (last 28 days)</h2>
            {rankError && <p style={{ color: 'var(--coral)', fontSize: 13.5 }}>{rankError}</p>}
            {!rankError && !rankings && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}
            {rankings && rankings.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>No query data yet — this fills in as Google indexes and serves your pages.</p>}
            {rankings && rankings.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ padding: '8px 10px' }}>Query</th>
                      <th style={{ padding: '8px 10px' }}>Clicks</th>
                      <th style={{ padding: '8px 10px' }}>Impressions</th>
                      <th style={{ padding: '8px 10px' }}>CTR</th>
                      <th style={{ padding: '8px 10px' }}>Avg. position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((r) => (
                      <tr key={r.query} style={{ borderBottom: '1px solid var(--muted)' }}>
                        <td style={{ padding: '8px 10px' }}>{r.query}</td>
                        <td style={{ padding: '8px 10px' }}>{r.clicks}</td>
                        <td style={{ padding: '8px 10px' }}>{r.impressions}</td>
                        <td style={{ padding: '8px 10px' }}>{(r.ctr * 100).toFixed(1)}%</td>
                        <td style={{ padding: '8px 10px' }}>{r.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-flat" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Pages getting impressions</h2>
            {!pages && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}
            {pages && pages.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>No page data yet.</p>}
            {pages && pages.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ padding: '8px 10px' }}>Page</th>
                      <th style={{ padding: '8px 10px' }}>Clicks</th>
                      <th style={{ padding: '8px 10px' }}>Impressions</th>
                      <th style={{ padding: '8px 10px' }}>Avg. position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((p) => (
                      <tr key={p.page} style={{ borderBottom: '1px solid var(--muted)' }}>
                        <td style={{ padding: '8px 10px', wordBreak: 'break-all' }}>{p.page}</td>
                        <td style={{ padding: '8px 10px' }}>{p.clicks}</td>
                        <td style={{ padding: '8px 10px' }}>{p.impressions}</td>
                        <td style={{ padding: '8px 10px' }}>{p.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: '2px 6px',
  border: '1px solid var(--muted)',
  borderRadius: 4,
  fontSize: 12,
  fontFamily: 'inherit',
};
