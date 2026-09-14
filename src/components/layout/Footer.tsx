import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { getSettings } from '@/lib/settings';
import { InstagramIcon, LinkedInIcon, TwitterIcon, FacebookIcon, YouTubeIcon } from '@/components/ui/SocialIcons';

const exploreLinks = [
  { href: '/#services', label: 'What we do?' },
  { href: '/#work', label: 'What we did?' },
  { href: '/why-us', label: 'Why Us?' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/lets-create', label: "Let's Create" },
];

const socialIcons: Record<string, (props: { size?: number }) => JSX.Element> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
};

export default async function Footer() {
  const settings = await getSettings();
  const socialEntries = Object.entries(settings.social ?? {}).filter(([, url]) => url);

  return (
    <footer style={{ borderTop: '2px solid var(--ink)', background: 'var(--surface)' }}>
      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <Logo size="sm" showTagline={false} />
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginTop: 16, maxWidth: 260 }}>{settings.tagline}</p>
            {socialEntries.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {socialEntries.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  if (!Icon || !url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '2px solid var(--ink)',
                        color: 'var(--ink)',
                        transition: 'transform 0.15s ease, background 0.15s ease, color 0.15s ease',
                      }}
                      className="footer-social-link"
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>Explore</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {exploreLinks.map((l) => (
                <a key={l.href} href={l.href} style={{ color: 'var(--muted)', fontSize: 14.5, textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5 }}>
              <a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>
                {settings.contactEmail}
              </a>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>
                  {settings.phone}
                </a>
              )}
              {settings.address && <p style={{ color: 'var(--muted)', margin: 0, whiteSpace: 'pre-line' }}>{settings.address}</p>}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>Legal</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/privacy-policy" style={{ color: 'var(--muted)', fontSize: 14.5, textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--muted)',
            opacity: 1,
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: 0 }}>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <p style={{ color: 'var(--purple)', fontWeight: 700, fontSize: 13.5, margin: 0 }}>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
