import { PrismaClient } from './generated/prisma/index.js';

const globalForPrisma = globalThis as unknown as {
  authPrisma: PrismaClient | undefined;
};

export const authPrisma =
  globalForPrisma.authPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.authPrisma = authPrisma;
}

export default authPrisma;
