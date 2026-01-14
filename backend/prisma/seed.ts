import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * CRÍTICO: Verifica que la tabla activity_logs existe
 * Esta función DEBE ejecutarse SIEMPRE para evitar errores
 */
async function ensureActivityLogsTable() {
  try {
    console.log('🔍 Verificando tabla activity_logs...');

    const tableExists = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'activity_logs'
      );
    `);

    if (!(tableExists as any)[0].exists) {
      console.log('⚠️  Tabla activity_logs NO existe. Creando...');

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

      await prisma.$executeRawUnsafe(`
        ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `);

      console.log('✅ Tabla activity_logs creada correctamente');
    } else {
      console.log('✅ Tabla activity_logs existe');
    }
  } catch (error) {
    console.error('❌ Error al verificar activity_logs:', error);
    // No throw - continuar con el seed
  }
}

async function main() {
  console.log('🌱 Seeding database...');

  // SIEMPRE verificar activity_logs primero
  await ensureActivityLogsTable();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iptegra.com' },
    update: {},
    create: {
      email: 'admin@iptegra.com',
      password: hashedPassword,
      name: 'Ludwig Schmidt',
      role: 'CEO',
      capacity: 40,
      skills: ['Management', 'Strategy', 'Leadership'],
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create team members
  const teamMembers = [
    {
      email: 'dev1@iptegra.com',
      name: 'Carlos Mendoza',
      role: 'DEV_DIRECTOR',
      capacity: 40,
      skills: ['Node.js', 'React', 'PostgreSQL', 'Architecture'],
    },
    {
      email: 'dev2@iptegra.com',
      name: 'Ana Rodríguez',
      role: 'FULLSTACK',
      capacity: 40,
      skills: ['React', 'Node.js', 'TypeScript'],
    },
    {
      email: 'dev3@iptegra.com',
      name: 'Miguel Torres',
      role: 'BACKEND',
      capacity: 40,
      skills: ['Node.js', 'PostgreSQL', 'API Design'],
    },
    {
      email: 'dev4@iptegra.com',
      name: 'Laura Pérez',
      role: 'FRONTEND',
      capacity: 40,
      skills: ['React', 'Tailwind', 'UI/UX'],
    },
  ];

  for (const member of teamMembers) {
    const password = await bcrypt.hash('dev123', 10);
    await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        ...member,
        password,
        status: 'ACTIVE',
      },
    });
    console.log('✅ Team member created:', member.email);
  }

  // Create products
  const products = [
    {
      name: 'Mawi Chat',
      description: 'Chat center solution for customer service with AI-powered automation',
      type: 'PRODUCT',
      price: 800,
      currency: 'USD',
      hasVAT: true,
      vatRate: 19,
      repositoryUrl: 'https://github.com/iptegra/mawi',
      productionUrl: 'https://mawi.chat',
      stagingUrl: 'https://staging.mawi.chat',
      status: 'ACTIVE',
      launchedAt: new Date('2020-01-01'),
    },
    {
      name: 'Omnileads',
      description: 'Call center and predictive dialer solution for sales teams',
      type: 'PRODUCT',
      price: 1200,
      currency: 'USD',
      hasVAT: true,
      vatRate: 19,
      repositoryUrl: 'https://github.com/iptegra/omnileads',
      productionUrl: 'https://omnileads.com',
      stagingUrl: 'https://staging.omnileads.com',
      status: 'ACTIVE',
      launchedAt: new Date('2018-06-01'),
    },
    {
      name: 'DXW Delivery',
      description: 'WhatsApp delivery system for restaurants with real-time tracking',
      type: 'PRODUCT',
      price: 450,
      currency: 'USD',
      hasVAT: true,
      vatRate: 19,
      repositoryUrl: 'https://github.com/iptegra/dxw',
      productionUrl: null,
      stagingUrl: 'https://staging.dxw.co',
      status: 'ACTIVE',
      launchedAt: null,
    },
    {
      name: 'Custom Development',
      description: 'Bespoke software development services',
      type: 'SERVICE',
      price: 0,
      currency: 'USD',
      hasVAT: false,
      status: 'ACTIVE',
      launchedAt: new Date('2015-01-01'),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product as any,
    });
    console.log('✅ Product created:', product.name);
  }

  // Create sample clients
  const clients = [
    {
      name: 'Grupo Financiero Azteca',
      nit: '900123456-1',
      email: 'contacto@azteca.com',
      contactPerson: 'Roberto Martínez',
      phone: '+52 55 1234 5678',
      website: 'https://azteca.com',
      address: 'Av. Insurgentes Sur 3579, Ciudad de México',
      products: ['Mawi Chat'],
      mrr: 2400,
      currency: 'MXN',
      healthScore: 92,
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      notes: 'Cliente prioritario con soporte 24/7. Requiere reportes mensuales de performance.',
    },
    {
      name: 'Banco de Bogotá',
      nit: '860002964-4',
      email: 'sistemas@bancodebogota.com',
      contactPerson: 'María González',
      phone: '+57 1 2345678',
      website: 'https://bancodebogota.com',
      address: 'Carrera 7 # 32-48, Bogotá',
      products: ['Omnileads', 'Mawi Chat'],
      mrr: 3500,
      currency: 'COP',
      healthScore: 88,
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      notes: 'Uso intensivo del call center. Plan de expansión Q2 2026.',
    },
    {
      name: 'Restaurantes La Fogata',
      nit: '12345678-9',
      email: 'admin@lafogata.mx',
      contactPerson: 'Juan Pérez',
      phone: '+52 33 8765 4321',
      website: 'https://lafogata.mx',
      address: 'Av. Chapultepec 123, Guadalajara',
      products: ['DXW Delivery'],
      mrr: 450,
      currency: 'MXN',
      healthScore: 75,
      tier: 'PRO',
      status: 'ACTIVE',
      notes: 'Cadena de 15 restaurantes. Beta tester de DXW.',
    },
    {
      name: 'TechCorp Solutions',
      nit: '800987654-2',
      email: 'info@techcorp.com',
      contactPerson: 'Ana Rodríguez',
      phone: '+1 305 555 0123',
      website: 'https://techcorp.com',
      address: '1234 Brickell Ave, Miami, FL',
      products: ['Custom Development'],
      mrr: 5000,
      currency: 'USD',
      healthScore: 95,
      tier: 'ENTERPRISE',
      status: 'ACTIVE',
      notes: 'Cliente de desarrollo custom. Proyecto de integración SAP en curso.',
    },
    {
      name: 'E-Commerce Plus',
      nit: '700654321-8',
      email: 'soporte@ecommerceplus.com',
      contactPerson: 'Carlos Méndez',
      phone: '+57 2 9876543',
      website: 'https://ecommerceplus.com',
      address: 'Calle 5 # 10-20, Cali',
      products: ['Mawi Chat'],
      mrr: 800,
      currency: 'USD',
      healthScore: 68,
      tier: 'BASIC',
      status: 'ACTIVE',
      notes: 'Health score bajo por incidentes recientes. Requiere follow-up.',
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { name: client.name },
      update: {},
      create: client as any,
    });
    console.log('✅ Client created:', client.name);
  }

  // TODO: Create sample OKR (requires proper OKR table migration)
  // const okr = await prisma.oKR.create({
  //   data: {
  //     title: 'Transform IPTEGRA into a pure SaaS company',
  //     description: 'Strategic objective to transition from custom development to product-focused model',
  //     year: 2025,
  //     quarter: 'Q1',
  //     ownerId: admin.id,
  //     status: 'ON_TRACK',
  //     progress: 65,
  //     keyResults: {
  //       create: [
  //         {
  //           title: 'Achieve 70/30 product-to-custom ratio',
  //           targetValue: 70,
  //           currentValue: 65,
  //           unit: '%',
  //         },
  //         {
  //           title: 'Launch dxw.co MVP with 10 paying clients',
  //           targetValue: 10,
  //           currentValue: 0,
  //           unit: 'clients',
  //         },
  //       ],
  //     },
  //   },
  // });

  // console.log('✅ OKR created:', okr.title);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
