'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =============================================================================
// BOOST PRICING
// =============================================================================

const BOOST_PRICING = {
  basic: {
    7: 999, // $9.99 for 7 days
    14: 1499, // $14.99 for 14 days
    30: 2499, // $24.99 for 30 days
  },
  premium: {
    7: 1999, // $19.99 for 7 days
    14: 2999, // $29.99 for 14 days
    30: 4999, // $49.99 for 30 days
  },
  featured: {
    7: 3999, // $39.99 for 7 days
    14: 5999, // $59.99 for 14 days
    30: 9999, // $99.99 for 30 days
  },
} as const;

type BoostTier = keyof typeof BOOST_PRICING;
type BoostDays = 7 | 14 | 30;

// =============================================================================
// BOOST ACTIONS
// =============================================================================

interface PurchaseBoostResult {
  success: boolean;
  message: string;
  boostId?: string;
}

/**
 * Purchase a profile boost for the authenticated user
 */
export async function purchaseProfileBoostAction(
  tier: BoostTier,
  days: BoostDays,
): Promise<PurchaseBoostResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in to purchase a boost' };
    }

    // Validate tier and days
    if (!BOOST_PRICING[tier] || !BOOST_PRICING[tier][days]) {
      return { success: false, message: 'Invalid boost tier or duration' };
    }

    const price = BOOST_PRICING[tier][days];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Create boost record
    const boost = await prisma.boost.create({
      data: {
        type: 'profile',
        targetId: session.user.id,
        tier,
        startDate,
        endDate,
        price,
        status: 'active',
      },
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/browse');

    return {
      success: true,
      message: `Profile boosted successfully for ${days} days!`,
      boostId: boost.id,
    };
  } catch (error) {
    console.error('Error purchasing profile boost:', error);
    return { success: false, message: 'Failed to purchase boost. Please try again.' };
  }
}

/**
 * Purchase a listing boost
 */
export async function purchaseListingBoostAction(
  listingId: string,
  tier: BoostTier,
  days: BoostDays,
): Promise<PurchaseBoostResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in to purchase a boost' };
    }

    // Verify listing ownership
    const listing = await prisma.roomListing.findUnique({
      where: { id: listingId },
      select: { ownerId: true },
    });

    if (!listing) {
      return { success: false, message: 'Listing not found' };
    }

    if (listing.ownerId !== session.user.id) {
      return { success: false, message: 'You can only boost your own listings' };
    }

    // Validate tier and days
    if (!BOOST_PRICING[tier] || !BOOST_PRICING[tier][days]) {
      return { success: false, message: 'Invalid boost tier or duration' };
    }

    const price = BOOST_PRICING[tier][days];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    // Create boost record
    const boost = await prisma.boost.create({
      data: {
        type: 'listing',
        targetId: listingId,
        tier,
        startDate,
        endDate,
        price,
        status: 'active',
      },
    });

    // Revalidate relevant pages
    revalidatePath(`/listing/${listingId}`);
    revalidatePath('/explore');
    revalidatePath('/browse');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Listing boosted successfully for ${days} days!`,
      boostId: boost.id,
    };
  } catch (error) {
    console.error('Error purchasing listing boost:', error);
    return { success: false, message: 'Failed to purchase boost. Please try again.' };
  }
}

/**
 * Get all active boosts for the authenticated user
 */
export async function getActiveBoostsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in', boosts: [] };
    }

    const now = new Date();

    // Get active profile boosts
    const profileBoosts = await prisma.boost.findMany({
      where: {
        type: 'profile',
        targetId: session.user.id,
        status: 'active',
        endDate: { gte: now },
      },
      orderBy: { endDate: 'desc' },
    });

    // Get active listing boosts
    const userListings = await prisma.roomListing.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    const listingIds = userListings.map((l) => l.id);

    const listingBoosts = await prisma.boost.findMany({
      where: {
        type: 'listing',
        targetId: { in: listingIds },
        status: 'active',
        endDate: { gte: now },
      },
      orderBy: { endDate: 'desc' },
    });

    // Update expired boosts
    await prisma.boost.updateMany({
      where: {
        OR: [
          { type: 'profile', targetId: session.user.id },
          { type: 'listing', targetId: { in: listingIds } },
        ],
        status: 'active',
        endDate: { lt: now },
      },
      data: { status: 'expired' },
    });

    return {
      success: true,
      message: 'Boosts retrieved successfully',
      boosts: {
        profile: profileBoosts,
        listing: listingBoosts,
      },
    };
  } catch (error) {
    console.error('Error getting active boosts:', error);
    return { success: false, message: 'Failed to get boosts', boosts: [] };
  }
}

/**
 * Check if a specific target is currently boosted
 */
export async function checkBoostStatusAction(
  type: 'profile' | 'listing',
  targetId: string,
): Promise<{
  success: boolean;
  isBoosted: boolean;
  tier?: string;
  endDate?: Date;
}> {
  try {
    const now = new Date();

    const activeBoost = await prisma.boost.findFirst({
      where: {
        type,
        targetId,
        status: 'active',
        endDate: { gte: now },
      },
      orderBy: { tier: 'desc' }, // Get highest tier if multiple
    });

    if (activeBoost) {
      return {
        success: true,
        isBoosted: true,
        tier: activeBoost.tier,
        endDate: activeBoost.endDate,
      };
    }

    return {
      success: true,
      isBoosted: false,
    };
  } catch (error) {
    console.error('Error checking boost status:', error);
    return {
      success: false,
      isBoosted: false,
    };
  }
}

/**
 * Cancel an active boost (admin only or early cancellation)
 */
export async function cancelBoostAction(boostId: string): Promise<PurchaseBoostResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in' };
    }

    const boost = await prisma.boost.findUnique({
      where: { id: boostId },
    });

    if (!boost) {
      return { success: false, message: 'Boost not found' };
    }

    // Verify ownership
    if (boost.type === 'profile' && boost.targetId !== session.user.id) {
      return { success: false, message: 'You can only cancel your own boosts' };
    }

    if (boost.type === 'listing') {
      const listing = await prisma.roomListing.findUnique({
        where: { id: boost.targetId },
        select: { ownerId: true },
      });

      if (!listing || listing.ownerId !== session.user.id) {
        return { success: false, message: 'You can only cancel boosts for your own listings' };
      }
    }

    // Cancel the boost
    await prisma.boost.update({
      where: { id: boostId },
      data: { status: 'cancelled' },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Boost cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling boost:', error);
    return { success: false, message: 'Failed to cancel boost' };
  }
}

/**
 * Get boost pricing for display
 */
export function getBoostPricingAction() {
  return {
    success: true,
    pricing: BOOST_PRICING,
  };
}
