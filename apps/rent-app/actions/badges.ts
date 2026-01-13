'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =============================================================================
// BADGE DEFINITIONS
// =============================================================================

export const BADGE_DEFINITIONS = {
  early_adopter: {
    name: 'early_adopter',
    displayName: 'Early Adopter',
    description: 'Joined Nivasesa in the first 1,000 users',
    icon: 'Sparkles',
    category: 'special',
  },
  super_host: {
    name: 'super_host',
    displayName: 'Super Host',
    description: 'Maintained 5-star rating with 10+ bookings',
    icon: 'Star',
    category: 'achievement',
  },
  verified_agent: {
    name: 'verified_agent',
    displayName: 'Verified Agent',
    description: 'Licensed real estate agent with verified credentials',
    icon: 'ShieldCheck',
    category: 'special',
  },
  community_builder: {
    name: 'community_builder',
    displayName: 'Community Builder',
    description: 'Created or managed a successful housing group',
    icon: 'Users',
    category: 'achievement',
  },
  referral_champion: {
    name: 'referral_champion',
    displayName: 'Referral Champion',
    description: 'Referred 5+ friends to Nivasesa',
    icon: 'Share2',
    category: 'achievement',
  },
  top_rated: {
    name: 'top_rated',
    displayName: 'Top Rated',
    description: 'Received 20+ five-star reviews',
    icon: 'Award',
    category: 'achievement',
  },
  hundred_connections: {
    name: 'hundred_connections',
    displayName: '100 Connections',
    description: 'Made 100+ successful connections',
    icon: 'Network',
    category: 'milestone',
  },
  first_booking: {
    name: 'first_booking',
    displayName: 'First Booking',
    description: 'Completed your first booking',
    icon: 'Home',
    category: 'milestone',
  },
  first_listing: {
    name: 'first_listing',
    displayName: 'First Listing',
    description: 'Posted your first room listing',
    icon: 'Plus',
    category: 'milestone',
  },
  ambassador: {
    name: 'ambassador',
    displayName: 'Ambassador',
    description: 'Active community contributor',
    icon: 'MessageCircle',
    category: 'special',
  },
} as const;

// =============================================================================
// BADGE ACTIONS
// =============================================================================

interface BadgeResult {
  success: boolean;
  message: string;
  badges?: any[];
}

/**
 * Get all badges earned by a user
 */
export async function getUserBadgesAction(userId?: string): Promise<BadgeResult> {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return { success: false, message: 'User ID required', badges: [] };
    }

    const userBadges = await prisma.userBadge.findMany({
      where: { userId: targetUserId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    return {
      success: true,
      message: 'Badges retrieved successfully',
      badges: userBadges,
    };
  } catch (error) {
    console.error('Error getting user badges:', error);
    return { success: false, message: 'Failed to get badges', badges: [] };
  }
}

/**
 * Award a badge to a user (internal use only)
 * This should only be called from server-side code, not directly from client
 */
export async function awardBadgeAction(
  userId: string,
  badgeName: keyof typeof BADGE_DEFINITIONS,
): Promise<BadgeResult> {
  try {
    // Verify badge exists in definitions
    const badgeDef = BADGE_DEFINITIONS[badgeName];
    if (!badgeDef) {
      return { success: false, message: 'Invalid badge name' };
    }

    // Ensure badge exists in database (create if not)
    let badge = await prisma.badge.findUnique({
      where: { name: badgeName },
    });

    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeDef.name,
          displayName: badgeDef.displayName,
          description: badgeDef.description,
          icon: badgeDef.icon,
          category: badgeDef.category,
        },
      });
    }

    // Check if user already has this badge
    const existingUserBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (existingUserBadge) {
      return {
        success: false,
        message: 'User already has this badge',
      };
    }

    // Award the badge
    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
      include: {
        badge: true,
      },
    });

    // Revalidate user profile
    revalidatePath(`/profile/${userId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Badge "${badge.displayName}" awarded successfully!`,
      badges: [userBadge],
    };
  } catch (error) {
    console.error('Error awarding badge:', error);
    return { success: false, message: 'Failed to award badge' };
  }
}

/**
 * Check and award milestone badges based on user activity
 * This is called automatically when certain actions occur
 */
export async function checkAndAwardMilestoneBadges(userId: string): Promise<void> {
  try {
    // Check for first listing
    const listingCount = await prisma.roomListing.count({
      where: { ownerId: userId },
    });

    if (listingCount === 1) {
      await awardBadgeAction(userId, 'first_listing');
    }

    // Check for first booking
    const bookingCount = await prisma.booking.count({
      where: {
        OR: [{ guestId: userId }, { hostId: userId }],
        status: 'COMPLETED',
      },
    });

    if (bookingCount === 1) {
      await awardBadgeAction(userId, 'first_booking');
    }

    // Check for 100 connections
    const connectionCount = await prisma.connectionRequest.count({
      where: {
        userId,
        status: 'ACCEPTED',
      },
    });

    if (connectionCount >= 100) {
      await awardBadgeAction(userId, 'hundred_connections');
    }

    // Check for referral champion (5+ referrals)
    const referralCount = await prisma.referral.count({
      where: {
        referrerUserId: userId,
        rewardStatus: 'applied',
      },
    });

    if (referralCount >= 5) {
      await awardBadgeAction(userId, 'referral_champion');
    }

    // Note: Other badges like super_host, top_rated, verified_agent
    // would need review/rating data which isn't in current schema
  } catch (error) {
    console.error('Error checking milestone badges:', error);
    // Don't throw - this is background processing
  }
}

/**
 * Get all available badges (for display)
 */
export async function getAllBadgesAction() {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      message: 'All badges retrieved',
      badges,
    };
  } catch (error) {
    console.error('Error getting all badges:', error);
    return { success: false, message: 'Failed to get badges', badges: [] };
  }
}

/**
 * Initialize all badge definitions in the database
 * Should be run once during deployment
 */
export async function initializeBadgesAction() {
  try {
    const session = await auth();
    // Only admins should initialize badges (you might want to add role check)
    if (!session?.user?.id) {
      return { success: false, message: 'Authentication required' };
    }

    const created = [];

    for (const [key, badgeDef] of Object.entries(BADGE_DEFINITIONS)) {
      const existing = await prisma.badge.findUnique({
        where: { name: key },
      });

      if (!existing) {
        const badge = await prisma.badge.create({
          data: {
            name: badgeDef.name,
            displayName: badgeDef.displayName,
            description: badgeDef.description,
            icon: badgeDef.icon,
            category: badgeDef.category,
          },
        });
        created.push(badge);
      }
    }

    return {
      success: true,
      message: `Initialized ${created.length} badges`,
      badges: created,
    };
  } catch (error) {
    console.error('Error initializing badges:', error);
    return { success: false, message: 'Failed to initialize badges' };
  }
}
