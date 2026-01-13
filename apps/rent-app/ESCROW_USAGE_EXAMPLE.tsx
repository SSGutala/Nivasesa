/**
 * EXAMPLE USAGE: Escrow System Integration
 *
 * This file demonstrates how to integrate the escrow system into your booking flow.
 * DO NOT import this file - it's for reference only.
 */

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import EscrowNudge from '@/components/ui/EscrowNudge'
import {
  createEscrowHoldAction,
  releaseEscrowAction,
  getEscrowStatusAction,
} from '@/actions/escrow'

// =============================================================================
// EXAMPLE 1: Booking Detail Page with Escrow Nudge
// =============================================================================

export function BookingDetailPage({ bookingId, userRole }: { bookingId: string, userRole: 'renter' | 'host' }) {
  const router = useRouter()
  const [escrow, setEscrow] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Fetch escrow status on mount
  useEffect(() => {
    async function loadEscrow() {
      const result = await getEscrowStatusAction(bookingId)
      if ('escrow' in result) {
        setEscrow(result.escrow)
      }
    }
    loadEscrow()
  }, [bookingId])

  return (
    <div>
      {/* Show escrow nudge if escrow exists */}
      {escrow && (
        <EscrowNudge
          bookingId={bookingId}
          escrowStatus={escrow.status}
          userRole={userRole}
          amount={escrow.amount}
          platformFeeAmount={escrow.platformFeeAmount}
          hostAmount={escrow.hostAmount}
          onStatusChange={() => {
            // Refresh escrow status
            getEscrowStatusAction(bookingId).then((result) => {
              if ('escrow' in result) setEscrow(result.escrow)
            })
          }}
        />
      )}

      {/* Rest of booking details */}
      <div>
        <h1>Booking Details</h1>
        {/* ... */}
      </div>
    </div>
  )
}

// =============================================================================
// EXAMPLE 2: Create Escrow on Booking Confirmation
// =============================================================================

export function BookingConfirmationFlow({ booking }: { booking: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleConfirmBooking() {
    setLoading(true)

    // Calculate total amount (booking total + service fee)
    const totalAmount = Math.round((booking.totalPrice + booking.serviceFee) * 100) // Convert to cents

    // Create escrow hold
    const result = await createEscrowHoldAction(booking.id, totalAmount)

    if ('error' in result) {
      alert(`Error: ${result.error}`)
      setLoading(false)
      return
    }

    // Use the clientSecret to collect payment with Stripe Elements
    const { clientSecret, paymentIntentId } = result

    // Initialize Stripe Elements with clientSecret
    // (See Stripe docs for full implementation)
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    const elements = stripe.elements({ clientSecret })

    // ... Stripe Elements UI for payment method

    // After successful payment method confirmation:
    router.push(`/dashboard/bookings/${booking.id}`)
    setLoading(false)
  }

  return (
    <div>
      <h2>Confirm Booking</h2>
      <p>Total: ${(booking.totalPrice + booking.serviceFee).toFixed(2)}</p>
      <button onClick={handleConfirmBooking} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm and Pay'}
      </button>
    </div>
  )
}

// =============================================================================
// EXAMPLE 3: Host Dashboard - Pending Escrows
// =============================================================================

export function HostDashboard() {
  const [pendingEscrows, setPendingEscrows] = useState<any[]>([])

  useEffect(() => {
    async function loadEscrows() {
      const result = await getUserEscrowsAction()
      if ('asHost' in result) {
        // Filter for authorized (pending confirmation) escrows
        const pending = result.asHost.filter((e) => e.status === 'authorized')
        setPendingEscrows(pending)
      }
    }
    loadEscrows()
  }, [])

  return (
    <div>
      <h1>Pending Move-In Confirmations</h1>
      {pendingEscrows.length === 0 ? (
        <p>No pending confirmations</p>
      ) : (
        <ul>
          {pendingEscrows.map((escrow) => (
            <li key={escrow.id}>
              <a href={`/dashboard/bookings/${escrow.bookingId}`}>
                Booking {escrow.bookingId.slice(0, 8)}
              </a>
              <span>Amount: ${(escrow.hostAmount / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// =============================================================================
// EXAMPLE 4: Server Component with Escrow Status
// =============================================================================

export async function ServerBookingPage({ params }: { params: { id: string } }) {
  // Server-side data fetching
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      escrowPayment: true,
      listing: true,
    },
  })

  if (!booking) {
    return <div>Booking not found</div>
  }

  const session = await auth()
  const userRole = booking.guestId === session?.user?.id ? 'renter' : 'host'

  return (
    <div>
      {/* Show escrow nudge if escrow exists */}
      {booking.escrowPayment && (
        <EscrowNudge
          bookingId={booking.id}
          escrowStatus={booking.escrowPayment.status}
          userRole={userRole}
          amount={booking.escrowPayment.amount}
          platformFeeAmount={booking.escrowPayment.platformFeeAmount}
          hostAmount={booking.escrowPayment.hostAmount}
        />
      )}

      <h1>{booking.listing.title}</h1>
      <p>Check-in: {booking.checkIn.toLocaleDateString()}</p>
      <p>Check-out: {booking.checkOut.toLocaleDateString()}</p>
      <p>Status: {booking.status}</p>
    </div>
  )
}

// =============================================================================
// EXAMPLE 5: Manual Escrow Operations (Admin/Testing)
// =============================================================================

export function AdminEscrowControls({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<any>(null)

  async function refreshStatus() {
    const result = await getEscrowStatusAction(bookingId)
    if ('escrow' in result) {
      setStatus(result)
    }
  }

  async function handleRelease() {
    if (!confirm('Release escrow to host?')) return
    await releaseEscrowAction(bookingId)
    await refreshStatus()
  }

  async function handleCancel() {
    const reason = prompt('Cancellation reason:')
    if (!reason) return
    await cancelEscrowAction(bookingId, reason)
    await refreshStatus()
  }

  async function handleRefund() {
    const reason = prompt('Refund reason:')
    if (!reason) return
    await refundEscrowAction(bookingId, undefined, reason)
    await refreshStatus()
  }

  return (
    <div>
      <h3>Escrow Controls</h3>
      <button onClick={refreshStatus}>Refresh Status</button>

      {status && (
        <div>
          <p>Status: {status.escrow.status}</p>
          <p>Stripe Status: {status.stripeStatus}</p>
          <p>Amount: ${(status.escrow.amount / 100).toFixed(2)}</p>
          <p>Platform Fee: ${(status.escrow.platformFeeAmount / 100).toFixed(2)}</p>
          <p>Host Amount: ${(status.escrow.hostAmount / 100).toFixed(2)}</p>

          {status.escrow.status === 'authorized' && (
            <>
              <button onClick={handleRelease}>Release to Host</button>
              <button onClick={handleCancel}>Cancel Escrow</button>
            </>
          )}

          {status.escrow.status === 'captured' && (
            <button onClick={handleRefund}>Issue Refund</button>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// EXAMPLE 6: Webhook Handler (for production)
// =============================================================================

/**
 * File: app/api/webhooks/stripe/route.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const payload = await req.text()

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const event = verifyWebhookSignature(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Payment was captured successfully
        const paymentIntent = event.data.object
        await prisma.escrowPayment.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: {
            status: 'captured',
            capturedAt: new Date(),
          },
        })
        break

      case 'payment_intent.canceled':
        // Payment was cancelled
        const cancelledIntent = event.data.object
        await prisma.escrowPayment.update({
          where: { stripePaymentIntentId: cancelledIntent.id },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
          },
        })
        break

      case 'charge.refunded':
        // Refund was issued
        const charge = event.data.object
        if (charge.payment_intent) {
          await prisma.escrowPayment.update({
            where: { stripePaymentIntentId: charge.payment_intent as string },
            data: {
              status: 'refunded',
              refundedAt: new Date(),
            },
          })
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
