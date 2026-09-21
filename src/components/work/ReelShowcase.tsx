'use client';

import { useEffect, useRef, useState } from 'react';
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

function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="reel-frame-btn" onClick={onToggle} aria-label={muted ? 'Unmute' : 'Mute'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />}
      </svg>
    </button>
  );
}

function FullscreenButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="reel-frame-btn" onClick={onClick} aria-label="Full screen">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      </svg>
    </button>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// YouTube and Vimeo expose a postMessage API for toggling mute after the
// embed loads; Instagram's public /embed iframe doesn't expose one, so no
// mute button is shown for it and it falls back to its own click-to-play UI.
function VideoFrame({ url, frameClassName, muted, onToggleMute }: { url: string; frameClassName: string; muted: boolean; onToggleMute: () => void }) {
  const embed = getVideoEmbed(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embed.provider === 'file' && videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted, embed.provider]);

  function postToIframe(msg: Record<string, unknown>) {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(msg), '*');
  }

  function handleToggle() {
    onToggleMute();
    if (embed.provider === 'youtube') {
      postToIframe({ event: 'command', func: muted ? 'unMute' : 'mute', args: [] });
    } else if (embed.provider === 'vimeo') {
      postToIframe({ method: 'setVolume', value: muted ? 1 : 0 });
    }
  }

  function handleFullscreen() {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  const canToggleMute = embed.provider === 'file' || embed.provider === 'youtube' || embed.provider === 'vimeo';

  return (
    <div className={frameClassName} ref={frameRef}>
      {embed.type === 'iframe' ? (
        <iframe
          ref={iframeRef}
          src={embed.src}
          title="Case study video"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop
          playsInline
          src={embed.src}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div className="reel-frame-controls">
        {canToggleMute && <MuteButton muted={muted} onToggle={handleToggle} />}
        <FullscreenButton onClick={handleFullscreen} />
      </div>
    </div>
  );
}

type Props = {
  client: string | null;
  summary: string | null;
  videos: string[];
  orientation: 'vertical' | 'horizontal';
  instagramUrl?: string | null;
};

export default function ReelShowcase({ client, summary, videos, orientation, instagramUrl }: Props) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canExpandSummary, setCanExpandSummary] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const hasVideos = videos.length > 0;
  const hasMultiple = videos.length > 1;

  // A new case study is a fresh viewing session - start its reel carousel
  // from the first video and collapse any previously-expanded description.
  useEffect(() => {
    setIndex(0);
    setExpanded(false);
  }, [client]);

  useEffect(() => {
    if (expanded) return;
    function check() {
      const el = summaryRef.current;
      if (!el) return;
      setCanExpandSummary(el.scrollHeight > el.clientHeight + 2);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [summary, expanded]);

  function prev() {
    setIndex((i) => (i - 1 + videos.length) % videos.length);
  }
  function next() {
    setIndex((i) => (i + 1) % videos.length);
  }

  const mediaFrame = hasVideos ? (
    <VideoFrame
      key={videos[index]}
      url={videos[index]}
      frameClassName={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'}
      muted={muted}
      onToggleMute={() => setMuted((m) => !m)}
    />
  ) : (
    <div className={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff', fontSize: 13, fontWeight: 600 }}>
      Video coming soon
    </div>
  );

  const infoBlock = (
    <div className="reel-showcase-info">
      <p className="reel-showcase-client">{client || 'Client'}</p>
      {summary && (
        <div className={`reel-showcase-summary-wrap${expanded ? ' expanded' : ''}`}>
          <p className="reel-showcase-summary" ref={summaryRef}>{summary}</p>
          {canExpandSummary && (
            <button type="button" className="reel-summary-toggle" onClick={() => setExpanded((e) => !e)}>
              {expanded ? 'Show less' : '… See more'}
            </button>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 20 }}>
        <Button href="/lets-create" variant="primary">Let&apos;s Create</Button>
        {instagramUrl && (
          <Button href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            Follow us on Instagram
          </Button>
        )}
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
