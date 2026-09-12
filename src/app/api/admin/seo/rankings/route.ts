import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getSearchAnalytics, isGoogleConfigured } from '@/lib/google';
import { getSettings } from '@/lib/settings';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  if (!isGoogleConfigured()) {
    return NextResponse.json({ ok: false, error: 'Google Search Console is not connected yet.' }, { status: 400 });
  }

  const settings = await getSettings();
  if (!settings.siteUrl) {
    return NextResponse.json({ ok: false, error: 'Set your site URL in Settings first.' }, { status: 400 });
  }

  try {
    const rows = await getSearchAnalytics(settings.siteUrl);
    return NextResponse.json({ ok: true, rows });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search Console request failed.';
    return NextResponse.json(
      { ok: false, error: `${message} — make sure the service account email has been added as a user under Search Console → Settings → Users and permissions.` },
      { status: 502 }
    );
  }
}
