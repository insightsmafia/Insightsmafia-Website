'use client';

import { useEffect, useRef, useState } from 'react';
import ReelShowcase from './ReelShowcase';
import { INDUSTRIES } from '@/lib/industries';
import { PlayableVideo } from '@/lib/normalizeVideos';

export type CaseStudy = {
  id: string;
  client: string | null;
  summary: string | null;
  videos: PlayableVideo[];
  images: string[];
  videoOrientation: 'vertical' | 'horizontal';
  industry: string | null;
};

export default function CategoryCaseStudyBrowser({ projects, instagramUrl }: { projects: CaseStudy[]; instagramUrl?: string | null }) {
  const [industry, setIndustry] = useState('');
  const [index, setIndex] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const filtered = industry ? projects.filter((p) => p.industry === industry) : projects;
  const active = filtered[index];
  const hasMultiple = filtered.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [industry]);

  // Bring the rectangle itself to the vertical center of the viewport
  // rather than jumping all the way to the page header - works the same
  // whether the visitor has scrolled a little or a lot, and on any
  // breakpoint, since it's relative to the viewport, not a fixed offset.
  function scrollToShowcase() {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function prevClient() {
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
    scrollToShowcase();
  }
  function nextClient() {
    setIndex((i) => (i + 1) % filtered.length);
    scrollToShowcase();
  }

  return (
    <div>
      <div className="industry-filter">
        <label htmlFor="industry-filter-select" className="industry-filter-label">
          What are you looking for?
        </label>
        <select
          id="industry-filter-select"
          className="industry-filter-select"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">All industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-flat" style={{ padding: 40, textAlign: 'center', boxShadow: '6px 6px 0 var(--ink)' }}>
          <p style={{ fontWeight: 700, marginBottom: 6 }}>No case studies for {industry} yet</p>
          <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 16 }}>Try a different industry, or see everything in this category.</p>
          <button type="button" className="btn" onClick={() => setIndustry('')}>
            Show all industries
          </button>
        </div>
      ) : (
        <>
          <div ref={showcaseRef}>
            <ReelShowcase
              client={active.client}
              summary={active.summary}
              videos={active.videos}
              images={active.images}
              orientation={active.videoOrientation}
              instagramUrl={instagramUrl}
            />
          </div>
          {hasMultiple && (
            <div className="client-nav">
              <button type="button" className="client-nav-btn" onClick={prevClient}>
                ← {filtered[(index - 1 + filtered.length) % filtered.length].client || 'Previous'}
              </button>
              <span className="client-nav-count">{index + 1} / {filtered.length}</span>
              <button type="button" className="client-nav-btn" onClick={nextClient}>
                {filtered[(index + 1) % filtered.length].client || 'Next'} →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
