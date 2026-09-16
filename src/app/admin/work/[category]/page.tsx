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
    { name: 'title', label: 'Case study title', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'client', label: 'Client name', type: 'text' },
    { name: 'summary', label: 'Summary (shown on the case study card)', type: 'textarea' },
    { name: 'body', label: 'Full story (shown on the case study page)', type: 'textarea' },
    { name: 'coverImage', label: 'Cover image', type: 'image' },
    { name: 'gallery', label: 'Gallery images', type: 'imagelist' },
    { name: 'videoUrl', label: 'Video URL (YouTube, Vimeo, or a direct .mp4 link)', type: 'text' },
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
      getLabel={(p) => p.title}
      getSubtitle={(p) => p.client || p.summary || ''}
    />
  );
}
