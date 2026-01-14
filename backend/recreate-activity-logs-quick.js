const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Recreating activity_logs table...');

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
        "id" TEXT NOT NULL,
        "user_id" TEXT,
        "user_name" TEXT,
        "user_email" TEXT,
        "action" TEXT NOT NULL,
        "entity" TEXT NOT NULL,
        "entity_id" TEXT,
        "description" TEXT NOT NULL,
        "metadata" JSONB,
        "ip_address" TEXT,
        "user_agent" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('Creating indexes...');

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "activity_logs_user_id_idx" ON "activity_logs"("user_id");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs"("action");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "activity_logs_entity_idx" ON "activity_logs"("entity");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs"("created_at");
    `);

    console.log('Adding foreign key...');

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✅ activity_logs table recreated successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
