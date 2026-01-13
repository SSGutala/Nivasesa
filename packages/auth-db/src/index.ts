// Re-export Prisma client and types
export { authPrisma, default } from './client';
export * from './generated/prisma/index.js';

// Re-export user lookup utilities
export {
  getUserById,
  getUsersByIds,
  userExists,
  validateUserIds,
  getUserByEmail,
  getSafeUserInfo,
  getSafeUserInfos,
  clearUserCache,
} from './user-lookup';
