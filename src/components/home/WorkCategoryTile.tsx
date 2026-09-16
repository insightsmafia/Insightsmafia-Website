import Link from 'next/link';

const bgFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

export default function WorkCategoryTile({ slug, label, i }: { slug: string; label: string; i: number }) {
  return (
    <Link
      href={`/work/${slug}`}
      className="card-flat svc-card"
      style={{
        display: 'flex',
        aspectRatio: '4/3',
        alignItems: 'flex-end',
        padding: 20,
        textDecoration: 'none',
        color: 'inherit',
        background: bgFor(i),
        ['--accent' as string]: 'var(--ink)',
      } as React.CSSProperties}
    >
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>
    </Link>
  );
}
