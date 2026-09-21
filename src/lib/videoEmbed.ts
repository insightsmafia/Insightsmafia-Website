export type VideoProvider = 'youtube' | 'vimeo' | 'instagram' | 'file';
export type VideoEmbed = { type: 'iframe' | 'video'; src: string; provider: VideoProvider };

/**
 * Turns a pasted YouTube/Vimeo/Instagram/direct-file URL into something
 * renderable, pre-wired for autoplay + loop wherever the provider's embed
 * API supports it. Always requests muted autoplay - every browser
 * (mobile Safari in particular) honors that reliably, whereas requesting
 * unmuted autoplay gets silently downgraded to muted on iOS with no event
 * to tell us it happened, which desyncs our mute button from the actual
 * playback state. The on-frame mute button lets the visitor turn sound on
 * with one reliable tap instead. YouTube and Vimeo expose a postMessage
 * API for toggling mute after the fact; Instagram's public /embed iframe
 * does not; direct files are fully controllable via the native <video>
 * element.
 */
export function getVideoEmbed(url: string): VideoEmbed {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: id,
      playsinline: '1',
      enablejsapi: '1',
      controls: '0',
      rel: '0',
    });
    return { type: 'iframe', provider: 'youtube', src: `https://www.youtube.com/embed/${id}?${params}` };
  }

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    const params = new URLSearchParams({ autoplay: '1', muted: '1', loop: '1', controls: '0' });
    return { type: 'iframe', provider: 'vimeo', src: `https://player.vimeo.com/video/${id}?${params}` };
  }

  const instagram = url.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  if (instagram) {
    return { type: 'iframe', provider: 'instagram', src: `https://www.instagram.com/${instagram[1]}/${instagram[2]}/embed` };
  }

  return { type: 'video', provider: 'file', src: url };
}
