'use server'

import { prisma } from '@/lib/prisma'
import {
  createVerificationToken,
  sendVerificationEmail,
  verifyToken,
  deleteVerificationToken,
} from '@/lib/email'
import { revalidatePath } from 'next/cache'

/**
 * Send verification email to user
 */
export async function sendVerificationEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.emailVerified) {
      return { success: false, error: 'Email already verified' }
    }

    const token = await createVerificationToken(email)
    const sent = await sendVerificationEmail(email, token)

    if (!sent) {
      return { success: false, error: 'Failed to send verification email' }
    }

    return { success: true, message: 'Verification email sent' }
  } catch (error) {
    console.error('Send verification email error:', error)
    return { success: false, error: 'An error occurred' }
  }
}

/**
 * Verify email with token
 */
export async function verifyEmailAction(token: string) {
  try {
    const email = await verifyToken(token)

    if (!email) {
      return { success: false, error: 'Invalid or expired token' }
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete the token
    await deleteVerificationToken(token)

    revalidatePath('/')

    return { success: true, message: 'Email verified successfully' }
  } catch (error) {
    console.error('Verify email error:', error)
    return { success: false, error: 'An error occurred' }
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmailAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.emailVerified) {
      return { success: false, error: 'Email already verified' }
    }

    const token = await createVerificationToken(email)
    const sent = await sendVerificationEmail(email, token)

    if (!sent) {
      return { success: false, error: 'Failed to send verification email' }
    }

    return { success: true, message: 'Verification email resent' }
  } catch (error) {
    console.error('Resend verification email error:', error)
    return { success: false, error: 'An error occurred' }
  }
}
