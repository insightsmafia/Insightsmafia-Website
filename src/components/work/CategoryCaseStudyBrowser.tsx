'use client';

import { useState } from 'react';
import ReelShowcase from './ReelShowcase';

export type CaseStudy = {
  id: string;
  client: string | null;
  summary: string | null;
  videos: string[];
  videoOrientation: 'vertical' | 'horizontal';
};

export default function CategoryCaseStudyBrowser({ projects, instagramUrl }: { projects: CaseStudy[]; instagramUrl?: string | null }) {
  const [index, setIndex] = useState(0);
  const active = projects[index];
  const hasMultiple = projects.length > 1;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function prevClient() {
    setIndex((i) => (i - 1 + projects.length) % projects.length);
    scrollToTop();
  }
  function nextClient() {
    setIndex((i) => (i + 1) % projects.length);
    scrollToTop();
  }

  return (
    <div>
      <ReelShowcase
        client={active.client}
        summary={active.summary}
        videos={active.videos}
        orientation={active.videoOrientation}
        instagramUrl={instagramUrl}
      />
      {hasMultiple && (
        <div className="client-nav">
          <button type="button" className="client-nav-btn" onClick={prevClient}>
            ← {projects[(index - 1 + projects.length) % projects.length].client || 'Previous'}
          </button>
          <span className="client-nav-count">{index + 1} / {projects.length}</span>
          <button type="button" className="client-nav-btn" onClick={nextClient}>
            {projects[(index + 1) % projects.length].client || 'Next'} →
          </button>
        </div>
      )}
    </div>
  );
}
