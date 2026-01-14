const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total usuarios en DB:', users.length);

    if (users.length > 0) {
      console.log('\nUsuarios encontrados:');
      users.forEach(u => {
        console.log(`- ${u.email} (${u.name}) - Rol: ${u.role}`);
      });
    } else {
      console.log('\n⚠️ No hay usuarios en la base de datos');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
