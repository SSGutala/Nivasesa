import { authPrisma, type Prisma } from '@niv/auth-db';
import {
  TransactionType,
  TransactionStatus,
  type Transaction,
  type TransactionHistoryFilters,
} from './types';

/**
 * Internal helper to create a transaction record
 * Can be used within a Prisma transaction or standalone
 *
 * @param data - Transaction data
 * @param tx - Optional Prisma transaction client
 * @returns Created transaction
 */
export async function createTransaction(
  data: {
    userId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    stripeSessionId?: string;
  },
  tx?: Prisma.TransactionClient
): Promise<Transaction> {
  const client = tx || authPrisma;

  const transaction = await client.transaction.create({
    data: {
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      status: data.status,
      stripeSessionId: data.stripeSessionId,
    },
  });

  return transaction as Transaction;
}

/**
 * Get transaction by ID
 *
 * @param transactionId - Transaction ID
 * @returns Transaction or null if not found
 */
export async function getTransaction(transactionId: string): Promise<Transaction | null> {
  const transaction = await authPrisma.transaction.findUnique({
    where: { id: transactionId },
  });

  return transaction as Transaction | null;
}

/**
 * Get transaction history for a user with optional filters
 *
 * @param filters - Filter criteria
 * @returns Array of transactions
 */
export async function getTransactionHistory(
  filters: TransactionHistoryFilters
): Promise<Transaction[]> {
  const {
    userId,
    type,
    status,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
  } = filters;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(type && { type }),
    ...(status && { status }),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  const transactions = await authPrisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return transactions as Transaction[];
}

/**
 * Get transaction count for a user with optional filters
 *
 * @param filters - Filter criteria (without limit/offset)
 * @returns Transaction count
 */
export async function getTransactionCount(
  filters: Omit<TransactionHistoryFilters, 'limit' | 'offset'>
): Promise<number> {
  const { userId, type, status, startDate, endDate } = filters;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(type && { type }),
    ...(status && { status }),
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  return await authPrisma.transaction.count({ where });
}

/**
 * Update transaction status
 *
 * @param transactionId - Transaction ID
 * @param status - New status
 * @returns Updated transaction
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus
): Promise<Transaction> {
  const transaction = await authPrisma.transaction.update({
    where: { id: transactionId },
    data: { status },
  });

  return transaction as Transaction;
}

/**
 * Get total amount by transaction type for a user
 *
 * @param userId - User ID
 * @param type - Transaction type
 * @param status - Optional status filter
 * @returns Total amount
 */
export async function getTotalByType(
  userId: string,
  type: TransactionType,
  status?: TransactionStatus
): Promise<number> {
  const where: Prisma.TransactionWhereInput = {
    userId,
    type,
    ...(status && { status }),
  };

  const result = await authPrisma.transaction.aggregate({
    where,
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
}

/**
 * Get transactions by stripe session ID
 *
 * @param stripeSessionId - Stripe session ID
 * @returns Array of transactions
 */
export async function getTransactionsByStripeSession(
  stripeSessionId: string
): Promise<Transaction[]> {
  const transactions = await authPrisma.transaction.findMany({
    where: { stripeSessionId },
    orderBy: { createdAt: 'desc' },
  });

  return transactions as Transaction[];
}

/**
 * Get recent transactions across all users (admin view)
 *
 * @param limit - Number of transactions to fetch
 * @param offset - Offset for pagination
 * @returns Array of transactions with user info
 */
export async function getRecentTransactionsAdmin(
  limit: number = 100,
  offset: number = 0
): Promise<(Transaction & { user: { email: string; name: string | null } })[]> {
  const transactions = await authPrisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return transactions as (Transaction & { user: { email: string; name: string | null } })[];
}

/**
 * Get transaction statistics for a user
 *
 * @param userId - User ID
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Transaction statistics
 */
export async function getTransactionStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalTopUps: number;
  totalDeductions: number;
  totalRefunds: number;
  transactionCount: number;
}> {
  const where: Prisma.TransactionWhereInput = {
    userId,
    status: TransactionStatus.COMPLETED,
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  const [topUps, deductions, refunds, count] = await Promise.all([
    authPrisma.transaction.aggregate({
      where: { ...where, type: TransactionType.TOP_UP },
      _sum: { amount: true },
    }),
    authPrisma.transaction.aggregate({
      where: { ...where, type: TransactionType.DEDUCTION },
      _sum: { amount: true },
    }),
    authPrisma.transaction.aggregate({
      where: { ...where, type: TransactionType.REFUND },
      _sum: { amount: true },
    }),
    authPrisma.transaction.count({ where }),
  ]);

  return {
    totalTopUps: topUps._sum.amount || 0,
    totalDeductions: deductions._sum.amount || 0,
    totalRefunds: refunds._sum.amount || 0,
    transactionCount: count,
  };
}
