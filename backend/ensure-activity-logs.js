const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Este script SIEMPRE debe ejecutarse para asegurar que activity_logs existe
 * NO ELIMINAR - Es crítico para evitar errores
 */
async function ensureActivityLogsTable() {
  try {
    console.log('🔍 Verificando tabla activity_logs...');

    // Check if table exists
    const tableExists = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'activity_logs'
      );
    `);

    if (!tableExists[0].exists) {
      console.log('❌ Tabla activity_logs NO existe. Creando...');

      await prisma.$executeRawUnsafe(`
        CREATE TABLE "activity_logs" (
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

      // Create indexes
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "activity_logs_entity_idx" ON "activity_logs"("entity");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");
      `);

      // Add foreign key
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `);

      console.log('✅ Tabla activity_logs creada correctamente');
    } else {
      console.log('✅ Tabla activity_logs existe correctamente');
    }
  } catch (error) {
    console.error('❌ Error al verificar/crear activity_logs:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await ensureActivityLogsTable();
  } finally {
    await prisma.$disconnect();
  }
}

main();
