/*
  Warnings:

  - You are about to drop the column `atsScore` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `title` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "atsScore",
DROP COLUMN "content",
DROP COLUMN "feedback",
ADD COLUMN     "title" TEXT NOT NULL;
