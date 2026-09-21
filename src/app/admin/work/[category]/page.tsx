'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResourceEditor, { Field } from '@/components/admin/ResourceEditor';

type Category = { id: string; slug: string; label: string };

export default function AdminWorkCategoryPage() {
  const params = useParams<{ category: string }>();
  const [category, setCategory] = useState<Category | null | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/work-categories', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) return setCategory(null);
        setCategory(json.items.find((c: Category) => c.slug === params.category) ?? null);
      });
  }, [params.category]);

  if (category === undefined) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;
  if (category === null) return <p style={{ color: 'var(--coral)' }}>Unknown category.</p>;

  const fields: Field[] = [
    { name: 'client', label: 'Client name', type: 'text', required: true },
    { name: 'summary', label: 'Description', type: 'textarea' },
    {
      name: 'videoOrientation',
      label: 'Video layout',
      type: 'select',
      options: [
        { value: 'vertical', label: 'Vertical — reel carousel (left) + client info (right)' },
        { value: 'horizontal', label: 'Horizontal — video on top, client info below' },
      ],
    },
    { name: 'videos', label: 'Reels / videos — upload a file or paste a YouTube, Vimeo, or Instagram link', type: 'videolist' },
    { name: 'externalUrl', label: 'External link (e.g. live site, Instagram post)', type: 'text' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'published', label: 'Published', type: 'checkbox' },
  ];

  return (
    <ResourceEditor
      resource="projects"
      title={`Case studies — ${category.label}`}
      reorderable
      fields={fields}
      defaults={{ categoryId: category.id }}
      filter={(p) => p.categoryId === category.id}
      getLabel={(p) => p.client || 'Untitled client'}
      getSubtitle={(p) => p.summary || ''}
    />
  );
}
