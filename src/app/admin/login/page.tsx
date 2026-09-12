'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      localStorage.setItem('admin_token', json.token);
      router.push('/admin');
    } else {
      setError(json.error || 'Login failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={onSubmit} className="card-flat" style={{ padding: 36, width: 360, boxShadow: '6px 6px 0 var(--ink)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Admin login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="email" type="email" placeholder="Email" required style={fieldStyle} />
          <input name="password" type="password" placeholder="Password" required style={fieldStyle} />
        </div>
        {error && <p style={{ color: 'var(--coral)', marginTop: 12, fontSize: 14 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: '12px 14px',
  border: '2px solid var(--ink)',
  borderRadius: 10,
  fontSize: 15,
  fontFamily: 'inherit',
};
