import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { leadSchema } from '@/lib/validations';

// very small in-memory rate limit — fine for a single serverless instance /
// low-traffic launch. Swap for a Redis/Upstash limiter before scaling.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests, try again shortly.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid submission.' }, { status: 400 });
  }

  // honeypot tripped — pretend success, drop silently
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const { company_website, ...data } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      ...data,
      events: { create: { type: 'status', to: 'new' } },
    },
  });

  // TODO: wire Resend/SMTP here to notify the team of the new lead.
  // Escape any user text before it ever goes into an HTML email body.

  return NextResponse.json({ ok: true, id: lead.id });
}
