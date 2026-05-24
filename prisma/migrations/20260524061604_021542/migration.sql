/*
  Warnings:

  - You are about to drop the `_ImageToMemorial` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "_ImageToMemorial" DROP CONSTRAINT "_ImageToMemorial_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToMemorial" DROP CONSTRAINT "_ImageToMemorial_B_fkey";

-- DropTable
DROP TABLE "_ImageToMemorial";

-- CreateTable
CREATE TABLE "Flames" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "ipAddress" TEXT NOT NULL,
    "memorialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "initials" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "status" "MemoryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flames_ipAddress_key" ON "Flames"("ipAddress");

-- AddForeignKey
ALTER TABLE "Flames" ADD CONSTRAINT "Flames_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
