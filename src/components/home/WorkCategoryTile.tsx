import Link from 'next/link';

const bgFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

// bottom-right / top-right / bottom-left corner for the decorative blob, one per tile index.
const blobCorner: Record<string, React.CSSProperties> = {
  br: { bottom: -46, right: -46 },
  tr: { top: -46, right: -46 },
  bl: { bottom: -46, left: -46 },
};
const blobPattern = ['br', 'tr', 'br', 'tr', 'bl', 'tr', 'br', 'br'];

const icons: Record<string, JSX.Element> = {
  'film-making': (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-3v10l-6-3" />
    </>
  ),
  'ad-production': (
    <>
      <path d="M3 9l1.2-4h15.6L21 9" />
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 9l3.5-4M9.3 9l3.5-4M15.6 9l3.4-4" />
    </>
  ),
  'ugc-content': (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="7.5" r="2.3" />
      <path d="M15.3 20c.2-2.7 2-5 4.7-5" />
    </>
  ),
  'branding-and-logo': (
    <>
      <path d="M11.5 3H20a1 1 0 0 1 1 1v8.5a1 1 0 0 1-.3.7l-8.8 8.8a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1 0-1.4l8.8-8.8a1 1 0 0 1 .4-.3Z" />
      <circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  'web-development': (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M2 19.5h20" />
    </>
  ),
  'performance-marketing': <path d="M3 20V11M9.5 20V4M16 20v-7M21 20V8" />,
  'creative-visuals': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.7" cy="9.5" r="1.6" />
      <path d="M21 16.5l-5.3-5.3-4 4-3-3-5.7 5.6" />
    </>
  ),
  'reels-and-shorts': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.7l5.5 3.3-5.5 3.3V8.7z" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function WorkCategoryTile({ slug, label, i }: { slug: string; label: string; i: number }) {
  return (
    <Link
      href={`/work/${slug}`}
      className="card-flat svc-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        aspectRatio: '4/3',
        padding: 20,
        textDecoration: 'none',
        color: 'var(--ink)',
        background: 'var(--surface)',
        ['--accent' as string]: 'var(--ink)',
      } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 92,
          height: 92,
          borderRadius: '50%',
          background: bgFor(i),
          opacity: 0.9,
          zIndex: 0,
          ...blobCorner[blobPattern[i % blobPattern.length]],
        }}
      />
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {icons[slug]}
      </svg>
      <div style={{ position: 'relative', zIndex: 1, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {label}
      </div>
    </Link>
  );
}
