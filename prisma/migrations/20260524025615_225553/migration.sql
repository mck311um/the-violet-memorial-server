/*
  Warnings:

  - Added the required column `category` to the `Memorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memorial" ADD COLUMN     "category" TEXT NOT NULL;
