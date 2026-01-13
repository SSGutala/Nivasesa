# Cross-Database User Lookup

## Overview

Nivasesa uses a **multi-database architecture** with separate databases for different concerns:

1. **Auth Database** (`packages/auth-db`) - Canonical source of user data
2. **Rent App Database** (`apps/rent-app/prisma`) - Room listings, bookings, profiles
3. **Lead-Gen Database** (`apps/lead-gen/prisma`) - Realtor leads, matches

This separation provides:
- **Security**: Sensitive auth data isolated
- **Scalability**: Each database can scale independently
- **Data Ownership**: Clear boundaries between services

## The Problem

Apps like `rent-app` reference users by ID (e.g., `ownerId`, `guestId`, `userId`) but don't have the User model in their own database. They need to:

- Display user names and emails
- Validate users exist before creating records
- Enrich data with user information

## The Solution

The `@niv/auth-db` package provides **user lookup utilities** that:

1. Fetch user data from the auth database
2. Cache results to minimize database queries
3. Provide safe, typed interfaces
4. Support batch operations for efficiency

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Auth Database                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ User Model (Canonical)                               │  │
│  │ - id, email, name, password, role, balance, etc.     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                   Cross-Database Lookup
                   (@niv/auth-db/user-lookup)
                              │
          ┌───────────────────┴────────────────────┐
          │                                        │
          ▼                                        ▼
┌──────────────────────┐              ┌──────────────────────┐
│  Rent App Database   │              │ Lead-Gen Database    │
│  ┌────────────────┐  │              │  ┌────────────────┐  │
│  │ RoomListing    │  │              │  │ Lead           │  │
│  │ - ownerId      │  │              │  │ - userId       │  │
│  ├────────────────┤  │              │  ├────────────────┤  │
│  │ Booking        │  │              │  │ Match          │  │
│  │ - guestId      │  │              │  │ - realtorId    │  │
│  │ - hostId       │  │              │  └────────────────┘  │
│  ├────────────────┤  │              └──────────────────────┘
│  │ RoommateProfile│  │
│  │ - userId       │  │
│  └────────────────┘  │
└──────────────────────┘
```

## Installation

### In Apps (rent-app, lead-gen)

Add to `package.json`:

```json
{
  "dependencies": {
    "@niv/auth-db": "workspace:*"
  }
}
```

Then run:
```bash
pnpm install
```

## Usage

### Basic User Lookup

```typescript
import { getUserById, getSafeUserInfo } from '@niv/auth-db';

// Full user object (use server-side only)
const user = await getUserById('clx123abc');
if (user) {
  console.log(user.email, user.password); // Has sensitive fields
}

// Safe user info (safe for client-side)
const safeInfo = await getSafeUserInfo('clx123abc');
if (safeInfo) {
  console.log(safeInfo.email, safeInfo.name); // No password/secrets
}
```

### Batch Lookups (Efficient!)

**ALWAYS use batch lookups** when resolving multiple user IDs:

```typescript
import { getUsersByIds, getSafeUserInfos } from '@niv/auth-db';

// BAD: Multiple individual queries (N+1 problem)
for (const listing of listings) {
  listing.owner = await getUserById(listing.ownerId); // ❌ Slow!
}

// GOOD: Single batch query
const ownerIds = listings.map(l => l.ownerId);
const owners = await getSafeUserInfos(ownerIds); // ✅ Fast!
listings.forEach(listing => {
  listing.owner = owners.get(listing.ownerId);
});
```

### User Validation

```typescript
import { userExists, validateUserIds } from '@niv/auth-db';

// Check single user
if (await userExists(userId)) {
  // Proceed
}

// Validate multiple users
const { validIds, invalidIds } = await validateUserIds([
  'id1', 'id2', 'id3'
]);

if (invalidIds.length > 0) {
  throw new Error(`Invalid users: ${invalidIds.join(', ')}`);
}
```

### Email Lookup

```typescript
import { getUserByEmail } from '@niv/auth-db';

const user = await getUserByEmail('user@example.com');
if (user) {
  console.log(user.id, user.role);
}
```

## Real-World Examples

### Example 1: Enrich Room Listings

```typescript
import { getSafeUserInfos } from '@niv/auth-db';
import { prisma } from './prisma';

async function getRoomListingsWithOwners() {
  // 1. Fetch listings from rent-app database
  const listings = await prisma.roomListing.findMany({
    where: { status: 'AVAILABLE' },
    take: 20,
  });

  // 2. Extract owner IDs
  const ownerIds = [...new Set(listings.map(l => l.ownerId))];

  // 3. Batch fetch owner info from auth database
  const owners = await getSafeUserInfos(ownerIds);

  // 4. Enrich listings
  return listings.map(listing => ({
    ...listing,
    owner: owners.get(listing.ownerId) || null,
  }));
}
```

### Example 2: Conversation with Participants

```typescript
import { getSafeUserInfo, getSafeUserInfos } from '@niv/auth-db';
import { prisma } from './prisma';

async function getConversationWithParticipants(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: true },
  });

  if (!conversation) return null;

  // Get participants (parallel)
  const [participant1, participant2] = await Promise.all([
    getSafeUserInfo(conversation.participant1Id),
    getSafeUserInfo(conversation.participant2Id),
  ]);

  // Get message senders (batch)
  const senderIds = [...new Set(conversation.messages.map(m => m.senderId))];
  const senders = await getSafeUserInfos(senderIds);

  return {
    ...conversation,
    participant1,
    participant2,
    messages: conversation.messages.map(msg => ({
      ...msg,
      sender: senders.get(msg.senderId),
    })),
  };
}
```

### Example 3: Validate Before Creating

```typescript
import { getUserById } from '@niv/auth-db';
import { prisma } from './prisma';

async function createBooking(data: {
  listingId: string;
  guestId: string;
  hostId: string;
}) {
  // Validate users exist
  const [guest, host] = await Promise.all([
    getUserById(data.guestId),
    getUserById(data.hostId),
  ]);

  if (!guest) throw new Error('Guest not found');
  if (!host) throw new Error('Host not found');

  // Verify host owns listing
  const listing = await prisma.roomListing.findUnique({
    where: { id: data.listingId },
  });

  if (listing?.ownerId !== data.hostId) {
    throw new Error('Host does not own this listing');
  }

  // Create booking
  return await prisma.booking.create({ data });
}
```

## Caching

All lookup functions use **in-memory caching** with a 5-minute TTL:

- First lookup: Queries auth database
- Subsequent lookups: Returns cached result
- After 5 minutes: Cache expires, fresh query

### Cache Management

```typescript
import { clearUserCache } from '@niv/auth-db';

// Clear cache (useful in tests)
clearUserCache();

// Force fresh lookup
const user = await getUserById(userId, { skipCache: true });
```

## API Reference

### `getUserById(userId, options?)`

Get a single user by ID.

**Parameters:**
- `userId: string` - User ID to look up
- `options.skipCache?: boolean` - Bypass cache

**Returns:** `Promise<User | null>`

---

### `getUsersByIds(userIds, options?)`

Get multiple users by IDs (batch lookup).

**Parameters:**
- `userIds: string[]` - Array of user IDs
- `options.skipCache?: boolean` - Bypass cache

**Returns:** `Promise<Map<string, User>>`

---

### `getSafeUserInfo(userId)`

Get safe user info (no sensitive fields).

**Parameters:**
- `userId: string` - User ID to look up

**Returns:** `Promise<SafeUserInfo | null>`

```typescript
type SafeUserInfo = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
};
```

---

### `getSafeUserInfos(userIds)`

Get multiple safe user infos (batch lookup).

**Parameters:**
- `userIds: string[]` - Array of user IDs

**Returns:** `Promise<Map<string, SafeUserInfo>>`

---

### `userExists(userId)`

Check if a user exists.

**Parameters:**
- `userId: string` - User ID to check

**Returns:** `Promise<boolean>`

---

### `validateUserIds(userIds)`

Validate multiple user IDs.

**Parameters:**
- `userIds: string[]` - Array of user IDs to validate

**Returns:** `Promise<{ validIds: string[], invalidIds: string[] }>`

---

### `getUserByEmail(email)`

Get user by email address.

**Parameters:**
- `email: string` - Email address to look up

**Returns:** `Promise<User | null>`

---

### `clearUserCache()`

Clear the in-memory user cache.

**Returns:** `void`

## Best Practices

### ✅ DO

- Use batch lookups (`getUsersByIds`, `getSafeUserInfos`) for lists
- Use `getSafeUserInfo` for client-side data
- Validate users exist before creating records
- Use `Promise.all` for parallel lookups
- Cache results at the application level if needed

### ❌ DON'T

- Loop over items calling `getUserById` individually (N+1 problem)
- Expose full User objects to client-side (use `getSafeUserInfo`)
- Skip validation when creating records with user references
- Store user data in other databases (keep auth DB canonical)

## Troubleshooting

### "User not found" errors

Check that:
1. User ID is correct (not email or name)
2. User exists in auth database
3. AUTH_DATABASE_URL is configured correctly

### Slow queries

Are you using batch lookups? Replace loops with:

```typescript
// Before
for (const item of items) {
  item.user = await getUserById(item.userId); // ❌
}

// After
const userIds = items.map(i => i.userId);
const users = await getSafeUserInfos(userIds); // ✅
items.forEach(item => {
  item.user = users.get(item.userId);
});
```

### Cache issues

Clear the cache:

```typescript
import { clearUserCache } from '@niv/auth-db';
clearUserCache();
```

## Environment Setup

All apps need access to the auth database:

```bash
# .env (in rent-app or lead-gen)
AUTH_DATABASE_URL="file:../../packages/auth-db/prisma/auth.db"

# Production
AUTH_DATABASE_URL="postgresql://user:pass@host:5432/nivasesa_auth"
```

## Migration Guide

### Before (Direct Prisma)

```typescript
// apps/rent-app/auth.ts
import { prisma } from './lib/prisma'; // ❌ Wrong DB!

const user = await prisma.user.findUnique({
  where: { email }
});
```

### After (Cross-Database Lookup)

```typescript
// apps/rent-app/auth.ts
import { getUserByEmail } from '@niv/auth-db'; // ✅ Right DB!

const user = await getUserByEmail(email);
```

## Future Enhancements

- Redis caching for production
- Pub/sub cache invalidation
- GraphQL DataLoader integration
- User update webhooks
