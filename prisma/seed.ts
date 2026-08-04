import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HypeCut database...');

  // Seed Professionals
  const professionals = [
    {
      name: 'JONATHAN NEMECEK',
      role: 'Barbeiro & Fundador',
      specialties: 'Cortes na Tesoura • Visagismo • Barboterapia',
      avatarUrl: '/jonathan.png',
    },
    {
      name: 'BRUNO',
      role: 'Artista & Tatuador',
      specialties: 'Lettering • Dark Art • Freehand',
      avatarUrl: '/bruno.png',
    },
    {
      name: 'BOSCO',
      role: 'Barbeiro',
      specialties: 'Cabelo Afro • Barba • Corte Americano',
      avatarUrl: '/bosco.png',
    },
    {
      name: 'LUKINHA',
      role: 'Barbeiro',
      specialties: 'Moicano • Americano • Freestyle',
      avatarUrl: '/Lukinha.png',
    },
    {
      name: 'MATHEUS',
      role: 'Tatuador',
      specialties: 'Realismo • Preto e Cinza • Fine Line',
      avatarUrl: '/matheus.png',
    },
    {
      name: 'PORKS',
      role: 'Barbeiro & Estilo',
      specialties: 'Cortes Modernos • Degradê • Pigmentação',
      avatarUrl: '/porks.png',
    },
  ];

  for (const pro of professionals) {
    const existing = await prisma.professional.findFirst({
      where: { name: pro.name },
    });
    if (!existing) {
      await prisma.professional.create({ data: pro });
    }
  }

  // Seed Services
  const services = [
    {
      name: 'Corte de Cabelo Masculino Stylist',
      category: 'barbearia',
      durationMin: 30,
      price: 60.0,
      description: 'Visagismo sob medida, corte com tesoura/máquina e finalização premium.',
    },
    {
      name: 'Barboterapia com Toalha Quente',
      category: 'barbearia',
      durationMin: 30,
      price: 50.0,
      description: 'Esfoliação, óleo essencial, toalha quente e alinhamento na navalha.',
    },
    {
      name: 'Combo VIP Complete',
      category: 'combos',
      durationMin: 60,
      price: 150.0,
      description: 'Corte + Barboterapia + Sobrancelha + Esfoliação facial.',
    },
    {
      name: 'Cabelo + Barba + Sobrancelha',
      category: 'combos',
      durationMin: 60,
      price: 110.0,
      description: 'O combo mais pedido: alinhamento completo do visual.',
    },
    {
      name: 'Cabelo + Barba',
      category: 'combos',
      durationMin: 45,
      price: 95.0,
      description: 'Corte masculino + modelagem e desenho de barba.',
    },
    {
      name: 'Sessão de Tattoo Autoral / Consultoria',
      category: 'tattoo',
      durationMin: 60,
      price: 200.0,
      description: 'Consultoria e criação de projeto autoral sob medida.',
    },
    {
      name: 'Limpeza de Pele & Cuidado Facial',
      category: 'estetica',
      durationMin: 30,
      price: 70.0,
      description: 'Remoção de cravos, esfoliação e hidratação profunda.',
    },
  ];

  for (const srv of services) {
    const existing = await prisma.service.findFirst({
      where: { name: srv.name },
    });
    if (!existing) {
      await prisma.service.create({ data: srv });
    }
  }

  console.log('HypeCut database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
