import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/settings';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

// Every page reads live content from the admin-editable database (services,
// testimonials, settings, etc.) — force dynamic rendering site-wide so admin
// changes show up immediately instead of being frozen at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights Mafia — You Dream. We Create.',
  description:
    'Full-service creative and growth agency — content creation, social media management, web development, performance marketing, and branding.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const base = (settings.siteUrl || 'https://insightsmafia.com').replace(/\/$/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: base,
    logo: `${base}/logo.jpg`,
    email: settings.contactEmail,
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.address && { address: settings.address }),
  };

  const sameAs = Object.values(settings.social ?? {}).filter(Boolean);
  if (sameAs.length > 0) (jsonLd as Record<string, unknown>).sameAs = sameAs;

  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
