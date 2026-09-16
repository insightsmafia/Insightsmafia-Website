'use client';

import ResourceEditor from '@/components/admin/ResourceEditor';

export default function AdminTestimonialsPage() {
  return (
    <ResourceEditor
      resource="testimonials"
      title="Testimonials"
      fields={[
        { name: 'author', label: 'Author name', type: 'text', required: true },
        { name: 'roleCompany', label: 'Role / company', type: 'text' },
        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating (1-5)', type: 'number' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
      getLabel={(t) => t.author}
      getSubtitle={(t) => t.quote}
    />
  );
}
