/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserCredential` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userId_key" ON "UserCredential"("userId");
