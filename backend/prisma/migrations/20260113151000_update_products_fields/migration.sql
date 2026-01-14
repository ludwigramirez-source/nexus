-- Add new fields to products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "has_vat" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "vat_rate" DOUBLE PRECISION;

-- Remove deprecated fields
ALTER TABLE "products" DROP COLUMN IF EXISTS "active_clients";
ALTER TABLE "products" DROP COLUMN IF EXISTS "mrr";

-- Add type column (ProductType enum already exists from Request model)
-- We'll handle this in Prisma since the enum already exists
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'PRODUCT';
