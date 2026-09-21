/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "videoUrl",
ADD COLUMN     "videoOrientation" TEXT NOT NULL DEFAULT 'vertical',
ADD COLUMN     "videos" TEXT NOT NULL DEFAULT '[]';
