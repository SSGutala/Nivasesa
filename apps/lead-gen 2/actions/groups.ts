'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGroupRequestsForRealtor() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    const profile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return []
    }

    const requests = await prisma.groupRealtorRequest.findMany({
      where: {
        realtorId: profile.id,
        status: 'pending',
      },
      include: {
        group: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return requests
  } catch (error) {
    console.error('Error fetching group requests:', error)
    return []
  }
}

export async function respondToGroupRequest(requestId: string, status: 'accepted' | 'rejected') {
  const session = await auth()
  if (!session?.user?.email) {
    return { success: false, message: 'Not authenticated' }
  }

  try {
    const request = await prisma.groupRealtorRequest.findUnique({
      where: { id: requestId },
      include: {
        realtor: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!request) {
      return { success: false, message: 'Request not found' }
    }

    if (request.realtor.user.email !== session.user.email) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.groupRealtorRequest.update({
      where: { id: requestId },
      data: { status },
    })

    if (status === 'accepted') {
      // Assign realtor to group
      await prisma.group.update({
        where: { id: request.groupId },
        data: { assignedRealtorId: request.realtorId },
      })
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error responding to group request:', error)
    return { success: false, message: 'Failed to respond to request' }
  }
}
