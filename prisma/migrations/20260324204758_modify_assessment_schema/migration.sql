/*
  Warnings:

  - You are about to drop the column `category` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "category",
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "totalQuestions" INTEGER,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "weakTopics" TEXT[];

-- CreateIndex
CREATE INDEX "Assessment_userId_createdAt_idx" ON "Assessment"("userId", "createdAt");
