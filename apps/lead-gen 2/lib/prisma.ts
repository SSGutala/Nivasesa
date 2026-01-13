import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  leadGenPrisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.leadGenPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.leadGenPrisma = prisma;
}

export default prisma;
