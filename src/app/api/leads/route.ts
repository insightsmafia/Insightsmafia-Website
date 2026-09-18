import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { leadSchema } from '@/lib/validations';
import { sendMail } from '@/lib/mail';
import { leadConfirmationEmail, leadNotificationEmail } from '@/lib/leadConfirmationEmail';

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

  // Confirmation email to the lead, and a notification to the team inbox -
  // failures here shouldn't fail the request, the lead is already saved
  // regardless of whether either email sends.
  try {
    const { html, text } = leadConfirmationEmail({ name: data.name, message: data.message });
    await sendMail({
      to: data.email,
      subject: 'We got your message — Insights Mafia',
      html,
      text,
    });
  } catch (err) {
    console.error('Failed to send lead confirmation email:', err);
  }

  try {
    if (process.env.SMTP_USER) {
      const { html, text } = leadNotificationEmail(data);
      await sendMail({
        to: process.env.SMTP_USER,
        subject: `New lead: ${data.name}${data.company ? ` (${data.company})` : ''}`,
        html,
        text,
      });
    }
  } catch (err) {
    console.error('Failed to send lead notification email:', err);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
