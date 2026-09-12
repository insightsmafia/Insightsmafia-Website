import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/settings';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const current = await getSettings();
  const updates = await req.json();
  const merged = { ...current, ...updates, social: { ...current.social, ...updates.social } };

  await prisma.content.upsert({
    where: { key: 'settings' },
    update: { data: JSON.stringify(merged) },
    create: { key: 'settings', data: JSON.stringify(merged) },
  });

  return NextResponse.json({ ok: true, settings: merged });
}
