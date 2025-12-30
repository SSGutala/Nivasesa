import crypto from 'crypto'
import { prisma } from './prisma'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@nivasesa.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Generate a verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create and store a verification token
 */
export async function createVerificationToken(email: string): Promise<string> {
  const token = generateVerificationToken()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return token
}

/**
 * Verify a token and return the email if valid
 */
export async function verifyToken(token: string): Promise<string | null> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return null
  }

  // Check if token is expired
  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    })
    return null
  }

  return verificationToken.identifier
}

/**
 * Delete a verification token after use
 */
export async function deleteVerificationToken(token: string): Promise<void> {
  await prisma.verificationToken.delete({
    where: { token },
  }).catch(() => {
    // Ignore errors if token doesn't exist
  })
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<boolean> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`

  // If no Resend API key, log to console (development mode)
  if (!RESEND_API_KEY) {
    console.log('\n=== EMAIL VERIFICATION ===')
    console.log(`To: ${email}`)
    console.log(`Verification URL: ${verificationUrl}`)
    console.log('==========================\n')
    return true
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your email address - Nivasesa',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin-top: 0;">Welcome to Nivasesa!</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Thank you for joining Nivasesa. Please verify your email address to complete your registration.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}"
                     style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Verify Email Address
                  </a>
                </div>
                <p style="font-size: 14px; color: #666;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
                </p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  This link will expire in 24 hours.
                </p>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                If you didn't create an account with Nivasesa, you can safely ignore this email.
              </p>
            </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return false
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  // If no Resend API key, log to console (development mode)
  if (!RESEND_API_KEY) {
    console.log('\n=== PASSWORD RESET ===')
    console.log(`To: ${email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('======================\n')
    return true
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your password - Nivasesa',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin-top: 0;">Reset Your Password</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}"
                     style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 14px; color: #666;">
                  Or copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
                </p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  This link will expire in 24 hours.
                </p>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
            </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return false
  }
}
