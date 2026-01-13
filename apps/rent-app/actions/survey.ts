'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Survey user types
export type SurveyUserType = 'roommate_seeker' | 'host' | 'buyer' | 'seller' | 'agent';

export interface SurveyFormData {
    userType: SurveyUserType;
    email: string;
    phone?: string;
    name?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    timeline?: string;
    languages?: string[];
    biggestChallenge?: string;
    currentSolution?: string;
    surveyData?: Record<string, unknown>;
    referralSource?: string;
}

export async function submitSurvey(data: SurveyFormData) {
    try {
        // Basic validation
        if (!data.email || !data.userType) {
            return { success: false, message: 'Email and user type are required.' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, message: 'Please enter a valid email address.' };
        }

        // Create survey response
        const surveyResponse = await prisma.preLaunchSurveyResponse.create({
            data: {
                userType: data.userType,
                email: data.email.toLowerCase(),
                phone: data.phone || null,
                name: data.name || null,
                city: data.city || null,
                state: data.state || null,
                zipcode: data.zipcode || null,
                timeline: data.timeline || null,
                languages: data.languages?.join(', ') || null,
                biggestChallenge: data.biggestChallenge || null,
                currentSolution: data.currentSolution || null,
                surveyData: data.surveyData ? JSON.stringify(data.surveyData) : null,
                referralSource: data.referralSource || null,
                status: 'new',
            },
        });

        return {
            success: true,
            message: 'Thank you for your interest! We\'ll be in touch soon.',
            id: surveyResponse.id,
        };
    } catch (error) {
        console.error('Failed to submit survey:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}

export async function getSurveyResponses(filters?: {
    userType?: SurveyUserType;
    status?: string;
    search?: string;
}) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: [] };
        }

        const where: Record<string, unknown> = {};

        if (filters?.userType) {
            where.userType = filters.userType;
        }

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { email: { contains: filters.search } },
                { name: { contains: filters.search } },
                { city: { contains: filters.search } },
                { phone: { contains: filters.search } },
            ];
        }

        const responses = await prisma.preLaunchSurveyResponse.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: responses };
    } catch (error) {
        console.error('Failed to get survey responses:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey responses.',
            data: [],
        };
    }
}

export async function getSurveyResponseById(id: string) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: null };
        }

        const response = await prisma.preLaunchSurveyResponse.findUnique({
            where: { id },
        });

        if (!response) {
            return { success: false, message: 'Survey response not found.', data: null };
        }

        return { success: true, data: response };
    } catch (error) {
        console.error('Failed to get survey response:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey response.',
            data: null,
        };
    }
}

export async function updateSurveyStatus(
    id: string,
    updates: {
        status?: string;
        callNotes?: string;
        calledAt?: Date;
        interviewedAt?: Date;
    }
) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized' };
        }

        const surveyResponse = await prisma.preLaunchSurveyResponse.update({
            where: { id },
            data: {
                ...updates,
                updatedAt: new Date(),
            },
        });

        revalidatePath('/admin/surveys');
        revalidatePath(`/admin/surveys/${id}`);

        return { success: true, data: surveyResponse };
    } catch (error) {
        console.error('Failed to update survey response:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update survey response.',
        };
    }
}

export async function getSurveyStats() {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: null };
        }

        const [
            total,
            roommateSeekers,
            hosts,
            buyers,
            sellers,
            agents,
            newStatus,
            contacted,
            scheduled,
            interviewed,
            converted,
        ] = await Promise.all([
            prisma.preLaunchSurveyResponse.count(),
            prisma.preLaunchSurveyResponse.count({ where: { userType: 'roommate_seeker' } }),
            prisma.preLaunchSurveyResponse.count({ where: { userType: 'host' } }),
            prisma.preLaunchSurveyResponse.count({ where: { userType: 'buyer' } }),
            prisma.preLaunchSurveyResponse.count({ where: { userType: 'seller' } }),
            prisma.preLaunchSurveyResponse.count({ where: { userType: 'agent' } }),
            prisma.preLaunchSurveyResponse.count({ where: { status: 'new' } }),
            prisma.preLaunchSurveyResponse.count({ where: { status: 'contacted' } }),
            prisma.preLaunchSurveyResponse.count({ where: { status: 'scheduled' } }),
            prisma.preLaunchSurveyResponse.count({ where: { status: 'interviewed' } }),
            prisma.preLaunchSurveyResponse.count({ where: { status: 'converted' } }),
        ]);

        return {
            success: true,
            data: {
                total,
                byUserType: {
                    roommate_seeker: roommateSeekers,
                    host: hosts,
                    buyer: buyers,
                    seller: sellers,
                    agent: agents,
                },
                byStatus: {
                    new: newStatus,
                    contacted,
                    scheduled,
                    interviewed,
                    converted,
                },
            },
        };
    } catch (error) {
        console.error('Failed to get survey stats:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey stats.',
            data: null,
        };
    }
}

// =============================================================================
// ALPHA INTAKE SUBMISSIONS (Pre-launch Survey)
// =============================================================================

/**
 * Generate a unique 8-character alphanumeric referral code
 * Helper function (not exported as server action)
 */
function generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0, O, 1, I)
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Track a referral relationship between two users
 */
export async function trackReferral(
    referrerCode: string,
    referredUserId: string,
    referredUserType: 'host' | 'renter',
    referredEmail: string
): Promise<{ success: boolean; message?: string }> {
    try {
        // Find the referrer by code (check both host and renter tables)
        const hostReferrer = await prisma.hostIntakeSubmission.findUnique({
            where: { referralCode: referrerCode },
        });

        const renterReferrer = await prisma.renterIntakeSubmission.findUnique({
            where: { referralCode: referrerCode },
        });

        const referrer = hostReferrer || renterReferrer;
        if (!referrer) {
            return { success: false, message: 'Invalid referral code' };
        }

        const referrerUserType = hostReferrer ? 'host' : 'renter';

        // Create referral record
        await prisma.referral.create({
            data: {
                referrerUserId: referrer.id,
                referrerUserType,
                referrerEmail: referrer.email,
                referralCode: referrerCode,
                referredUserId,
                referredUserType,
                referredUserEmail: referredEmail,
                referrerBoostDays: 14,
                referredBoostDays: 7,
                rewardStatus: 'pending',
                // Connect to the appropriate foreign keys
                ...(referrerUserType === 'host'
                    ? { referrerHostId: referrer.id }
                    : { referrerRenterId: referrer.id }),
                ...(referredUserType === 'host'
                    ? { referredHostId: referredUserId }
                    : { referredRenterId: referredUserId }),
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to track referral:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to track referral',
        };
    }
}

/**
 * Host/Landlord Survey Submission
 */
export interface HostSurveyData {
    fullName: string;
    email: string;
    phoneNumber?: string;
    preferredContactMethod: 'Email' | 'Text' | 'WhatsApp';
    city: string;
    state: string;
    zipCode: string;
    typeOfSpaceOffered: 'Private room' | 'Entire apartment/home' | 'Shared room';
    stayDurationsOffered: string[]; // Array to be joined as CSV
    currentAvailability: 'Available now' | 'Available soon' | 'Not yet / just exploring';
    earliestAvailableDate?: Date;
    additionalNotes?: string;
    referredByCode?: string;
}

export async function submitHostSurveyAction(data: HostSurveyData): Promise<{
    success: boolean;
    message?: string;
    referralCode?: string;
}> {
    try {
        // Validate required fields
        if (
            !data.fullName ||
            !data.email ||
            !data.preferredContactMethod ||
            !data.city ||
            !data.state ||
            !data.zipCode ||
            !data.typeOfSpaceOffered ||
            !data.stayDurationsOffered?.length ||
            !data.currentAvailability
        ) {
            return { success: false, message: 'All required fields must be filled' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, message: 'Please enter a valid email address' };
        }

        // Check if email already exists
        const existingHost = await prisma.hostIntakeSubmission.findUnique({
            where: { email: data.email.toLowerCase() },
        });

        if (existingHost) {
            return {
                success: false,
                message: 'This email is already registered. Please use a different email.',
            };
        }

        // Generate unique referral code
        let referralCode = generateReferralCode();
        let codeExists = true;

        // Ensure code is unique across both host and renter tables
        while (codeExists) {
            const [hostCode, renterCode] = await Promise.all([
                prisma.hostIntakeSubmission.findUnique({
                    where: { referralCode },
                }),
                prisma.renterIntakeSubmission.findUnique({
                    where: { referralCode },
                }),
            ]);

            if (!hostCode && !renterCode) {
                codeExists = false;
            } else {
                referralCode = generateReferralCode();
            }
        }

        // Create host submission
        const submission = await prisma.hostIntakeSubmission.create({
            data: {
                fullName: data.fullName.trim(),
                email: data.email.toLowerCase().trim(),
                phoneNumber: data.phoneNumber?.trim() || null,
                preferredContactMethod: data.preferredContactMethod,
                city: data.city.trim(),
                state: data.state,
                zipCode: data.zipCode.trim(),
                typeOfSpaceOffered: data.typeOfSpaceOffered,
                stayDurationsOffered: data.stayDurationsOffered.join(', '),
                currentAvailability: data.currentAvailability,
                earliestAvailableDate: data.earliestAvailableDate || null,
                additionalNotes: data.additionalNotes?.trim() || null,
                referralCode,
                referredByCode: data.referredByCode?.trim().toUpperCase() || null,
            },
        });

        // Track referral if referred by someone
        if (data.referredByCode) {
            await trackReferral(
                data.referredByCode.trim().toUpperCase(),
                submission.id,
                'host',
                submission.email
            );
        }

        return {
            success: true,
            referralCode,
            message: 'Thank you for joining! Check your email for next steps.',
        };
    } catch (error) {
        console.error('Failed to submit host survey:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}

/**
 * Tenant/Renter Survey Submission
 */
export interface RenterSurveyData {
    fullName: string;
    email: string;
    phoneNumber?: string;
    preferredContactMethod: 'Email' | 'Text' | 'WhatsApp';
    targetCity: string;
    targetState: string;
    targetZipCode?: string;
    moveInTimeframe: 'ASAP' | '2–4 weeks' | '1–3 months' | 'Just browsing';
    intendedStayDuration: 'Temporary 1–4 weeks' | 'Short-term 1–3 months' | 'Long-term 6+ months';
    lookingFor: 'A room' | 'A roommate to co-lease' | 'Either';
    preferSimilarCulture?: 'Yes' | 'No' | 'Not sure';
    additionalNotes?: string;
    referredByCode?: string;
}

export async function submitRenterSurveyAction(data: RenterSurveyData): Promise<{
    success: boolean;
    message?: string;
    referralCode?: string;
}> {
    try {
        // Validate required fields
        if (
            !data.fullName ||
            !data.email ||
            !data.preferredContactMethod ||
            !data.targetCity ||
            !data.targetState ||
            !data.moveInTimeframe ||
            !data.intendedStayDuration ||
            !data.lookingFor
        ) {
            return { success: false, message: 'All required fields must be filled' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, message: 'Please enter a valid email address' };
        }

        // Check if email already exists
        const existingRenter = await prisma.renterIntakeSubmission.findUnique({
            where: { email: data.email.toLowerCase() },
        });

        if (existingRenter) {
            return {
                success: false,
                message: 'This email is already registered. Please use a different email.',
            };
        }

        // Generate unique referral code
        let referralCode = generateReferralCode();
        let codeExists = true;

        // Ensure code is unique across both host and renter tables
        while (codeExists) {
            const [hostCode, renterCode] = await Promise.all([
                prisma.hostIntakeSubmission.findUnique({
                    where: { referralCode },
                }),
                prisma.renterIntakeSubmission.findUnique({
                    where: { referralCode },
                }),
            ]);

            if (!hostCode && !renterCode) {
                codeExists = false;
            } else {
                referralCode = generateReferralCode();
            }
        }

        // Create renter submission
        const submission = await prisma.renterIntakeSubmission.create({
            data: {
                fullName: data.fullName.trim(),
                email: data.email.toLowerCase().trim(),
                phoneNumber: data.phoneNumber?.trim() || null,
                preferredContactMethod: data.preferredContactMethod,
                targetCity: data.targetCity.trim(),
                targetState: data.targetState,
                targetZipCode: data.targetZipCode?.trim() || null,
                moveInTimeframe: data.moveInTimeframe,
                intendedStayDuration: data.intendedStayDuration,
                lookingFor: data.lookingFor,
                preferSimilarCulture: data.preferSimilarCulture || null,
                additionalNotes: data.additionalNotes?.trim() || null,
                referralCode,
                referredByCode: data.referredByCode?.trim().toUpperCase() || null,
            },
        });

        // Track referral if referred by someone
        if (data.referredByCode) {
            await trackReferral(
                data.referredByCode.trim().toUpperCase(),
                submission.id,
                'renter',
                submission.email
            );
        }

        return {
            success: true,
            referralCode,
            message: 'Thank you for joining! Check your email for next steps.',
        };
    } catch (error) {
        console.error('Failed to submit renter survey:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}
