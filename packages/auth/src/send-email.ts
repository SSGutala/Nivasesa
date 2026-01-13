/**
 * Email sending utilities
 * Generic email send function with environment-based configuration
 */

/**
 * Send an email
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML email body
 * @param text - Plain text email body (fallback)
 * @returns Promise that resolves when email is sent
 *
 * @example
 * ```ts
 * import { sendEmail } from '@niv/auth/send-email';
 * import { verificationEmail } from '@niv/auth/email-templates';
 *
 * const template = verificationEmail('user@example.com', 'token123', 'https://example.com');
 * await sendEmail('user@example.com', template.subject, template.html, template.text);
 * ```
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<void> {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error('EMAIL_FROM environment variable is not set');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    throw new Error(`Invalid recipient email address: ${to}`);
  }

  // In development/test mode, log email instead of sending
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    console.log('='.repeat(80));
    console.log('EMAIL (Development Mode - Not Actually Sent)');
    console.log('='.repeat(80));
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(80));
    console.log('Plain Text:');
    console.log(text);
    console.log('='.repeat(80));
    return;
  }

  // Production email sending
  // This is a placeholder for actual email service integration
  // Integrations could include: Resend, SendGrid, AWS SES, Postmark, etc.

  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from, to, subject, html, text });

  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({ from, to, subject, html, text });

  // Example with AWS SES:
  // const ses = new AWS.SES({ region: process.env.AWS_REGION });
  // await ses.sendEmail({
  //   Source: from,
  //   Destination: { ToAddresses: [to] },
  //   Message: {
  //     Subject: { Data: subject },
  //     Body: {
  //       Html: { Data: html },
  //       Text: { Data: text }
  //     }
  //   }
  // }).promise();

  throw new Error(
    'Email service not configured. Set up an email provider in send-email.ts'
  );
}

/**
 * Send email with template
 * Helper function to send email using a template object
 * @param to - Recipient email address
 * @param template - Template object with subject, html, and text
 */
export async function sendTemplateEmail(
  to: string,
  template: { subject: string; html: string; text: string }
): Promise<void> {
  return sendEmail(to, template.subject, template.html, template.text);
}
