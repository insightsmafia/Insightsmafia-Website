'use client';

import { useEffect, useState } from 'react';

type Stats = { totalLeads: number; newLeads: number; totalServices: number; totalPosts: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => json.ok && setStats(json));
  }, []);

  const cards = [
    { label: 'Total leads', value: stats?.totalLeads ?? '—', color: 'var(--purple)' },
    { label: 'New leads', value: stats?.newLeads ?? '—', color: 'var(--coral)' },
    { label: 'Services published', value: stats?.totalServices ?? '—', color: 'var(--yellow)' },
    { label: 'Blog posts', value: stats?.totalPosts ?? '—', color: 'var(--purple)' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
        {cards.map((c) => (
          <div key={c.label} className="card-flat" style={{ padding: 22, boxShadow: `4px 4px 0 ${c.color}` }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
