'use client';

import ResourceEditor from '@/components/admin/ResourceEditor';

export default function AdminFaqPage() {
  return (
    <ResourceEditor
      resource="faq"
      title="FAQs"
      fields={[
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', required: true },
        { name: 'category', label: 'Category (optional)', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'published', label: 'Published', type: 'checkbox' },
      ]}
      getLabel={(f) => f.question}
      getSubtitle={(f) => f.answer}
    />
  );
}
