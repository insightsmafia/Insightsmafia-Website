import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { isGoogleConfigured } from '@/lib/google';
import { getSettings } from '@/lib/settings';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const settings = await getSettings();
  return NextResponse.json({
    ok: true,
    configured: isGoogleConfigured(),
    siteUrl: settings.siteUrl || null,
  });
}
