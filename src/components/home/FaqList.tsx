import { prisma } from '@/lib/db';
import FaqAccordion from './FaqAccordion';

export default async function FaqList() {
  const faqs = await prisma.faq.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  if (faqs.length === 0) return null;

  return <FaqAccordion faqs={faqs} />;
}
