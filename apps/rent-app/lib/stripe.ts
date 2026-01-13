import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - payments will fail')
}

// Use a placeholder key during build time if not set
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_build_only'

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Lead pricing
export const LEAD_PRICE_CENTS = 3000 // $30 per lead

// Wallet top-up amounts
export const TOPUP_AMOUNTS = [
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
  { amount: 200, label: '$200' },
  { amount: 500, label: '$500' },
]

/**
 * Create a Stripe Checkout session for wallet top-up
 */
export async function createCheckoutSession({
  userId,
  email,
  amount,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  amount: number // in dollars
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Nivasesa Wallet Top-up',
            description: `Add $${amount} to your wallet`,
          },
          unit_amount: amount * 100, // cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      type: 'wallet_topup',
      amount: amount.toString(),
    },
  })

  return session
}

/**
 * Create a Stripe Checkout session for direct lead purchase
 */
export async function createLeadPurchaseSession({
  userId,
  email,
  leadId,
  leadPrice,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  leadId: string
  leadPrice: number // in dollars
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Lead Unlock',
            description: 'Unlock contact details for this lead',
          },
          unit_amount: leadPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      leadId,
      type: 'lead_purchase',
      amount: leadPrice.toString(),
    },
  })

  return session
}

/**
 * Process a refund for a transaction
 */
export async function createRefund({
  paymentIntentId,
  amount,
  reason,
}: {
  paymentIntentId: string
  amount?: number // partial refund in cents, omit for full
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
}): Promise<Stripe.Refund> {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  })

  return refund
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId)
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// =============================================================================
// ESCROW PAYMENT FUNCTIONS
// =============================================================================

/**
 * Platform fee configuration (percentage)
 */
export const PLATFORM_FEE_PERCENTAGE = 0.10 // 10% platform fee

/**
 * Calculate platform fee and host amount
 */
export function calculateEscrowAmounts(totalAmount: number): {
  totalAmount: number
  platformFeeAmount: number
  hostAmount: number
} {
  const platformFeeAmount = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE)
  const hostAmount = totalAmount - platformFeeAmount

  return {
    totalAmount,
    platformFeeAmount,
    hostAmount,
  }
}

/**
 * Create a PaymentIntent with manual capture for escrow
 * This authorizes the payment but doesn't capture it until move-in confirmation
 */
export async function createEscrowPaymentIntent({
  amount,
  platformFeeAmount,
  renterId,
  hostId,
  bookingId,
  description,
}: {
  amount: number // Total amount in cents
  platformFeeAmount: number // Platform fee in cents
  renterId: string
  hostId: string
  bookingId: string
  description?: string
}): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    capture_method: 'manual', // This creates an authorization hold
    description: description || `Escrow for booking ${bookingId}`,
    metadata: {
      renterId,
      hostId,
      bookingId,
      platformFeeAmount: platformFeeAmount.toString(),
      type: 'escrow_hold',
    },
  })

  return paymentIntent
}

/**
 * Capture an authorized escrow payment (release funds)
 * This happens when host confirms move-in
 */
export async function captureEscrowPayment({
  paymentIntentId,
  platformFeeAmount,
}: {
  paymentIntentId: string
  platformFeeAmount: number // Platform fee to deduct in cents
}): Promise<Stripe.PaymentIntent> {
  // Capture the full amount - we'll handle the platform fee separately via transfers or payouts
  const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId, {
    application_fee_amount: platformFeeAmount,
  })

  return paymentIntent
}

/**
 * Cancel an authorized escrow payment (refund the hold)
 * This happens if booking is cancelled before move-in
 */
export async function cancelEscrowPayment(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)

  return paymentIntent
}

/**
 * Refund a captured escrow payment
 * This happens if there's a dispute after move-in
 */
export async function refundEscrowPayment({
  paymentIntentId,
  amount,
  reason,
}: {
  paymentIntentId: string
  amount?: number // Partial refund in cents, omit for full refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
}): Promise<Stripe.Refund> {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  })

  return refund
}

/**
 * Get the status of a PaymentIntent
 */
export async function getPaymentIntentStatus(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}
