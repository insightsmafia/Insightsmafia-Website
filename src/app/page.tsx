import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import ServicesList from '@/components/home/ServicesList';
import WorkGrid from '@/components/home/WorkGrid';
import Process from '@/components/home/Process';
import TestimonialsFaqSection from '@/components/home/TestimonialsFaqSection';
import { getSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.homeTitle,
    description: settings.homeDescription,
  };
}

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ClientsMarquee />
      <ServicesList />
      <Process />
      <WorkGrid />
      <TestimonialsFaqSection />
      <Footer />
    </>
  );
}
