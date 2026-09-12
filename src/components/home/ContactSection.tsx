'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePath: '/' }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="section-pad" id="contact" style={{ background: 'var(--surface)', borderTop: '2px solid var(--ink)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 16 }}>Ready to move faster?</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 400 }}>
            Tell us what you&apos;re building and which of the six disciplines to start with.
          </p>
          <p style={{ fontWeight: 700 }}>hello@insightsmafia.com</p>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>Based in India — working with brands everywhere</p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* honeypot - hidden from real users, bots tend to fill every field */}
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />

          <input name="name" required placeholder="Your name" className="card-flat" style={inputStyle} />
          <input name="email" type="email" required placeholder="you@company.com" className="card-flat" style={inputStyle} />
          <select name="serviceInterest" className="card-flat" style={inputStyle}>
            <option>Content Creation</option>
            <option>Content Planning</option>
            <option>Social Media Management</option>
            <option>Web Development</option>
            <option>Performance Marketing</option>
            <option>Branding &amp; Logo Design</option>
          </select>
          <textarea name="message" required placeholder="Tell us about the project" className="card-flat" style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }} />
          <Button type="submit">{status === 'sending' ? 'Sending...' : 'Send message'}</Button>
          {status === 'sent' && <p style={{ color: 'var(--purple)', fontWeight: 600 }}>Thanks — we&apos;ll write back within one business day.</p>}
          {status === 'error' && <p style={{ color: 'var(--coral)', fontWeight: 600 }}>Something went wrong — try again in a moment.</p>}
        </form>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '13px 16px',
  fontSize: 15,
  fontFamily: 'inherit',
  border: '2px solid var(--ink)',
  borderRadius: 12,
  outline: 'none',
};
