-- AddForeignKey
ALTER TABLE "Memorial" ADD CONSTRAINT "Memorial_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
