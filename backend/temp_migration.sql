-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_product_id_fkey";

-- DropIndex
DROP INDEX "requests_product_id_idx";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "product_id",
ADD COLUMN     "product" "ProductType";

-- CreateIndex
CREATE INDEX "requests_product_idx" ON "requests"("product" ASC);

