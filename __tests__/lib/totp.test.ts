import { describe, it, expect, vi } from 'vitest'

// Mock the crypto and otpauth modules
vi.mock('otpauth', () => ({
  Secret: class MockSecret {
    base32 = 'TESTSECRET123456'
    static fromBase32(secret: string) {
      return { base32: secret }
    }
  },
  TOTP: class MockTOTP {
    constructor(public config: any) {}
    toString() {
      return `otpauth://totp/${this.config.issuer}:${this.config.label}?secret=${this.config.secret.base32}&issuer=${this.config.issuer}`
    }
    validate({ token }: { token: string }) {
      // Return 0 (valid) for '123456', null otherwise
      return token === '123456' ? 0 : null
    }
  },
}))

vi.mock('qrcode', () => ({
  toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,testqrcode')),
}))

// Import after mocking
import { generateTOTPSecret, generateOTPAuthURL, generateQRCode, verifyTOTP, generateBackupCodes } from '@/lib/totp'

describe('TOTP utilities', () => {
  describe('generateTOTPSecret', () => {
    it('should generate a base32 secret', () => {
      const secret = generateTOTPSecret()
      expect(secret).toBeDefined()
      expect(typeof secret).toBe('string')
    })
  })

  describe('generateOTPAuthURL', () => {
    it('should generate a valid OTP auth URL', () => {
      const url = generateOTPAuthURL('TESTSECRET', 'test@example.com')
      expect(url).toContain('otpauth://totp/')
      expect(url).toContain('test@example.com')
      expect(url).toContain('Nivasesa')
    })
  })

  describe('generateQRCode', () => {
    it('should generate a data URL for QR code', async () => {
      const qrCode = await generateQRCode('TESTSECRET', 'test@example.com')
      expect(qrCode).toContain('data:image/png')
    })
  })

  describe('verifyTOTP', () => {
    it('should return true for valid token', () => {
      const result = verifyTOTP('TESTSECRET', 'test@example.com', '123456')
      expect(result).toBe(true)
    })

    it('should return false for invalid token', () => {
      const result = verifyTOTP('TESTSECRET', 'test@example.com', '000000')
      expect(result).toBe(false)
    })
  })

  describe('generateBackupCodes', () => {
    it('should generate specified number of backup codes', () => {
      const codes = generateBackupCodes(8)
      expect(codes).toHaveLength(8)
    })

    it('should generate codes in correct format (XXXX-XXXX)', () => {
      const codes = generateBackupCodes(1)
      expect(codes[0]).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/)
    })

    it('should generate unique codes', () => {
      const codes = generateBackupCodes(10)
      const uniqueCodes = new Set(codes)
      expect(uniqueCodes.size).toBe(10)
    })
  })
})
