import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import TeamSection from '@/components/home/TeamSection';
import { getSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.whyUsTitle || 'Why Insights Mafia — A crew that delivers',
    description: settings.whyUsDescription || 'One tight team across film, social, design, code and paid media — no hand-offs, no agencies-of-agencies.',
  };
}

const reasons = [
  { title: 'One team, zero hand-offs', desc: 'Film, social, design, code and paid media under one roof — no briefing five agencies separately.', color: 'var(--coral)' },
  { title: 'Built around your numbers', desc: 'Every plan traces back to a metric that matters to your business, not vanity stats.', color: 'var(--yellow)' },
  { title: 'Fast, straight answers', desc: 'You get a plan to approve before we start, and status you can actually read.', color: 'var(--purple)' },
];

export default function WhyUsPage() {
  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              Why Insights Mafia
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>A crew that delivers.</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', marginBottom: 48 }}>
              Insights Mafia is a full-service creative and growth agency — film, social, design, code and paid media, run by one tight team.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div style={{ borderLeft: `4px solid ${r.color}`, paddingLeft: 18 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{r.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)' }}>
        <TeamSection />
      </div>
      <Footer />
    </>
  );
}
