'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, createLeadPurchaseSession, LEAD_PRICE_CENTS, getCheckoutSession } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

/**
 * Create a Stripe Checkout session for wallet top-up
 */
export async function createWalletTopupAction(amount: number): Promise<{ url: string } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { error: 'Not authenticated' };
  }

  // Validate amount
  const validAmounts = [50, 100, 200, 500];
  if (!validAmounts.includes(amount)) {
    return { error: 'Invalid top-up amount' };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      amount,
      successUrl: `${baseUrl}/dashboard/wallet?success=true&amount=${amount}`,
      cancelUrl: `${baseUrl}/dashboard/wallet?canceled=true`,
    });

    if (!checkoutSession.url) {
      return { error: 'Failed to create checkout session' };
    }

    return { url: checkoutSession.url };
  } catch (error) {
    console.error('Wallet topup error:', error);
    return { error: 'Failed to initiate payment' };
  }
}

/**
 * Create a Stripe Checkout session for direct lead purchase
 */
export async function createLeadPurchaseAction(leadId: string): Promise<{ url: string } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { error: 'Not authenticated' };
  }

  // Verify lead exists and isn't already unlocked
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return { error: 'Lead not found' };
  }

  const alreadyUnlocked = await prisma.unlockedLead.findFirst({
    where: {
      userId: session.user.id,
      leadId,
    },
  });

  if (alreadyUnlocked) {
    return { error: 'Lead already unlocked' };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const leadPrice = LEAD_PRICE_CENTS / 100; // Convert to dollars

    const checkoutSession = await createLeadPurchaseSession({
      userId: session.user.id,
      email: session.user.email,
      leadId,
      leadPrice,
      successUrl: `${baseUrl}/dashboard/leads?success=true&lead=${leadId}`,
      cancelUrl: `${baseUrl}/dashboard/leads/${leadId}?canceled=true`,
    });

    if (!checkoutSession.url) {
      return { error: 'Failed to create checkout session' };
    }

    return { url: checkoutSession.url };
  } catch (error) {
    console.error('Lead purchase error:', error);
    return { error: 'Failed to initiate payment' };
  }
}

/**
 * Unlock a lead using wallet balance
 */
export async function unlockLeadWithBalanceAction(leadId: string): Promise<{ success: boolean } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  // Verify lead exists
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return { error: 'Lead not found' };
  }

  // Check if already unlocked
  const alreadyUnlocked = await prisma.unlockedLead.findFirst({
    where: {
      userId: session.user.id,
      leadId,
    },
  });

  if (alreadyUnlocked) {
    return { error: 'Lead already unlocked' };
  }

  // Get user and check balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: 'User not found' };
  }

  const leadPrice = LEAD_PRICE_CENTS / 100;

  // Check for free unlocks first
  const unlockedCount = await prisma.unlockedLead.count({
    where: { userId: session.user.id },
  });

  const FREE_UNLOCKS = 10;
  const hasFreeUnlocks = unlockedCount < FREE_UNLOCKS;

  if (!hasFreeUnlocks && (user.balance || 0) < leadPrice) {
    return { error: 'Insufficient balance. Please top up your wallet.' };
  }

  try {
    // Use transaction to ensure atomicity
    await prisma.$transaction([
      // Only deduct balance if using paid unlock
      ...(hasFreeUnlocks
        ? []
        : [
            prisma.user.update({
              where: { id: session.user.id },
              data: { balance: { decrement: leadPrice } },
            }),
            prisma.transaction.create({
              data: {
                userId: session.user.id,
                amount: -leadPrice,
                type: 'lead_unlock',
                status: 'completed',
              },
            }),
          ]),
      // Create unlock record
      prisma.unlockedLead.create({
        data: {
          userId: session.user.id,
          leadId,
        },
      }),
    ]);

    revalidatePath('/dashboard/leads');
    return { success: true };
  } catch (error) {
    console.error('Lead unlock error:', error);
    return { error: 'Failed to unlock lead' };
  }
}

/**
 * Get user's wallet balance and transaction history
 */
export async function getWalletDetailsAction(): Promise<{
  balance: number;
  freeUnlocksRemaining: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
  }>;
} | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const unlockedCount = await prisma.unlockedLead.count({
      where: { userId: session.user.id },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const FREE_UNLOCKS = 10;

    return {
      balance: user.balance || 0,
      freeUnlocksRemaining: Math.max(0, FREE_UNLOCKS - unlockedCount),
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        status: t.status,
        createdAt: t.createdAt,
      })),
    };
  } catch (error) {
    console.error('Get wallet details error:', error);
    return { error: 'Failed to get wallet details' };
  }
}

/**
 * Request a refund for a transaction
 */
export async function requestRefundAction(
  transactionId: string,
  reason: string
): Promise<{ success: boolean } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  // Verify transaction exists and belongs to user
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: session.user.id,
    },
  });

  if (!transaction) {
    return { error: 'Transaction not found' };
  }

  // Check if refund already requested
  const existingRefund = await prisma.refundRequest.findFirst({
    where: { transactionId },
  });

  if (existingRefund) {
    return { error: 'Refund already requested' };
  }

  try {
    await prisma.refundRequest.create({
      data: {
        transactionId,
        userId: session.user.id,
        reason,
        status: 'pending',
      },
    });

    revalidatePath('/dashboard/transactions');
    return { success: true };
  } catch (error) {
    console.error('Refund request error:', error);
    return { error: 'Failed to request refund' };
  }
}

/**
 * Verify a checkout session completed (for success page)
 */
export async function verifyCheckoutSessionAction(
  sessionId: string
): Promise<{ verified: boolean; amount?: number } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  try {
    const checkoutSession = await getCheckoutSession(sessionId);

    if (checkoutSession.payment_status === 'paid' && checkoutSession.metadata?.userId === session.user.id) {
      return {
        verified: true,
        amount: parseFloat(checkoutSession.metadata.amount || '0'),
      };
    }

    return { verified: false };
  } catch (error) {
    console.error('Verify checkout session error:', error);
    return { error: 'Failed to verify payment' };
  }
}
