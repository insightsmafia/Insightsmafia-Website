import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesList from '@/components/home/ServicesList';
import { getSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.whatWeDoTitle || 'What We Do? — Insights Mafia',
    description: settings.whatWeDoDescription || 'Film, social, design, code and paid media, run end to end by one team — the six disciplines Insights Mafia covers.',
  };
}

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
