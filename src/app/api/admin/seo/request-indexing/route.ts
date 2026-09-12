import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { requestIndexing, isGoogleConfigured } from '@/lib/google';

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  if (!isGoogleConfigured()) {
    return NextResponse.json({ ok: false, error: 'Google Search Console is not connected yet.' }, { status: 400 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 });

  try {
    const result = await requestIndexing(url);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Indexing request failed.';
    return NextResponse.json(
      {
        ok: false,
        error: `${message} — the Indexing API is officially limited to job-posting and livestream pages by Google's terms, so this may be rejected for regular pages. Requesting indexing manually inside Search Console usually works better for normal content.`,
      },
      { status: 502 }
    );
  }
}
