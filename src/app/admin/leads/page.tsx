'use client';

import { useEffect, useState } from 'react';

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  serviceInterest?: string;
  status: string;
  createdAt: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => json.ok && setLeads(json.leads));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Leads</h1>
      <div className="card-flat" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Interested in</th>
              <th style={th}>Status</th>
              <th style={th}>Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={td}>{l.name}</td>
                <td style={td}>{l.email}</td>
                <td style={td}>{l.serviceInterest || '—'}</td>
                <td style={td}>{l.status}</td>
                <td style={td}>{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td style={td} colSpan={5}>
                  No leads yet — they&apos;ll show up here as soon as someone submits the contact form.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: '12px 16px', fontWeight: 700, fontSize: 12.5 };
const td: React.CSSProperties = { padding: '12px 16px' };
