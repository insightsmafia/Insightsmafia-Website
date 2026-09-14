import { NextRequest, NextResponse } from 'next/server';

// Vercel Blob sets `content-security-policy: default-src 'none'` on every file it
// serves (a mandatory, non-configurable platform security header — see
// vercel.com/docs/vercel-blob/security). Chrome's Opaque Response Blocking (ORB)
// treats that as reason to block the cross-origin <img>/background-image fetch
// entirely, so blob-hosted images silently fail to render. Proxying the bytes
// through our own first-party route sidesteps the cross-origin fetch altogether.
const ALLOWED_HOST_SUFFIX = '.public.blob.vercel-storage.com';

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src');
  if (!src) return NextResponse.json({ ok: false, error: 'Missing src' }, { status: 400 });

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid src' }, { status: 400 });
  }

  if (!url.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
    return NextResponse.json({ ok: false, error: 'Host not allowed' }, { status: 400 });
  }

  const upstream = await fetch(url.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ ok: false, error: 'Upstream fetch failed' }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=2592000, immutable',
    },
  });
}
