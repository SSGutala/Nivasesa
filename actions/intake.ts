'use server';

import prisma from '@/lib/prisma';
import { generateReferralCode, trackReferralOnSignup, validateReferralCode } from './referrals';

/**
 * Host Intake Submission Data
 */
export interface HostIntakeData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  preferredContactMethod: string;
  city: string;
  state: string;
  zipCode: string;
  typeOfSpaceOffered: string;
  stayDurationsOffered: string; // CSV string
  currentAvailability: string;
  earliestAvailableDate?: Date;
  additionalNotes?: string;
  referredByCode?: string; // Referral code used during signup
}

/**
 * Renter Intake Submission Data
 */
export interface RenterIntakeData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  preferredContactMethod: string;
  targetCity: string;
  targetState: string;
  targetZipCode?: string;
  moveInTimeframe: string;
  intendedStayDuration: string;
  lookingFor: string;
  preferSimilarCulture?: string;
  additionalNotes?: string;
  referredByCode?: string; // Referral code used during signup
}

/**
 * Submit Host Intake Form
 * Creates a host intake submission and handles referral tracking
 */
export async function submitHostIntake(data: HostIntakeData): Promise<{
  success: boolean;
  message?: string;
  id?: string;
  referralCode?: string;
  referralTracked?: boolean;
}> {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Check if email already exists
    const existing = await prisma.hostIntakeSubmission.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return {
        success: false,
        message: 'This email is already registered. Please use a different email.',
      };
    }

    // Validate referral code if provided
    let referralCodeValid = false;
    if (data.referredByCode) {
      const validation = await validateReferralCode(data.referredByCode);
      if (!validation.valid) {
        return {
          success: false,
          message: `Invalid referral code: ${validation.message}`,
        };
      }
      referralCodeValid = true;
    }

    // Generate unique referral code for this user
    const referralCode = await generateReferralCode();

    // Create host intake submission
    const submission = await prisma.hostIntakeSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phoneNumber: data.phoneNumber || null,
        preferredContactMethod: data.preferredContactMethod,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        typeOfSpaceOffered: data.typeOfSpaceOffered,
        stayDurationsOffered: data.stayDurationsOffered,
        currentAvailability: data.currentAvailability,
        earliestAvailableDate: data.earliestAvailableDate || null,
        additionalNotes: data.additionalNotes || null,
        referralCode,
        referredByCode: data.referredByCode?.toUpperCase() || null,
      },
    });

    // Track referral if a valid referral code was used
    let referralTracked = false;
    if (referralCodeValid && data.referredByCode) {
      const referralResult = await trackReferralOnSignup(
        submission.id,
        'host',
        submission.email,
        data.referredByCode.toUpperCase()
      );
      referralTracked = referralResult.success;
    }

    return {
      success: true,
      message: 'Thank you for joining! You will receive updates as we launch.',
      id: submission.id,
      referralCode: submission.referralCode,
      referralTracked,
    };
  } catch (error) {
    console.error('Failed to submit host intake:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Submit Renter Intake Form
 * Creates a renter intake submission and handles referral tracking
 */
export async function submitRenterIntake(data: RenterIntakeData): Promise<{
  success: boolean;
  message?: string;
  id?: string;
  referralCode?: string;
  referralTracked?: boolean;
}> {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Check if email already exists
    const existing = await prisma.renterIntakeSubmission.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return {
        success: false,
        message: 'This email is already registered. Please use a different email.',
      };
    }

    // Validate referral code if provided
    let referralCodeValid = false;
    if (data.referredByCode) {
      const validation = await validateReferralCode(data.referredByCode);
      if (!validation.valid) {
        return {
          success: false,
          message: `Invalid referral code: ${validation.message}`,
        };
      }
      referralCodeValid = true;
    }

    // Generate unique referral code for this user
    const referralCode = await generateReferralCode();

    // Create renter intake submission
    const submission = await prisma.renterIntakeSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phoneNumber: data.phoneNumber || null,
        preferredContactMethod: data.preferredContactMethod,
        targetCity: data.targetCity,
        targetState: data.targetState,
        targetZipCode: data.targetZipCode || null,
        moveInTimeframe: data.moveInTimeframe,
        intendedStayDuration: data.intendedStayDuration,
        lookingFor: data.lookingFor,
        preferSimilarCulture: data.preferSimilarCulture || null,
        additionalNotes: data.additionalNotes || null,
        referralCode,
        referredByCode: data.referredByCode?.toUpperCase() || null,
      },
    });

    // Track referral if a valid referral code was used
    let referralTracked = false;
    if (referralCodeValid && data.referredByCode) {
      const referralResult = await trackReferralOnSignup(
        submission.id,
        'renter',
        submission.email,
        data.referredByCode.toUpperCase()
      );
      referralTracked = referralResult.success;
    }

    return {
      success: true,
      message: 'Thank you for joining! You will receive updates as we launch.',
      id: submission.id,
      referralCode: submission.referralCode,
      referralTracked,
    };
  } catch (error) {
    console.error('Failed to submit renter intake:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
    };
  }
}

/**
 * Get intake submission by ID (Admin only)
 */
export async function getIntakeSubmissionById(
  id: string,
  type: 'host' | 'renter'
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const submission =
      type === 'host'
        ? await prisma.hostIntakeSubmission.findUnique({
            where: { id },
            include: {
              referralsGiven: true,
              referralsReceived: true,
            },
          })
        : await prisma.renterIntakeSubmission.findUnique({
            where: { id },
            include: {
              referralsGiven: true,
              referralsReceived: true,
            },
          });

    if (!submission) {
      return {
        success: false,
        message: 'Submission not found',
      };
    }

    return {
      success: true,
      data: submission,
    };
  } catch (error) {
    console.error('Failed to get intake submission:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch submission',
    };
  }
}

/**
 * Get all intake submissions (Admin only)
 */
export async function getAllIntakeSubmissions(filters?: {
  type?: 'host' | 'renter';
  city?: string;
  state?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: { hosts: any[]; renters: any[] };
  message?: string;
}> {
  try {
    const hostWhere: any = {};
    const renterWhere: any = {};

    if (filters?.city) {
      hostWhere.city = { contains: filters.city, mode: 'insensitive' };
      renterWhere.targetCity = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.state) {
      hostWhere.state = filters.state;
      renterWhere.targetState = filters.state;
    }

    if (filters?.search) {
      const searchCondition = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
      ];
      hostWhere.OR = searchCondition;
      renterWhere.OR = searchCondition;
    }

    const [hosts, renters] = await Promise.all([
      !filters?.type || filters.type === 'host'
        ? prisma.hostIntakeSubmission.findMany({
            where: hostWhere,
            orderBy: { createdAt: 'desc' },
            include: {
              referralsGiven: true,
            },
          })
        : [],
      !filters?.type || filters.type === 'renter'
        ? prisma.renterIntakeSubmission.findMany({
            where: renterWhere,
            orderBy: { createdAt: 'desc' },
            include: {
              referralsGiven: true,
            },
          })
        : [],
    ]);

    return {
      success: true,
      data: { hosts, renters },
    };
  } catch (error) {
    console.error('Failed to get intake submissions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch submissions',
    };
  }
}
