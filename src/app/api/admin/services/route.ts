import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ ok: true, services });
}

export async function PATCH(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const { id, published } = await req.json();
  const service = await prisma.service.update({ where: { id }, data: { published } });
  return NextResponse.json({ ok: true, service });
}
