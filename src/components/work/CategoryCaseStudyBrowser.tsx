'use client';

import { useRef, useState } from 'react';
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
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Bring the rectangle itself to the top of the viewport rather than
  // jumping all the way to the page header - works the same whether the
  // visitor has scrolled a little (reading the description) or a lot
  // (down at the client-nav / footer).
  function scrollToShowcase() {
    const el = showcaseRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  function prevClient() {
    setIndex((i) => (i - 1 + projects.length) % projects.length);
    scrollToShowcase();
  }
  function nextClient() {
    setIndex((i) => (i + 1) % projects.length);
    scrollToShowcase();
  }

  return (
    <div>
      <div ref={showcaseRef}>
        <ReelShowcase
          client={active.client}
          summary={active.summary}
          videos={active.videos}
          orientation={active.videoOrientation}
          instagramUrl={instagramUrl}
        />
      </div>
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
