import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConfig() {
  const configs = await prisma.systemConfig.findMany({
    orderBy: { key: 'asc' }
  });

  console.log('\n📊 Total de registros en system_config:', configs.length);
  console.log('\n🔑 Keys encontradas:');
  configs.forEach((config) => {
    console.log(`  - ${config.key}`);
  });

  await prisma.$disconnect();
}

checkConfig();
