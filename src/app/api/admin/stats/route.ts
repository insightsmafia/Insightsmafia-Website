import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const [totalLeads, newLeads, totalServices, totalPosts] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.service.count(),
    prisma.post.count(),
  ]);

  return NextResponse.json({ ok: true, totalLeads, newLeads, totalServices, totalPosts });
}
