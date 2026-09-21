'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { getVideoEmbed } from '@/lib/videoEmbed';
import { VideoItem } from '@/lib/normalizeVideos';
import { proxyImage } from '@/lib/imageProxy';

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

function ViewMoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ViewsBadge({ views }: { views: string }) {
  return (
    <div className="reel-views-badge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {views} views
    </div>
  );
}

// YouTube and Vimeo expose a postMessage API for toggling mute after the
// embed loads; Instagram's public /embed iframe doesn't expose one, so no
// mute button is shown for it and it falls back to its own click-to-play UI.
function VideoFrame({ url, views, frameClassName, muted, onToggleMute }: { url: string; views?: string; frameClassName: string; muted: boolean; onToggleMute: () => void }) {
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
    const doc = document as any;
    const fsElement = document.fullscreenElement || doc.webkitFullscreenElement;
    if (fsElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      return;
    }
    // iPhone Safari only reliably supports fullscreen on the actual media
    // element, not a generic wrapping <div>, and on older versions only via
    // the webkit-prefixed API (video.webkitEnterFullscreen) rather than the
    // standard requestFullscreen - try the real element first, in every
    // form it might support, before falling back to the outer frame.
    if (embed.provider === 'file' && videoRef.current) {
      const v = videoRef.current as any;
      if (v.requestFullscreen) return void v.requestFullscreen();
      if (v.webkitEnterFullscreen) return void v.webkitEnterFullscreen();
      if (v.webkitRequestFullscreen) return void v.webkitRequestFullscreen();
    }
    if (embed.type === 'iframe' && iframeRef.current) {
      const f = iframeRef.current as any;
      if (f.requestFullscreen) return void f.requestFullscreen();
      if (f.webkitRequestFullscreen) return void f.webkitRequestFullscreen();
    }
    const el = frameRef.current as any;
    if (el?.requestFullscreen) el.requestFullscreen();
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
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
      {views && <ViewsBadge views={views} />}
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
  videos: VideoItem[];
  images: string[];
  orientation: 'vertical' | 'horizontal';
  instagramUrl?: string | null;
};

export default function ReelShowcase({ client, summary, videos, images, orientation, instagramUrl }: Props) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [canExpandSummary, setCanExpandSummary] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const hasVideos = videos.length > 0;
  // Videos take priority when a case study has both - images are the
  // fallback carousel for case studies that only have stills to show.
  const hasImages = !hasVideos && images.length > 0;
  const activeCount = hasVideos ? videos.length : images.length;
  const hasMultiple = activeCount > 1;
  // `index` only resets to 0 on the next effect pass, which runs after this
  // render - clamp it here too, otherwise switching from a case study with
  // more items to one with fewer crashes on videos[index]/images[index]
  // being undefined for that one render.
  const safeIndex = Math.min(index, Math.max(activeCount - 1, 0));
  const activeMediaUrl = hasVideos ? videos[safeIndex]?.url : hasImages ? images[safeIndex] : undefined;

  // A new case study is a fresh viewing session - start its carousel from
  // the first item and collapse any previously-expanded description.
  useEffect(() => {
    setIndex(0);
    setExpanded(false);
  }, [client]);

  // Every reel/video switch mounts a brand-new <video>/<iframe> element, and
  // mobile Safari silently forces each new one to start muted regardless of
  // what we request - it doesn't tell us when it does this. If our `muted`
  // state stayed false across the switch, the mute button would show
  // "sound is on" while the video was actually silent, and tapping it would
  // send a mute command instead of unmute (since it trusts the stale
  // state) - the exact "have to mute/unmute again and again" bug. Resetting
  // to the one state every browser is guaranteed to honor keeps the button
  // and the real playback state in sync, so a single tap reliably unmutes.
  useEffect(() => {
    setMuted(true);
  }, [activeMediaUrl]);

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
    setIndex((i) => (i - 1 + activeCount) % activeCount);
  }
  function next() {
    setIndex((i) => (i + 1) % activeCount);
  }

  const mediaFrame = hasVideos ? (
    <VideoFrame
      key={videos[safeIndex].url}
      url={videos[safeIndex].url}
      views={videos[safeIndex].views}
      frameClassName={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'}
      muted={muted}
      onToggleMute={() => setMuted((m) => !m)}
    />
  ) : hasImages ? (
    <div className="reel-frame-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={proxyImage(images[safeIndex])} alt={client || 'Case study'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
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
            <ViewMoreIcon />
            View More Work
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
            {Array.from({ length: activeCount }).map((_, i) => (
              <span key={i} className={`reel-dot${i === safeIndex ? ' active' : ''}`} />
            ))}
          </div>
        )}
      </div>
      <div className="reel-showcase-divider" />
      {infoBlock}
    </div>
  );
}
