/**
 * Notification Helper Utilities
 *
 * This module provides helper functions to create notifications and send emails
 * for various events in the system (bookings, messages, reviews, etc.)
 */

import { createNotificationAction } from '@/actions/notifications'
import {
  sendBookingConfirmationEmail,
  sendNewMessageEmail,
  sendReviewReceivedEmail,
} from './email'
import prisma from './prisma'
import { getSafeUserInfo } from '@niv/auth-db'

/**
 * Notify user about a new booking
 */
export async function notifyBookingConfirmed(
  bookingId: string,
  guestId: string,
  hostId: string
): Promise<void> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    })

    if (!booking) return

    const [guest, host] = await Promise.all([
      getSafeUserInfo(guestId),
      getSafeUserInfo(hostId),
    ])

    if (!guest || !host) return

    // Check notification preferences
    const guestPrefs = await prisma.notificationPreference.findUnique({
      where: { userId: guestId },
    })

    // Create in-app notification for guest
    await createNotificationAction(
      guestId,
      'booking',
      'Booking Confirmed!',
      `Your booking at ${booking.listing.title} has been confirmed.`,
      `/dashboard/bookings/${bookingId}`
    )

    // Send email if enabled (default: true)
    if (!guestPrefs || guestPrefs.emailBookings) {
      await sendBookingConfirmationEmail({
        id: booking.id,
        guestName: guest.name || 'Guest',
        guestEmail: guest.email,
        hostName: host.name || 'Host',
        hostEmail: host.email,
        listingTitle: booking.listing.title,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: Math.round(booking.totalPrice * 100), // Convert to cents
        status: booking.status,
      })
    }

    // Notify host about new booking
    await createNotificationAction(
      hostId,
      'booking',
      'New Booking Received',
      `${guest.name || 'A guest'} has booked your listing "${booking.listing.title}".`,
      `/dashboard/bookings/${bookingId}`
    )
  } catch (error) {
    console.error('Error notifying booking confirmation:', error)
  }
}

/**
 * Notify user about a booking status change
 */
export async function notifyBookingStatusChange(
  bookingId: string,
  userId: string,
  newStatus: string,
  message?: string
): Promise<void> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    })

    if (!booking) return

    const statusMessages: Record<string, { title: string; body: string }> = {
      CONFIRMED: {
        title: 'Booking Confirmed',
        body: message || `Your booking at ${booking.listing.title} has been confirmed.`,
      },
      DECLINED: {
        title: 'Booking Declined',
        body:
          message ||
          `Your booking request for ${booking.listing.title} has been declined.`,
      },
      CANCELLED: {
        title: 'Booking Cancelled',
        body: message || `Your booking at ${booking.listing.title} has been cancelled.`,
      },
      COMPLETED: {
        title: 'Booking Completed',
        body: message || `Your stay at ${booking.listing.title} is complete. Leave a review!`,
      },
    }

    const notification = statusMessages[newStatus]
    if (notification) {
      await createNotificationAction(
        userId,
        'booking',
        notification.title,
        notification.body,
        `/dashboard/bookings/${bookingId}`
      )
    }
  } catch (error) {
    console.error('Error notifying booking status change:', error)
  }
}

/**
 * Notify user about a new message (with rate limiting)
 */
export async function notifyNewMessage(
  conversationId: string,
  senderId: string,
  recipientId: string,
  messageContent: string
): Promise<void> {
  try {
    const [sender, recipient] = await Promise.all([
      getSafeUserInfo(senderId),
      getSafeUserInfo(recipientId),
    ])

    if (!sender || !recipient) return

    // Check if we've already sent a notification for this conversation recently
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId: recipientId,
        type: 'message',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const messagePreview =
      messageContent.length > 100 ? messageContent.substring(0, 100) + '...' : messageContent

    // Create in-app notification
    await createNotificationAction(
      recipientId,
      'message',
      `New message from ${sender.name || 'a user'}`,
      messagePreview,
      `/messages?conversation=${conversationId}`
    )

    // Check recipient's notification preferences
    const recipientPrefs = await prisma.notificationPreference.findUnique({
      where: { userId: recipientId },
    })

    // Send email if enabled and no recent notification was sent
    if (!recentNotification && (!recipientPrefs || recipientPrefs.emailMessages)) {
      await sendNewMessageEmail({
        senderName: sender.name || 'A user',
        recipientEmail: recipient.email,
        messagePreview,
        conversationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/messages?conversation=${conversationId}`,
      })
    }
  } catch (error) {
    console.error('Error notifying new message:', error)
  }
}

/**
 * Notify user about a new review
 */
export async function notifyNewReview(
  reviewId: string,
  reviewerId: string,
  revieweeId: string
): Promise<void> {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) return

    const [reviewer, reviewee] = await Promise.all([
      getSafeUserInfo(reviewerId),
      getSafeUserInfo(revieweeId),
    ])

    if (!reviewer || !reviewee) return

    // Create in-app notification
    await createNotificationAction(
      revieweeId,
      'review',
      'New Review Received',
      `${reviewer.name || 'A user'} left you a ${review.rating}-star review.`,
      `/dashboard/reviews/${reviewId}`
    )

    // Check reviewee's notification preferences
    const revieweePrefs = await prisma.notificationPreference.findUnique({
      where: { userId: revieweeId },
    })

    // Send email if enabled
    if (!revieweePrefs || revieweePrefs.emailReviews) {
      await sendReviewReceivedEmail({
        reviewerName: reviewer.name || 'A user',
        revieweeEmail: reviewee.email,
        rating: review.rating,
        comment: review.comment || undefined,
        reviewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/reviews/${reviewId}`,
      })
    }
  } catch (error) {
    console.error('Error notifying new review:', error)
  }
}

/**
 * Notify user when a waitlisted listing becomes available
 */
export async function notifyWaitlistAvailable(
  listingId: string,
  userIds: string[]
): Promise<void> {
  try {
    const listing = await prisma.roomListing.findUnique({
      where: { id: listingId },
    })

    if (!listing) return

    for (const userId of userIds) {
      await createNotificationAction(
        userId,
        'waitlist',
        'Listing Now Available!',
        `A listing you're interested in (${listing.title}) is now available.`,
        `/listing/${listingId}`
      )
    }
  } catch (error) {
    console.error('Error notifying waitlist:', error)
  }
}

/**
 * Notify user about a connection request status change
 */
export async function notifyConnectionRequest(
  requestId: string,
  senderId: string,
  listingOwnerId: string,
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
): Promise<void> {
  try {
    const request = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
      include: { listing: true },
    })

    if (!request) return

    if (status === 'PENDING') {
      // Notify listing owner of new request
      const sender = await getSafeUserInfo(senderId)
      await createNotificationAction(
        listingOwnerId,
        'connection',
        'New Connection Request',
        `${sender?.name || 'A user'} wants to connect about your listing "${request.listing.title}".`,
        `/dashboard/connections/${requestId}`
      )
    } else if (status === 'ACCEPTED' || status === 'DECLINED') {
      // Notify requester of status change
      await createNotificationAction(
        senderId,
        'connection',
        status === 'ACCEPTED' ? 'Request Accepted!' : 'Request Declined',
        `Your connection request for "${request.listing.title}" has been ${status.toLowerCase()}.`,
        status === 'ACCEPTED' ? `/messages` : `/listing/${request.listingId}`
      )
    }
  } catch (error) {
    console.error('Error notifying connection request:', error)
  }
}

/**
 * Send system notification to a user
 */
export async function notifySystem(
  userId: string,
  title: string,
  body: string,
  link?: string
): Promise<void> {
  try {
    await createNotificationAction(userId, 'system', title, body, link)
  } catch (error) {
    console.error('Error sending system notification:', error)
  }
}
