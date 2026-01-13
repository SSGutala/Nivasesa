# Cross-Database User Lookup - Quick Start

Get started with cross-database user lookups in 5 minutes.

## Installation

### Step 1: Add Dependency

Add to your app's `package.json`:

```json
{
  "dependencies": {
    "@niv/auth-db": "workspace:*"
  }
}
```

Run:
```bash
pnpm install
```

### Step 2: Configure Environment

Add to your app's `.env`:

```bash
# Development (SQLite)
AUTH_DATABASE_URL="file:../../packages/auth-db/prisma/auth.db"

# Production (PostgreSQL)
AUTH_DATABASE_URL="postgresql://user:pass@host:5432/nivasesa_auth"
```

## Basic Usage

### Import Functions

```typescript
import {
  getUserById,
  getSafeUserInfo,
  getUsersByIds,
  getSafeUserInfos,
} from '@niv/auth-db';
```

### Single User Lookup

```typescript
// Get full user (server-side only)
const user = await getUserById('clx123abc');

// Get safe user info (safe for client-side)
const safeInfo = await getSafeUserInfo('clx123abc');
// Returns: { id, name, email, image, role }
```

### Batch User Lookup (Efficient!)

```typescript
// Enrich listings with owner data
const listings = await prisma.roomListing.findMany();

// Extract owner IDs
const ownerIds = [...new Set(listings.map(l => l.ownerId))];

// Batch fetch owners (single query!)
const owners = await getSafeUserInfos(ownerIds);

// Enrich listings
const enrichedListings = listings.map(listing => ({
  ...listing,
  owner: owners.get(listing.ownerId),
}));
```

## Common Patterns

### Pattern 1: API Route

```typescript
// app/api/listings/route.ts
import { getSafeUserInfos } from '@niv/auth-db';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const listings = await prisma.roomListing.findMany();

  const ownerIds = [...new Set(listings.map(l => l.ownerId))];
  const owners = await getSafeUserInfos(ownerIds);

  return Response.json(
    listings.map(l => ({
      ...l,
      owner: owners.get(l.ownerId),
    }))
  );
}
```

### Pattern 2: Server Action

```typescript
'use server';

import { getUserById } from '@niv/auth-db';
import { auth } from '@/auth';

export async function createBooking(data: {
  listingId: string;
  hostId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  // Validate host exists
  const host = await getUserById(data.hostId);
  if (!host) {
    return { error: 'Host not found' };
  }

  // Create booking...
}
```

### Pattern 3: Page Component

```typescript
// app/listing/[id]/page.tsx
import { getSafeUserInfo } from '@niv/auth-db';
import { prisma } from '@/lib/prisma';

export default async function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await prisma.roomListing.findUnique({
    where: { id: params.id },
  });

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const owner = await getSafeUserInfo(listing.ownerId);

  return (
    <div>
      <h1>{listing.title}</h1>
      <p>Listed by: {owner?.name}</p>
    </div>
  );
}
```

## Performance Tips

### DO ✅

```typescript
// Batch lookup
const ids = items.map(i => i.userId);
const users = await getUsersByIds(ids);

// Parallel requests
const [user, listing] = await Promise.all([
  getUserById(userId),
  getListingById(listingId),
]);
```

### DON'T ❌

```typescript
// N+1 queries
for (const item of items) {
  item.user = await getUserById(item.userId); // ❌
}

// Sequential requests
const user = await getUserById(userId);
const listing = await getListingById(listingId); // ❌
```

## API Reference

### getUserById(userId, options?)

```typescript
const user = await getUserById('clx123abc');
// Returns: User | null (full user object with password)
```

### getSafeUserInfo(userId)

```typescript
const info = await getSafeUserInfo('clx123abc');
// Returns: { id, name, email, image, role } | null
```

### getUsersByIds(userIds, options?)

```typescript
const users = await getUsersByIds(['id1', 'id2', 'id3']);
// Returns: Map<string, User>
```

### getSafeUserInfos(userIds)

```typescript
const infos = await getSafeUserInfos(['id1', 'id2', 'id3']);
// Returns: Map<string, SafeUserInfo>
```

### userExists(userId)

```typescript
if (await userExists('clx123abc')) {
  // User exists
}
// Returns: boolean
```

### validateUserIds(userIds)

```typescript
const { validIds, invalidIds } = await validateUserIds(['id1', 'id2']);
// Returns: { validIds: string[], invalidIds: string[] }
```

### getUserByEmail(email)

```typescript
const user = await getUserByEmail('user@example.com');
// Returns: User | null
```

### clearUserCache()

```typescript
clearUserCache();
// Clears the in-memory cache
```

## Next Steps

1. Read full guide: `/docs/CROSS_DATABASE_USER_LOOKUP.md`
2. See examples: `/packages/auth-db/EXAMPLES.md`
3. Check implementation: `/packages/auth-db/IMPLEMENTATION.md`
4. Run tests: `cd packages/auth-db && npm test`

## Need Help?

- Check troubleshooting: `/docs/CROSS_DATABASE_USER_LOOKUP.md#troubleshooting`
- See examples: `/packages/auth-db/EXAMPLES.md`
- Review tests: `/packages/auth-db/__tests__/user-lookup.test.ts`
