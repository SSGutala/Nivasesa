import * as OTPAuth from 'otpauth'
import * as QRCode from 'qrcode'
import * as crypto from 'crypto'

const APP_NAME = 'Nivasesa'

/**
 * Generate a new TOTP secret
 */
export function generateTOTPSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 })
  return secret.base32
}

/**
 * Create a TOTP instance
 */
function createTOTP(secret: string, email: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: APP_NAME,
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
}

/**
 * Generate OTP auth URL for QR code
 */
export function generateOTPAuthURL(secret: string, email: string): string {
  const totp = createTOTP(secret, email)
  return totp.toString()
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(secret: string, email: string): Promise<string> {
  const otpAuthUrl = generateOTPAuthURL(secret, email)
  return QRCode.toDataURL(otpAuthUrl)
}

/**
 * Verify a TOTP code
 */
export function verifyTOTP(secret: string, email: string, token: string): boolean {
  const totp = createTOTP(secret, email)
  // Allow 1 period window (30 seconds before/after)
  const delta = totp.validate({ token, window: 1 })
  return delta !== null
}

/**
 * Encrypt secret for storage (simple encryption for demo)
 * In production, use a proper KMS or hardware security module
 */
export function encryptSecret(secret: string): string {
  const key = process.env.TWO_FACTOR_ENCRYPTION_KEY || 'default-key-change-in-production-32'
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32).slice(0, 32)), iv)
  let encrypted = cipher.update(secret, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

/**
 * Decrypt secret from storage
 */
export function decryptSecret(encryptedSecret: string): string {
  const key = process.env.TWO_FACTOR_ENCRYPTION_KEY || 'default-key-change-in-production-32'
  const [ivHex, encrypted] = encryptedSecret.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.padEnd(32).slice(0, 32)), iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}
