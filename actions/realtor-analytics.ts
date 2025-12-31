'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Get comprehensive analytics for realtor dashboard
 */
export async function getRealtorAnalyticsAction(period: '7d' | '30d' | '90d' | 'all' = '30d') {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        realtorProfile: true,
      },
    })

    if (!user || user.role !== 'REALTOR' || !user.realtorProfile) {
      return { success: false, error: 'Realtor profile required' }
    }

    const profileId = user.realtorProfile.id

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

    // Fetch analytics in parallel
    const [
      // Referrals
      totalReferrals,
      referralsInPeriod,
      referralsByStatus,
      // Leads
      leadsAssigned,
      unlockedLeads,
      // Groups
      groupsAssigned,
      groupRequestsReceived,
      // Transactions
      earnings,
    ] = await Promise.all([
      // Total referrals all time
      prisma.referral.count({
        where: { realtorId: profileId },
      }),
      // Referrals in period
      prisma.referral.count({
        where: {
          realtorId: profileId,
          createdAt: dateFilter,
        },
      }),
      // Referrals by status
      prisma.referral.groupBy({
        by: ['status'],
        where: {
          realtorId: profileId,
          createdAt: dateFilter,
        },
        _count: true,
      }),
      // Leads assigned
      prisma.lead.count({
        where: {
          agentId: profileId,
          createdAt: dateFilter,
        },
      }),
      // Unlocked leads (purchased)
      prisma.unlockedLead.count({
        where: {
          userId: session.user.id,
          createdAt: dateFilter,
        },
      }),
      // Groups assigned
      prisma.group.count({
        where: {
          assignedRealtorId: profileId,
          createdAt: dateFilter,
        },
      }),
      // Group requests received
      prisma.groupRealtorRequest.count({
        where: {
          realtorId: profileId,
          createdAt: dateFilter,
        },
      }),
      // Earnings from leads (for future - placeholder)
      prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          type: 'refund', // Refunds show earnings going back
          createdAt: dateFilter,
        },
        _sum: { amount: true },
      }),
    ])

    // Get recent referrals with buyer info
    const recentReferrals = await prisma.referral.findMany({
      where: {
        realtorId: profileId,
        createdAt: dateFilter,
      },
      include: {
        buyerRequest: {
          select: {
            name: true,
            locations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get lead distribution by city
    const leads = await prisma.lead.findMany({
      where: {
        agentId: profileId,
        createdAt: dateFilter,
      },
      select: { city: true },
    })

    const leadsByCity: Record<string, number> = {}
    leads.forEach(lead => {
      const city = lead.city || 'Unknown'
      leadsByCity[city] = (leadsByCity[city] || 0) + 1
    })

    // Calculate referral status distribution
    const statusDistribution = referralsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, {} as Record<string, number>)

    // Calculate conversion rate
    const acceptedCount = statusDistribution['ACCEPTED'] || 0
    const conversionRate = totalReferrals > 0 ? (acceptedCount / totalReferrals) * 100 : 0

    return {
      success: true,
      analytics: {
        summary: {
          totalReferrals,
          referralsInPeriod,
          leadsAssigned,
          unlockedLeads,
          groupsAssigned,
          groupRequestsReceived,
          conversionRate: conversionRate.toFixed(1),
        },
        referralStatus: {
          sent: statusDistribution['SENT'] || 0,
          viewed: statusDistribution['VIEWED'] || 0,
          accepted: statusDistribution['ACCEPTED'] || 0,
          declined: statusDistribution['DECLINED'] || 0,
        },
        leadsByCity: Object.entries(leadsByCity)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        recentReferrals: recentReferrals.map(r => ({
          id: r.id,
          buyerName: r.buyerRequest.name,
          locations: r.buyerRequest.locations,
          status: r.status,
          createdAt: r.createdAt,
        })),
        profile: {
          cities: user.realtorProfile.cities,
          languages: user.realtorProfile.languages,
          isVerified: user.realtorProfile.isVerified,
        },
      },
    }
  } catch (error) {
    console.error('Get realtor analytics error:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
