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

// =============================================================================
// NOTIFICATION EMAILS
// =============================================================================

interface BookingEmailData {
  id: string
  guestName: string
  guestEmail: string
  hostName: string
  hostEmail: string
  listingTitle: string
  checkIn: Date
  checkOut: Date
  totalPrice: number
  status: string
}

interface MessageEmailData {
  senderName: string
  recipientEmail: string
  messagePreview: string
  conversationUrl: string
}

interface ReviewEmailData {
  reviewerName: string
  revieweeEmail: string
  rating: number
  comment?: string
  reviewUrl: string
}

/**
 * Send booking confirmation email to guest
 */
export async function sendBookingConfirmationEmail(
  booking: BookingEmailData
): Promise<boolean> {
  const bookingUrl = `${APP_URL}/dashboard/bookings/${booking.id}`

  // If no Resend API key, log to console (development mode)
  if (!RESEND_API_KEY) {
    console.log('\n=== BOOKING CONFIRMATION ===')
    console.log(`To: ${booking.guestEmail}`)
    console.log(`Booking ID: ${booking.id}`)
    console.log(`Listing: ${booking.listingTitle}`)
    console.log(`Check-in: ${booking.checkIn.toLocaleDateString()}`)
    console.log(`Check-out: ${booking.checkOut.toLocaleDateString()}`)
    console.log('============================\n')
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
        to: booking.guestEmail,
        subject: `Booking Confirmed - ${booking.listingTitle}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin-top: 0;">Booking Confirmed!</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Great news! Your booking has been confirmed.
                </p>
                <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h2 style="margin-top: 0; font-size: 18px; color: #2c3e50;">${booking.listingTitle}</h2>
                  <p style="margin: 10px 0;"><strong>Host:</strong> ${booking.hostName}</p>
                  <p style="margin: 10px 0;"><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</p>
                  <p style="margin: 10px 0;"><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</p>
                  <p style="margin: 10px 0;"><strong>Total:</strong> $${(booking.totalPrice / 100).toFixed(2)}</p>
                  <p style="margin: 10px 0;"><strong>Status:</strong> ${booking.status}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${bookingUrl}"
                     style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    View Booking Details
                  </a>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  If you have any questions, you can message ${booking.hostName} directly through the Nivasesa platform.
                </p>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated email from Nivasesa. Please do not reply directly to this email.
              </p>
            </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
    return false
  }
}

/**
 * Send new message notification email
 */
export async function sendNewMessageEmail(
  message: MessageEmailData
): Promise<boolean> {
  // If no Resend API key, log to console (development mode)
  if (!RESEND_API_KEY) {
    console.log('\n=== NEW MESSAGE ===')
    console.log(`To: ${message.recipientEmail}`)
    console.log(`From: ${message.senderName}`)
    console.log(`Preview: ${message.messagePreview}`)
    console.log('===================\n')
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
        to: message.recipientEmail,
        subject: `New message from ${message.senderName} - Nivasesa`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin-top: 0;">New Message</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  You have a new message from <strong>${message.senderName}</strong>:
                </p>
                <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
                  <p style="margin: 0; font-style: italic;">${message.messagePreview}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${message.conversationUrl}"
                     style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    View Message
                  </a>
                </div>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated email from Nivasesa. Please do not reply directly to this email.
              </p>
            </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send new message email:', error)
    return false
  }
}

/**
 * Send review received notification email
 */
export async function sendReviewReceivedEmail(
  review: ReviewEmailData
): Promise<boolean> {
  // If no Resend API key, log to console (development mode)
  if (!RESEND_API_KEY) {
    console.log('\n=== NEW REVIEW ===')
    console.log(`To: ${review.revieweeEmail}`)
    console.log(`From: ${review.reviewerName}`)
    console.log(`Rating: ${review.rating}/5 stars`)
    console.log('==================\n')
    return true
  }

  try {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: review.revieweeEmail,
        subject: `New review from ${review.reviewerName} - Nivasesa`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin-top: 0;">You've Received a Review!</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  <strong>${review.reviewerName}</strong> has left you a review:
                </p>
                <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <div style="font-size: 24px; color: #FFD700; margin-bottom: 10px;">${stars}</div>
                  <p style="font-size: 18px; margin: 0;"><strong>${review.rating}/5 stars</strong></p>
                  ${review.comment ? `<p style="margin: 15px 0 0 0; font-style: italic;">"${review.comment}"</p>` : ''}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${review.reviewUrl}"
                     style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    View Review
                  </a>
                </div>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated email from Nivasesa. Please do not reply directly to this email.
              </p>
            </body>
          </html>
        `,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send review received email:', error)
    return false
  }
}
