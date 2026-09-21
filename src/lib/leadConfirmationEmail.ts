function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Table-based layout (not divs) for reliable rendering in Outlook and other
// email clients that don't support modern CSS - a colored header band with
// the real logo image, centered, on top of a white card body.
function wrapEmail(bodyHtml: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px; max-width:100%; background:#ffffff; border-radius:16px; overflow:hidden; font-family:-apple-system,Helvetica,Arial,sans-serif; color:#000315;">
            <tr>
              <td align="center" style="background:#faf7f2; padding:28px 24px; border-bottom:2px solid #000315;">
                <img
                  src="https://www.insightsmafia.com/logo.jpg"
                  alt="Insights Mafia — You Dream. We Create!"
                  width="170"
                  height="78"
                  style="display:block; width:170px; height:78px; border:0;"
                />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function leadConfirmationEmail(data: { name: string; message: string }) {
  const safeName = escapeHtml(data.name);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

  const html = wrapEmail(`
    <h1 style="font-size: 22px; margin: 0 0 16px;">Thanks, ${safeName} — we&apos;ve got your message.</h1>
    <p style="font-size: 15px; line-height: 1.6; color: #333;">
      Our team will connect with you within one business day.
    </p>
    <div style="background:#faf7f2; border:1px solid #e5e0d8; border-radius:12px; padding:16px 18px; margin:24px 0;">
      <p style="font-size: 13px; color: #6b6275; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.04em;">Your message</p>
      <p style="font-size: 14.5px; line-height: 1.6; margin: 0;">${safeMessage}</p>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #333; margin-bottom: 18px;">
      In the meantime, take a look at some of the work we&apos;ve done for other brands:
    </p>
    <p style="margin: 0 0 28px;">
      <a href="https://www.insightsmafia.com/work" style="display:inline-block; background:#a244d0; color:#ffffff; font-weight:700; font-size:14px; text-decoration:none; padding:12px 22px; border-radius:100px;">
        See our recent work →
      </a>
    </p>
    <p style="font-size: 14px; color: #6b6275;">
      Feel free to reply directly to this email if there&apos;s anything else you&apos;d like to add.
    </p>
    <p style="font-size: 14px; margin-top: 32px;">— The Insights Mafia team</p>
  `);

  const text = `Thanks, ${data.name} — we've got your message.\n\nOur team will connect with you within one business day.\n\nYour message:\n${data.message}\n\nIn the meantime, take a look at some of our recent work: https://www.insightsmafia.com/work\n\n— The Insights Mafia team`;

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

  const html = wrapEmail(`
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
  `);

  const textLines = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  const text = `New lead from the site\n\n${textLines}\n\nMessage:\n${data.message}\n\nView in admin: https://www.insightsmafia.com/admin/leads`;

  return { html, text };
}
