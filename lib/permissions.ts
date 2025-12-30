import { auth } from '@/auth'

export type Role = 'BUYER' | 'REALTOR' | 'ADMIN'

export type Permission =
  | 'view:leads'
  | 'unlock:leads'
  | 'manage:profile'
  | 'verify:realtors'
  | 'manage:users'
  | 'view:analytics'
  | 'manage:payments'
  | 'create:leads'

// Role-based permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
  BUYER: [
    'create:leads',
    'manage:profile',
  ],
  REALTOR: [
    'view:leads',
    'unlock:leads',
    'manage:profile',
    'view:analytics',
  ],
  ADMIN: [
    'view:leads',
    'unlock:leads',
    'manage:profile',
    'verify:realtors',
    'manage:users',
    'view:analytics',
    'manage:payments',
    'create:leads',
  ],
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

/**
 * Get current user session and role
 */
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as Role,
  }
}

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return roleHasPermission(user.role, permission)
}

/**
 * Require permission or throw error
 */
export async function requirePermission(permission: Permission): Promise<void> {
  const allowed = await hasPermission(permission)
  if (!allowed) {
    throw new Error(`Permission denied: ${permission}`)
  }
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === role
}

/**
 * Require role or throw error
 */
export async function requireRole(role: Role): Promise<void> {
  const user = await getCurrentUser()
  if (!user || user.role !== role) {
    throw new Error(`Access denied: ${role} role required`)
  }
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

/**
 * Require authentication or throw error
 */
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Authentication required')
  }
}
