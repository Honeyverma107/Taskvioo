const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@taskvio.com' },
    update: { name: 'Admin', password },
    create: {
      name: 'Admin',
      email: 'admin@taskvio.com',
      password,
    },
  });

  console.log('Seed complete: admin@taskvio.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
