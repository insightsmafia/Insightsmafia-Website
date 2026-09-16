import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WorkGrid from '@/components/home/WorkGrid';

export const metadata: Metadata = {
  title: 'What We Did? — Insights Mafia',
  description: 'Real shoots, campaigns and builds from the brands Insights Mafia has run film, social, design, code and paid media for.',
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>
        <WorkGrid />
      </div>
      <Footer />
    </>
  );
}
