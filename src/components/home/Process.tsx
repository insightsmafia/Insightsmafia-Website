import Reveal from '@/components/ui/Reveal';

const steps = [
  { name: 'Discover', desc: 'We learn the brand, the audience and the numbers before touching a camera or a keyboard.', color: 'var(--coral)' },
  { name: 'Plan', desc: 'Content calendars, campaign structures and site maps — a plan to approve, not a surprise later.', color: 'var(--yellow)' },
  { name: 'Create', desc: 'Shoots, edits, designs and builds happen here — the actual film, feed and product.', color: 'var(--purple)' },
  { name: 'Launch', desc: 'Assets go live on socials, on the site and in ad managers, on the day we said they would.', color: 'var(--coral)' },
  { name: 'Optimize', desc: 'We watch what the numbers say after launch and adjust the plan around what\u2019s working.', color: 'var(--yellow)' },
];

export default function Process() {
  return (
    <section className="section-pad" id="process" style={{ borderTop: '2px solid var(--ink)' }}>
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 56 }}>How a project moves</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <Reveal key={s.name} delay={i * 80}>
              <div style={{ borderLeft: `4px solid ${s.color}`, paddingLeft: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>{s.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
