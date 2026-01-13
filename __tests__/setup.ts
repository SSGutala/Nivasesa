import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Next.js headers
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => new Map(),
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

vi.mock('@/auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { id: 'test-user', email: 'test@example.com' } })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    lead: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    transaction: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    unlockedLead: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    realtorProfile: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

// Global test utilities
global.fetch = vi.fn()
global.alert = vi.fn()
global.confirm = vi.fn(() => true)
