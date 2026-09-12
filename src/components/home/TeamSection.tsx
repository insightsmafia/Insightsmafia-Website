import { prisma } from '@/lib/db';
import Reveal from '@/components/ui/Reveal';

const tiltFor = (i: number) => [-2, 1.5, -1, 2, -1.5][i % 5];
const colorFor = (i: number) => ['var(--coral)', 'var(--yellow)', 'var(--purple)'][i % 3];

export default async function TeamSection() {
  const team = await prisma.teamMember.findMany({ where: { published: true }, orderBy: { order: 'asc' } });

  return (
    <section className="section-pad">
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>The crew</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            One tight team across film, social, design, code and paid media — no hand-offs, no agencies-of-agencies.
          </p>
        </Reveal>

        {team.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Team profiles are coming soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            {team.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <div className="card-flat" style={{ padding: 22, transform: `rotate(${tiltFor(i)}deg)`, boxShadow: `6px 6px 0 ${colorFor(i)}` }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: m.photo ? `url(${m.photo}) center/cover` : colorFor(i),
                      border: '2px solid var(--ink)',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {!m.photo && m.name.charAt(0)}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{m.name}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13.5, fontWeight: 600, marginBottom: m.bio ? 10 : 0 }}>{m.role}</p>
                  {m.bio && <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6 }}>{m.bio}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
