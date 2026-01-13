/**
 * Email templates for authentication flows
 * Returns { subject, html, text } for each template
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Email verification template
 * @param email - User's email address
 * @param token - Verification token
 * @param baseUrl - Application base URL (e.g., https://example.com)
 */
export function verificationEmail(
  email: string,
  token: string,
  baseUrl: string
): EmailTemplate {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  return {
    subject: 'Verify your email address',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
    .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    .code { background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #212529;">Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6c757d;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>This email was sent to ${email}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
    text: `
Verify Your Email

Hello,

Thank you for signing up! Please verify your email address by visiting:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

This email was sent to ${email}
    `.trim(),
  };
}

/**
 * Password reset template
 * @param email - User's email address
 * @param token - Reset token
 * @param baseUrl - Application base URL (e.g., https://example.com)
 */
export function passwordResetEmail(
  email: string,
  token: string,
  baseUrl: string
): EmailTemplate {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  return {
    subject: 'Reset your password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
    .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #212529;">Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6c757d;">${resetUrl}</p>
      <div class="warning">
        <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and ensure your account is secure.
      </div>
      <p>If you continue to receive password reset emails that you didn't request, please contact support.</p>
    </div>
    <div class="footer">
      <p>This email was sent to ${email}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
    text: `
Reset Your Password

Hello,

We received a request to reset your password. Click the link below to choose a new password:

${resetUrl}

SECURITY NOTICE: This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and ensure your account is secure.

If you continue to receive password reset emails that you didn't request, please contact support.

This email was sent to ${email}
    `.trim(),
  };
}

/**
 * Welcome email template
 * @param email - User's email address
 * @param name - User's name
 */
export function welcomeEmail(email: string, name: string): EmailTemplate {
  return {
    subject: 'Welcome! Your account is ready',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #28a745; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; color: #ffffff; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    .features { list-style: none; padding: 0; }
    .features li { padding: 8px 0; }
    .features li:before { content: "✓ "; color: #28a745; font-weight: bold; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Welcome Aboard!</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>
      <p>Welcome! Your account has been successfully verified and you're all set to get started.</p>
      <p>Here's what you can do now:</p>
      <ul class="features">
        <li>Complete your profile</li>
        <li>Customize your preferences</li>
        <li>Explore available features</li>
        <li>Connect with others</li>
      </ul>
      <p>If you have any questions or need assistance, our support team is here to help.</p>
      <p>Thank you for joining us!</p>
      <p style="margin-top: 30px;">Best regards,<br>The Team</p>
    </div>
    <div class="footer">
      <p>This email was sent to ${email}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
    text: `
Welcome Aboard!

Hello ${name},

Welcome! Your account has been successfully verified and you're all set to get started.

Here's what you can do now:
✓ Complete your profile
✓ Customize your preferences
✓ Explore available features
✓ Connect with others

If you have any questions or need assistance, our support team is here to help.

Thank you for joining us!

Best regards,
The Team

This email was sent to ${email}
    `.trim(),
  };
}

/**
 * Two-factor authentication code template
 * @param email - User's email address
 * @param code - 6-digit verification code
 */
export function twoFactorEmail(email: string, code: string): EmailTemplate {
  return {
    subject: 'Your verification code',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
    .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 14px; }
    .code-box { background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; font-family: monospace; }
    .warning { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #212529;">Verification Code</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You requested a verification code to sign in. Enter the code below:</p>
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      <p style="text-align: center; color: #6c757d; font-size: 14px;">This code expires in 10 minutes</p>
      <div class="warning">
        <strong>Security Notice:</strong> If you didn't request this code, someone may be trying to access your account. Please secure your account immediately.
      </div>
      <p>Never share this code with anyone, including support staff.</p>
    </div>
    <div class="footer">
      <p>This email was sent to ${email}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
    text: `
Verification Code

Hello,

You requested a verification code to sign in. Enter the code below:

${code}

This code expires in 10 minutes.

SECURITY NOTICE: If you didn't request this code, someone may be trying to access your account. Please secure your account immediately.

Never share this code with anyone, including support staff.

This email was sent to ${email}
    `.trim(),
  };
}
