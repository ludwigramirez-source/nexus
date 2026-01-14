const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Step 1: Checking if status column exists...');

    // Check if status column exists
    const statusExists = await prisma.$queryRawUnsafe(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'status';
    `);

    if (statusExists.length > 0) {
      console.log('Status column exists, creating temp column...');

      // Add temp column to store current status values
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "status_temp" TEXT;
      `);

      // Copy current status values
      await prisma.$executeRawUnsafe(`
        UPDATE "products"
        SET "status_temp" = "status"::text
        WHERE "status" IS NOT NULL;
      `);

      console.log('Step 2: Dropping status column...');

      // Drop the status column
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "products"
        DROP COLUMN IF EXISTS "status";
      `);
    } else {
      console.log('Status column does not exist, skipping temp column creation...');
    }

    console.log('Step 3: Recreating ProductStatus enum...');

    // Drop and recreate enum - SIN CASCADE para no eliminar otras tablas
    await prisma.$executeRawUnsafe(`
      DROP TYPE IF EXISTS "ProductStatus";
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');
    `);

    console.log('Step 4: Creating BillingRecurrence enum...');

    // Create BillingRecurrence enum - SIN CASCADE para no eliminar otras tablas
    await prisma.$executeRawUnsafe(`
      DROP TYPE IF EXISTS "BillingRecurrence";
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TYPE "BillingRecurrence" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'ONE_TIME');
    `);

    console.log('Step 5: Adding status and recurrence columns...');

    // Add status column with new enum
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN "status" "ProductStatus" DEFAULT 'ACTIVE';
    `);

    // Add recurrence column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "recurrence" "BillingRecurrence" DEFAULT 'MONTHLY';
    `);

    console.log('Step 6: Restoring status values...');

    // Restore status values, mapping old values to new ones
    await prisma.$executeRawUnsafe(`
      UPDATE "products"
      SET "status" = CASE
        WHEN "status_temp" IN ('ACTIVE', 'DEVELOPMENT') THEN 'ACTIVE'::\"ProductStatus\"
        ELSE 'INACTIVE'::\"ProductStatus\"
      END
      WHERE "status_temp" IS NOT NULL;
    `);

    console.log('Step 7: Cleaning up...');

    // Drop temp column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      DROP COLUMN IF EXISTS "status_temp";
    `);

    console.log('✅ Product enum and recurrence field fixed successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
