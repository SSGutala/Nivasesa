'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createEscrowPaymentIntent,
  captureEscrowPayment,
  cancelEscrowPayment,
  refundEscrowPayment,
  getPaymentIntentStatus,
  calculateEscrowAmounts,
} from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

// =============================================================================
// ESCROW PAYMENT ACTIONS
// =============================================================================

/**
 * Create an escrow hold for a booking
 * This authorizes the payment but doesn't charge until move-in confirmation
 */
export async function createEscrowHoldAction(
  bookingId: string,
  amount: number // Total amount in cents
): Promise<
  | { success: true; paymentIntentId: string; clientSecret: string }
  | { error: string }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    })

    if (!booking) {
      return { error: 'Booking not found' }
    }

    // Verify user is the guest/renter
    if (booking.guestId !== session.user.id) {
      return { error: 'Unauthorized - you are not the renter for this booking' }
    }

    // Check if escrow already exists
    const existingEscrow = await prisma.escrowPayment.findUnique({
      where: { bookingId },
    })

    if (existingEscrow) {
      return { error: 'Escrow payment already exists for this booking' }
    }

    // Calculate amounts
    const { totalAmount, platformFeeAmount, hostAmount } =
      calculateEscrowAmounts(amount)

    // Create Stripe PaymentIntent with manual capture
    const paymentIntent = await createEscrowPaymentIntent({
      amount: totalAmount,
      platformFeeAmount,
      renterId: booking.guestId,
      hostId: booking.hostId,
      bookingId,
      description: `Escrow for ${booking.listing.title}`,
    })

    // Create escrow record in database
    await prisma.escrowPayment.create({
      data: {
        bookingId,
        renterId: booking.guestId,
        hostId: booking.hostId,
        amount: totalAmount,
        platformFeeAmount,
        hostAmount,
        stripePaymentIntentId: paymentIntent.id,
        status: 'authorized',
      },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'PENDING',
        paymentIntentId: paymentIntent.id,
      },
    })

    revalidatePath(`/dashboard/bookings/${bookingId}`)

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || '',
    }
  } catch (error) {
    console.error('Create escrow hold error:', error)
    return { error: 'Failed to create escrow hold' }
  }
}

/**
 * Release escrow payment (capture the authorized funds)
 * Called when host confirms move-in
 */
export async function releaseEscrowAction(
  bookingId: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get escrow payment
    const escrow = await prisma.escrowPayment.findUnique({
      where: { bookingId },
      include: { booking: true },
    })

    if (!escrow) {
      return { error: 'Escrow payment not found' }
    }

    // Verify user is the host
    if (escrow.hostId !== session.user.id) {
      return { error: 'Unauthorized - only the host can release escrow' }
    }

    // Verify escrow is in authorized status
    if (escrow.status !== 'authorized') {
      return { error: `Cannot release escrow with status: ${escrow.status}` }
    }

    // Capture the payment in Stripe
    await captureEscrowPayment({
      paymentIntentId: escrow.stripePaymentIntentId,
      platformFeeAmount: escrow.platformFeeAmount,
    })

    // Update escrow status
    await prisma.escrowPayment.update({
      where: { id: escrow.id },
      data: {
        status: 'captured',
        capturedAt: new Date(),
      },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
      },
    })

    revalidatePath(`/dashboard/bookings/${bookingId}`)
    revalidatePath('/dashboard/bookings')

    return { success: true }
  } catch (error) {
    console.error('Release escrow error:', error)
    return { error: 'Failed to release escrow payment' }
  }
}

/**
 * Cancel escrow payment (release the authorization hold)
 * Called when booking is cancelled before move-in
 */
export async function cancelEscrowAction(
  bookingId: string,
  reason?: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get escrow payment
    const escrow = await prisma.escrowPayment.findUnique({
      where: { bookingId },
      include: { booking: true },
    })

    if (!escrow) {
      return { error: 'Escrow payment not found' }
    }

    // Verify user is either the renter or host
    if (
      escrow.renterId !== session.user.id &&
      escrow.hostId !== session.user.id
    ) {
      return { error: 'Unauthorized - you are not part of this booking' }
    }

    // Verify escrow is in authorized status
    if (escrow.status !== 'authorized') {
      return { error: `Cannot cancel escrow with status: ${escrow.status}` }
    }

    // Cancel the payment intent in Stripe
    await cancelEscrowPayment(escrow.stripePaymentIntentId)

    // Update escrow status
    await prisma.escrowPayment.update({
      where: { id: escrow.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
    })

    revalidatePath(`/dashboard/bookings/${bookingId}`)
    revalidatePath('/dashboard/bookings')

    return { success: true }
  } catch (error) {
    console.error('Cancel escrow error:', error)
    return { error: 'Failed to cancel escrow payment' }
  }
}

/**
 * Request a refund for a captured escrow payment
 * Called when there's a dispute after move-in
 */
export async function refundEscrowAction(
  bookingId: string,
  amount?: number, // Partial refund in cents, omit for full refund
  reason?: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get escrow payment
    const escrow = await prisma.escrowPayment.findUnique({
      where: { bookingId },
      include: { booking: true },
    })

    if (!escrow) {
      return { error: 'Escrow payment not found' }
    }

    // Verify user is either the renter or host
    if (
      escrow.renterId !== session.user.id &&
      escrow.hostId !== session.user.id
    ) {
      return { error: 'Unauthorized - you are not part of this booking' }
    }

    // Verify escrow is in captured status
    if (escrow.status !== 'captured') {
      return {
        error: `Cannot refund escrow with status: ${escrow.status}. Only captured payments can be refunded.`,
      }
    }

    // Process refund in Stripe
    await refundEscrowPayment({
      paymentIntentId: escrow.stripePaymentIntentId,
      amount,
      reason: 'requested_by_customer',
    })

    // Update escrow status
    await prisma.escrowPayment.update({
      where: { id: escrow.id },
      data: {
        status: 'refunded',
        refundedAt: new Date(),
        refundReason: reason,
      },
    })

    revalidatePath(`/dashboard/bookings/${bookingId}`)
    revalidatePath('/dashboard/bookings')

    return { success: true }
  } catch (error) {
    console.error('Refund escrow error:', error)
    return { error: 'Failed to refund escrow payment' }
  }
}

/**
 * Get escrow payment status for a booking
 */
export async function getEscrowStatusAction(bookingId: string): Promise<
  | {
      escrow: {
        id: string
        amount: number
        platformFeeAmount: number
        hostAmount: number
        status: string
        authorizedAt: Date
        capturedAt: Date | null
        cancelledAt: Date | null
        refundedAt: Date | null
      }
      stripeStatus: string
    }
  | { error: string }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get escrow payment
    const escrow = await prisma.escrowPayment.findUnique({
      where: { bookingId },
      include: { booking: true },
    })

    if (!escrow) {
      return { error: 'Escrow payment not found' }
    }

    // Verify user is either the renter or host
    if (
      escrow.renterId !== session.user.id &&
      escrow.hostId !== session.user.id
    ) {
      return { error: 'Unauthorized - you are not part of this booking' }
    }

    // Get current Stripe status
    const paymentIntent = await getPaymentIntentStatus(
      escrow.stripePaymentIntentId
    )

    return {
      escrow: {
        id: escrow.id,
        amount: escrow.amount,
        platformFeeAmount: escrow.platformFeeAmount,
        hostAmount: escrow.hostAmount,
        status: escrow.status,
        authorizedAt: escrow.authorizedAt,
        capturedAt: escrow.capturedAt,
        cancelledAt: escrow.cancelledAt,
        refundedAt: escrow.refundedAt,
      },
      stripeStatus: paymentIntent.status,
    }
  } catch (error) {
    console.error('Get escrow status error:', error)
    return { error: 'Failed to get escrow status' }
  }
}

/**
 * Get all escrow payments for the current user (as renter or host)
 */
export async function getUserEscrowsAction(): Promise<
  | {
      asRenter: Array<{
        id: string
        bookingId: string
        amount: number
        status: string
        authorizedAt: Date
      }>
      asHost: Array<{
        id: string
        bookingId: string
        amount: number
        hostAmount: number
        status: string
        authorizedAt: Date
      }>
    }
  | { error: string }
> {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  try {
    const [asRenter, asHost] = await Promise.all([
      prisma.escrowPayment.findMany({
        where: { renterId: session.user.id },
        orderBy: { authorizedAt: 'desc' },
      }),
      prisma.escrowPayment.findMany({
        where: { hostId: session.user.id },
        orderBy: { authorizedAt: 'desc' },
      }),
    ])

    return {
      asRenter: asRenter.map((e) => ({
        id: e.id,
        bookingId: e.bookingId,
        amount: e.amount,
        status: e.status,
        authorizedAt: e.authorizedAt,
      })),
      asHost: asHost.map((e) => ({
        id: e.id,
        bookingId: e.bookingId,
        amount: e.amount,
        hostAmount: e.hostAmount,
        status: e.status,
        authorizedAt: e.authorizedAt,
      })),
    }
  } catch (error) {
    console.error('Get user escrows error:', error)
    return { error: 'Failed to get escrow payments' }
  }
}
