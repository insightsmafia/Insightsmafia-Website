'use client';

import ResourceEditor from '@/components/admin/ResourceEditor';

export default function AdminServicesPage() {
  return (
    <ResourceEditor
      resource="services"
      title="Services"
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug (used in /services/…)', type: 'text', required: true },
        { name: 'excerpt', label: 'Short excerpt (shown on homepage card)', type: 'textarea' },
        { name: 'body', label: 'Full description (shown on the service page)', type: 'textarea' },
        { name: 'seoTitle', label: 'SEO title (optional, shown on Google)', type: 'text' },
        { name: 'seoDescription', label: 'SEO description (optional, shown on Google)', type: 'textarea' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'featured', label: 'Featured', type: 'checkbox' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
      getLabel={(s) => s.title}
      getSubtitle={(s) => s.excerpt}
    />
  );
}
