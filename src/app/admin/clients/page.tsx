'use client';

import ResourceEditor from '@/components/admin/ResourceEditor';

export default function AdminClientsPage() {
  return (
    <ResourceEditor
      resource="clients"
      title="Client logos"
      fields={[
        { name: 'name', label: 'Client name', type: 'text', required: true },
        { name: 'logoUrl', label: 'Logo (leave blank to show name as text)', type: 'image' },
        { name: 'linkUrl', label: 'Link URL (optional)', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
      getLabel={(c) => c.name}
      getSubtitle={(c) => c.logoUrl || 'No logo — shown as text'}
    />
  );
}
