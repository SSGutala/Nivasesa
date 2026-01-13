'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCurrentUserAction() {
  const session = await auth()
  return session?.user || null
}

export async function getUserBalanceAction(email: string) {
  // NOTE: This function needs refactoring to use RealtorProfile credit system
  // Temporarily returning stub data to fix build
  return null
  // try {
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //     select: {
  //       id: true,
  //       email: true,
  //       name: true,
  //       balance: true,
  //     },
  //   })
  //   return user
  // } catch (error) {
  //   console.error('Error fetching user balance:', error)
  //   return null
  // }
}

export async function addBalanceAction(userId: string, amount: number) {
  // NOTE: This function needs refactoring to use RealtorProfile credit system
  // Temporarily returning stub to fix build
  return { success: false }
  // try {
  //   await prisma.$transaction([
  //     prisma.user.update({
  //       where: { id: userId },
  //       data: { balance: { increment: amount } },
  //     }),
  //     prisma.transaction.create({
  //       data: {
  //         userId,
  //         amount,
  //         type: 'wallet_topup',
  //         status: 'completed',
  //       },
  //     }),
  //   ])
  //
  //   revalidatePath('/dashboard')
  //   return { success: true }
  // } catch (error) {
  //   console.error('Error adding balance:', error)
  //   return { success: false }
  // }
}

export async function getRealtorProfileByEmail(email: string) {
  // NOTE: This function needs refactoring to work with separated auth DB
  // Temporarily returning stub to fix build
  return null
  // try {
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //     select: { id: true },
  //   })
  //
  //   if (!user) return null
  //
  //   const profile = await prisma.realtorProfile.findUnique({
  //     where: { userId: user.id },
  //     include: {
  //       user: true,
  //     },
  //   })
  //   return profile
  // } catch (error) {
  //   console.error('Error fetching realtor profile:', error)
  //   return null
  // }
}

export async function updateRealtorProfile(userId: string, data: {
  fullName?: string
  bio?: string
  description?: string
  citiesZipcodesServed?: string
}) {
  // NOTE: This function needs refactoring to work with separated auth DB
  // Temporarily returning stub to fix build
  return { success: false }
  // try {
  //   const session = await auth()
  //   if (!session?.user?.id) {
  //     return { success: false }
  //   }
  //
  //   await prisma.realtorProfile.update({
  //     where: { userId: session.user.id },
  //     data: {
  //       bio: data.bio,
  //       // description field doesn't exist in schema - remove it
  //       // citiesZipcodesServed field doesn't exist - cities is a string
  //       cities: data.citiesZipcodesServed || '',
  //     },
  //   })
  //
  //   if (data.fullName) {
  //     await prisma.user.update({
  //       where: { id: session.user.id },
  //       data: { name: data.fullName },
  //     })
  //   }
  //
  //   revalidatePath('/dashboard')
  //   return { success: true }
  // } catch (error) {
  //   console.error('Error updating profile:', error)
  //   return { success: false }
  // }
}

export async function getInboundLeadsAction(agentId: string) {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        agentId: agentId,
      },
      include: {
        unlockedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return leads
  } catch (error) {
    console.error('Error fetching inbound leads:', error)
    return []
  }
}

export async function getUnlockedLeadsAction(userId?: string) {
  if (!userId) return []

  try {
    const unlocks = await prisma.unlockedLead.findMany({
      where: { userId },
      include: {
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return unlocks.map(u => u.lead)
  } catch (error) {
    console.error('Error fetching unlocked leads:', error)
    return []
  }
}

export async function unlockLeadsBulkAction(leadIds: string[], userId: string, totalCost: number) {
  // NOTE: This function needs refactoring to use RealtorProfile credit system
  // Temporarily returning stub to fix build
  return { success: false, message: 'Function needs refactoring for credit system' }
  // try {
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //     select: { balance: true },
  //   })
  //
  //   if (!user || user.balance < totalCost) {
  //     return { success: false, message: 'Insufficient balance' }
  //   }
  //
  //   await prisma.$transaction([
  //     ...leadIds.map(leadId =>
  //       prisma.unlockedLead.create({
  //         data: { leadId, userId },
  //       })
  //     ),
  //     prisma.user.update({
  //       where: { id: userId },
  //       data: { balance: { decrement: totalCost } },
  //     }),
  //     prisma.transaction.create({
  //       data: {
  //         userId,
  //         amount: -totalCost,
  //         type: 'lead_purchase',
  //         status: 'completed',
  //       },
  //     }),
  //   ])
  //
  //   revalidatePath('/dashboard')
  //   return { success: true }
  // } catch (error) {
  //   console.error('Error unlocking leads:', error)
  //   return { success: false, message: 'Failed to unlock leads' }
  // }
}

export async function getLeadCountAction(zipcode: string, radius: number) {
  try {
    // Simple implementation - in production, would use geospatial queries
    const leads = await prisma.lead.findMany({
      where: {
        zipcode: {
          startsWith: zipcode.substring(0, 3), // Simple radius approximation
        },
        status: 'active',
      },
      select: { id: true },
    })

    return {
      count: leads.length,
      leadIds: leads.map(l => l.id),
    }
  } catch (error) {
    console.error('Error counting leads:', error)
    return { error: 'Failed to search leads' }
  }
}
