import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import ProjectTile from './ProjectTile';

export default async function WorkGrid() {
  const projects = await prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' }, take: 6 });

  return (
    <section className="section-pad" id="work" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>What we did?</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            Real shoots, campaigns and builds from the brands we&apos;ve worked with.
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Case studies are on their way.</p>
        ) : (
          <div className="tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProjectTile p={p} i={i} />
              </Reveal>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Button href="/work">See all work</Button>
        </div>
      </div>
    </section>
  );
}
