'use server'

import { auth } from '@/auth'
import { prisma } from '../lib/prisma'

/**
 * Get available leads for realtors to browse (not yet unlocked by this user)
 */
export async function getAvailableLeadsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Get user's realtor profile to filter by location
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        realtorProfile: true,
        unlockedLeads: {
          select: { leadId: true },
        },
      },
    })

    if (!user || (user as any).role !== 'REALTOR') {
      return { success: false, error: 'Only realtors can browse leads' }
    }

    const unlockedLeadIds = user.unlockedLeads.map(ul => ul.leadId)

    // Get leads that haven't been unlocked by this user
    // In production, filter by realtor's service areas
    const leads = await prisma.lead.findMany({
      where: {
        status: 'locked',
        id: {
          notIn: unlockedLeadIds.length > 0 ? unlockedLeadIds : [''],
        },
      },
      select: {
        id: true,
        buyerName: true,
        city: true,
        zipcode: true,
        buyerType: true,
        interest: true,
        languagePreference: true,
        timeline: true,
        price: true,
        status: true,
        createdAt: true,
        // Don't include contact details for locked leads
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, leads }
  } catch (error) {
    console.error('Get available leads error:', error)
    return { success: false, error: 'Failed to fetch leads' }
  }
}

/**
 * Get leads that the current user has unlocked
 */
export async function getUnlockedLeadsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const unlockedLeads = await prisma.unlockedLead.findMany({
      where: { userId: session.user.id },
      include: {
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const leads = unlockedLeads.map(ul => ul.lead)

    return { success: true, leads }
  } catch (error) {
    console.error('Get unlocked leads error:', error)
    return { success: false, error: 'Failed to fetch unlocked leads' }
  }
}

/**
 * Get a single lead with full details (if unlocked by user)
 */
export async function getLeadDetailsAction(leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Check if user has unlocked this lead
    const unlockedLead = await prisma.unlockedLead.findUnique({
      where: {
        userId_leadId: {
          userId: session.user.id,
          leadId,
        },
      },
      include: {
        lead: true,
      },
    })

    if (!unlockedLead) {
      // Return limited info for locked leads
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: {
          id: true,
          buyerName: true,
          city: true,
          zipcode: true,
          buyerType: true,
          interest: true,
          languagePreference: true,
          timeline: true,
          price: true,
          status: true,
          createdAt: true,
        },
      })

      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      return { success: true, lead, isUnlocked: false }
    }

    return { success: true, lead: unlockedLead.lead, isUnlocked: true }
  } catch (error) {
    console.error('Get lead details error:', error)
    return { success: false, error: 'Failed to fetch lead' }
  }
}

/**
 * Check if user has unlocked a specific lead
 */
export async function checkLeadUnlockedAction(leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const unlockedLead = await prisma.unlockedLead.findUnique({
      where: {
        userId_leadId: {
          userId: session.user.id,
          leadId,
        },
      },
    })

    return { success: true, isUnlocked: !!unlockedLead }
  } catch (error) {
    console.error('Check lead unlocked error:', error)
    return { success: false, error: 'Failed to check lead status' }
  }
}

/**
 * Get lead statistics for the current realtor
 */
export async function getLeadStatsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const [totalUnlocked, totalAvailable] = await Promise.all([
      prisma.unlockedLead.count({
        where: { userId: session.user.id },
      }),
      prisma.lead.count({
        where: { status: 'locked' },
      }),
    ])

    // Get recent unlocks
    const recentUnlocks = await prisma.unlockedLead.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        lead: {
          select: {
            buyerName: true,
            city: true,
          },
        },
      },
    })

    return {
      success: true,
      stats: {
        totalUnlocked,
        totalAvailable,
        recentUnlocks: recentUnlocks.map(ul => ({
          leadName: ul.lead.buyerName,
          city: ul.lead.city,
          unlockedAt: ul.createdAt,
        })),
      },
    }
  } catch (error) {
    console.error('Get lead stats error:', error)
    return { success: false, error: 'Failed to fetch stats' }
  }
}

/**
 * Unlock a lead by deducting credits and revealing buyer contact info
 */
export async function unlockLeadAction(leadId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Use Prisma transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Get realtor profile for this user
      // Note: User model is in separate auth database, so we query RealtorProfile by userId
      const profile = await tx.realtorProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!profile) {
        throw new Error('Only realtors can unlock leads')
      }

      // Get the lead
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
      })

      if (!lead) {
        throw new Error('Lead not found')
      }

      // Check if already unlocked
      const existingUnlock = await tx.unlockedLead.findUnique({
        where: {
          userId_leadId: {
            userId: session.user.id,
            leadId,
          },
        },
      })

      if (existingUnlock) {
        throw new Error('Lead already unlocked')
      }

      // Check credit availability
      const useFreeUnlock = profile.freeUnlocksRemaining > 0
      const hasSufficientCredits = profile.creditBalance >= lead.price

      if (!useFreeUnlock && !hasSufficientCredits) {
        throw new Error('INSUFFICIENT_CREDITS')
      }

      // Create unlocked lead record
      const unlockedLead = await tx.unlockedLead.create({
        data: {
          userId: session.user.id,
          leadId,
        },
      })

      // Deduct credits and update profile
      const updates: any = {
        totalUnlocks: { increment: 1 },
      }

      if (useFreeUnlock) {
        updates.freeUnlocksRemaining = { decrement: 1 }
      } else {
        updates.creditBalance = { decrement: lead.price }
      }

      await tx.realtorProfile.update({
        where: { id: profile.id },
        data: updates,
      })

      // Create credit transaction record
      await tx.creditTransaction.create({
        data: {
          agentId: profile.id,
          amount: useFreeUnlock ? 0 : -lead.price,
          type: 'unlock',
          description: useFreeUnlock
            ? `Free unlock for lead: ${lead.buyerName}`
            : `Unlocked lead: ${lead.buyerName}`,
          leadId,
        },
      })

      // Return the unlocked lead with full contact info
      return {
        unlockedLead,
        lead,
        usedFreeUnlock: useFreeUnlock,
        remainingFreeUnlocks: useFreeUnlock
          ? profile.freeUnlocksRemaining - 1
          : profile.freeUnlocksRemaining,
        remainingCredits: useFreeUnlock
          ? profile.creditBalance
          : profile.creditBalance - lead.price,
      }
    })

    return {
      success: true,
      lead: result.lead,
      usedFreeUnlock: result.usedFreeUnlock,
      remainingFreeUnlocks: result.remainingFreeUnlocks,
      remainingCredits: result.remainingCredits,
    }
  } catch (error: any) {
    console.error('Unlock lead error:', error)

    // Handle insufficient credits error specially
    if (error.message === 'INSUFFICIENT_CREDITS') {
      return {
        success: false,
        error: 'Insufficient credits',
        needsCredits: true,
        redirectTo: '/dashboard/wallet',
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to unlock lead',
    }
  }
}

/**
 * Get comprehensive lead analytics for realtor
 */
export async function getLeadAnalyticsAction(period: '7d' | '30d' | '90d' | 'all' = '30d') {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Calculate date range
    const now = new Date()
    let startDate: Date | undefined
    if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (period === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    }

    const dateFilter = startDate ? { gte: startDate } : undefined

    // Fetch all analytics data in parallel
    const [
      totalUnlocked,
      unlockedInPeriod,
      unlockedLeads,
      totalSpent,
      allLeads,
    ] = await Promise.all([
      // Total unlocked all time
      prisma.unlockedLead.count({
        where: { userId: session.user.id },
      }),
      // Unlocked in period
      prisma.unlockedLead.count({
        where: {
          userId: session.user.id,
          createdAt: dateFilter,
        },
      }),
      // Get unlocked leads with details for breakdowns
      prisma.unlockedLead.findMany({
        where: {
          userId: session.user.id,
          createdAt: dateFilter,
        },
        include: {
          lead: {
            select: {
              id: true,
              city: true,
              buyerType: true,
              languagePreference: true,
              timeline: true,
              price: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Total spent on leads
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: 'lead_purchase',
          createdAt: dateFilter,
        },
        _sum: { amount: true },
      }),
      // Available leads for reference
      prisma.lead.count({
        where: { status: 'locked' },
      }),
    ])

    // Calculate distributions
    const cityDistribution: Record<string, number> = {}
    const buyerTypeDistribution: Record<string, number> = {}
    const languageDistribution: Record<string, number> = {}
    const timelineDistribution: Record<string, number> = {}

    unlockedLeads.forEach(ul => {
      const lead = ul.lead
      // City
      const city = lead.city || 'Unknown'
      cityDistribution[city] = (cityDistribution[city] || 0) + 1
      // Buyer type
      const buyerType = lead.buyerType || 'Unknown'
      buyerTypeDistribution[buyerType] = (buyerTypeDistribution[buyerType] || 0) + 1
      // Language
      const language = lead.languagePreference || 'Unknown'
      languageDistribution[language] = (languageDistribution[language] || 0) + 1
      // Timeline
      const timeline = lead.timeline || 'Unknown'
      timelineDistribution[timeline] = (timelineDistribution[timeline] || 0) + 1
    })

    // Calculate unlock trend (daily counts for charts)
    const unlocksByDate: Record<string, number> = {}
    unlockedLeads.forEach(ul => {
      const dateKey = new Date(ul.createdAt).toISOString().split('T')[0]
      unlocksByDate[dateKey] = (unlocksByDate[dateKey] || 0) + 1
    })

    // Fill in missing dates with zeros
    const trendData: { date: string; count: number }[] = []
    if (startDate) {
      const current = new Date(startDate)
      while (current <= now) {
        const dateKey = current.toISOString().split('T')[0]
        trendData.push({ date: dateKey, count: unlocksByDate[dateKey] || 0 })
        current.setDate(current.getDate() + 1)
      }
    }

    // Calculate average cost per lead
    const totalSpentAmount = Math.abs(totalSpent._sum.amount || 0)
    const avgCostPerLead = unlockedInPeriod > 0 ? totalSpentAmount / unlockedInPeriod : 0

    return {
      success: true,
      analytics: {
        summary: {
          totalUnlockedAllTime: totalUnlocked,
          unlockedInPeriod,
          availableLeads: allLeads,
          totalSpent: totalSpentAmount,
          avgCostPerLead,
        },
        distributions: {
          byCity: Object.entries(cityDistribution)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
          byBuyerType: Object.entries(buyerTypeDistribution)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
          byLanguage: Object.entries(languageDistribution)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
          byTimeline: Object.entries(timelineDistribution)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        },
        trend: trendData,
        recentLeads: unlockedLeads.slice(0, 10).map(ul => ({
          id: ul.lead.id,
          city: ul.lead.city,
          buyerType: ul.lead.buyerType,
          unlockedAt: ul.createdAt,
        })),
      },
    }
  } catch (error) {
    console.error('Get lead analytics error:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
