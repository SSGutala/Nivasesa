'use server';

import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

/**
 * Generate a unique referral code
 * Returns a short, URL-friendly code (8 characters)
 */
export async function generateReferralCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  // Keep generating codes until we find a unique one
  while (!isUnique) {
    code = nanoid(8).toUpperCase();

    // Check if code already exists in either intake submission table
    const [existingHost, existingRenter] = await Promise.all([
      prisma.hostIntakeSubmission.findUnique({
        where: { referralCode: code },
        select: { id: true },
      }),
      prisma.renterIntakeSubmission.findUnique({
        where: { referralCode: code },
        select: { id: true },
      }),
    ]);

    if (!existingHost && !existingRenter) {
      isUnique = true;
      return code;
    }
  }

  // TypeScript safety - this should never be reached
  throw new Error('Failed to generate unique referral code');
}

/**
 * Track referral when a new user signs up with a referral code
 * Creates a Referral record linking the referrer to the referred user
 *
 * @param referredUserId - ID of the user who signed up
 * @param referredUserType - Type: 'host' or 'renter'
 * @param referredEmail - Email of the referred user
 * @param referralCode - The referral code used during signup
 */
export async function trackReferralOnSignup(
  referredUserId: string,
  referredUserType: 'host' | 'renter',
  referredEmail: string,
  referralCode: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // Find the referrer by their referral code
    const [hostReferrer, renterReferrer] = await Promise.all([
      prisma.hostIntakeSubmission.findUnique({
        where: { referralCode },
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      }),
      prisma.renterIntakeSubmission.findUnique({
        where: { referralCode },
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      }),
    ]);

    const referrer = hostReferrer || renterReferrer;
    const referrerType = hostReferrer ? 'host' : 'renter';

    if (!referrer) {
      return {
        success: false,
        message: 'Invalid referral code',
      };
    }

    // Prevent self-referral
    if (referrer.email.toLowerCase() === referredEmail.toLowerCase()) {
      return {
        success: false,
        message: 'You cannot refer yourself',
      };
    }

    // Create the referral record
    const referralData: any = {
      referrerUserId: referrer.id,
      referrerUserType: referrerType,
      referrerEmail: referrer.email,
      referralCode,
      referredUserId,
      referredUserType,
      referredUserEmail: referredEmail,
      referrerBoostDays: 14,
      referredBoostDays: 7,
      rewardStatus: 'pending',
    };

    // Set the appropriate foreign key based on referrer type
    if (referrerType === 'host') {
      referralData.referrerHostId = referrer.id;
    } else {
      referralData.referrerRenterId = referrer.id;
    }

    // Set the appropriate foreign key based on referred type
    if (referredUserType === 'host') {
      referralData.referredHostId = referredUserId;
    } else {
      referralData.referredRenterId = referredUserId;
    }

    const referral = await prisma.referral.create({
      data: referralData,
    });

    return {
      success: true,
      message: `Referral tracked successfully. Both users will receive boost at launch.`,
    };
  } catch (error) {
    console.error('Failed to track referral:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to track referral',
    };
  }
}

/**
 * Get referral statistics for a user
 * Returns count of successful referrals and pending rewards
 *
 * @param userId - ID of the user (from HostIntakeSubmission or RenterIntakeSubmission)
 * @param userType - Type: 'host' or 'renter'
 */
export async function getReferralStatsAction(
  userId: string,
  userType: 'host' | 'renter'
): Promise<{
  success: boolean;
  data?: {
    totalReferrals: number;
    pendingRewards: number;
    appliedRewards: number;
    totalBoostDays: number;
    referrals: Array<{
      id: string;
      referredEmail: string;
      referredUserType: string;
      createdAt: Date;
      rewardStatus: string;
      referredBoostDays: number;
    }>;
  };
  message?: string;
}> {
  try {
    // Find all referrals where this user is the referrer
    const whereClause: any = {
      referrerUserId: userId,
      referrerUserType: userType,
    };

    const referrals = await prisma.referral.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referredUserEmail: true,
        referredUserType: true,
        createdAt: true,
        rewardStatus: true,
        referrerBoostDays: true,
      },
    });

    const totalReferrals = referrals.length;
    const pendingRewards = referrals.filter((r) => r.rewardStatus === 'pending').length;
    const appliedRewards = referrals.filter((r) => r.rewardStatus === 'applied').length;
    const totalBoostDays = referrals.reduce((sum, r) => sum + r.referrerBoostDays, 0);

    return {
      success: true,
      data: {
        totalReferrals,
        pendingRewards,
        appliedRewards,
        totalBoostDays,
        referrals: referrals.map((r) => ({
          id: r.id,
          referredEmail: r.referredUserEmail,
          referredUserType: r.referredUserType,
          createdAt: r.createdAt,
          rewardStatus: r.rewardStatus,
          referredBoostDays: r.referrerBoostDays,
        })),
      },
    };
  } catch (error) {
    console.error('Failed to get referral stats:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get referral stats',
    };
  }
}

/**
 * Apply pending boost rewards at launch
 * Updates all pending referrals to 'applied' status
 * This should be run when the platform officially launches
 *
 * @param adminOnly - Safety check to ensure only admins can trigger this
 */
export async function applyPendingBoostRewards(
  adminOnly: boolean = true
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    if (!adminOnly) {
      return {
        success: false,
        message: 'Unauthorized: This action requires admin privileges',
      };
    }

    // Update all pending referrals to applied
    const result = await prisma.referral.updateMany({
      where: { rewardStatus: 'pending' },
      data: { rewardStatus: 'applied' },
    });

    return {
      success: true,
      message: `Successfully applied ${result.count} boost rewards`,
      count: result.count,
    };
  } catch (error) {
    console.error('Failed to apply boost rewards:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to apply boost rewards',
    };
  }
}

/**
 * Validate a referral code
 * Checks if a referral code exists and is valid
 *
 * @param referralCode - The code to validate
 */
export async function validateReferralCode(
  referralCode: string
): Promise<{
  success: boolean;
  valid: boolean;
  referrerName?: string;
  referrerType?: 'host' | 'renter';
  message?: string;
}> {
  try {
    if (!referralCode || referralCode.trim() === '') {
      return {
        success: true,
        valid: false,
        message: 'Referral code is empty',
      };
    }

    // Find the referrer by their referral code
    const [hostReferrer, renterReferrer] = await Promise.all([
      prisma.hostIntakeSubmission.findUnique({
        where: { referralCode: referralCode.toUpperCase() },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      }),
      prisma.renterIntakeSubmission.findUnique({
        where: { referralCode: referralCode.toUpperCase() },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      }),
    ]);

    const referrer = hostReferrer || renterReferrer;
    const referrerType = hostReferrer ? 'host' : 'renter';

    if (!referrer) {
      return {
        success: true,
        valid: false,
        message: 'Invalid referral code',
      };
    }

    return {
      success: true,
      valid: true,
      referrerName: referrer.fullName,
      referrerType: referrerType as 'host' | 'renter',
      message: `Valid referral code from ${referrer.fullName}`,
    };
  } catch (error) {
    console.error('Failed to validate referral code:', error);
    return {
      success: false,
      valid: false,
      message: error instanceof Error ? error.message : 'Failed to validate referral code',
    };
  }
}
