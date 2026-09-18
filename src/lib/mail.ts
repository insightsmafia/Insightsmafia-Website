import nodemailer from 'nodemailer';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  const transport = getTransport();
  if (!transport) {
    console.warn('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) - skipping email send.');
    return { sent: false };
  }

  await transport.sendMail({
    from: `"Insights Mafia" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return { sent: true };
}
