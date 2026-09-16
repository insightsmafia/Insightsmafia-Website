'use client';

import { useEffect, useState } from 'react';
import ResourceEditor, { Field } from '@/components/admin/ResourceEditor';

type Service = { id: string; title: string };

export default function AdminProjectsPage() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => json.ok && setServices(json.items));
  }, []);

  if (!services) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;

  const fields: Field[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'client', label: 'Client name', type: 'text' },
    {
      name: 'serviceId',
      label: 'Belongs to service (shown on that service’s page)',
      type: 'select',
      options: services.map((s) => ({ value: s.id, label: s.title })),
    },
    { name: 'summary', label: 'Summary (shown on work cards)', type: 'textarea' },
    { name: 'body', label: 'Full case study (shown on the project’s dedicated page)', type: 'textarea' },
    { name: 'coverImage', label: 'Cover image', type: 'image' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'published', label: 'Published', type: 'checkbox' },
  ];

  return (
    <ResourceEditor
      resource="projects"
      title="Work / Projects"
      fields={fields}
      getLabel={(p) => p.title}
      getSubtitle={(p) => p.client || p.summary || ''}
    />
  );
}
