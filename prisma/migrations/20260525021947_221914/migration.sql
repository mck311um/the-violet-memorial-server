-- CreateTable
CREATE TABLE "MemorialSuggestion" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "MemorialSuggestion_pkey" PRIMARY KEY ("id")
);
