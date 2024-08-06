import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phases = ['Backlog', 'Design', 'To do', 'Doing', 'Done'];

  for (const title of phases) {
    await prisma.phase.upsert({
      where: { phase_title: title },
      update: {},
      create: { phase_title: title },
    });
  }

  console.log('Default phases inserted.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
