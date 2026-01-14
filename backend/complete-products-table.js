const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Completing products table structure...');

    // Add all missing columns
    console.log('Adding price column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION DEFAULT 0;
    `);

    console.log('Adding currency column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
    `);

    console.log('Adding has_vat column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "has_vat" BOOLEAN DEFAULT true;
    `);

    console.log('Adding vat_rate column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "vat_rate" DOUBLE PRECISION;
    `);

    console.log('Adding launched_at column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "launched_at" TIMESTAMP(3);
    `);

    console.log('✅ Products table structure completed!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
