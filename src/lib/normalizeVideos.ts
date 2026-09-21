export type VideoItem = { url: string; views?: string };

/**
 * The `videos` column started as a JSON array of plain URL strings and grew
 * a per-video `views` label later. Parsing through here means both the old
 * string-array rows and the new object-array rows read the same way,
 * without needing a one-off DB backfill - a record upgrades to the new
 * shape automatically the next time it's saved from the admin.
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
      if (typeof item === 'string') return { url: item, views: '' };
      if (item && typeof item === 'object' && 'url' in item) {
        return { url: String((item as any).url || ''), views: (item as any).views ? String((item as any).views) : '' };
      }
      return { url: '', views: '' };
    })
    .filter((v) => v.url);
}
