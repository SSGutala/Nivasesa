'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createCheckoutSession,
  createLeadPurchaseSession,
  getCheckoutSession,
  createRefund,
  LEAD_PRICE_CENTS,
} from '@/lib/stripe'

/**
 * Create a checkout session for wallet top-up
 */
export async function createWalletTopupAction(amount: number) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate amount
  const validAmounts = [50, 100, 200, 500]
  if (!validAmounts.includes(amount)) {
    return { success: false, error: 'Invalid amount' }
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email!,
      amount,
      successUrl: `${baseUrl}/dashboard/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/dashboard/wallet?canceled=true`,
    })

    return { success: true, url: checkoutSession.url }
  } catch (error) {
    console.error('Create checkout error:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

/**
 * Process successful wallet top-up after Stripe redirect
 */
export async function processWalletTopupAction(sessionId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Check if already processed
    const existingTransaction = await prisma.transaction.findFirst({
      where: { stripeSessionId: sessionId },
    })

    if (existingTransaction) {
      return { success: true, message: 'Already processed' }
    }

    // Get checkout session from Stripe
    const checkoutSession = await getCheckoutSession(sessionId)

    if (checkoutSession.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' }
    }

    // Verify this session belongs to current user
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return { success: false, error: 'Session mismatch' }
    }

    const amount = parseFloat(checkoutSession.metadata?.amount || '0')

    // Update user balance and create transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount,
          type: 'deposit',
          stripeSessionId: sessionId,
          status: 'completed',
        },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Process topup error:', error)
    return { success: false, error: 'Failed to process payment' }
  }
}

/**
 * Unlock a lead using wallet balance
 */
export async function unlockLeadWithBalanceAction(leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Get user and lead
    const [user, lead] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, balance: true, role: true },
      }),
      prisma.lead.findUnique({
        where: { id: leadId },
        select: { id: true, price: true },
      }),
    ])

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.role !== 'REALTOR') {
      return { success: false, error: 'Only realtors can unlock leads' }
    }

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    // Check if already unlocked
    const existingUnlock = await prisma.unlockedLead.findUnique({
      where: {
        userId_leadId: { userId: session.user.id, leadId },
      },
    })

    if (existingUnlock) {
      return { success: false, error: 'Lead already unlocked' }
    }

    // Check balance
    if (user.balance < lead.price) {
      return { success: false, error: 'Insufficient balance', needsTopup: true }
    }

    // Deduct balance and unlock lead
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: lead.price } },
      }),
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount: -lead.price,
          type: 'lead_purchase',
          status: 'completed',
        },
      }),
      prisma.unlockedLead.create({
        data: {
          userId: session.user.id,
          leadId,
        },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Unlock lead error:', error)
    return { success: false, error: 'Failed to unlock lead' }
  }
}

/**
 * Create checkout session for direct lead purchase (when balance is insufficient)
 */
export async function createLeadPurchaseCheckoutAction(leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, price: true },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await createLeadPurchaseSession({
      userId: session.user.id,
      email: session.user.email!,
      leadId,
      leadPrice: lead.price,
      successUrl: `${baseUrl}/dashboard/leads?success=true&lead_id=${leadId}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/dashboard/leads?canceled=true`,
    })

    return { success: true, url: checkoutSession.url }
  } catch (error) {
    console.error('Create lead purchase error:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

/**
 * Process successful lead purchase after Stripe redirect
 */
export async function processLeadPurchaseAction(sessionId: string, leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Check if already processed
    const existingUnlock = await prisma.unlockedLead.findUnique({
      where: {
        userId_leadId: { userId: session.user.id, leadId },
      },
    })

    if (existingUnlock) {
      return { success: true, message: 'Already processed' }
    }

    // Get checkout session from Stripe
    const checkoutSession = await getCheckoutSession(sessionId)

    if (checkoutSession.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' }
    }

    // Verify session metadata
    if (
      checkoutSession.metadata?.userId !== session.user.id ||
      checkoutSession.metadata?.leadId !== leadId
    ) {
      return { success: false, error: 'Session mismatch' }
    }

    const amount = parseFloat(checkoutSession.metadata?.amount || '0')

    // Create transaction and unlock lead
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount: -amount,
          type: 'lead_purchase',
          stripeSessionId: sessionId,
          status: 'completed',
        },
      }),
      prisma.unlockedLead.create({
        data: {
          userId: session.user.id,
          leadId,
        },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Process lead purchase error:', error)
    return { success: false, error: 'Failed to process payment' }
  }
}

/**
 * Get user's wallet balance and recent transactions
 */
export async function getWalletDataAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const [user, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true },
      }),
      prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    return {
      success: true,
      balance: user?.balance || 0,
      transactions,
    }
  } catch (error) {
    console.error('Get wallet data error:', error)
    return { success: false, error: 'Failed to get wallet data' }
  }
}

/**
 * Get all transactions for user (with pagination and filtering)
 */
export async function getTransactionsAction(
  page: number = 1,
  limit: number = 20,
  filters?: {
    type?: string
    startDate?: string
    endDate?: string
  }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const where: Record<string, unknown> = { userId: session.user.id }

    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        ;(where.createdAt as Record<string, Date>).lte = endDate
      }
    }

    const [transactions, total, stats] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ['type'],
        where: { userId: session.user.id },
        _sum: { amount: true },
        _count: true,
      }),
    ])

    // Calculate stats
    const totalDeposits = stats.find(s => s.type === 'deposit')?._sum.amount || 0
    const totalSpent = Math.abs(stats.find(s => s.type === 'lead_purchase')?._sum.amount || 0)
    const totalRefunds = stats.find(s => s.type === 'refund')?._sum.amount || 0

    return {
      success: true,
      transactions,
      total,
      pages: Math.ceil(total / limit),
      stats: {
        totalDeposits,
        totalSpent,
        totalRefunds,
        transactionCount: stats.reduce((sum, s) => sum + s._count, 0),
      },
    }
  } catch (error) {
    console.error('Get transactions error:', error)
    return { success: false, error: 'Failed to get transactions' }
  }
}

/**
 * Export transactions to CSV format
 */
export async function exportTransactionsAction(
  filters?: {
    type?: string
    startDate?: string
    endDate?: string
  }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const where: Record<string, unknown> = { userId: session.user.id }

    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        ;(where.createdAt as Record<string, Date>).lte = endDate
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = ['Date', 'Type', 'Amount', 'Status', 'Transaction ID']
    const rows = transactions.map(tx => [
      new Date(tx.createdAt).toISOString(),
      tx.type,
      tx.amount.toFixed(2),
      tx.status,
      tx.id,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    return { success: true, csv }
  } catch (error) {
    console.error('Export transactions error:', error)
    return { success: false, error: 'Failed to export transactions' }
  }
}

// =============================================================================
// REFUND ACTIONS
// =============================================================================

/**
 * Request a refund for a lead purchase
 */
export async function requestRefundAction(
  transactionId: string,
  reason: string
) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Get the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      return { success: false, error: 'Transaction not found' }
    }

    if (transaction.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (transaction.type !== 'lead_purchase') {
      return { success: false, error: 'Only lead purchases are refundable' }
    }

    if (transaction.status === 'refunded') {
      return { success: false, error: 'Already refunded' }
    }

    // Check if within refund window (7 days)
    const refundWindow = 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    if (Date.now() - new Date(transaction.createdAt).getTime() > refundWindow) {
      return { success: false, error: 'Refund window has expired (7 days)' }
    }

    // Check for existing refund request
    const existingRequest = await prisma.refundRequest.findFirst({
      where: {
        transactionId,
        status: { in: ['pending', 'approved'] },
      },
    })

    if (existingRequest) {
      return { success: false, error: 'A refund request already exists for this transaction' }
    }

    // Create refund request
    await prisma.refundRequest.create({
      data: {
        userId: session.user.id,
        transactionId,
        amount: Math.abs(transaction.amount),
        reason,
        status: 'pending',
      },
    })

    return { success: true, message: 'Refund request submitted successfully' }
  } catch (error) {
    console.error('Request refund error:', error)
    return { success: false, error: 'Failed to submit refund request' }
  }
}

/**
 * Get user's refund requests
 */
export async function getRefundRequestsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const requests = await prisma.refundRequest.findMany({
      where: { userId: session.user.id },
      include: {
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, requests }
  } catch (error) {
    console.error('Get refund requests error:', error)
    return { success: false, error: 'Failed to get refund requests' }
  }
}

/**
 * Process refund (Admin only) - credits wallet balance
 */
export async function processRefundAction(
  requestId: string,
  action: 'approve' | 'reject',
  adminNote?: string
) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return { success: false, error: 'Admin access required' }
  }

  try {
    const request = await prisma.refundRequest.findUnique({
      where: { id: requestId },
      include: { transaction: true },
    })

    if (!request) {
      return { success: false, error: 'Refund request not found' }
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'Request already processed' }
    }

    if (action === 'approve') {
      // Credit wallet balance and create refund transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: request.userId },
          data: { balance: { increment: request.amount } },
        }),
        prisma.transaction.create({
          data: {
            userId: request.userId,
            amount: request.amount,
            type: 'refund',
            status: 'completed',
          },
        }),
        prisma.transaction.update({
          where: { id: request.transactionId },
          data: { status: 'refunded' },
        }),
        prisma.refundRequest.update({
          where: { id: requestId },
          data: {
            status: 'approved',
            processedAt: new Date(),
            processedBy: session.user.id,
            adminNote,
          },
        }),
      ])

      return { success: true, message: 'Refund approved and credited to wallet' }
    } else {
      // Reject
      await prisma.refundRequest.update({
        where: { id: requestId },
        data: {
          status: 'rejected',
          processedAt: new Date(),
          processedBy: session.user.id,
          adminNote,
        },
      })

      return { success: true, message: 'Refund request rejected' }
    }
  } catch (error) {
    console.error('Process refund error:', error)
    return { success: false, error: 'Failed to process refund' }
  }
}

/**
 * Get all pending refund requests (Admin only)
 */
export async function getAdminRefundRequestsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return { success: false, error: 'Admin access required' }
  }

  try {
    const requests = await prisma.refundRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, requests }
  } catch (error) {
    console.error('Get admin refund requests error:', error)
    return { success: false, error: 'Failed to get refund requests' }
  }
}

/**
 * Cancel a pending refund request
 */
export async function cancelRefundRequestAction(requestId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const request = await prisma.refundRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      return { success: false, error: 'Request not found' }
    }

    if (request.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'Can only cancel pending requests' }
    }

    await prisma.refundRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' },
    })

    return { success: true, message: 'Refund request cancelled' }
  } catch (error) {
    console.error('Cancel refund request error:', error)
    return { success: false, error: 'Failed to cancel request' }
  }
}
