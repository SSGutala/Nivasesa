'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe, SUBSCRIPTION_TIERS, type SubscriptionTier } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

/**
 * Get current subscription status for logged-in agent
 */
export async function getSubscriptionStatusAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile) {
      return { success: false, error: 'Realtor profile not found' }
    }

    const subscription = realtorProfile.subscription || {
      tier: 'free',
      status: 'active',
      monthlyLeadCredits: 0,
    }

    return {
      success: true,
      subscription: {
        ...subscription,
        tierInfo: SUBSCRIPTION_TIERS[subscription.tier as SubscriptionTier],
        creditBalance: realtorProfile.creditBalance,
        freeUnlocksRemaining: realtorProfile.freeUnlocksRemaining,
      },
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return { success: false, error: 'Failed to fetch subscription' }
  }
}

/**
 * Create a new subscription checkout session
 */
export async function createSubscriptionAction(tier: SubscriptionTier, returnUrl?: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated', url: null }
  }

  if (tier === 'free') {
    return { success: false, error: 'Cannot create subscription for free tier', url: null }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile) {
      return { success: false, error: 'Realtor profile not found', url: null }
    }

    const tierConfig = SUBSCRIPTION_TIERS[tier]
    if (!tierConfig.priceId) {
      return { success: false, error: 'Invalid subscription tier', url: null }
    }

    // Check if agent already has an active subscription
    if (realtorProfile.subscription && realtorProfile.subscription.status === 'active') {
      return {
        success: false,
        error: 'You already have an active subscription. Please cancel or upgrade instead.',
        url: null,
      }
    }

    // Get or create Stripe customer
    let customerId = realtorProfile.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId: session.user.id,
          realtorProfileId: realtorProfile.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?subscription=success`,
      cancel_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: {
        userId: session.user.id,
        realtorProfileId: realtorProfile.id,
        tier,
      },
    })

    return { success: true, url: checkoutSession.url }
  } catch (error) {
    console.error('Error creating subscription:', error)
    return { success: false, error: 'Failed to create subscription', url: null }
  }
}

/**
 * Upgrade or downgrade subscription to a new tier
 */
export async function upgradeSubscriptionAction(newTier: SubscriptionTier) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  if (newTier === 'free') {
    // Downgrading to free is the same as canceling
    return await cancelSubscriptionAction()
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile || !realtorProfile.subscription) {
      return { success: false, error: 'No active subscription found' }
    }

    const { subscription } = realtorProfile
    if (!subscription.stripeSubscriptionId) {
      return { success: false, error: 'Subscription not found in Stripe' }
    }

    const newTierConfig = SUBSCRIPTION_TIERS[newTier]
    if (!newTierConfig.priceId) {
      return { success: false, error: 'Invalid subscription tier' }
    }

    // Update the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newTierConfig.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    })

    // Update in database
    await prisma.agentSubscription.update({
      where: { id: subscription.id },
      data: {
        tier: newTier,
        monthlyLeadCredits: newTierConfig.monthlyCredits,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/wallet')
    return { success: true, message: `Successfully upgraded to ${newTierConfig.name}` }
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return { success: false, error: 'Failed to upgrade subscription' }
  }
}

/**
 * Cancel subscription at end of billing period
 */
export async function cancelSubscriptionAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile || !realtorProfile.subscription) {
      return { success: false, error: 'No subscription to cancel' }
    }

    const { subscription } = realtorProfile
    if (!subscription.stripeSubscriptionId) {
      return { success: false, error: 'Subscription not found in Stripe' }
    }

    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    // Update in database
    await prisma.agentSubscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/wallet')
    return {
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscriptionAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile || !realtorProfile.subscription) {
      return { success: false, error: 'No subscription found' }
    }

    const { subscription } = realtorProfile
    if (!subscription.stripeSubscriptionId) {
      return { success: false, error: 'Subscription not found in Stripe' }
    }

    // Remove the cancellation in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })

    // Update in database
    await prisma.agentSubscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/wallet')
    return { success: true, message: 'Subscription reactivated successfully' }
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return { success: false, error: 'Failed to reactivate subscription' }
  }
}

/**
 * Get subscription billing portal URL
 */
export async function getBillingPortalAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated', url: null }
  }

  try {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!realtorProfile || !realtorProfile.subscription?.stripeCustomerId) {
      return { success: false, error: 'No Stripe customer found', url: null }
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: realtorProfile.subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet`,
    })

    return { success: true, url: portalSession.url }
  } catch (error) {
    console.error('Error creating billing portal:', error)
    return { success: false, error: 'Failed to access billing portal', url: null }
  }
}
