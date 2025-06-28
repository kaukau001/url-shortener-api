/*
  Warnings:

  - A unique constraint covering the columns `[code,status]` on the table `short_urls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "short_urls_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_code_status_key" ON "short_urls"("code", "status");
