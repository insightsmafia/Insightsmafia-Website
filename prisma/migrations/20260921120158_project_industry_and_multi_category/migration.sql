-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "categoryIds" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "industry" TEXT NOT NULL DEFAULT '';
