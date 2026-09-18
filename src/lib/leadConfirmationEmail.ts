function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function leadConfirmationEmail(data: { name: string; message: string }) {
  const safeName = escapeHtml(data.name);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #000315;">
      <p style="font-weight: 800; font-size: 20px; margin: 0 0 24px;">
        <span style="color: #a244d0;">insights</span>mafia
      </p>
      <h1 style="font-size: 22px; margin: 0 0 16px;">Thanks, ${safeName} — we&apos;ve got your message.</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333;">
        We&apos;ve received your inquiry and someone from our team will get back to you within one business day.
      </p>
      <div style="background:#faf7f2; border:1px solid #e5e0d8; border-radius:12px; padding:16px 18px; margin:24px 0;">
        <p style="font-size: 13px; color: #6b6275; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.04em;">Your message</p>
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0;">${safeMessage}</p>
      </div>
      <p style="font-size: 14px; color: #6b6275;">
        In the meantime, feel free to reply directly to this email if there&apos;s anything else you&apos;d like to add.
      </p>
      <p style="font-size: 14px; margin-top: 32px;">— The Insights Mafia team</p>
    </div>
  `;

  const text = `Thanks, ${data.name} — we've got your message.\n\nWe've received your inquiry and someone from our team will get back to you within one business day.\n\nYour message:\n${data.message}\n\n— The Insights Mafia team`;

  return { html, text };
}

type LeadNotificationData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  serviceInterest?: string;
  sourcePath?: string;
};

export function leadNotificationEmail(data: LeadNotificationData) {
  const rows: [string, string | undefined][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Company', data.company],
    ['Service interest', data.serviceInterest],
    ['Submitted from', data.sourcePath],
  ];

  const rowsHtml = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0; color:#6b6275; font-size:13px; white-space:nowrap; vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0; font-size:14.5px; vertical-align:top;">${escapeHtml(value as string)}</td>
        </tr>`
    )
    .join('');

  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #000315;">
      <p style="font-weight: 800; font-size: 20px; margin: 0 0 24px;">
        <span style="color: #a244d0;">insights</span>mafia
      </p>
      <h1 style="font-size: 20px; margin: 0 0 20px;">New lead from the site 🎯</h1>
      <table style="width:100%; border-collapse:collapse; margin-bottom: 20px;">
        ${rowsHtml}
      </table>
      <div style="background:#faf7f2; border:1px solid #e5e0d8; border-radius:12px; padding:16px 18px; margin-bottom:24px;">
        <p style="font-size: 13px; color: #6b6275; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.04em;">Message</p>
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0;">${safeMessage}</p>
      </div>
      <p style="font-size: 14px;">
        <a href="https://www.insightsmafia.com/admin/leads" style="color:#a244d0; font-weight:700;">View in admin →</a>
      </p>
    </div>
  `;

  const textLines = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  const text = `New lead from the site\n\n${textLines}\n\nMessage:\n${data.message}\n\nView in admin: https://www.insightsmafia.com/admin/leads`;

  return { html, text };
}
