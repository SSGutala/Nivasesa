'use server';

import { prisma } from '@/lib/prisma';

// =============================================================================
// REFERRAL CODE GENERATION AND TRACKING
// =============================================================================

/**
 * Generate a unique 8-character alphanumeric referral code
 */
function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars: 0, O, 1, I
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Generate a referral code for a host intake submission
 * @param userId - The host intake submission ID
 * @returns The generated referral code or error
 */
export async function generateReferralCodeAction(userId: string) {
    try {
        // Check if user exists (host or renter)
        const host = await prisma.hostIntakeSubmission.findUnique({
            where: { id: userId },
        });

        const renter = await prisma.renterIntakeSubmission.findUnique({
            where: { id: userId },
        });

        if (!host && !renter) {
            return { success: false, message: 'User not found' };
        }

        // Check if user already has a referral code
        const existing = host || renter;
        if (existing?.referralCode) {
            return { success: true, code: existing.referralCode };
        }

        // Generate unique code
        let code = generateCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            const existingHost = await prisma.hostIntakeSubmission.findUnique({
                where: { referralCode: code },
            });
            const existingRenter = await prisma.renterIntakeSubmission.findUnique({
                where: { referralCode: code },
            });

            if (!existingHost && !existingRenter) {
                isUnique = true;
            } else {
                code = generateCode();
                attempts++;
            }
        }

        if (!isUnique) {
            return { success: false, message: 'Failed to generate unique code' };
        }

        // Update user with referral code
        if (host) {
            await prisma.hostIntakeSubmission.update({
                where: { id: userId },
                data: { referralCode: code },
            });
        } else if (renter) {
            await prisma.renterIntakeSubmission.update({
                where: { id: userId },
                data: { referralCode: code },
            });
        }

        return { success: true, code };
    } catch (error) {
        console.error('Error generating referral code:', error);
        return { success: false, message: 'Failed to generate referral code' };
    }
}

/**
 * Validate a referral code and return referrer information
 * @param code - The referral code to validate
 * @returns Referrer information if valid, null otherwise
 */
export async function validateReferralCodeAction(code: string) {
    try {
        // Check if code exists in host submissions
        const host = await prisma.hostIntakeSubmission.findUnique({
            where: { referralCode: code },
        });

        if (host) {
            return {
                success: true,
                referrer: {
                    id: host.id,
                    type: 'host' as const,
                    email: host.email,
                    name: host.fullName,
                },
            };
        }

        // Check if code exists in renter submissions
        const renter = await prisma.renterIntakeSubmission.findUnique({
            where: { referralCode: code },
        });

        if (renter) {
            return {
                success: true,
                referrer: {
                    id: renter.id,
                    type: 'renter' as const,
                    email: renter.email,
                    name: renter.fullName,
                },
            };
        }

        return { success: false, message: 'Invalid referral code' };
    } catch (error) {
        console.error('Error validating referral code:', error);
        return { success: false, message: 'Failed to validate referral code' };
    }
}

/**
 * Track a referral when a new user signs up with a referral code
 * @param referralCode - The referral code used
 * @param newUserId - The new user's ID
 * @param newUserEmail - The new user's email
 * @returns Success status
 */
export async function trackReferralAction(
    referralCode: string,
    newUserId: string,
    newUserEmail: string
) {
    try {
        // Validate the referral code
        const validation = await validateReferralCodeAction(referralCode);

        if (!validation.success || !validation.referrer) {
            return { success: false, message: 'Invalid referral code' };
        }

        const { referrer } = validation;

        // Check if new user is host or renter
        const newHost = await prisma.hostIntakeSubmission.findUnique({
            where: { id: newUserId },
        });

        const newRenter = await prisma.renterIntakeSubmission.findUnique({
            where: { id: newUserId },
        });

        if (!newHost && !newRenter) {
            return { success: false, message: 'New user not found' };
        }

        const newUserType = newHost ? 'host' : 'renter';

        // Create referral record
        const referralData = {
            referrerUserId: referrer.id,
            referrerUserType: referrer.type,
            referrerEmail: referrer.email,
            referralCode: referralCode,
            referredUserId: newUserId,
            referredUserType: newUserType,
            referredUserEmail: newUserEmail,
            referrerBoostDays: 14,
            referredBoostDays: 7,
            rewardStatus: 'pending',
        };

        // Connect to appropriate relation fields
        const relationData: Record<string, string> = {};
        if (referrer.type === 'host') {
            relationData.referrerHostId = referrer.id;
        } else {
            relationData.referrerRenterId = referrer.id;
        }

        if (newUserType === 'host') {
            relationData.referredHostId = newUserId;
        } else {
            relationData.referredRenterId = newUserId;
        }

        await prisma.referral.create({
            data: {
                ...referralData,
                ...relationData,
            },
        });

        // Update the new user's referredByCode field
        if (newHost) {
            await prisma.hostIntakeSubmission.update({
                where: { id: newUserId },
                data: { referredByCode: referralCode },
            });
        } else if (newRenter) {
            await prisma.renterIntakeSubmission.update({
                where: { id: newUserId },
                data: { referredByCode: referralCode },
            });
        }

        return {
            success: true,
            message: 'Referral tracked successfully',
            referrerBoostDays: 14,
            referredBoostDays: 7,
        };
    } catch (error) {
        console.error('Error tracking referral:', error);
        return { success: false, message: 'Failed to track referral' };
    }
}

/**
 * Get referral statistics for a user
 * @param userId - The user's ID (host or renter submission)
 * @returns Referral statistics including list of referred users
 */
export async function getReferralStatsAction(userId: string) {
    try {
        // Check if user is host or renter
        const host = await prisma.hostIntakeSubmission.findUnique({
            where: { id: userId },
        });

        const renter = await prisma.renterIntakeSubmission.findUnique({
            where: { id: userId },
        });

        if (!host && !renter) {
            return { success: false, message: 'User not found' };
        }

        const user = host || renter;

        // Get all referrals where this user is the referrer
        const referrals = await prisma.referral.findMany({
            where: {
                referrerUserId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const successfulReferrals = referrals.filter(
            (r) => r.rewardStatus === 'applied'
        ).length;

        const pendingReferrals = referrals.filter(
            (r) => r.rewardStatus === 'pending'
        ).length;

        const totalBoostDaysEarned = referrals
            .filter((r) => r.rewardStatus === 'applied')
            .reduce((sum, r) => sum + r.referrerBoostDays, 0);

        const potentialBoostDays = referrals
            .filter((r) => r.rewardStatus === 'pending')
            .reduce((sum, r) => sum + r.referrerBoostDays, 0);

        return {
            success: true,
            data: {
                referralCode: user?.referralCode || null,
                totalReferrals: referrals.length,
                pendingRewards: pendingReferrals,
                appliedRewards: successfulReferrals,
                totalBoostDays: totalBoostDaysEarned + potentialBoostDays,
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
        console.error('Error getting referral stats:', error);
        return { success: false, message: 'Failed to get referral stats' };
    }
}

/**
 * Apply referral boosts for all pending referrals (admin action)
 * @returns Number of referrals processed
 */
export async function applyReferralBoostsAction() {
    try {
        // Get all pending referrals
        const pendingReferrals = await prisma.referral.findMany({
            where: {
                rewardStatus: 'pending',
            },
        });

        if (pendingReferrals.length === 0) {
            return {
                success: true,
                message: 'No pending referrals to process',
                count: 0,
            };
        }

        // In a real implementation, this would apply boosts to user accounts
        // For now, we'll just mark them as applied
        const updatePromises = pendingReferrals.map((referral) =>
            prisma.referral.update({
                where: { id: referral.id },
                data: { rewardStatus: 'applied' },
            })
        );

        await Promise.all(updatePromises);

        return {
            success: true,
            message: `Applied boosts for ${pendingReferrals.length} referrals`,
            count: pendingReferrals.length,
        };
    } catch (error) {
        console.error('Error applying referral boosts:', error);
        return { success: false, message: 'Failed to apply referral boosts' };
    }
}
