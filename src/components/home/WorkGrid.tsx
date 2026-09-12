import Reveal from '@/components/ui/Reveal';

const items = [
  { cat: 'Film & Ad Production', color: 'var(--coral)' },
  { cat: 'Branding & Logo', color: 'var(--yellow)' },
  { cat: 'Web Development', color: 'var(--purple)' },
  { cat: 'Performance Marketing', color: 'var(--coral)' },
  { cat: 'Social Media Management', color: 'var(--yellow)' },
];

export default function WorkGrid() {
  return (
    <section className="section-pad" id="work" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>Recent work</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            Placeholders for now — real shoots and campaigns land here as they wrap.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {items.map((it, i) => (
            <Reveal key={it.cat} delay={i * 70}>
              <div
                className="card-flat"
                style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'flex-end', padding: 20, background: it.color, boxShadow: '6px 6px 0 var(--ink)' }}
              >
                <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{it.cat}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--muted)' }}>Case study coming soon</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p style={{ marginTop: 32, color: 'var(--muted)' }}>
          Have a shoot, a campaign or a launch you&apos;re proud of? Send it over and it goes here first.
        </p>
      </div>
    </section>
  );
}
