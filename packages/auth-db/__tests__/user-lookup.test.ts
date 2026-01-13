import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getUserById,
  getUsersByIds,
  userExists,
  validateUserIds,
  getUserByEmail,
  getSafeUserInfo,
  getSafeUserInfos,
  clearUserCache,
} from '../src/user-lookup';
import { authPrisma } from '../src/client';

describe('User Lookup Utilities', () => {
  beforeEach(async () => {
    // Clear cache before each test
    clearUserCache();

    // Clean up test data
    await authPrisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'test-',
        },
      },
    });
  });

  afterEach(async () => {
    clearUserCache();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const testUser = await authPrisma.user.create({
        data: {
          email: 'test-user1@example.com',
          name: 'Test User 1',
          role: 'BUYER',
        },
      });

      const user = await getUserById(testUser.id);
      expect(user).not.toBeNull();
      expect(user?.id).toBe(testUser.id);
      expect(user?.email).toBe('test-user1@example.com');
    });

    it('should return null when user not found', async () => {
      const user = await getUserById('nonexistent-id');
      expect(user).toBeNull();
    });

    it('should cache user lookups', async () => {
      const testUser = await authPrisma.user.create({
        data: {
          email: 'test-cache@example.com',
          name: 'Cache Test',
          role: 'BUYER',
        },
      });

      // First call - should query database
      const user1 = await getUserById(testUser.id);
      expect(user1).not.toBeNull();

      // Second call - should use cache
      const user2 = await getUserById(testUser.id);
      expect(user2).not.toBeNull();
      expect(user2?.id).toBe(user1?.id);
    });

    it('should skip cache when requested', async () => {
      const testUser = await authPrisma.user.create({
        data: {
          email: 'test-skip-cache@example.com',
          name: 'Skip Cache Test',
          role: 'BUYER',
        },
      });

      await getUserById(testUser.id);

      // Update user in database
      await authPrisma.user.update({
        where: { id: testUser.id },
        data: { name: 'Updated Name' },
      });

      // With cache - old name
      const cachedUser = await getUserById(testUser.id);
      expect(cachedUser?.name).toBe('Skip Cache Test');

      // Skip cache - new name
      const freshUser = await getUserById(testUser.id, { skipCache: true });
      expect(freshUser?.name).toBe('Updated Name');
    });
  });

  describe('getUsersByIds', () => {
    it('should return multiple users', async () => {
      const users = await Promise.all([
        authPrisma.user.create({
          data: { email: 'test-batch1@example.com', name: 'User 1', role: 'BUYER' },
        }),
        authPrisma.user.create({
          data: { email: 'test-batch2@example.com', name: 'User 2', role: 'REALTOR' },
        }),
        authPrisma.user.create({
          data: { email: 'test-batch3@example.com', name: 'User 3', role: 'BUYER' },
        }),
      ]);

      const userIds = users.map((u) => u.id);
      const result = await getUsersByIds(userIds);

      expect(result.size).toBe(3);
      expect(result.get(users[0].id)?.email).toBe('test-batch1@example.com');
      expect(result.get(users[1].id)?.email).toBe('test-batch2@example.com');
      expect(result.get(users[2].id)?.email).toBe('test-batch3@example.com');
    });

    it('should handle empty array', async () => {
      const result = await getUsersByIds([]);
      expect(result.size).toBe(0);
    });

    it('should skip non-existent users', async () => {
      const testUser = await authPrisma.user.create({
        data: { email: 'test-exists@example.com', name: 'Exists', role: 'BUYER' },
      });

      const result = await getUsersByIds([testUser.id, 'nonexistent-id']);

      expect(result.size).toBe(1);
      expect(result.get(testUser.id)).not.toBeUndefined();
      expect(result.get('nonexistent-id')).toBeUndefined();
    });

    it('should cache batch lookups', async () => {
      const users = await Promise.all([
        authPrisma.user.create({
          data: { email: 'test-cache1@example.com', name: 'Cache 1', role: 'BUYER' },
        }),
        authPrisma.user.create({
          data: { email: 'test-cache2@example.com', name: 'Cache 2', role: 'BUYER' },
        }),
      ]);

      const userIds = users.map((u) => u.id);

      // First call
      await getUsersByIds(userIds);

      // Second call should use cache
      const result = await getUsersByIds(userIds);
      expect(result.size).toBe(2);
    });
  });

  describe('userExists', () => {
    it('should return true for existing user', async () => {
      const testUser = await authPrisma.user.create({
        data: { email: 'test-exists@example.com', name: 'Exists', role: 'BUYER' },
      });

      const exists = await userExists(testUser.id);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent user', async () => {
      const exists = await userExists('nonexistent-id');
      expect(exists).toBe(false);
    });

    it('should return false for empty string', async () => {
      const exists = await userExists('');
      expect(exists).toBe(false);
    });
  });

  describe('validateUserIds', () => {
    it('should separate valid and invalid IDs', async () => {
      const validUser = await authPrisma.user.create({
        data: { email: 'test-valid@example.com', name: 'Valid', role: 'BUYER' },
      });

      const { validIds, invalidIds } = await validateUserIds([
        validUser.id,
        'invalid-id-1',
        'invalid-id-2',
      ]);

      expect(validIds).toEqual([validUser.id]);
      expect(invalidIds).toEqual(['invalid-id-1', 'invalid-id-2']);
    });

    it('should handle empty array', async () => {
      const { validIds, invalidIds } = await validateUserIds([]);
      expect(validIds).toEqual([]);
      expect(invalidIds).toEqual([]);
    });

    it('should handle all valid IDs', async () => {
      const users = await Promise.all([
        authPrisma.user.create({
          data: { email: 'test-valid1@example.com', name: 'Valid 1', role: 'BUYER' },
        }),
        authPrisma.user.create({
          data: { email: 'test-valid2@example.com', name: 'Valid 2', role: 'BUYER' },
        }),
      ]);

      const { validIds, invalidIds } = await validateUserIds(users.map((u) => u.id));

      expect(validIds.length).toBe(2);
      expect(invalidIds.length).toBe(0);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      await authPrisma.user.create({
        data: { email: 'test-email@example.com', name: 'Email Test', role: 'BUYER' },
      });

      const user = await getUserByEmail('test-email@example.com');
      expect(user).not.toBeNull();
      expect(user?.email).toBe('test-email@example.com');
    });

    it('should be case insensitive', async () => {
      await authPrisma.user.create({
        data: { email: 'test-case@example.com', name: 'Case Test', role: 'BUYER' },
      });

      const user = await getUserByEmail('TEST-CASE@EXAMPLE.COM');
      expect(user).not.toBeNull();
      expect(user?.email).toBe('test-case@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });

    it('should cache user by ID after email lookup', async () => {
      const testUser = await authPrisma.user.create({
        data: { email: 'test-cache-email@example.com', name: 'Cache Email', role: 'BUYER' },
      });

      await getUserByEmail('test-cache-email@example.com');

      // Should be cached by ID now
      const cachedUser = await getUserById(testUser.id);
      expect(cachedUser).not.toBeNull();
    });
  });

  describe('getSafeUserInfo', () => {
    it('should return only safe fields', async () => {
      const testUser = await authPrisma.user.create({
        data: {
          email: 'test-safe@example.com',
          name: 'Safe Test',
          password: 'secret-password',
          role: 'BUYER',
          image: 'https://example.com/avatar.jpg',
        },
      });

      const safeInfo = await getSafeUserInfo(testUser.id);

      expect(safeInfo).not.toBeNull();
      expect(safeInfo).toHaveProperty('id');
      expect(safeInfo).toHaveProperty('name');
      expect(safeInfo).toHaveProperty('email');
      expect(safeInfo).toHaveProperty('image');
      expect(safeInfo).toHaveProperty('role');
      expect(safeInfo).not.toHaveProperty('password');
      expect(safeInfo).not.toHaveProperty('twoFactorSecret');
    });

    it('should return null for non-existent user', async () => {
      const safeInfo = await getSafeUserInfo('nonexistent-id');
      expect(safeInfo).toBeNull();
    });
  });

  describe('getSafeUserInfos', () => {
    it('should return safe info for multiple users', async () => {
      const users = await Promise.all([
        authPrisma.user.create({
          data: { email: 'test-safe1@example.com', name: 'Safe 1', role: 'BUYER', password: 'secret1' },
        }),
        authPrisma.user.create({
          data: { email: 'test-safe2@example.com', name: 'Safe 2', role: 'REALTOR', password: 'secret2' },
        }),
      ]);

      const result = await getSafeUserInfos(users.map((u) => u.id));

      expect(result.size).toBe(2);

      const safe1 = result.get(users[0].id);
      expect(safe1).not.toBeUndefined();
      expect(safe1).not.toHaveProperty('password');
      expect(safe1?.name).toBe('Safe 1');

      const safe2 = result.get(users[1].id);
      expect(safe2).not.toBeUndefined();
      expect(safe2).not.toHaveProperty('password');
      expect(safe2?.role).toBe('REALTOR');
    });
  });

  describe('clearUserCache', () => {
    it('should clear the cache', async () => {
      const testUser = await authPrisma.user.create({
        data: { email: 'test-clear@example.com', name: 'Clear Test', role: 'BUYER' },
      });

      // Populate cache
      await getUserById(testUser.id);

      // Update user
      await authPrisma.user.update({
        where: { id: testUser.id },
        data: { name: 'Updated After Clear' },
      });

      // Should still be cached
      let user = await getUserById(testUser.id);
      expect(user?.name).toBe('Clear Test');

      // Clear cache
      clearUserCache();

      // Should fetch fresh data
      user = await getUserById(testUser.id);
      expect(user?.name).toBe('Updated After Clear');
    });
  });
});
