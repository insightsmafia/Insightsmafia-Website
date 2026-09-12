import { prisma } from '@/lib/db';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import TestimonialsList from './TestimonialsList';
import FaqList from './FaqList';

export default async function TestimonialsFaqSection() {
  const [testimonialCount, faqCount] = await Promise.all([
    prisma.testimonial.count({ where: { published: true } }),
    prisma.faq.count({ where: { published: true } }),
  ]);

  if (testimonialCount === 0 && faqCount === 0) return null;

  return (
    <section className="section-pad" id="faq" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)' }}>
      <div className="wrap">
        <div className="split-screen">
          <div>
            <Reveal>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, marginBottom: 12 }}>What clients say</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Real feedback from the brands we&apos;ve worked with.</p>
            </Reveal>
            {testimonialCount === 0 ? (
              <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Client stories are on their way.</p>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <TestimonialsList limit={3} />
              </div>
            )}
            <Button href="/testimonials">See More</Button>
          </div>

          <div>
            <Reveal>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, marginBottom: 12 }}>Questions, answered</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Still curious? We reply within one business day.</p>
            </Reveal>
            {faqCount === 0 ? <p style={{ color: 'var(--muted)' }}>FAQs are coming soon.</p> : <FaqList />}
          </div>
        </div>
      </div>
    </section>
  );
}
