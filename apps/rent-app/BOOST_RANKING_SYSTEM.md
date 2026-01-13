# Boost & Ranking System

Complete implementation of paid boosts, organic ranking, and gamification badges for Nivasesa.

## Overview

The Boost & Ranking System provides three key features:

1. **Paid Boosts** - Users can boost profiles or listings for increased visibility
2. **Organic Ranking** - Listings ranked by Freedom Score (permissiveness)
3. **Gamification Badges** - Achievement badges for user engagement

---

## 1. Paid Boosts

### Models

**Boost** - Tracks all boost purchases
- `type`: "profile" or "listing"
- `targetId`: userId or listingId
- `tier`: "basic", "premium", "featured"
- `startDate`, `endDate`: Boost duration
- `price`: Amount paid in cents
- `status`: "active", "expired", "cancelled"

### Pricing

| Tier | 7 Days | 14 Days | 30 Days |
|------|--------|---------|---------|
| Basic | $9.99 | $14.99 | $24.99 |
| Premium | $19.99 | $29.99 | $49.99 |
| Featured | $39.99 | $59.99 | $99.99 |

### Actions (`/actions/boosts.ts`)

#### `purchaseProfileBoostAction(tier, days)`
Purchase a boost for the authenticated user's profile.

```typescript
const result = await purchaseProfileBoostAction('premium', 14);
// { success: true, message: "Profile boosted...", boostId: "..." }
```

#### `purchaseListingBoostAction(listingId, tier, days)`
Purchase a boost for a specific listing (ownership verified).

```typescript
const result = await purchaseListingBoostAction('listing_123', 'featured', 30);
```

#### `getActiveBoostsAction()`
Get all active boosts for the authenticated user.

```typescript
const result = await getActiveBoostsAction();
// { success: true, boosts: { profile: [...], listing: [...] } }
```

#### `checkBoostStatusAction(type, targetId)`
Check if a specific target is currently boosted.

```typescript
const result = await checkBoostStatusAction('listing', 'listing_123');
// { success: true, isBoosted: true, tier: "featured", endDate: Date }
```

#### `cancelBoostAction(boostId)`
Cancel an active boost (for refunds or early termination).

#### `getBoostPricingAction()`
Get pricing information for display.

---

## 2. Organic Ranking

### Freedom Score

Already implemented in `/lib/freedom-score.ts`. Score from 0-100 based on listing restrictions:

- **Guests & Visitors** (max 20 pts): overnight guests, extended stays, visitors
- **Romantic Partners** (max 20 pts): partner visits, unmarried couples, same-sex couples
- **Social Life** (max 20 pts): parties, curfew, night owl friendly
- **Substances** (max 20 pts): smoking, cannabis, alcohol policies
- **Diet & Cooking** (max 10 pts): cooking restrictions, kitchen access
- **Independence** (max 10 pts): landlord presence, private entrance

**Higher score = fewer restrictions = better ranking**

### Ranking Algorithm

Updated in `/actions/rooms.ts`:

```typescript
getRoomListings(filters)
```

**Ranking Order:**
1. Featured Boosts (sorted by Freedom Score)
2. Premium Boosts (sorted by Freedom Score)
3. Basic Boosts (sorted by Freedom Score)
4. Organic Listings (sorted by Freedom Score, then creation date)

**Implementation:**
- Fetches active boosts alongside listings
- Sorts listings by boost tier first, then Freedom Score
- Attaches boost info to each listing for display

---

## 3. Gamification Badges

### Models

**Badge** - Badge definitions
- `name`: unique identifier (e.g., "early_adopter")
- `displayName`: Human-readable name
- `description`: Badge description
- `icon`: Icon name (Lucide icon or emoji)
- `category`: "achievement", "milestone", "special"

**UserBadge** - User's earned badges
- `userId`: User who earned the badge
- `badgeId`: Reference to Badge
- `earnedAt`: When badge was earned

### Badge Definitions

Defined in `/actions/badges.ts`:

| Badge | Category | Description |
|-------|----------|-------------|
| Early Adopter | special | First 1,000 users |
| Super Host | achievement | 10+ bookings with 5-star rating |
| Verified Agent | special | Licensed real estate agent |
| Community Builder | achievement | Created successful group |
| Referral Champion | achievement | Referred 5+ friends |
| Top Rated | achievement | 20+ five-star reviews |
| 100 Connections | milestone | Made 100+ connections |
| First Booking | milestone | Completed first booking |
| First Listing | milestone | Posted first listing |
| Ambassador | special | Active community contributor |

### Actions (`/actions/badges.ts`)

#### `getUserBadgesAction(userId?)`
Get all badges earned by a user.

```typescript
const result = await getUserBadgesAction('user_123');
// { success: true, badges: [...] }
```

#### `awardBadgeAction(userId, badgeName)`
Award a badge to a user (internal use only).

```typescript
await awardBadgeAction('user_123', 'early_adopter');
```

#### `checkAndAwardMilestoneBadges(userId)`
Automatically check and award milestone badges based on user activity.

Called automatically when:
- User creates first listing → `first_listing`
- User completes first booking → `first_booking`
- User reaches 100 connections → `hundred_connections`
- User refers 5+ friends → `referral_champion`

#### `getAllBadgesAction()`
Get all available badges (for display).

#### `initializeBadgesAction()`
Initialize all badge definitions in database (run once on deployment).

---

## 4. UI Components

### BoostBadge (`/components/ui/BoostBadge.tsx`)

**Main Component:**
```tsx
<BoostBadge tier="featured" variant="full" />
```

**Variants:**
- `compact`: Just icon and subtle background
- `full`: Icon + label with tier-specific styling

**Tier Styles:**
- `basic`: Blue gradient with ⚡ icon
- `premium`: Purple gradient with ✨ icon
- `featured`: Gold gradient with 🌟 icon (elevated shadow)

**UserBadge Component:**
```tsx
<UserBadge
  name="early_adopter"
  displayName="Early Adopter"
  description="Joined in first 1,000 users"
  icon="Sparkles"
  earnedAt={new Date()}
  size="medium"
/>
```

**BadgeCollection Component:**
```tsx
<BadgeCollection
  badges={userBadges}
  maxDisplay={5}
  size="small"
/>
```

---

## 5. Integration Guide

### Display Boosted Listings

```tsx
import BoostBadge from '@/components/ui/BoostBadge';
import { getRoomListings } from '@/actions/rooms';

export default async function ListingsPage() {
  const listings = await getRoomListings();

  return (
    <div>
      {listings.map((listing) => (
        <div key={listing.id} className="listing-card">
          {listing.boost && (
            <BoostBadge tier={listing.boost.tier} variant="full" />
          )}
          <h3>{listing.title}</h3>
          <p>Freedom Score: {listing.freedomScore}</p>
        </div>
      ))}
    </div>
  );
}
```

### Purchase Boost Flow

```tsx
'use client';

import { purchaseListingBoostAction } from '@/actions/boosts';
import { useState } from 'react';

export function BoostPurchaseButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    const result = await purchaseListingBoostAction(listingId, 'premium', 14);
    if (result.success) {
      alert('Boost purchased!');
    } else {
      alert(result.message);
    }
    setLoading(false);
  }

  return (
    <button onClick={handlePurchase} disabled={loading}>
      Boost Listing - $29.99 (14 days)
    </button>
  );
}
```

### Display User Badges

```tsx
import { getUserBadgesAction } from '@/actions/badges';
import { BadgeCollection } from '@/components/ui/BoostBadge';

export default async function UserProfile({ userId }: { userId: string }) {
  const result = await getUserBadgesAction(userId);

  return (
    <div>
      <h2>Achievements</h2>
      {result.badges && result.badges.length > 0 ? (
        <BadgeCollection badges={result.badges} maxDisplay={5} />
      ) : (
        <p>No badges yet</p>
      )}
    </div>
  );
}
```

### Auto-award Milestone Badges

Add to relevant actions:

```typescript
import { checkAndAwardMilestoneBadges } from '@/actions/badges';

export async function createRoomListing(data: CreateRoomListingData) {
  const session = await auth();

  const listing = await prisma.roomListing.create({ data });

  // Check and award milestone badges
  await checkAndAwardMilestoneBadges(session.user.id);

  return { success: true, listing };
}
```

---

## 6. Database Migration

After pulling this code, run:

```bash
cd apps/rent-app
npx prisma generate
npx prisma db push
```

To initialize badges in production:

```typescript
// Run once via admin panel or script
await initializeBadgesAction();
```

---

## 7. Future Enhancements

### Payment Integration
- Connect `purchaseBoostAction` to Stripe payment flow
- Store payment intent IDs on Boost model
- Handle refunds for cancelled boosts

### Analytics
- Track boost ROI (views, connections, bookings)
- A/B test boost effectiveness
- Display analytics in dashboard

### Badge Improvements
- Add badge rarity levels
- Create badge leaderboard
- Allow users to select "featured badge"
- Add seasonal/limited-time badges

### Advanced Ranking
- Incorporate user ratings into ranking
- Add recency boost (newly listed)
- Randomize within same tier for fairness

---

## 8. File Reference

| File | Purpose |
|------|---------|
| `/prisma/schema.prisma` | Boost, Badge, UserBadge models |
| `/actions/boosts.ts` | Boost purchase and management actions |
| `/actions/badges.ts` | Badge awarding and retrieval actions |
| `/components/ui/BoostBadge.tsx` | Boost badge and user badge components |
| `/components/ui/BoostBadge.module.css` | Styling for badges |
| `/actions/rooms.ts` | Updated with boost-aware ranking |
| `/lib/freedom-score.ts` | Freedom Score calculation (existing) |

---

## Support

For questions or issues:
- Check action return values for error messages
- Review Prisma schema for model relationships
- Use `checkBoostStatusAction` to debug boost state
