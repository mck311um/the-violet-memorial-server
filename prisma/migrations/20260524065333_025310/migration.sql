/*
  Warnings:

  - You are about to drop the `_MemorialToTimelineEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MemorialToTimelineEntry" DROP CONSTRAINT "_MemorialToTimelineEntry_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemorialToTimelineEntry" DROP CONSTRAINT "_MemorialToTimelineEntry_B_fkey";

-- DropTable
DROP TABLE "_MemorialToTimelineEntry";

-- AddForeignKey
ALTER TABLE "TimelineEntry" ADD CONSTRAINT "TimelineEntry_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
