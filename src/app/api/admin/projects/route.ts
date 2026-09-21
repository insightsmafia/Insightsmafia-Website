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
  let categoryIds = data.categoryIds;
  try {
    const parsed = JSON.parse(categoryIds || '[]');
    if (!Array.isArray(parsed) || parsed.length === 0) {
      categoryIds = JSON.stringify(data.categoryId ? [data.categoryId] : []);
    }
  } catch {
    categoryIds = JSON.stringify(data.categoryId ? [data.categoryId] : []);
  }
  return {
    ...data,
    categoryIds,
    title: data.title || client || 'Case study',
    slug: data.slug || `${slugify(client)}-${Date.now().toString(36)}`,
  };
});
