-- AlterTable: Add nit and currency fields, remove customizations fields
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "nit" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "clients" DROP COLUMN IF EXISTS "customizations_count";
ALTER TABLE "clients" DROP COLUMN IF EXISTS "last_custom_request";
