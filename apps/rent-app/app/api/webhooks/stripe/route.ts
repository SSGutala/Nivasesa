import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = verifyWebhookSignature(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') {
          break
        }

        const { userId, type, amount, leadId } = session.metadata || {}

        if (!userId || !type || !amount) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Check if already processed
        const existingTransaction = await prisma.transaction.findFirst({
          where: { stripeSessionId: session.id },
        })

        if (existingTransaction) {
          console.log('Transaction already processed:', session.id)
          break
        }

        const amountNum = parseFloat(amount)

        if (type === 'wallet_topup') {
          // Update user balance and create transaction
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: { balance: { increment: amountNum } },
            }),
            prisma.transaction.create({
              data: {
                userId,
                amount: amountNum,
                type: 'deposit',
                stripeSessionId: session.id,
                status: 'completed',
              },
            }),
          ])
          console.log('Wallet topup processed:', userId, amountNum)
        } else if (type === 'lead_purchase' && leadId) {
          // Create transaction and unlock lead
          await prisma.$transaction([
            prisma.transaction.create({
              data: {
                userId,
                amount: -amountNum,
                type: 'lead_purchase',
                stripeSessionId: session.id,
                status: 'completed',
              },
            }),
            prisma.unlockedLead.create({
              data: {
                userId,
                leadId,
              },
            }),
          ])
          console.log('Lead purchase processed:', userId, leadId)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
