import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return NextResponse.json({ ok: true, leads });
}
