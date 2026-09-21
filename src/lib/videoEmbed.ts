export type VideoProvider = 'youtube' | 'vimeo' | 'instagram' | 'file';
export type VideoEmbed = { type: 'iframe' | 'video'; src: string; provider: VideoProvider };

/**
 * Turns a pasted YouTube/Vimeo/Instagram/direct-file URL into something
 * renderable, pre-wired for autoplay wherever the provider's embed API
 * supports it.
 *
 * `initialMuted` lets the caller request sound-on from the very first
 * frame once the visitor has already unmuted a previous video in this
 * browsing session - browsers are far more willing to honor unmuted
 * autoplay as a continuation of an established gesture than a cold
 * request, so once the user has unmuted once we keep asking for sound on
 * every video after that instead of forcing them to re-tap each one.
 * The on-frame mute button remains available either way, and its state
 * gets reset to match this same request on every new video so it never
 * drifts from what was actually asked for.
 *
 * `loop` controls whether a single video repeats forever (true, the
 * default - used when it's the only item in the carousel) or plays once
 * so the carousel can detect "ended" and auto-advance to the next reel
 * (false - used whenever there's more than one item).
 */
export function getVideoEmbed(url: string, opts: { initialMuted?: boolean; loop?: boolean } = {}): VideoEmbed {
  const initialMuted = opts.initialMuted ?? true;
  const loop = opts.loop ?? true;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: '1',
      mute: initialMuted ? '1' : '0',
      playsinline: '1',
      enablejsapi: '1',
      controls: '0',
      rel: '0',
    });
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', id);
    }
    return { type: 'iframe', provider: 'youtube', src: `https://www.youtube.com/embed/${id}?${params}` };
  }

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    const params = new URLSearchParams({ autoplay: '1', muted: initialMuted ? '1' : '0', loop: loop ? '1' : '0', controls: '0' });
    return { type: 'iframe', provider: 'vimeo', src: `https://player.vimeo.com/video/${id}?${params}` };
  }

  const instagram = url.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  if (instagram) {
    return { type: 'iframe', provider: 'instagram', src: `https://www.instagram.com/${instagram[1]}/${instagram[2]}/embed` };
  }

  return { type: 'video', provider: 'file', src: url };
}
