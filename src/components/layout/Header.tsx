import Image from 'next/image';
import Button from '@/components/ui/Button';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '2px solid var(--ink)' }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', gap: 24 }}>
        <Image src="/logo.jpg" alt="Insights Mafia" width={140} height={64} style={{ borderRadius: 10, border: '2px solid var(--ink)' }} />
        <nav style={{ display: 'flex', gap: 28 }} className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ fontWeight: 700, fontSize: 14.5, textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </nav>
        <Button href="#contact" variant="primary">Start a project</Button>
      </div>
    </header>
  );
}
