export type VideoItem = { url: string; views?: string; categories: string[] };
export type ImageItem = { url: string; categories: string[] };
// What's left of a VideoItem once a work-category page has already
// filtered by `categories` - the public-facing components downstream only
// ever need the url/views, not which categories it matched on.
export type PlayableVideo = { url: string; views?: string };

function normalizeCategories(item: any): string[] {
  if (Array.isArray(item.categories)) return item.categories.filter(Boolean).map(String);
  if (item.category) return [String(item.category)];
  return [];
}

/**
 * The `videos` column started as a JSON array of plain URL strings, grew a
 * per-video `views` label, then a single `category` tag, then a
 * `categories` array (a video can show on more than one work-category
 * page). Parsing through here means every past shape reads the same way,
 * without needing a one-off DB backfill - a record upgrades to the
 * current shape automatically the next time it's saved from the admin.
 * A video with no categories at all doesn't show on any work-category
 * page until one is picked.
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
      if (typeof item === 'string') return { url: item, views: '', categories: [] };
      if (item && typeof item === 'object' && 'url' in item) {
        return {
          url: String((item as any).url || ''),
          views: (item as any).views ? String((item as any).views) : '',
          categories: normalizeCategories(item),
        };
      }
      return { url: '', views: '', categories: [] };
    })
    .filter((v) => v.url);
}

/**
 * Same idea as normalizeVideos, for the `gallery` (image carousel) column,
 * which started as a plain array of image URLs before gaining a category
 * tag and then a `categories` array.
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
      if (typeof item === 'string') return { url: item, categories: [] };
      if (item && typeof item === 'object' && 'url' in item) {
        return { url: String((item as any).url || ''), categories: normalizeCategories(item) };
      }
      return { url: '', categories: [] };
    })
    .filter((v) => v.url);
}
