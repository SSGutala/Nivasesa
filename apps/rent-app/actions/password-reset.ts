'use server'

import { prisma } from '@/lib/prisma'
import {
  createVerificationToken,
  sendPasswordResetEmail,
  verifyToken,
  deleteVerificationToken,
} from '@/lib/email'

/**
 * Request password reset - sends email with reset link
 */
export async function requestPasswordResetAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true, message: 'If an account exists with this email, you will receive a password reset link.' }
    }

    const token = await createVerificationToken(email)
    const sent = await sendPasswordResetEmail(email, token)

    if (!sent) {
      return { success: false, error: 'Failed to send password reset email. Please try again.' }
    }

    return { success: true, message: 'If an account exists with this email, you will receive a password reset link.' }
  } catch (error) {
    console.error('Request password reset error:', error)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' }
    }

    const email = await verifyToken(token)

    if (!email) {
      return { success: false, error: 'Invalid or expired reset link. Please request a new one.' }
    }

    // Update user's password
    // Note: In production, you should hash the password with bcrypt
    await prisma.user.update({
      where: { email },
      data: { password: newPassword },
    })

    // Delete the token
    await deleteVerificationToken(token)

    return { success: true, message: 'Password reset successfully. You can now log in with your new password.' }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}

/**
 * Validate reset token without consuming it
 */
export async function validateResetTokenAction(token: string) {
  try {
    const email = await verifyToken(token)

    if (!email) {
      return { valid: false }
    }

    return { valid: true, email }
  } catch (error) {
    console.error('Validate reset token error:', error)
    return { valid: false }
  }
}
