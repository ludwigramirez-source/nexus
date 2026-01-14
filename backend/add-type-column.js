const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Step 1: Creating ProductCategory enum...');

    // Create ProductCategory enum if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "ProductCategory" AS ENUM ('PRODUCT', 'SERVICE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('Step 2: Adding type column to products table...');

    // Add type column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "type" "ProductCategory" DEFAULT 'PRODUCT';
    `);

    console.log('✅ Type column added successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
