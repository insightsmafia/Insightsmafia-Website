'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResourceEditor, { Field } from '@/components/admin/ResourceEditor';
import { INDUSTRIES } from '@/lib/industries';
import { normalizeVideos, normalizeImages } from '@/lib/normalizeVideos';

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
      name: 'industry',
      label: 'Industry',
      type: 'select',
      options: INDUSTRIES.map((i) => ({ value: i, label: i })),
    },
    {
      name: 'videoOrientation',
      label: 'Video layout',
      type: 'select',
      options: [
        { value: 'vertical', label: 'Vertical — reel carousel (left) + client info (right)' },
        { value: 'horizontal', label: 'Horizontal — video on top, client info below' },
      ],
    },
    {
      name: 'videos',
      label: 'Reels / videos — upload a file or paste a YouTube, Vimeo, or Instagram link. The category picked per video controls which work-category page it shows on.',
      type: 'videolist',
    },
    {
      name: 'gallery',
      label: 'Image carousel (used only if there are no videos) — recommended size 1350×1080px. Same per-image category picker controls where each one shows.',
      type: 'imagelist',
    },
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
      // Show a case study in this category's admin list whenever any of
      // its videos/images is tagged for it - not just the category it was
      // originally created under - so its description and video/image
      // order can be managed from every admin page it publicly shows on.
      filter={(p) => {
        const videos = normalizeVideos(p.videos);
        const images = normalizeImages(p.gallery);
        return videos.some((v) => v.categories.includes(category.id)) || images.some((img) => img.categories.includes(category.id));
      }}
      getLabel={(p) => p.client || 'Untitled client'}
      getSubtitle={(p) => p.summary || ''}
    />
  );
}
