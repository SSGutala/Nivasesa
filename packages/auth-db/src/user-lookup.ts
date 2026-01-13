import { authPrisma } from './client';
import type { User } from './generated/prisma/index.js';

/**
 * User lookup utilities for cross-database user references.
 *
 * This module provides safe, cached access to user data from the auth database
 * for applications that reference users by ID but don't have direct access to
 * the User model in their own database.
 */

// Simple in-memory cache with TTL
interface CacheEntry {
  user: User | null;
  timestamp: number;
}

const userCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Clear the user cache (useful for testing or manual cache invalidation)
 */
export function clearUserCache(): void {
  userCache.clear();
}

/**
 * Get a single user by ID with caching
 *
 * @param userId - The user ID to look up
 * @param options.skipCache - If true, bypass cache and fetch fresh data
 * @returns User object or null if not found
 *
 * @example
 * ```ts
 * const user = await getUserById('clx123abc');
 * if (user) {
 *   console.log(user.email, user.name);
 * }
 * ```
 */
export async function getUserById(
  userId: string,
  options: { skipCache?: boolean } = {}
): Promise<User | null> {
  if (!userId) return null;

  // Check cache first
  if (!options.skipCache) {
    const cached = userCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.user;
    }
  }

  // Fetch from database
  try {
    const user = await authPrisma.user.findUnique({
      where: { id: userId },
    });

    // Update cache
    userCache.set(userId, {
      user,
      timestamp: Date.now(),
    });

    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

/**
 * Get multiple users by IDs with caching (batch lookup)
 *
 * @param userIds - Array of user IDs to look up
 * @param options.skipCache - If true, bypass cache and fetch fresh data
 * @returns Map of userId to User object (missing users are not included)
 *
 * @example
 * ```ts
 * const users = await getUsersByIds(['id1', 'id2', 'id3']);
 * users.forEach((user, id) => {
 *   console.log(id, user.name);
 * });
 * ```
 */
export async function getUsersByIds(
  userIds: string[],
  options: { skipCache?: boolean } = {}
): Promise<Map<string, User>> {
  if (!userIds.length) return new Map();

  const result = new Map<string, User>();
  const idsToFetch: string[] = [];

  // Check cache for each ID
  for (const id of userIds) {
    if (!id) continue;

    if (!options.skipCache) {
      const cached = userCache.get(id);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (cached.user) {
          result.set(id, cached.user);
        }
        continue;
      }
    }

    idsToFetch.push(id);
  }

  // Fetch remaining IDs from database
  if (idsToFetch.length > 0) {
    try {
      const users = await authPrisma.user.findMany({
        where: {
          id: {
            in: idsToFetch,
          },
        },
      });

      // Add to result and cache
      for (const user of users) {
        result.set(user.id, user);
        userCache.set(user.id, {
          user,
          timestamp: Date.now(),
        });
      }

      // Cache null results for IDs not found
      for (const id of idsToFetch) {
        if (!result.has(id)) {
          userCache.set(id, {
            user: null,
            timestamp: Date.now(),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching users by IDs:', error);
    }
  }

  return result;
}

/**
 * Check if a user exists by ID
 *
 * @param userId - The user ID to check
 * @returns true if user exists, false otherwise
 *
 * @example
 * ```ts
 * if (await userExists('clx123abc')) {
 *   // Proceed with operation
 * }
 * ```
 */
export async function userExists(userId: string): Promise<boolean> {
  if (!userId) return false;
  const user = await getUserById(userId);
  return user !== null;
}

/**
 * Validate that all provided user IDs exist
 *
 * @param userIds - Array of user IDs to validate
 * @returns Object with valid IDs and invalid IDs
 *
 * @example
 * ```ts
 * const { validIds, invalidIds } = await validateUserIds(['id1', 'id2', 'id3']);
 * if (invalidIds.length > 0) {
 *   throw new Error(`Invalid users: ${invalidIds.join(', ')}`);
 * }
 * ```
 */
export async function validateUserIds(
  userIds: string[]
): Promise<{ validIds: string[]; invalidIds: string[] }> {
  if (!userIds.length) {
    return { validIds: [], invalidIds: [] };
  }

  const users = await getUsersByIds(userIds);
  const validIds: string[] = [];
  const invalidIds: string[] = [];

  for (const id of userIds) {
    if (users.has(id)) {
      validIds.push(id);
    } else {
      invalidIds.push(id);
    }
  }

  return { validIds, invalidIds };
}

/**
 * Get user by email address
 *
 * @param email - The email address to look up
 * @returns User object or null if not found
 *
 * @example
 * ```ts
 * const user = await getUserByEmail('user@example.com');
 * if (user) {
 *   console.log(user.id, user.name);
 * }
 * ```
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email) return null;

  try {
    const user = await authPrisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Cache the result
    if (user) {
      userCache.set(user.id, {
        user,
        timestamp: Date.now(),
      });
    }

    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

/**
 * Get basic user info (safe for client-side display)
 * Returns only non-sensitive fields
 *
 * @param userId - The user ID to look up
 * @returns Safe user info or null if not found
 *
 * @example
 * ```ts
 * const userInfo = await getSafeUserInfo('clx123abc');
 * if (userInfo) {
 *   console.log(userInfo.name, userInfo.email);
 * }
 * ```
 */
export async function getSafeUserInfo(userId: string): Promise<{
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
} | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}

/**
 * Get multiple safe user infos (batch lookup)
 *
 * @param userIds - Array of user IDs to look up
 * @returns Map of userId to safe user info
 *
 * @example
 * ```ts
 * const usersInfo = await getSafeUserInfos(['id1', 'id2', 'id3']);
 * usersInfo.forEach((info, id) => {
 *   console.log(id, info.name);
 * });
 * ```
 */
export async function getSafeUserInfos(userIds: string[]): Promise<
  Map<
    string,
    {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      role: string;
    }
  >
> {
  const users = await getUsersByIds(userIds);
  const result = new Map();

  users.forEach((user, id) => {
    result.set(id, {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    });
  });

  return result;
}
