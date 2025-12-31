import { authPrisma } from '@niv/auth-db';
import {
  TopUpSchema,
  DeductionSchema,
  TransactionType,
  TransactionStatus,
  type WalletBalance,
  type TopUpResult,
  type DeductionResult,
} from './types';
import { createTransaction } from './transactions';

/**
 * Get wallet balance for a user
 *
 * @param userId - User ID
 * @returns Wallet balance information
 */
export async function getWalletBalance(userId: string): Promise<WalletBalance> {
  const user = await authPrisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      balance: true,
    },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  return {
    userId: user.id,
    balance: user.balance || 0,
    currency: 'usd',
  };
}

/**
 * Process a wallet top-up after successful payment
 *
 * @param userId - User ID
 * @param amount - Amount to add to wallet
 * @param paymentIntentId - Stripe payment intent ID
 * @returns Top-up result with transaction and new balance
 */
export async function processTopUp(
  userId: string,
  amount: number,
  paymentIntentId: string
): Promise<TopUpResult> {
  // Validate input
  const validated = TopUpSchema.parse({ userId, amount, paymentIntentId });

  // Use transaction to ensure atomicity
  const result = await authPrisma.$transaction(async (tx) => {
    // Get current balance
    const user = await tx.user.findUnique({
      where: { id: validated.userId },
      select: { balance: true },
    });

    if (!user) {
      throw new Error(`User not found: ${validated.userId}`);
    }

    const currentBalance = user.balance || 0;
    const newBalance = currentBalance + validated.amount;

    // Update wallet balance
    await tx.user.update({
      where: { id: validated.userId },
      data: { balance: newBalance },
    });

    // Create transaction record
    const transaction = await createTransaction(
      {
        userId: validated.userId,
        type: TransactionType.TOP_UP,
        amount: validated.amount,
        status: TransactionStatus.COMPLETED,
        stripeSessionId: validated.paymentIntentId,
      },
      tx
    );

    return { transaction, newBalance };
  });

  return result;
}

/**
 * Deduct amount from wallet
 *
 * @param userId - User ID
 * @param amount - Amount to deduct
 * @param reason - Reason for deduction
 * @returns Deduction result with transaction and new balance
 */
export async function deductFromWallet(
  userId: string,
  amount: number,
  reason: string
): Promise<DeductionResult> {
  // Validate input
  const validated = DeductionSchema.parse({ userId, amount, reason });

  // Use transaction to ensure atomicity
  const result = await authPrisma.$transaction(async (tx) => {
    // Get current balance
    const user = await tx.user.findUnique({
      where: { id: validated.userId },
      select: { balance: true },
    });

    if (!user) {
      throw new Error(`User not found: ${validated.userId}`);
    }

    const currentBalance = user.balance || 0;

    // Check sufficient balance
    if (currentBalance < validated.amount) {
      throw new Error(
        `Insufficient balance. Current: $${currentBalance.toFixed(2)}, Required: $${validated.amount.toFixed(2)}`
      );
    }

    const newBalance = currentBalance - validated.amount;

    // Update wallet balance
    await tx.user.update({
      where: { id: validated.userId },
      data: { balance: newBalance },
    });

    // Create transaction record
    const transaction = await createTransaction(
      {
        userId: validated.userId,
        type: TransactionType.DEDUCTION,
        amount: validated.amount,
        status: TransactionStatus.COMPLETED,
      },
      tx
    );

    return { transaction, newBalance };
  });

  return result;
}

/**
 * Add amount to wallet (for refunds or credits)
 *
 * @param userId - User ID
 * @param amount - Amount to add
 * @param reason - Reason for credit
 * @param transactionId - Optional related transaction ID
 * @returns Updated wallet balance
 */
export async function creditWallet(
  userId: string,
  amount: number,
  reason: string,
  transactionId?: string
): Promise<WalletBalance> {
  if (amount <= 0) {
    throw new Error('Credit amount must be positive');
  }

  const result = await authPrisma.$transaction(async (tx) => {
    // Get current balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, balance: true },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const currentBalance = user.balance || 0;
    const newBalance = currentBalance + amount;

    // Update wallet balance
    await tx.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });

    // Create transaction record
    await createTransaction(
      {
        userId,
        type: TransactionType.REFUND,
        amount,
        status: TransactionStatus.COMPLETED,
      },
      tx
    );

    return {
      userId: user.id,
      balance: newBalance,
      currency: 'usd',
    };
  });

  return result;
}

/**
 * Check if user has sufficient balance
 *
 * @param userId - User ID
 * @param amount - Amount to check
 * @returns True if sufficient balance exists
 */
export async function hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
  const balance = await getWalletBalance(userId);
  return balance.balance >= amount;
}

/**
 * Transfer amount between wallets (for internal transfers)
 *
 * @param fromUserId - Source user ID
 * @param toUserId - Destination user ID
 * @param amount - Amount to transfer
 * @param reason - Transfer reason
 * @returns Object with both new balances
 */
export async function transferBetweenWallets(
  fromUserId: string,
  toUserId: string,
  amount: number,
  reason: string
): Promise<{ fromBalance: number; toBalance: number }> {
  if (amount <= 0) {
    throw new Error('Transfer amount must be positive');
  }

  if (fromUserId === toUserId) {
    throw new Error('Cannot transfer to the same user');
  }

  const result = await authPrisma.$transaction(async (tx) => {
    // Deduct from sender
    const fromUser = await tx.user.findUnique({
      where: { id: fromUserId },
      select: { balance: true },
    });

    if (!fromUser) {
      throw new Error(`Source user not found: ${fromUserId}`);
    }

    const fromCurrentBalance = fromUser.balance || 0;

    if (fromCurrentBalance < amount) {
      throw new Error('Insufficient balance for transfer');
    }

    const fromNewBalance = fromCurrentBalance - amount;

    await tx.user.update({
      where: { id: fromUserId },
      data: { balance: fromNewBalance },
    });

    // Add to recipient
    const toUser = await tx.user.findUnique({
      where: { id: toUserId },
      select: { balance: true },
    });

    if (!toUser) {
      throw new Error(`Destination user not found: ${toUserId}`);
    }

    const toCurrentBalance = toUser.balance || 0;
    const toNewBalance = toCurrentBalance + amount;

    await tx.user.update({
      where: { id: toUserId },
      data: { balance: toNewBalance },
    });

    // Create deduction transaction for sender
    await createTransaction(
      {
        userId: fromUserId,
        type: TransactionType.DEDUCTION,
        amount,
        status: TransactionStatus.COMPLETED,
      },
      tx
    );

    // Create credit transaction for recipient
    await createTransaction(
      {
        userId: toUserId,
        type: TransactionType.TOP_UP,
        amount,
        status: TransactionStatus.COMPLETED,
      },
      tx
    );

    return {
      fromBalance: fromNewBalance,
      toBalance: toNewBalance,
    };
  });

  return result;
}
