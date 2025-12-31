import { authPrisma } from '@niv/auth-db';
import {
  RefundRequestSchema,
  RefundStatus,
  TransactionStatus,
  type RefundRequest,
} from './types';
import { getTransaction } from './transactions';
import { createRefund as createStripeRefund } from './stripe';
import { creditWallet } from './wallet';

/**
 * Request a refund for a transaction
 *
 * @param userId - User ID making the request
 * @param transactionId - Transaction ID to refund
 * @param reason - Reason for refund request
 * @returns Created refund request
 */
export async function requestRefund(
  userId: string,
  transactionId: string,
  reason: string
): Promise<RefundRequest> {
  // Validate input
  const validated = RefundRequestSchema.parse({ transactionId, reason });

  // Verify transaction exists and belongs to user
  const transaction = await getTransaction(validated.transactionId);

  if (!transaction) {
    throw new Error(`Transaction not found: ${validated.transactionId}`);
  }

  if (transaction.userId !== userId) {
    throw new Error('Transaction does not belong to this user');
  }

  if (transaction.status !== TransactionStatus.COMPLETED) {
    throw new Error('Can only refund completed transactions');
  }

  // Check if refund request already exists
  const existingRefund = await authPrisma.refundRequest.findFirst({
    where: {
      transactionId: validated.transactionId,
      status: {
        in: [RefundStatus.PENDING, RefundStatus.APPROVED],
      },
    },
  });

  if (existingRefund) {
    throw new Error('A refund request already exists for this transaction');
  }

  // Create refund request
  const refundRequest = await authPrisma.refundRequest.create({
    data: {
      transactionId: validated.transactionId,
      userId,
      amount: transaction.amount,
      reason: validated.reason,
      status: RefundStatus.PENDING,
    },
  });

  return refundRequest as RefundRequest;
}

/**
 * Get refund request by ID
 *
 * @param refundRequestId - Refund request ID
 * @returns Refund request or null
 */
export async function getRefundRequest(refundRequestId: string): Promise<RefundRequest | null> {
  const refund = await authPrisma.refundRequest.findUnique({
    where: { id: refundRequestId },
  });

  return refund as RefundRequest | null;
}

/**
 * Get all refund requests for a user
 *
 * @param userId - User ID
 * @param status - Optional status filter
 * @returns Array of refund requests
 */
export async function getUserRefundRequests(
  userId: string,
  status?: RefundStatus
): Promise<RefundRequest[]> {
  const refunds = await authPrisma.refundRequest.findMany({
    where: {
      userId,
      ...(status && { status }),
    },
    orderBy: { createdAt: 'desc' },
  });

  return refunds as RefundRequest[];
}

/**
 * Get all pending refund requests (admin view)
 *
 * @param limit - Number of requests to fetch
 * @param offset - Offset for pagination
 * @returns Array of refund requests with transaction and user info
 */
export async function getPendingRefundRequests(
  limit: number = 50,
  offset: number = 0
): Promise<
  (RefundRequest & {
    transaction: { type: string; amount: number };
    user: { email: string; name: string | null };
  })[]
> {
  const refunds = await authPrisma.refundRequest.findMany({
    where: { status: RefundStatus.PENDING },
    orderBy: { createdAt: 'asc' },
    take: limit,
    skip: offset,
    include: {
      transaction: {
        select: {
          type: true,
          amount: true,
        },
      },
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return refunds as (RefundRequest & {
    transaction: { type: string; amount: number };
    user: { email: string; name: string | null };
  })[];
}

/**
 * Approve a refund request and process the refund
 *
 * @param refundRequestId - Refund request ID
 * @param adminNotes - Optional admin notes
 * @returns Updated refund request
 */
export async function approveRefund(
  refundRequestId: string,
  adminNotes?: string
): Promise<RefundRequest> {
  const refundRequest = await getRefundRequest(refundRequestId);

  if (!refundRequest) {
    throw new Error(`Refund request not found: ${refundRequestId}`);
  }

  if (refundRequest.status !== RefundStatus.PENDING) {
    throw new Error(`Refund request is not pending (status: ${refundRequest.status})`);
  }

  // Get associated transaction
  const transaction = await getTransaction(refundRequest.transactionId);

  if (!transaction) {
    throw new Error(`Transaction not found: ${refundRequest.transactionId}`);
  }

  // Update refund request to approved
  await authPrisma.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: RefundStatus.APPROVED,
      adminNote: adminNotes,
    },
  });

  // Process Stripe refund if there's a payment session (commented out for now - schema mismatch)
  // TODO: Re-enable when stripe session handling is implemented
  // if (transaction.stripeSessionId) {
  //   try {
  //     await createStripeRefund(
  //       transaction.stripeSessionId,
  //       refundRequest.amount,
  //       'requested_by_customer'
  //     );
  //   } catch (error) {
  //     await authPrisma.refundRequest.update({
  //       where: { id: refundRequestId },
  //       data: {
  //         status: RefundStatus.PENDING,
  //         adminNote: `Stripe refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
  //       },
  //     });
  //     throw error;
  //   }
  // }

  // Credit user's wallet
  await creditWallet(
    refundRequest.userId,
    refundRequest.amount,
    `Refund for transaction ${refundRequest.transactionId}`,
    refundRequest.transactionId
  );

  // Update refund request to completed
  const updatedRefund = await authPrisma.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: RefundStatus.COMPLETED,
    },
  });

  return updatedRefund as RefundRequest;
}

/**
 * Reject a refund request
 *
 * @param refundRequestId - Refund request ID
 * @param adminNotes - Reason for rejection
 * @returns Updated refund request
 */
export async function rejectRefund(
  refundRequestId: string,
  adminNotes: string
): Promise<RefundRequest> {
  const refundRequest = await getRefundRequest(refundRequestId);

  if (!refundRequest) {
    throw new Error(`Refund request not found: ${refundRequestId}`);
  }

  if (refundRequest.status !== RefundStatus.PENDING) {
    throw new Error(`Refund request is not pending (status: ${refundRequest.status})`);
  }

  const updatedRefund = await authPrisma.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: RefundStatus.REJECTED,
      adminNote: adminNotes,
    },
  });

  return updatedRefund as RefundRequest;
}

/**
 * Get refund statistics for admin dashboard
 *
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Refund statistics
 */
export async function getRefundStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  totalAmount: number;
}> {
  const where = {
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          },
        }
      : {}),
  };

  const [pending, approved, rejected, completed, totalAmount] = await Promise.all([
    authPrisma.refundRequest.count({ where: { ...where, status: RefundStatus.PENDING } }),
    authPrisma.refundRequest.count({ where: { ...where, status: RefundStatus.APPROVED } }),
    authPrisma.refundRequest.count({ where: { ...where, status: RefundStatus.REJECTED } }),
    authPrisma.refundRequest.count({ where: { ...where, status: RefundStatus.COMPLETED } }),
    authPrisma.refundRequest.aggregate({
      where: { ...where, status: RefundStatus.COMPLETED },
      _sum: { amount: true },
    }),
  ]);

  return {
    pending,
    approved,
    rejected,
    completed,
    totalAmount: totalAmount._sum.amount || 0,
  };
}

/**
 * Cancel a pending refund request (user initiated)
 *
 * @param refundRequestId - Refund request ID
 * @param userId - User ID (for verification)
 * @returns Updated refund request
 */
export async function cancelRefundRequest(
  refundRequestId: string,
  userId: string
): Promise<RefundRequest> {
  const refundRequest = await getRefundRequest(refundRequestId);

  if (!refundRequest) {
    throw new Error(`Refund request not found: ${refundRequestId}`);
  }

  if (refundRequest.userId !== userId) {
    throw new Error('Refund request does not belong to this user');
  }

  if (refundRequest.status !== RefundStatus.PENDING) {
    throw new Error('Can only cancel pending refund requests');
  }

  const updatedRefund = await authPrisma.refundRequest.update({
    where: { id: refundRequestId },
    data: {
      status: RefundStatus.REJECTED,
      adminNote: 'Cancelled by user',
    },
  });

  return updatedRefund as RefundRequest;
}
