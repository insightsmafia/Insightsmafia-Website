import { prisma } from '@/lib/db';
import { crudHandlers } from '@/lib/adminCrudRoute';

function slugify(str: string) {
  return (
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'case-study'
  );
}

// The admin form no longer collects a title/slug (case studies aren't
// individually clickable pages anymore) - auto-fill both from the client
// name so the still-required, still-unique DB columns stay satisfied.
export const { GET, POST, PATCH, DELETE } = crudHandlers(prisma.project, { order: 'asc' }, (data) => {
  const client = String(data.client || '').trim();
  return {
    ...data,
    title: data.title || client || 'Case study',
    slug: data.slug || `${slugify(client)}-${Date.now().toString(36)}`,
  };
});
