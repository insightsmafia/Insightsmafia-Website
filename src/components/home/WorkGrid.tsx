import Reveal from '@/components/ui/Reveal';
import WorkCategoryTile from './WorkCategoryTile';
import { workCategories } from '@/lib/workCategories';

export default function WorkGrid() {
  return (
    <section className="section-pad" id="work" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>What we did?</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            Real shoots, campaigns and builds from the brands we&apos;ve worked with.
          </p>
        </Reveal>

        <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {workCategories.map((label, i) => (
            <Reveal key={label} delay={i * 60}>
              <WorkCategoryTile label={label} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
