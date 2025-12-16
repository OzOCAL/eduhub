import { PrismaClient, Role } from 'generated/prisma';

const prisma = new PrismaClient();

const users = [
  {
    email: 'jean@example.com',
    password: 'password',
    firstName: 'Jean',
    lastName: 'Bon',
    role: Role.ADMIN,
  },
];

async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    console.log('✅ Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });