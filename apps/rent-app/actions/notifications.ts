'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSafeUserInfo } from '@niv/auth-db'

export interface NotificationWithDetails {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  read: boolean
  createdAt: Date
}

export interface NotificationPreferences {
  emailBookings: boolean
  emailMessages: boolean
  emailReviews: boolean
  emailMarketing: boolean
  inAppBookings: boolean
  inAppMessages: boolean
  inAppReviews: boolean
}

/**
 * Get user's notifications with pagination
 */
export async function getNotificationsAction(
  limit: number = 20,
  offset: number = 0
): Promise<{
  success: boolean
  notifications?: NotificationWithDetails[]
  totalCount?: number
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ])

    return { success: true, notifications, totalCount }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadNotificationCountAction(): Promise<{
  success: boolean
  count?: number
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    const count = await prisma.notification.count({
      where: { userId, read: false },
    })

    return { success: true, count }
  } catch (error) {
    console.error('Error getting unread notification count:', error)
    return { success: false, error: 'Failed to get unread count' }
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    })

    if (!notification) {
      return { success: false, error: 'Notification not found' }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: 'Failed to mark notification as read' }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsReadAction(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error: 'Failed to mark all notifications as read' }
  }
}

/**
 * Create a notification for a user (internal use)
 */
export async function createNotificationAction(
  userId: string,
  type: 'booking' | 'message' | 'review' | 'system' | 'waitlist' | 'connection',
  title: string,
  body: string,
  link?: string
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    // Verify user exists
    const user = await getSafeUserInfo(userId)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check user's notification preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    // Check if user has disabled this type of in-app notification
    if (preferences) {
      const prefKey = `inApp${type.charAt(0).toUpperCase() + type.slice(1)}s` as keyof NotificationPreferences
      if (preferences[prefKey] === false) {
        // User has disabled this notification type
        return { success: true, notificationId: undefined }
      }
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, notificationId: notification.id }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: 'Failed to create notification' }
  }
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferencesAction(): Promise<{
  success: boolean
  preferences?: NotificationPreferences
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    })

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: { userId },
      })
    }

    return {
      success: true,
      preferences: {
        emailBookings: preferences.emailBookings,
        emailMessages: preferences.emailMessages,
        emailReviews: preferences.emailReviews,
        emailMarketing: preferences.emailMarketing,
        inAppBookings: preferences.inAppBookings,
        inAppMessages: preferences.inAppMessages,
        inAppReviews: preferences.inAppReviews,
      },
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error)
    return { success: false, error: 'Failed to get notification preferences' }
  }
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferencesAction(
  preferences: Partial<NotificationPreferences>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    await prisma.notificationPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return { success: false, error: 'Failed to update notification preferences' }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    })

    if (!notification) {
      return { success: false, error: 'Notification not found' }
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: 'Failed to delete notification' }
  }
}

/**
 * Delete all read notifications
 */
export async function deleteReadNotificationsAction(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    await prisma.notification.deleteMany({
      where: { userId, read: true },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting read notifications:', error)
    return { success: false, error: 'Failed to delete read notifications' }
  }
}
