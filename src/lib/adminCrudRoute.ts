import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

/** Builds Bearer-token-gated GET/POST/PATCH/DELETE handlers for a simple id-keyed Prisma model. */
export function crudHandlers(
  delegate: Delegate,
  orderBy: Record<string, unknown> = { order: 'asc' },
  /** Runs on the submitted body before create, e.g. to auto-fill a field the admin form no longer collects. */
  beforeCreate?: (data: any) => any
) {
  async function GET(req: NextRequest) {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const items = await delegate.findMany({ orderBy });
    return NextResponse.json({ ok: true, items });
  }

  async function POST(req: NextRequest) {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    let data = await req.json();
    if (beforeCreate) data = beforeCreate(data);
    const item = await delegate.create({ data });
    return NextResponse.json({ ok: true, item });
  }

  async function PATCH(req: NextRequest) {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { id, ...data } = await req.json();
    const item = await delegate.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item });
  }

  async function DELETE(req: NextRequest) {
    const admin = requireAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    await delegate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return { GET, POST, PATCH, DELETE };
}
