import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - payments will fail')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
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
