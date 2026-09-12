import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Privacy Policy — Insights Mafia',
  description: 'What personal information Insights Mafia collects, why, and how you can control it.',
};

const sections = [
  {
    title: 'Information we collect',
    body: [
      'When you fill out the contact form on this site, we collect your name, email address, and the message you send us, along with any optional details you choose to share — phone number, company name, service you’re interested in, and budget.',
      'If you subscribe to our newsletter, we collect your email address.',
      'We do not collect payment information, government IDs, or any sensitive personal data through this site.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'We use the information you submit to respond to your enquiry, discuss potential projects, and — if you’ve subscribed — send occasional updates about our work.',
      'We do not sell, rent, or trade your personal information to third parties.',
    ],
  },
  {
    title: 'Where your data is stored',
    body: [
      'Form submissions and newsletter sign-ups are stored in our own database and are accessible only to our team through a password-protected admin panel.',
    ],
  },
  {
    title: 'Cookies and tracking',
    body: [
      'This site does not use tracking cookies or third-party analytics for visitors. The fonts on this site are self-hosted at build time, so no font-related requests are sent to external services when you browse.',
      'If we add analytics, advertising pixels, or other tracking tools in the future, we will update this policy to reflect that.',
    ],
  },
  {
    title: 'Third-party links',
    body: [
      'Our social media links take you to third-party platforms (Instagram, LinkedIn, and others) that have their own privacy policies. We aren’t responsible for how those platforms handle your data.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You can ask us to access, correct, or delete the personal data we hold about you, or unsubscribe from our newsletter at any time, by emailing us using the address below.',
    ],
  },
  {
    title: "Children's privacy",
    body: ['This site is not directed at children under 13, and we do not knowingly collect personal information from children.'],
  },
  {
    title: 'Changes to this policy',
    body: ['We may update this policy from time to time. Material changes will be reflected on this page with an updated date.'],
  },
];

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <>
      <Header />
      <section className="section-pad" style={{ paddingTop: 70 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p style={{ display: 'inline-block', background: 'var(--yellow)', border: '2px solid var(--ink)', borderRadius: 100, padding: '6px 16px', fontWeight: 700, fontSize: 13.5, transform: 'rotate(-2deg)', marginBottom: 24 }}>
            Legal
          </p>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,48px)', lineHeight: 1.1, marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 40 }}>Last updated: September 12, 2026</p>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 40 }}>
            This policy explains what personal information {settings.siteName} collects when you use this website, why we collect it, and
            how you can control it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {sections.map((s) => (
              <div key={s.title}>
                <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}

            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>Contact us</h2>
              <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
                For any privacy-related questions or requests, reach us at{' '}
                <a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--purple)', fontWeight: 700 }}>
                  {settings.contactEmail}
                </a>
                {settings.address ? <> or at {settings.address}.</> : '.'}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
