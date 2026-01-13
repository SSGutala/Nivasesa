'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Wallet Management
export async function getWalletDataAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        creditBalance: true,
        freeUnlocksRemaining: true,
        totalUnlocks: true,
      },
    })

    if (!realtorProfile) {
      return { success: false, error: 'Realtor profile not found' }
    }

    const creditTransactions = await prisma.creditTransaction.findMany({
      where: {
        agent: {
          userId: session.user.id
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return {
      success: true,
      creditBalance: realtorProfile.creditBalance,
      freeUnlocksRemaining: realtorProfile.freeUnlocksRemaining,
      totalUnlocks: realtorProfile.totalUnlocks,
      transactions: creditTransactions,
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return { success: false, error: 'Failed to fetch wallet data' }
  }
}

export async function createWalletTopupAction(amount: number) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated', url: null }
  }

  // Stub implementation - in production, create Stripe checkout session
  return {
    success: false,
    error: 'Stripe integration not implemented in lead-gen app',
    url: null,
  }
}

export async function processWalletTopupAction(sessionId: string) {
  // Stub implementation
  return { success: false, error: 'Stripe integration not implemented' }
}

// Lead Purchase
export async function unlockLeadWithBalanceAction(leadId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { price: true },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    })

    if (!user || user.balance < lead.price) {
      return { success: false, needsTopup: true }
    }

    // Unlock lead and deduct balance
    await prisma.$transaction([
      prisma.unlockedLead.create({
        data: {
          leadId,
          userId: session.user.id,
        },
      }),
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
    ])

    revalidatePath('/dashboard/browse-leads')
    return { success: true }
  } catch (error) {
    console.error('Error unlocking lead:', error)
    return { success: false, error: 'Failed to unlock lead' }
  }
}

export async function createLeadPurchaseCheckoutAction(leadId: string) {
  // Stub - Stripe not implemented
  return { success: false, error: 'Direct purchase not implemented. Please add funds to wallet first.', url: null }
}

export async function processLeadPurchaseAction(sessionId: string, leadId: string) {
  // Stub - Stripe not implemented
  return { success: false, error: 'Stripe integration not implemented' }
}

// Transactions
export async function getTransactionsAction(
  page = 1,
  limit = 20,
  filters?: { type?: string; status?: string }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const where: any = {
      agent: {
        userId: session.user.id
      }
    }
    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type
    }

    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.creditTransaction.count({ where }),
    ])

    return {
      success: true,
      transactions,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error: 'Failed to fetch transactions' }
  }
}

export async function exportTransactionsAction(filters?: { type?: string; status?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const where: any = {
      agent: {
        userId: session.user.id
      }
    }
    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type
    }

    const transactions = await prisma.creditTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = ['Date', 'Type', 'Amount', 'Description', 'Lead ID', 'Transaction ID']
    const rows = transactions.map(tx => [
      new Date(tx.createdAt).toISOString(),
      tx.type,
      tx.amount.toString(),
      tx.description || '',
      tx.leadId || '',
      tx.id,
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

    return { success: true, csv }
  } catch (error) {
    console.error('Error exporting transactions:', error)
    return { success: false, error: 'Failed to export transactions' }
  }
}

// Refunds
export async function getRefundRequestsAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const requests = await prisma.refundRequest.findMany({
      where: {
        transaction: {
          userId: session.user.id,
        },
      },
      include: {
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, requests }
  } catch (error) {
    console.error('Error fetching refund requests:', error)
    return { success: false, error: 'Failed to fetch refund requests' }
  }
}

export async function requestRefundAction(transactionId: string, reason: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction || transaction.userId !== session.user.id) {
      return { success: false, error: 'Transaction not found' }
    }

    // Check if within 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (transaction.createdAt < sevenDaysAgo) {
      return { success: false, error: 'Refund window expired (7 days)' }
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

    revalidatePath('/dashboard/refunds')
    return { success: true, message: 'Refund request submitted successfully' }
  } catch (error) {
    console.error('Error requesting refund:', error)
    return { success: false, error: 'Failed to submit refund request' }
  }
}

export async function cancelRefundRequestAction(requestId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const request = await prisma.refundRequest.findUnique({
      where: { id: requestId },
      include: { transaction: true },
    })

    if (!request || request.transaction.userId !== session.user.id) {
      return { success: false, error: 'Request not found' }
    }

    if (request.status !== 'pending') {
      return { success: false, error: 'Can only cancel pending requests' }
    }

    await prisma.refundRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' },
    })

    revalidatePath('/dashboard/refunds')
    return { success: true }
  } catch (error) {
    console.error('Error canceling refund:', error)
    return { success: false, error: 'Failed to cancel request' }
  }
}
