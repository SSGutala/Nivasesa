export type Permission =
  | 'view:dashboard'
  | 'manage:listings'
  | 'manage:leads'
  | 'unlock:leads'
  | 'manage:wallet'
  | 'admin:users'
  | 'admin:settings';

export type Role = 'USER' | 'ADMIN';

const rolePermissions: Record<Role, Permission[]> = {
  USER: ['view:dashboard', 'manage:listings', 'manage:leads', 'unlock:leads', 'manage:wallet'],
  ADMIN: [
    'view:dashboard',
    'manage:listings',
    'manage:leads',
    'unlock:leads',
    'manage:wallet',
    'admin:users',
    'admin:settings',
  ],
};

export function hasPermission(role: Role | string, permission: Permission): boolean {
  const normalizedRole = (role?.toUpperCase() ?? 'USER') as Role;
  const permissions = rolePermissions[normalizedRole] ?? rolePermissions.USER;
  return permissions.includes(permission);
}

export function getPermissions(role: Role | string): Permission[] {
  const normalizedRole = (role?.toUpperCase() ?? 'USER') as Role;
  return rolePermissions[normalizedRole] ?? rolePermissions.USER;
}
