import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({ ok: true, token, user: { name: user.name, email: user.email, role: user.role } });
}
