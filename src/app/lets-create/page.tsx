import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/home/ContactSection';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Let's Create — Insights Mafia",
  description: 'Tell us what you’re building and which of our six disciplines to start with — we reply within one business day.',
};

export default async function LetsCreatePage() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <ContactSection contactEmail={settings.contactEmail} />
      <Footer />
    </>
  );
}
