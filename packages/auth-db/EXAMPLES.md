# User Lookup Examples

This file contains real-world examples of using the cross-database user lookup utilities.

## Basic Usage

### Single User Lookup

```typescript
import { getUserById, getSafeUserInfo } from '@niv/auth-db';

// Full user object (server-side only, has password/secrets)
async function getFullUserData(userId: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user; // Has all fields including password
}

// Safe user info (safe for client-side, no secrets)
async function getSafeUserData(userId: string) {
  const safeInfo = await getSafeUserInfo(userId);
  if (!safeInfo) {
    throw new Error('User not found');
  }
  return safeInfo; // Only: id, name, email, image, role
}
```

### Email Lookup

```typescript
import { getUserByEmail } from '@niv/auth-db';

async function loginUser(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return { error: 'Invalid credentials' };
  }
  // Verify password, create session, etc.
  return { success: true };
}
```

### User Validation

```typescript
import { userExists, validateUserIds } from '@niv/auth-db';

// Check single user
async function canCreateBooking(userId: string) {
  if (!await userExists(userId)) {
    throw new Error('User does not exist');
  }
  // Proceed with booking creation
}

// Validate multiple users
async function validateGroupMembers(memberIds: string[]) {
  const { validIds, invalidIds } = await validateUserIds(memberIds);

  if (invalidIds.length > 0) {
    throw new Error(`Invalid users: ${invalidIds.join(', ')}`);
  }

  return validIds;
}
```

## Batch Operations (Efficient!)

### Enrich List with User Data

```typescript
import { getSafeUserInfos } from '@niv/auth-db';

// BAD: N+1 query problem
async function getListingsBad(listings: Array<{ ownerId: string }>) {
  const enriched = [];
  for (const listing of listings) {
    const owner = await getUserById(listing.ownerId); // ❌ 1 query per listing
    enriched.push({ ...listing, owner });
  }
  return enriched;
}

// GOOD: Single batch query
async function getListingsGood(listings: Array<{ ownerId: string }>) {
  // Extract unique owner IDs
  const ownerIds = [...new Set(listings.map(l => l.ownerId))];

  // Single batch query ✅
  const owners = await getSafeUserInfos(ownerIds);

  // Enrich listings
  return listings.map(listing => ({
    ...listing,
    owner: owners.get(listing.ownerId) || null,
  }));
}
```

### Parallel Lookups

```typescript
import { getSafeUserInfo } from '@niv/auth-db';

async function getConversationData(
  participant1Id: string,
  participant2Id: string
) {
  // Fetch both users in parallel ✅
  const [participant1, participant2] = await Promise.all([
    getSafeUserInfo(participant1Id),
    getSafeUserInfo(participant2Id),
  ]);

  return {
    participant1,
    participant2,
  };
}
```

## Real-World Patterns

### Pattern 1: API Response Enrichment

```typescript
import { getSafeUserInfos } from '@niv/auth-db';

type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
};

async function getCommentsWithAuthors(comments: Comment[]) {
  // Extract author IDs
  const authorIds = [...new Set(comments.map(c => c.authorId))];

  // Batch fetch authors
  const authors = await getSafeUserInfos(authorIds);

  // Enrich comments
  return comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: authors.get(comment.authorId) || {
      id: comment.authorId,
      name: 'Unknown User',
      email: '',
      image: null,
      role: 'BUYER',
    },
  }));
}
```

### Pattern 2: Server Action with Validation

```typescript
'use server';

import { getUserById } from '@niv/auth-db';
import { auth } from '@/auth';

export async function createBooking(data: {
  listingId: string;
  guestId: string;
  hostId: string;
}) {
  // 1. Verify current user
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  // 2. Validate guest and host exist (parallel)
  const [guest, host] = await Promise.all([
    getUserById(data.guestId),
    getUserById(data.hostId),
  ]);

  if (!guest) {
    return { error: 'Guest user not found' };
  }

  if (!host) {
    return { error: 'Host user not found' };
  }

  // 3. Verify session user is the guest
  if (session.user.id !== data.guestId) {
    return { error: 'You can only book as yourself' };
  }

  // 4. Create booking
  // ... booking creation logic

  return { success: true };
}
```

### Pattern 3: GraphQL Resolver

```typescript
import { getSafeUserInfo } from '@niv/auth-db';

const resolvers = {
  RoomListing: {
    owner: async (parent: { ownerId: string }) => {
      return await getSafeUserInfo(parent.ownerId);
    },
  },

  Conversation: {
    participants: async (parent: {
      participant1Id: string;
      participant2Id: string;
    }) => {
      const [p1, p2] = await Promise.all([
        getSafeUserInfo(parent.participant1Id),
        getSafeUserInfo(parent.participant2Id),
      ]);
      return [p1, p2].filter(Boolean);
    },
  },
};
```

### Pattern 4: Cache Management

```typescript
import { getUserById, clearUserCache } from '@niv/auth-db';

// Clear cache in tests
beforeEach(() => {
  clearUserCache();
});

// Force fresh data
async function getUserFresh(userId: string) {
  return await getUserById(userId, { skipCache: true });
}

// Or just clear cache
async function refreshUserData(userId: string) {
  clearUserCache();
  return await getUserById(userId);
}
```

### Pattern 5: Error Handling

```typescript
import { getUserById } from '@niv/auth-db';

async function getOwnerInfo(ownerId: string) {
  try {
    const owner = await getUserById(ownerId);

    if (!owner) {
      // User deleted or never existed
      return {
        id: ownerId,
        name: 'Deleted User',
        email: '',
        image: null,
        role: 'BUYER',
      };
    }

    return {
      id: owner.id,
      name: owner.name || 'Anonymous',
      email: owner.email,
      image: owner.image,
      role: owner.role,
    };
  } catch (error) {
    console.error('Failed to fetch owner:', error);
    // Return fallback
    return {
      id: ownerId,
      name: 'Unknown User',
      email: '',
      image: null,
      role: 'BUYER',
    };
  }
}
```

## Performance Tips

### 1. Always Use Batch Lookups for Lists

```typescript
// ❌ BAD: N+1 queries
for (const item of items) {
  item.user = await getUserById(item.userId);
}

// ✅ GOOD: 1 batch query
const userIds = items.map(i => i.userId);
const users = await getUsersByIds(userIds);
items.forEach(item => {
  item.user = users.get(item.userId);
});
```

### 2. Deduplicate IDs Before Batch Lookup

```typescript
// ✅ Remove duplicates
const uniqueIds = [...new Set(items.map(i => i.userId))];
const users = await getUsersByIds(uniqueIds);
```

### 3. Use Parallel Requests When Independent

```typescript
// ✅ Parallel
const [user, listing, reviews] = await Promise.all([
  getUserById(userId),
  getListingById(listingId),
  getReviews(userId),
]);

// ❌ Sequential (slower)
const user = await getUserById(userId);
const listing = await getListingById(listingId);
const reviews = await getReviews(userId);
```

### 4. Leverage the Cache

```typescript
// First call: queries DB
const user1 = await getUserById(userId);

// Within 5 minutes: uses cache (no DB query)
const user2 = await getUserById(userId);
const user3 = await getUserById(userId);
```

## Testing Examples

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { getUserById, clearUserCache } from '@niv/auth-db';
import { authPrisma } from '@niv/auth-db';

describe('User lookup tests', () => {
  beforeEach(() => {
    clearUserCache(); // Start each test with clean cache
  });

  it('should fetch user from auth database', async () => {
    const testUser = await authPrisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'BUYER',
      },
    });

    const user = await getUserById(testUser.id);

    expect(user).not.toBeNull();
    expect(user?.email).toBe('test@example.com');

    // Cleanup
    await authPrisma.user.delete({
      where: { id: testUser.id },
    });
  });
});
```

## Common Pitfalls

### Pitfall 1: Forgetting to Check Null

```typescript
// ❌ Will crash if user not found
const userName = (await getUserById(userId)).name;

// ✅ Proper null handling
const user = await getUserById(userId);
const userName = user?.name || 'Unknown';
```

### Pitfall 2: Using Full User on Client

```typescript
// ❌ Exposes password/secrets
export async function getServerSideProps() {
  const user = await getUserById(userId);
  return { props: { user } }; // BAD!
}

// ✅ Use safe info
export async function getServerSideProps() {
  const user = await getSafeUserInfo(userId);
  return { props: { user } }; // Safe
}
```

### Pitfall 3: Not Validating Before Creation

```typescript
// ❌ Create without validation
await createBooking({
  guestId: 'invalid-id',
  hostId: 'another-invalid',
});

// ✅ Validate first
const { validIds, invalidIds } = await validateUserIds([
  guestId,
  hostId,
]);

if (invalidIds.length > 0) {
  throw new Error('Invalid users');
}

await createBooking({ guestId, hostId });
```

## Migration Examples

### Before: Direct Prisma (Wrong DB)

```typescript
import { prisma } from './lib/prisma';

// ❌ Queries rent-app DB (doesn't have User model)
const user = await prisma.user.findUnique({
  where: { email },
});
```

### After: Cross-DB Lookup

```typescript
import { getUserByEmail } from '@niv/auth-db';

// ✅ Queries auth DB (has User model)
const user = await getUserByEmail(email);
```

## Summary

Key principles:
1. Use batch lookups for lists
2. Use `getSafeUserInfo` for client-side
3. Validate users before DB operations
4. Leverage caching for performance
5. Handle null cases gracefully
