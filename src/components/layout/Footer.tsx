import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ borderTop: '2px solid var(--ink)', padding: '48px 0 30px', background: 'var(--surface)' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
        <Image src="/logo.jpg" alt="Insights Mafia" width={120} height={55} style={{ borderRadius: 8, border: '2px solid var(--ink)' }} />
        <p style={{ fontWeight: 700, color: 'var(--purple)' }}>You Dream. We Create!</p>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>© {new Date().getFullYear()} Insights Mafia. All rights reserved.</p>
      </div>
    </footer>
  );
}
