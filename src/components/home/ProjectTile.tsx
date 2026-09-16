import Link from 'next/link';
import { proxyImage } from '@/lib/imageProxy';

type Project = {
  slug: string;
  title: string;
  client: string | null;
  summary: string | null;
  coverImage: string | null;
};

const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];
const tiltFor = (i: number) => [-2, 1.5, -1, 2, -1.5, 1][i % 6];

export default function ProjectTile({ p, i }: { p: Project; i: number }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="card-flat svc-card"
      style={{
        display: 'flex',
        aspectRatio: '4/3',
        alignItems: 'flex-end',
        padding: 20,
        textDecoration: 'none',
        color: 'inherit',
        background: p.coverImage ? `url(${proxyImage(p.coverImage)}) center/cover` : colorFor(i),
        ['--accent' as string]: colorFor(i),
        ['--tilt' as string]: `${tiltFor(i)}deg`,
      } as React.CSSProperties}
    >
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{p.title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>{p.client || p.summary || 'Case study'}</div>
      </div>
    </Link>
  );
}
