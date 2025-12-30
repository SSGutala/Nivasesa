'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import {
  generateTOTPSecret,
  generateQRCode,
  verifyTOTP,
  encryptSecret,
  decryptSecret,
} from '@/lib/totp'

/**
 * Start 2FA setup - generate secret and QR code
 */
export async function setupTwoFactorAction() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.twoFactorEnabled) {
      return { success: false, error: '2FA is already enabled' }
    }

    // Generate a new secret
    const secret = generateTOTPSecret()
    const qrCode = await generateQRCode(secret, user.email)

    // Store the secret temporarily (not enabled yet)
    const encryptedSecret = encryptSecret(secret)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: encryptedSecret },
    })

    return {
      success: true,
      secret,
      qrCode,
    }
  } catch (error) {
    console.error('Setup 2FA error:', error)
    return { success: false, error: 'Failed to setup 2FA' }
  }
}

/**
 * Verify and enable 2FA
 */
export async function enableTwoFactorAction(code: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || !user.twoFactorSecret) {
      return { success: false, error: 'Please setup 2FA first' }
    }

    if (user.twoFactorEnabled) {
      return { success: false, error: '2FA is already enabled' }
    }

    // Decrypt and verify
    const secret = decryptSecret(user.twoFactorSecret)
    const isValid = verifyTOTP(secret, user.email, code)

    if (!isValid) {
      return { success: false, error: 'Invalid code. Please try again.' }
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    })

    return { success: true, message: '2FA enabled successfully' }
  } catch (error) {
    console.error('Enable 2FA error:', error)
    return { success: false, error: 'Failed to enable 2FA' }
  }
}

/**
 * Disable 2FA (requires current code)
 */
export async function disableTwoFactorAction(code: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return { success: false, error: '2FA is not enabled' }
    }

    // Verify the code before disabling
    const secret = decryptSecret(user.twoFactorSecret)
    const isValid = verifyTOTP(secret, user.email, code)

    if (!isValid) {
      return { success: false, error: 'Invalid code. Please try again.' }
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return { success: true, message: '2FA disabled successfully' }
  } catch (error) {
    console.error('Disable 2FA error:', error)
    return { success: false, error: 'Failed to disable 2FA' }
  }
}

/**
 * Verify 2FA code during login
 */
export async function verifyTwoFactorLoginAction(email: string, code: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return { success: false, error: '2FA is not enabled for this account' }
    }

    const secret = decryptSecret(user.twoFactorSecret)
    const isValid = verifyTOTP(secret, user.email, code)

    if (!isValid) {
      return { success: false, error: 'Invalid code. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Verify 2FA login error:', error)
    return { success: false, error: 'Failed to verify 2FA' }
  }
}

/**
 * Check if user has 2FA enabled
 */
export async function checkTwoFactorStatusAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { twoFactorEnabled: true },
    })

    return {
      enabled: user?.twoFactorEnabled ?? false,
    }
  } catch (error) {
    console.error('Check 2FA status error:', error)
    return { enabled: false }
  }
}

/**
 * Get current user's 2FA status
 */
export async function getCurrentUserTwoFactorStatusAction() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { enabled: false }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true },
    })

    return {
      enabled: user?.twoFactorEnabled ?? false,
    }
  } catch (error) {
    console.error('Get 2FA status error:', error)
    return { enabled: false }
  }
}
