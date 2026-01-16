import prisma from '../config/database';
import logger from '../config/logger';

/**
 * Script para actualizar el estado de requests que tienen asignaciones
 * pero están en INTAKE o BACKLOG a IN_PROGRESS
 */
async function fixRequestStatuses() {
  try {
    console.log('🔄 Iniciando corrección de estados de requests...\n');

    // Obtener todos los requests que tienen asignaciones
    const requestsWithAssignments = await prisma.assignment.findMany({
      select: {
        requestId: true,
      },
      distinct: ['requestId'],
    });

    const requestIds = requestsWithAssignments.map(a => a.requestId);
    console.log(`📊 Encontrados ${requestIds.length} requests con asignaciones\n`);

    // Obtener requests que están en INTAKE o BACKLOG y tienen asignaciones
    const requestsToUpdate = await prisma.request.findMany({
      where: {
        id: { in: requestIds },
        status: { in: ['INTAKE', 'BACKLOG'] },
      },
      select: {
        id: true,
        requestNumber: true,
        title: true,
        status: true,
      },
    });

    if (requestsToUpdate.length === 0) {
      console.log('✅ No hay requests que necesiten actualización');
      return;
    }

    console.log(`🔧 Actualizando ${requestsToUpdate.length} requests:\n`);

    // Actualizar cada request
    for (const request of requestsToUpdate) {
      await prisma.request.update({
        where: { id: request.id },
        data: { status: 'IN_PROGRESS' },
      });

      console.log(`  ✓ ${request.requestNumber} - "${request.title}"`);
      console.log(`    Estado: ${request.status} → IN_PROGRESS\n`);
    }

    console.log(`\n✅ ¡Corrección completada! ${requestsToUpdate.length} requests actualizados`);

  } catch (error) {
    console.error('❌ Error al actualizar estados:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar script
fixRequestStatuses()
  .then(() => {
    console.log('\n✨ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
