import { PrismaClient } from './generated/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { paymentPrisma: PrismaClient };

export const paymentPrisma =
  globalForPrisma.paymentPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.paymentPrisma = paymentPrisma;
}

export default paymentPrisma;
