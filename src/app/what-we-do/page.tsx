import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesList from '@/components/home/ServicesList';

export const metadata: Metadata = {
  title: 'What We Do? — Insights Mafia',
  description: 'Film, social, design, code and paid media, run end to end by one team — the six disciplines Insights Mafia covers.',
};

export default function WhatWeDoPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>
        <ServicesList />
      </div>
      <Footer />
    </>
  );
}
