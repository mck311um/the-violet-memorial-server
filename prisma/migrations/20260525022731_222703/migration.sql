/*
  Warnings:

  - Added the required column `message` to the `MemorialSuggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemorialSuggestion" ADD COLUMN     "message" TEXT NOT NULL;
