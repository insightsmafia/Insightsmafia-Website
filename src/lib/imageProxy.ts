/**
 * Routes Vercel Blob URLs through our own /api/image proxy so browsers load them
 * same-origin instead of hitting Chrome's ORB block on the blob CDN's CSP header.
 * Non-blob URLs (e.g. /logo.jpg, or an admin-pasted external URL) pass through unchanged.
 */
export function proxyImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.includes('.public.blob.vercel-storage.com')) {
    return `/api/image?src=${encodeURIComponent(url)}`;
  }
  return url;
}
