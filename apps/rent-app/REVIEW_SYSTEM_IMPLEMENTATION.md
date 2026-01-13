# Review System Implementation Guide

## Overview

The bidirectional review system allows hosts and renters to review each other after a completed booking. This implementation includes:

- **Review Model**: Prisma schema for storing reviews
- **Server Actions**: CRUD operations for reviews
- **UI Components**: StarRating, ReviewCard, ReviewList, ReviewForm

---

## Database Schema

The Review model has been added to `/apps/rent-app/prisma/schema.prisma`:

```prisma
model Review {
  id         String   @id @default(cuid())
  bookingId  String
  reviewerId String // User who wrote the review
  revieweeId String // User being reviewed
  rating     Int     // 1-5 stars
  comment    String?
  type       String  // "host_to_renter" or "renter_to_host"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([bookingId, reviewerId])
  @@index([revieweeId])
  @@index([bookingId])
  @@index([type])
}
```

**Key Features:**
- Unique constraint ensures one review per user per booking
- Indexed for efficient queries by reviewee and booking
- Supports optional text comments

---

## Server Actions

All review actions are in `/apps/rent-app/actions/reviews.ts`:

### 1. Submit Review

```typescript
import { submitReviewAction } from '@/actions/reviews';

const result = await submitReviewAction({
  bookingId: 'booking_123',
  rating: 5,
  comment: 'Great experience!',
});

if (result.success) {
  console.log('Review submitted:', result.review);
}
```

**Validation:**
- Checks if user is logged in
- Validates rating (1-5)
- Verifies booking is completed
- Ensures user is part of booking (host or guest)
- Prevents duplicate reviews

### 2. Get Reviews for User

```typescript
import { getReviewsForUserAction } from '@/actions/reviews';

const { reviews } = await getReviewsForUserAction('user_123');
```

Returns all reviews received by a user.

### 3. Get Average Rating

```typescript
import { getAverageRatingAction } from '@/actions/reviews';

const { averageRating, totalReviews, ratingBreakdown } =
  await getAverageRatingAction('user_123');

console.log(averageRating); // 4.5
console.log(totalReviews); // 10
console.log(ratingBreakdown); // { 5: 6, 4: 3, 3: 1, 2: 0, 1: 0 }
```

### 4. Check Review Eligibility

```typescript
import { canReviewAction } from '@/actions/reviews';

const { canReview, reason, reviewType } =
  await canReviewAction('booking_123');

if (canReview) {
  console.log('Can review as:', reviewType); // "host_to_renter" or "renter_to_host"
} else {
  console.log('Cannot review:', reason);
}
```

### 5. Get Review for Booking

```typescript
import { getReviewForBookingAction } from '@/actions/reviews';

const { review } = await getReviewForBookingAction('booking_123');
```

### 6. Get All Reviews for Booking

```typescript
import { getBookingReviewsAction } from '@/actions/reviews';

const { reviews } = await getBookingReviewsAction('booking_123');
// Returns both host and renter reviews
```

### 7. Get Reviews by Type

```typescript
import { getReviewsByTypeAction } from '@/actions/reviews';

// Get all reviews where user acted as host
const { reviews: hostReviews } = await getReviewsByTypeAction(
  'user_123',
  'renter_to_host'
);

// Get all reviews where user acted as renter
const { reviews: renterReviews } = await getReviewsByTypeAction(
  'user_123',
  'host_to_renter'
);
```

---

## UI Components

### StarRating

Interactive star rating input (already existed):

```tsx
import { StarRating } from '@/components/ui';

function MyComponent() {
  const [rating, setRating] = useState(0);

  return (
    <StarRating
      value={rating}
      onChange={setRating}
      max={5}
      size="md" // "sm" | "md" | "lg"
      readonly={false}
    />
  );
}
```

### ReviewCard

Display a single review:

```tsx
import { ReviewCard } from '@/components/ui';

function MyComponent() {
  const review = {
    id: 'review_123',
    rating: 5,
    comment: 'Great host!',
    type: 'renter_to_host',
    createdAt: new Date(),
    reviewerId: 'user_123',
    revieweeId: 'user_456',
  };

  return (
    <ReviewCard
      review={review}
      reviewerName="John Doe"
      showType={true}
    />
  );
}
```

### ReviewList

Display multiple reviews with summary:

```tsx
import { ReviewList } from '@/components/ui';

function MyComponent() {
  const reviews = [...]; // Array of reviews

  return (
    <ReviewList
      reviews={reviews}
      averageRating={4.5}
      totalReviews={10}
      ratingBreakdown={{ 5: 6, 4: 3, 3: 1, 2: 0, 1: 0 }}
      title="Reviews"
      showType={true}
      initialDisplayCount={5}
    />
  );
}
```

### ReviewForm

Submit a new review:

```tsx
import { ReviewForm } from '@/components/ui';
import { submitReviewAction } from '@/actions/reviews';

function MyComponent() {
  const handleSubmit = async (data: { rating: number; comment?: string }) => {
    const result = await submitReviewAction({
      bookingId: 'booking_123',
      ...data,
    });

    if (!result.success) {
      throw new Error(result.message);
    }
  };

  return (
    <ReviewForm
      bookingId="booking_123"
      reviewType="renter_to_host"
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

---

## Example: Booking Details Page

Here's a complete example of integrating reviews into a booking details page:

```tsx
// app/dashboard/bookings/[id]/page.tsx
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  getBookingReviewsAction,
  canReviewAction,
  submitReviewAction
} from '@/actions/reviews';
import { ReviewList, ReviewForm } from '@/components/ui';

export default async function BookingDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth();
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      listing: true,
    },
  });

  if (!booking) {
    return <div>Booking not found</div>;
  }

  // Get reviews for this booking
  const { reviews } = await getBookingReviewsAction(params.id);

  // Check if current user can review
  const { canReview, reviewType } = await canReviewAction(params.id);

  return (
    <div>
      <h1>Booking Details</h1>

      {/* Booking info */}
      <div>
        {/* ... booking details ... */}
      </div>

      {/* Review Form (if eligible) */}
      {canReview && reviewType && (
        <ReviewForm
          bookingId={params.id}
          reviewType={reviewType}
          onSubmit={async (data) => {
            'use server';
            const result = await submitReviewAction({
              bookingId: params.id,
              ...data,
            });
            if (!result.success) {
              throw new Error(result.message);
            }
          }}
        />
      )}

      {/* Display existing reviews */}
      {reviews.length > 0 && (
        <ReviewList
          reviews={reviews}
          title="Reviews for this Booking"
          showType={true}
        />
      )}
    </div>
  );
}
```

---

## Example: User Profile Page

Display user's received reviews on their profile:

```tsx
// app/profile/[userId]/page.tsx
import {
  getReviewsForUserAction,
  getAverageRatingAction
} from '@/actions/reviews';
import { ReviewList } from '@/components/ui';

export default async function UserProfilePage({
  params
}: {
  params: { userId: string }
}) {
  const { reviews } = await getReviewsForUserAction(params.userId);
  const { averageRating, totalReviews, ratingBreakdown } =
    await getAverageRatingAction(params.userId);

  return (
    <div>
      <h1>User Profile</h1>

      {/* User info */}
      <div>
        <h2>Average Rating: {averageRating}</h2>
        <p>{totalReviews} reviews</p>
      </div>

      {/* Reviews */}
      <ReviewList
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
        ratingBreakdown={ratingBreakdown}
        title="Reviews"
        showType={true}
      />
    </div>
  );
}
```

---

## Review Flow

### Host Reviews Renter

1. Booking is completed (status: `COMPLETED`)
2. Host navigates to booking details
3. System checks eligibility via `canReviewAction()`
4. If eligible, shows `ReviewForm` with `reviewType="host_to_renter"`
5. Host submits review via `submitReviewAction()`
6. Review is saved with:
   - `reviewerId`: host's user ID
   - `revieweeId`: guest's user ID
   - `type`: "host_to_renter"

### Renter Reviews Host

1. Booking is completed (status: `COMPLETED`)
2. Renter navigates to booking details
3. System checks eligibility via `canReviewAction()`
4. If eligible, shows `ReviewForm` with `reviewType="renter_to_host"`
5. Renter submits review via `submitReviewAction()`
6. Review is saved with:
   - `reviewerId`: guest's user ID
   - `revieweeId`: host's user ID
   - `type`: "renter_to_host"

---

## Database Migrations

After updating the schema, run:

```bash
cd apps/rent-app

# Format the schema
npx prisma format

# Generate Prisma client
npx prisma generate

# Push schema changes to database (dev)
npx prisma db push

# Or create migration (production)
npx prisma migrate dev --name add_review_model
```

---

## Testing

### Manual Testing

1. Create a completed booking
2. Navigate to booking details as host
3. Submit a review with rating and comment
4. Navigate to booking details as renter
5. Submit a review with rating and comment
6. View both reviews on user profiles
7. Verify average rating calculation

### Validation Tests

- Try to review an incomplete booking (should fail)
- Try to review the same booking twice (should fail)
- Try to submit rating outside 1-5 range (should fail)
- Try to review a booking you're not part of (should fail)

---

## Security Considerations

- All actions use `auth()` to verify user session
- Reviews can only be submitted for completed bookings
- Users can only review bookings they participated in
- One review per user per booking (enforced by DB constraint)
- Reviews cannot be edited once submitted
- Input validation for rating (1-5) and comment length

---

## Future Enhancements

Potential improvements:

1. **Review Responses**: Allow reviewees to respond to reviews
2. **Helpful Votes**: Let users vote reviews as helpful/not helpful
3. **Edit Reviews**: Allow editing within 24 hours
4. **Review Reminders**: Send notifications after booking completion
5. **Verified Reviews**: Badge for verified bookings
6. **Review Reporting**: Flag inappropriate reviews
7. **Rating Filters**: Filter listings by minimum rating
8. **Review Templates**: Quick review suggestions

---

## Files Created/Modified

### New Files

- `/apps/rent-app/actions/reviews.ts` - Server actions
- `/apps/rent-app/components/ui/ReviewCard.tsx` - Single review display
- `/apps/rent-app/components/ui/ReviewCard.module.css`
- `/apps/rent-app/components/ui/ReviewList.tsx` - Multiple reviews display
- `/apps/rent-app/components/ui/ReviewList.module.css`
- `/apps/rent-app/components/ui/ReviewForm.tsx` - Review submission form
- `/apps/rent-app/components/ui/ReviewForm.module.css`

### Modified Files

- `/apps/rent-app/prisma/schema.prisma` - Added Review model
- `/apps/rent-app/components/ui/index.ts` - Exported new components

### Existing Files (Used)

- `/apps/rent-app/components/ui/StarRating.tsx` - Star rating input
- `/apps/rent-app/components/ui/StarRating.module.css`

---

## API Reference

### Review Type Definition

```typescript
type ReviewType = 'host_to_renter' | 'renter_to_host';

interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment?: string | null;
  type: ReviewType;
  createdAt: Date;
  updatedAt: Date;
}
```

### Action Return Types

```typescript
interface ReviewResult {
  success: boolean;
  message: string;
  review?: Review;
}

interface CanReviewResult {
  canReview: boolean;
  reason?: string;
  reviewType?: ReviewType;
}

interface AverageRatingResult {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

---

## Support

For questions or issues with the review system, refer to:

- Main documentation: `/CLAUDE.md`
- Prisma schema: `/apps/rent-app/prisma/schema.prisma`
- Action implementations: `/apps/rent-app/actions/reviews.ts`
