export { authConfig } from './config';
export { createAuthMiddleware } from './middleware';
export { hasPermission, getPermissions } from './permissions';
export type { Permission, Role } from './permissions';
export { generateTOTP, verifyTOTP } from './totp';
export {
  verificationEmail,
  passwordResetEmail,
  welcomeEmail,
  twoFactorEmail,
} from './email-templates';
export { sendEmail, sendTemplateEmail } from './send-email';
