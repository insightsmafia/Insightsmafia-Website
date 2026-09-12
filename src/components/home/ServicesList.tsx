import Reveal from '@/components/ui/Reveal';

const services = [
  { title: 'Content Creation', desc: 'Filmmaking and ad shoots — brand films to social-first video.', color: 'var(--coral)', tilt: -2 },
  { title: 'Content Planning', desc: 'Calendars that carry a brand voice across months, not one-off posts.', color: 'var(--yellow)', tilt: 1.5 },
  { title: 'Social Media Management', desc: 'Day-to-day handling of your channels — posting, replying, growing.', color: 'var(--purple)', tilt: -1 },
  { title: 'Web Development', desc: 'Sites and platforms built to load fast and convert visitors.', color: 'var(--coral)', tilt: 2 },
  { title: 'Performance Marketing', desc: 'Campaigns measured against revenue, not vanity metrics.', color: 'var(--yellow)', tilt: -1.5 },
  { title: 'Branding & Logo Design', desc: 'Identity systems that make a business recognisable at a glance.', color: 'var(--purple)', tilt: 1 },
];

export default function ServicesList() {
  return (
    <section className="section-pad" id="services">
      <div className="wrap">
        <Reveal>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 12 }}>Six disciplines. One team.</h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, marginBottom: 56 }}>
            No hand-offs between five different agencies — we run your content, campaigns and code end to end.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div
                className="card-flat"
                style={{
                  padding: 28,
                  transform: `rotate(${s.tilt}deg)`,
                  boxShadow: `6px 6px 0 ${s.color}`,
                  height: '100%',
                }}
              >
                <div style={{ width: 40, height: 8, background: s.color, borderRadius: 4, marginBottom: 20 }} />
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
