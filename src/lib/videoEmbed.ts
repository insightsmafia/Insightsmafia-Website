export type VideoEmbed = { type: 'iframe' | 'video'; src: string };

/** Turns a pasted YouTube/Vimeo/direct-file URL into something renderable. */
export function getVideoEmbed(url: string): VideoEmbed {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };

  return { type: 'video', src: url };
}
