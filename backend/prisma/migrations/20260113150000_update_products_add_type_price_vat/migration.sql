-- CreateEnum for ProductType (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SERVICE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable: Add new fields to products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" "ProductType" NOT NULL DEFAULT 'PRODUCT';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "has_vat" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "vat_rate" DOUBLE PRECISION;

-- AlterTable: Remove deprecated fields
ALTER TABLE "products" DROP COLUMN IF EXISTS "active_clients";
ALTER TABLE "products" DROP COLUMN IF EXISTS "mrr";
