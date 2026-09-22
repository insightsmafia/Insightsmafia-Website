'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { getVideoEmbed } from '@/lib/videoEmbed';
import { PlayableVideo } from '@/lib/normalizeVideos';
import { proxyImage } from '@/lib/imageProxy';
import { loadYouTubeIframeApi } from '@/lib/youtubeIframeApi';
import { loadVimeoPlayerApi } from '@/lib/vimeoPlayerApi';

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

function FullscreenButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button type="button" className="reel-frame-btn" onClick={onClick} aria-label={active ? 'Exit full screen' : 'Full screen'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {active ? (
          <path d="M9 3v3a2 2 0 0 1-2 2H4M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
        ) : (
          <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
        )}
      </svg>
    </button>
  );
}

// CSS `aspect-ratio` combined with fixed positioning and auto sizing turns
// out to have real cross-browser quirks here (one centering approach came
// out vertically off-center, another collapsed the box to zero size,
// likely because the frame's own content is itself sized as 100% of the
// frame with no intrinsic size to inform the frame's own auto-sizing).
// Computing exact pixel dimensions in JS sidesteps all of that ambiguity -
// the box is always exactly as large as it can be within the viewport
// while keeping its aspect ratio, and exactly centered, on every
// breakpoint, recalculated on resize/orientation change.
function useFullscreenBox(active: boolean, aspectRatio: number): React.CSSProperties | undefined {
  const [box, setBox] = useState<{ width: number; height: number; top: number; left: number } | null>(null);

  useEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }
    function compute() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let width: number;
      let height: number;
      if (vw / vh > aspectRatio) {
        height = vh;
        width = vh * aspectRatio;
      } else {
        width = vw;
        height = vw / aspectRatio;
      }
      setBox({ width, height, top: (vh - height) / 2, left: (vw - width) / 2 });
    }
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, [active, aspectRatio]);

  if (!active || !box) return undefined;
  return {
    position: 'fixed',
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    margin: 0,
    maxWidth: 'none',
    maxHeight: 'none',
    borderRadius: 0,
    zIndex: 9999,
  };
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

// YouTube and Vimeo expose a postMessage API for toggling mute and for
// "video ended" notifications (used to auto-advance the carousel);
// Instagram's public /embed iframe exposes neither, so no mute button
// shows for it and it can't auto-advance - it falls back to its own
// click-to-play UI and stays until the visitor swipes manually.
function VideoFrame({
  url,
  views,
  frameClassName,
  aspectRatio,
  muted,
  onToggleMute,
  loop,
  onEnded,
  fullscreen,
  onToggleFullscreen,
}: {
  url: string;
  views?: string;
  frameClassName: string;
  aspectRatio: number;
  muted: boolean;
  onToggleMute: () => void;
  loop: boolean;
  onEnded: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  // Computed once per mount (the parent already keys this component by
  // url, so a new video mounting is the only time this should change) -
  // recomputing it on every render would bake the *current* muted state
  // into a fresh iframe src on every mute toggle, which reloads the
  // iframe and restarts the video from the beginning.
  const [embed] = useState(() => getVideoEmbed(url, { initialMuted: muted, loop }));
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fullscreenStyle = useFullscreenBox(fullscreen, aspectRatio);

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

  // Detecting "ended" reliably needs each provider's official player
  // library wrapping the existing iframe - a hand-rolled raw postMessage
  // subscription doesn't reliably receive state-change broadcasts. Only
  // needed when there's something to advance to (loop === false).
  useEffect(() => {
    if (loop || !iframeRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    if (embed.provider === 'youtube') {
      loadYouTubeIframeApi().then((YT) => {
        if (cancelled || !YT || !iframeRef.current) return;
        const player = new YT.Player(iframeRef.current, {
          events: {
            onStateChange: (e: any) => {
              if (e.data === YT.PlayerState.ENDED) onEnded();
            },
          },
        });
        cleanup = () => player?.destroy?.();
      });
    } else if (embed.provider === 'vimeo') {
      loadVimeoPlayerApi().then((Vimeo) => {
        if (cancelled || !Vimeo || !iframeRef.current) return;
        const player = new Vimeo.Player(iframeRef.current);
        player.on('ended', onEnded);
        cleanup = () => player.off('ended', onEnded);
      });
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [loop, embed.provider, onEnded]);

  const canToggleMute = embed.provider === 'file' || embed.provider === 'youtube' || embed.provider === 'vimeo';

  return (
    <div className={frameClassName} style={fullscreenStyle}>
      {embed.type === 'iframe' ? (
        <iframe
          ref={iframeRef}
          src={embed.src}
          title="Case study video"
          allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop={loop}
          onEnded={!loop ? onEnded : undefined}
          playsInline
          src={embed.src}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {views && <ViewsBadge views={views} />}
      <div className="reel-frame-controls">
        {canToggleMute && <MuteButton muted={muted} onToggle={handleToggle} />}
        <FullscreenButton active={fullscreen} onClick={onToggleFullscreen} />
      </div>
    </div>
  );
}

type Props = {
  client: string | null;
  summary: string | null;
  videos: PlayableVideo[];
  images: string[];
  orientation: 'vertical' | 'horizontal';
  instagramUrl?: string | null;
};

export default function ReelShowcase({ client, summary, videos, images, orientation, instagramUrl }: Props) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [canExpandSummary, setCanExpandSummary] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  // Once the visitor unmutes any video, keep asking for sound on every
  // video after that (within this page view) instead of making them tap
  // unmute again for each new reel - a browser is far more willing to
  // honor unmuted autoplay as a continuation of an already-granted gesture
  // than as a fresh, cold request.
  const soundEnabledRef = useRef(false);
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

  // Every reel/video switch mounts a brand-new <video>/<iframe> element.
  // Start it muted unless the visitor has already unmuted once this
  // session (see soundEnabledRef above); either way this always matches
  // exactly what we're about to request from the embed, so the mute
  // button and the actual playback state can't drift apart - the "have to
  // mute/unmute again and again" bug was caused by the two disagreeing.
  useEffect(() => {
    setMuted(!soundEnabledRef.current);
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

  // Exit the CSS-based fullscreen overlay on Escape, and lock background
  // scroll while it's open.
  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFullscreen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [fullscreen]);

  function prev() {
    setIndex((i) => (i - 1 + activeCount) % activeCount);
  }
  function next() {
    setIndex((i) => (i + 1) % activeCount);
  }
  function toggleMuted() {
    setMuted((m) => {
      const next = !m;
      soundEnabledRef.current = !next;
      return next;
    });
  }

  const imageFullscreenStyle = useFullscreenBox(fullscreen && hasImages, 1350 / 1080);

  const mediaFrame = hasVideos ? (
    <VideoFrame
      key={videos[safeIndex].url}
      url={videos[safeIndex].url}
      views={videos[safeIndex].views}
      frameClassName={orientation === 'vertical' ? 'reel-frame-vertical' : 'reel-frame-horizontal'}
      aspectRatio={orientation === 'vertical' ? 9 / 16 : 16 / 9}
      muted={muted}
      onToggleMute={toggleMuted}
      loop={!hasMultiple}
      onEnded={next}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((f) => !f)}
    />
  ) : hasImages ? (
    <div className="reel-frame-image" style={imageFullscreenStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={proxyImage(images[safeIndex])} alt={client || 'Case study'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="reel-frame-controls">
        <FullscreenButton active={fullscreen} onClick={() => setFullscreen((f) => !f)} />
      </div>
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
      {fullscreen && <div className="reel-fullscreen-backdrop" onClick={() => setFullscreen(false)} />}
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
