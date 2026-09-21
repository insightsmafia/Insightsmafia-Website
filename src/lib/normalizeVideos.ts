export type VideoItem = { url: string; views?: string; category?: string };
export type ImageItem = { url: string; category?: string };

/**
 * The `videos` column started as a JSON array of plain URL strings and grew
 * a per-video `views` label and a `category` tag later. Parsing through
 * here means both the old string-array rows and the new object-array rows
 * read the same way, without needing a one-off DB backfill - a record
 * upgrades to the new shape automatically the next time it's saved from
 * the admin. `category` is a ProjectCategory id: when set, the video only
 * shows on that one work-category page; left blank, it shows on every
 * category page the case study is assigned to (the old, default behavior).
 */
export function normalizeVideos(raw: string | null | undefined): VideoItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item): VideoItem => {
      if (typeof item === 'string') return { url: item, views: '', category: '' };
      if (item && typeof item === 'object' && 'url' in item) {
        return {
          url: String((item as any).url || ''),
          views: (item as any).views ? String((item as any).views) : '',
          category: (item as any).category ? String((item as any).category) : '',
        };
      }
      return { url: '', views: '', category: '' };
    })
    .filter((v) => v.url);
}

/**
 * Same idea as normalizeVideos, for the `gallery` (image carousel) column,
 * which started as a plain array of image URLs before gaining a per-image
 * `category` tag.
 */
export function normalizeImages(raw: string | null | undefined): ImageItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item): ImageItem => {
      if (typeof item === 'string') return { url: item, category: '' };
      if (item && typeof item === 'object' && 'url' in item) {
        return { url: String((item as any).url || ''), category: (item as any).category ? String((item as any).category) : '' };
      }
      return { url: '', category: '' };
    })
    .filter((v) => v.url);
}
