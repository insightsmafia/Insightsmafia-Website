'use client';

import { useEffect, useState } from 'react';

type Category = { id: string; slug: string; label: string };

export default function CategoryCheckboxList({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/work-categories', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setCategories(json.items);
        setLoading(false);
      });
  }, []);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  if (loading) return <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading categories…</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px' }}>
      {categories.map((c) => (
        <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={value.includes(c.id)} onChange={() => toggle(c.id)} style={{ width: 18, height: 18 }} />
          {c.label}
        </label>
      ))}
    </div>
  );
}
