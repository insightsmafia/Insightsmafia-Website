import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import TestimonialsList from '@/components/home/TestimonialsList';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Client Testimonials — Insights Mafia',
  description: 'Real feedback from the brands Insights Mafia has run campaigns, shoots and builds for.',
};

export default async function TestimonialsPage() {
  const count = await prisma.testimonial.count({ where: { published: true } });

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap">
          <Reveal>
            <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
              Client stories
            </p>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.1, marginBottom: 20 }}>What clients say</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 560, marginBottom: 56 }}>
              Real feedback from the brands we&apos;ve run campaigns, shoots and builds for.
            </p>
          </Reveal>
          {count === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Client stories are on their way — check back soon.</p>
          ) : (
            <TestimonialsList />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
