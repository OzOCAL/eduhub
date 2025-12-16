import { PrismaClient, Role } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    email: 'jean@example.com',
    password: 'password',
    firstName: 'Jean',
    lastName: 'Bon',
    role: Role.ADMIN,
  },
  {
    // Admin user used by e2e tests
    email: 'admin@example.fr',
    password: 'Admin41200',
    firstName: 'Admin',
    lastName: 'User',
    role: Role.ADMIN,
  },
];

async function main() {
  // Hash passwords before seeding
  const hashed = await Promise.all(users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) })));

  await prisma.user.createMany({
    data: hashed,
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