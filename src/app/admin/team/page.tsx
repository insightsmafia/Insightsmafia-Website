'use client';

import ResourceEditor from '@/components/admin/ResourceEditor';

export default function AdminTeamPage() {
  return (
    <ResourceEditor
      resource="team"
      title="Team"
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'role', label: 'Role', type: 'text', required: true },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'photo', label: 'Photo URL', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
      getLabel={(m) => m.name}
      getSubtitle={(m) => m.role}
    />
  );
}
