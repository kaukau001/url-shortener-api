-- CreateEnum
CREATE TYPE "UrlStatus" AS ENUM ('ACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "short_urls" ADD COLUMN     "status" "UrlStatus" NOT NULL DEFAULT 'ACTIVE';
