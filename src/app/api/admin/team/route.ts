import { prisma } from '@/lib/db';
import { crudHandlers } from '@/lib/adminCrudRoute';

export const { GET, POST, PATCH, DELETE } = crudHandlers(prisma.teamMember);
