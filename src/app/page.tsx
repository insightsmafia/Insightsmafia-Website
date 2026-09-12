import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ServicesList from '@/components/home/ServicesList';
import WorkGrid from '@/components/home/WorkGrid';
import Process from '@/components/home/Process';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ServicesList />
      <WorkGrid />
      <Process />
      <ContactSection />
      <Footer />
    </>
  );
}
