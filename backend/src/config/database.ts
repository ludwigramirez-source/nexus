import { PrismaClient } from '@prisma/client';
import { config } from './env';

const prisma = new PrismaClient({
  log: config.app.isDev ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

// Handle cleanup on shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
