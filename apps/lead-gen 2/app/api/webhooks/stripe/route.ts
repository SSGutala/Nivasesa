import { NextRequest, NextResponse } from 'next/server'
import { stripe, SUBSCRIPTION_TIERS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

/**
 * Stripe webhook handler for subscription events
 * Handles subscription lifecycle and credit provisioning
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { customer, metadata } = subscription
  const customerId = typeof customer === 'string' ? customer : customer.id

  if (!metadata.realtorProfileId) {
    console.error('No realtorProfileId in subscription metadata')
    return
  }

  const tier = (metadata.tier as keyof typeof SUBSCRIPTION_TIERS) || 'free'
  const tierConfig = SUBSCRIPTION_TIERS[tier]

  // Type assertion for Stripe subscription properties
  const sub = subscription as any

  // Create or update subscription in database
  await prisma.agentSubscription.upsert({
    where: { agentId: metadata.realtorProfileId },
    create: {
      agentId: metadata.realtorProfileId,
      tier,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      status: subscription.status as string,
      currentPeriodStart: sub.current_period_start
        ? new Date(sub.current_period_start * 1000)
        : null,
      currentPeriodEnd: sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null,
      monthlyLeadCredits: tierConfig.monthlyCredits,
    },
    update: {
      tier,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      status: subscription.status as string,
      currentPeriodStart: sub.current_period_start
        ? new Date(sub.current_period_start * 1000)
        : null,
      currentPeriodEnd: sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null,
      monthlyLeadCredits: tierConfig.monthlyCredits,
      cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    },
  })

  // Grant initial credits
  await grantMonthlyCredits(metadata.realtorProfileId, tier)

  console.log(`Subscription created for agent ${metadata.realtorProfileId}`)
}

/**
 * Handle subscription updates (tier changes, cancellations, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.agentSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!existingSubscription) {
    console.error('Subscription not found in database:', subscription.id)
    return
  }

  // Determine new tier from price
  let newTier: keyof typeof SUBSCRIPTION_TIERS = 'free'
  const priceId = subscription.items.data[0]?.price.id

  for (const [tier, config] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (config.priceId === priceId) {
      newTier = tier as keyof typeof SUBSCRIPTION_TIERS
      break
    }
  }

  const tierConfig = SUBSCRIPTION_TIERS[newTier]

  // Type assertion for Stripe subscription properties
  const sub = subscription as any

  // Update subscription
  await prisma.agentSubscription.update({
    where: { id: existingSubscription.id },
    data: {
      tier: newTier,
      status: subscription.status as string,
      currentPeriodStart: sub.current_period_start
        ? new Date(sub.current_period_start * 1000)
        : null,
      currentPeriodEnd: sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null,
      monthlyLeadCredits: tierConfig.monthlyCredits,
      cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    },
  })

  console.log(`Subscription updated for agent ${existingSubscription.agentId}`)
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.agentSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!existingSubscription) {
    console.error('Subscription not found in database:', subscription.id)
    return
  }

  // Update to free tier
  await prisma.agentSubscription.update({
    where: { id: existingSubscription.id },
    data: {
      tier: 'free',
      status: 'cancelled',
      monthlyLeadCredits: 0,
      cancelAtPeriodEnd: false,
    },
  })

  console.log(`Subscription cancelled for agent ${existingSubscription.agentId}`)
}

/**
 * Handle successful invoice payment
 * Grant monthly credits on each billing cycle
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscription = (invoice as any).subscription

  if (!subscription) {
    // This is not a subscription invoice (could be one-time payment)
    return
  }

  const subscriptionId = typeof subscription === 'string' ? subscription : subscription.id

  const agentSubscription = await prisma.agentSubscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!agentSubscription) {
    console.error('Subscription not found for invoice:', invoice.id)
    return
  }

  // Grant monthly credits
  await grantMonthlyCredits(agentSubscription.agentId, agentSubscription.tier)

  console.log(`Monthly credits granted for agent ${agentSubscription.agentId}`)
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = (invoice as any).subscription

  if (!subscription) {
    return
  }

  const subscriptionId = typeof subscription === 'string' ? subscription : subscription.id

  const agentSubscription = await prisma.agentSubscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (!agentSubscription) {
    console.error('Subscription not found for failed invoice:', invoice.id)
    return
  }

  // Update subscription status to past_due
  await prisma.agentSubscription.update({
    where: { id: agentSubscription.id },
    data: { status: 'past_due' },
  })

  console.log(`Payment failed for agent ${agentSubscription.agentId}`)
}

/**
 * Grant monthly lead credits to agent
 */
async function grantMonthlyCredits(agentId: string, tier: string) {
  const tierConfig = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]
  const creditsToGrant = tierConfig.monthlyCredits

  if (creditsToGrant === 0) {
    return // Free tier gets no monthly credits
  }

  // Add credits to agent's balance
  await prisma.$transaction([
    prisma.realtorProfile.update({
      where: { id: agentId },
      data: {
        creditBalance: { increment: creditsToGrant },
      },
    }),
    prisma.creditTransaction.create({
      data: {
        agentId,
        amount: creditsToGrant,
        type: 'purchase',
        description: `Monthly subscription credits - ${tierConfig.name} plan`,
      },
    }),
  ])
}
