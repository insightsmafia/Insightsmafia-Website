'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { getVideoEmbed } from '@/lib/videoEmbed';

function ArrowButton({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button type="button" className={`reel-arrow reel-arrow-${dir}`} onClick={onClick} aria-label={dir === 'left' ? 'Previous reel' : 'Next reel'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

function VideoFrame({ url, frameClassName }: { url: string; frameClassName: string }) {
  const embed = getVideoEmbed(url);
  return (
    <div className={frameClassName}>
      {embed.type === 'iframe' ? (
        <iframe
          src={embed.src}
          title="Case study video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <video controls src={embed.src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  );
}

type Props = {
  client: string | null;
  year: number | null;
  summary: string | null;
  videos: string[];
  orientation: 'vertical' | 'horizontal';
  externalUrl?: string | null;
};

export default function ReelShowcase({ client, year, summary, videos, orientation, externalUrl }: Props) {
  const [index, setIndex] = useState(0);
  const hasVideos = videos.length > 0;
  const hasMultiple = videos.length > 1;

  function prev() {
    setIndex((i) => (i - 1 + videos.length) % videos.length);
  }
  function next() {
    setIndex((i) => (i + 1) % videos.length);
  }

  const mediaFrame = hasVideos ? (
    <VideoFrame url={videos[index]} frameClassName={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'} />
  ) : (
    <div className={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff', fontSize: 13, fontWeight: 600 }}>
      Video coming soon
    </div>
  );

  const infoBlock = (
    <div className="reel-showcase-info">
      <p className="reel-showcase-client">{client || 'Client'}</p>
      {year && <p className="reel-showcase-year">{year}</p>}
      {summary && <p className="reel-showcase-summary">{summary}</p>}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 20 }}>
        <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
        {externalUrl && <Button href={externalUrl}>View Live ↗</Button>}
      </div>
    </div>
  );

  return (
    <div className={`reel-showcase ${orientation}`}>
      <div className="reel-showcase-media">
        <div className="reel-media-wrap">
          {mediaFrame}
          {hasMultiple && (
            <>
              <ArrowButton dir="left" onClick={prev} />
              <ArrowButton dir="right" onClick={next} />
            </>
          )}
        </div>
        {hasMultiple && (
          <div className="reel-dots">
            {videos.map((_, i) => (
              <span key={i} className={`reel-dot${i === index ? ' active' : ''}`} />
            ))}
          </div>
        )}
      </div>
      <div className="reel-showcase-divider" />
      {infoBlock}
    </div>
  );
}
