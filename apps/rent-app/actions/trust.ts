'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Get the verification status for the current user
 */
export async function getVerificationStatusAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const verification = await prisma.userVerification.findUnique({
      where: { userId: session.user.id },
    });

    return {
      success: true,
      data: verification || {
        emailVerified: false,
        phoneVerified: false,
        idVerified: false,
      },
    };
  } catch (error) {
    console.error('Error fetching verification status:', error);
    return { success: false, error: 'Failed to fetch verification status' };
  }
}

/**
 * Request phone verification
 * Sends a verification code to the provided phone number
 */
export async function requestPhoneVerificationAction(phone: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate phone number format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/[\s()-]/g, ''))) {
    return { success: false, error: 'Invalid phone number format' };
  }

  try {
    // In production, integrate with Twilio/SNS to send SMS
    // For now, we'll generate a code and log it
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code temporarily (in production, use Redis or similar)
    // For demo purposes, we'll just log it
    console.log(`Verification code for ${phone}: ${verificationCode}`);

    // TODO: Send SMS with verification code
    // await sendSMS(phone, `Your Nivasesa verification code is: ${verificationCode}`);

    return {
      success: true,
      message: 'Verification code sent to your phone',
      // In production, don't return the code
      code: process.env.NODE_ENV === 'development' ? verificationCode : undefined,
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, error: 'Failed to send verification code' };
  }
}

/**
 * Verify phone with the provided code
 */
export async function verifyPhoneAction(code: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!code || code.length !== 6) {
    return { success: false, error: 'Invalid verification code' };
  }

  try {
    // TODO: Verify the code against stored value
    // For demo purposes, accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return { success: false, error: 'Invalid verification code format' };
    }

    // Update or create verification record
    const verification = await prisma.userVerification.upsert({
      where: { userId: session.user.id },
      update: {
        phoneVerified: true,
        verifiedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        phoneVerified: true,
        emailVerified: false,
        idVerified: false,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Phone verified successfully',
      data: verification,
    };
  } catch (error) {
    console.error('Error verifying phone:', error);
    return { success: false, error: 'Failed to verify phone' };
  }
}

/**
 * Submit ID verification document
 */
export async function submitIdVerificationAction(documentUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!documentUrl) {
    return { success: false, error: 'Document URL is required' };
  }

  try {
    // Update or create verification record
    const verification = await prisma.userVerification.upsert({
      where: { userId: session.user.id },
      update: {
        idDocumentUrl: documentUrl,
        // ID verification requires manual review, so don't set idVerified yet
      },
      create: {
        userId: session.user.id,
        emailVerified: false,
        phoneVerified: false,
        idVerified: false,
        idDocumentUrl: documentUrl,
      },
    });

    // TODO: Trigger admin notification for ID review
    // TODO: Integrate with ID verification service (e.g., Stripe Identity, Onfido)

    return {
      success: true,
      message: 'ID document submitted for review',
      data: verification,
    };
  } catch (error) {
    console.error('Error submitting ID verification:', error);
    return { success: false, error: 'Failed to submit ID document' };
  }
}

/**
 * Mark email as verified
 * This would typically be called by the email verification flow
 */
export async function markEmailVerifiedAction(userId: string) {
  try {
    const verification = await prisma.userVerification.upsert({
      where: { userId },
      update: {
        emailVerified: true,
        verifiedAt: new Date(),
      },
      create: {
        userId,
        emailVerified: true,
        phoneVerified: false,
        idVerified: false,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
      data: verification,
    };
  } catch (error) {
    console.error('Error marking email as verified:', error);
    return { success: false, error: 'Failed to verify email' };
  }
}
