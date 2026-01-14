const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE products ADD COLUMN IF NOT EXISTS repository_url TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE products ADD COLUMN IF NOT EXISTS production_url TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE products ADD COLUMN IF NOT EXISTS staging_url TEXT');
  console.log('✅ URL columns added');
  await prisma.$disconnect();
}

main();
