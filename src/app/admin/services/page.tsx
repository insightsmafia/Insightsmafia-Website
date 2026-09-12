'use client';

import { useEffect, useState } from 'react';

type Service = { id: string; title: string; excerpt: string; published: boolean };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  function load() {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => json.ok && setServices(json.services));
  }

  useEffect(load, []);

  async function togglePublish(s: Service) {
    const token = localStorage.getItem('admin_token');
    await fetch('/api/admin/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: s.id, published: !s.published }),
    });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Services</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {services.map((s) => (
          <div key={s.id} className="card-flat" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13.5 }}>{s.excerpt}</div>
            </div>
            <button
              onClick={() => togglePublish(s)}
              className="btn"
              style={{ background: s.published ? 'var(--purple)' : 'var(--surface)', color: s.published ? '#fff' : 'var(--ink)', padding: '8px 16px', fontSize: 13 }}
            >
              {s.published ? 'Published' : 'Draft'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
