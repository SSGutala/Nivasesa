'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export async function getCurrentUserTwoFactorStatusAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { enabled: false }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true },
    })

    return { enabled: user?.twoFactorEnabled || false }
  } catch (error) {
    console.error('Error fetching 2FA status:', error)
    return { enabled: false }
  }
}

export async function setupTwoFactorAction() {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.email) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Nivasesa Lead-Gen (${session.user.email})`,
      issuer: 'Nivasesa',
    })

    // Store temporary secret
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret.base32 },
    })

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

    return {
      success: true,
      secret: secret.base32,
      qrCode,
    }
  } catch (error) {
    console.error('Error setting up 2FA:', error)
    return { success: false, error: 'Failed to setup 2FA' }
  }
}

export async function enableTwoFactorAction(token: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true },
    })

    if (!user?.twoFactorSecret) {
      return { success: false, error: 'No 2FA setup found' }
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    })

    if (!verified) {
      return { success: false, error: 'Invalid code' }
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    })

    return { success: true }
  } catch (error) {
    console.error('Error enabling 2FA:', error)
    return { success: false, error: 'Failed to enable 2FA' }
  }
}

export async function disableTwoFactorAction(token: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user?.twoFactorEnabled) {
      return { success: false, error: '2FA is not enabled' }
    }

    if (!user.twoFactorSecret) {
      return { success: false, error: 'No 2FA secret found' }
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    })

    if (!verified) {
      return { success: false, error: 'Invalid code' }
    }

    // Disable 2FA and remove secret
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error disabling 2FA:', error)
    return { success: false, error: 'Failed to disable 2FA' }
  }
}
