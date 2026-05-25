/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CorrectionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "MemoryStatus" ADD VALUE 'REPORTED';

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_memorialId_fkey";

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "Correction" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "field" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "status" "CorrectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Correction" ADD CONSTRAINT "Correction_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
