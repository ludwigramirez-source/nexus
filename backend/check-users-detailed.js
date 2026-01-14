const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log('Total usuarios en DB:', users.length);
    console.log('\nDetalles de usuarios:');
    console.log('='.repeat(80));

    users.forEach(u => {
      const hasPassword = u.password ? 'SÍ' : 'NO';
      const passwordPreview = u.password ? u.password.substring(0, 15) + '...' : 'NULL';
      console.log(`\nEmail: ${u.email}`);
      console.log(`Nombre: ${u.name}`);
      console.log(`Rol: ${u.role}`);
      console.log(`Tiene contraseña: ${hasPassword}`);
      console.log(`Password (preview): ${passwordPreview}`);
      console.log(`Creado: ${u.createdAt}`);
      console.log('-'.repeat(80));
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
