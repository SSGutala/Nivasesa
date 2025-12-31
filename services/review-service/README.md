# Review Service

GraphQL Federation subgraph for managing reviews in the Nivasesa platform.

## Features

- User-to-user reviews (HOST_TO_GUEST, GUEST_TO_HOST)
- Listing reviews
- Review summaries with average ratings and breakdowns
- Review responses
- Review reporting and moderation
- Federated with User and Listing entities

## Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

## GraphQL Operations

### Queries

- `review(id)` - Get a review by ID
- `reviewsForUser(userId)` - Get reviews for a user (as reviewee)
- `reviewsForListing(listingId)` - Get reviews for a listing
- `myReviews()` - Get reviews written by the current user
- `pendingReviews()` - Get pending reviews for the current user
- `userReviewSummary(userId)` - Get review summary for a user
- `listingReviewSummary(listingId)` - Get review summary for a listing

### Mutations

- `createReview(input)` - Create a new review
- `respondToReview(input)` - Respond to a review (for reviewee)
- `reportReview(input)` - Report a review
- `deleteReview(reviewId)` - Delete a review (admin or own within 24h)

## Database Schema

### Review Model

- `id` - Unique identifier
- `reviewerId` - User who wrote the review
- `revieweeId` - User being reviewed
- `listingId` - Listing being reviewed (optional)
- `bookingId` - Associated booking (optional)
- `rating` - Rating from 1-5
- `comment` - Review text
- `type` - Review type (HOST_TO_GUEST, GUEST_TO_HOST, LISTING)
- `response` - Response from reviewee
- `isReported` - Report flag
- `reportedAt` - Report timestamp
- `reportReason` - Report reason

## Federation

This service extends the following external entities:

- `User` - Adds `reviews`, `reviewsReceived`, and `reviewSummary` fields
- `Listing` - Adds `reviews` and `reviewSummary` fields

## Environment Variables

See `.env.example` for required environment variables.

## Port

Default port: 4007
