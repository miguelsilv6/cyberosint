import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  if (process.env.APP_ENV !== 'local') return;

  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;
  const role = (process.env.SEED_ADMIN_ROLE || 'admin') as Role;
  const rounds = Number(process.env.PASSWORD_SALT_ROUNDS || 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, rounds),
        role,
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded admin user: ${email}`);
  }
}

main().finally(async () => prisma.$disconnect());
