import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable"])

  """
  Review entity - ratings and feedback for users, listings, and bookings
  """
  type Review @key(fields: "id") {
    id: ID!
    reviewer: User!
    reviewee: User!
    listing: Listing
    bookingId: String
    rating: Int!
    comment: String
    type: ReviewType!
    response: String
    isReported: Boolean!
    reportedAt: DateTime
    reportReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Review type categorization
  """
  enum ReviewType {
    HOST_TO_GUEST
    GUEST_TO_HOST
    LISTING
  }

  """
  Aggregated review summary for a user or listing
  """
  type ReviewSummary {
    averageRating: Float!
    totalReviews: Int!
    ratingBreakdown: RatingBreakdown!
  }

  """
  Count of reviews per star rating
  """
  type RatingBreakdown {
    oneStar: Int!
    twoStar: Int!
    threeStar: Int!
    fourStar: Int!
    fiveStar: Int!
  }

  """
  Extend User entity from user-service
  """
  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review!]!
    reviewsReceived: [Review!]!
    reviewSummary: ReviewSummary!
  }

  """
  Extend Listing entity from listing-service
  """
  extend type Listing @key(fields: "id") {
    id: ID! @external
    reviews: [Review!]!
    reviewSummary: ReviewSummary!
  }

  # Input types
  input CreateReviewInput {
    revieweeId: ID!
    listingId: ID
    bookingId: ID
    rating: Int!
    comment: String
    type: ReviewType!
  }

  input RespondToReviewInput {
    reviewId: ID!
    response: String!
  }

  input ReportReviewInput {
    reviewId: ID!
    reason: String!
  }

  # Queries
  type Query {
    """
    Get a review by ID
    """
    review(id: ID!): Review

    """
    Get reviews for a specific user (as reviewee)
    """
    reviewsForUser(userId: ID!, limit: Int, offset: Int): ReviewConnection!

    """
    Get reviews for a specific listing
    """
    reviewsForListing(listingId: ID!, limit: Int, offset: Int): ReviewConnection!

    """
    Get reviews written by the current user
    """
    myReviews(limit: Int, offset: Int): ReviewConnection!

    """
    Get pending reviews (where user needs to write a review)
    """
    pendingReviews: [PendingReview!]!

    """
    Get review summary for a user
    """
    userReviewSummary(userId: ID!): ReviewSummary!

    """
    Get review summary for a listing
    """
    listingReviewSummary(listingId: ID!): ReviewSummary!
  }

  """
  Paginated review list
  """
  type ReviewConnection {
    nodes: [Review!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  """
  Pending review indicator
  """
  type PendingReview {
    bookingId: ID!
    revieweeId: ID!
    revieweeName: String!
    listingId: ID
    listingTitle: String
    type: ReviewType!
  }

  # Mutations
  type Mutation {
    """
    Create a new review
    """
    createReview(input: CreateReviewInput!): Review!

    """
    Respond to a review (for reviewee)
    """
    respondToReview(input: RespondToReviewInput!): Review!

    """
    Report a review
    """
    reportReview(input: ReportReviewInput!): Review!

    """
    Delete a review (admin only or own review within 24h)
    """
    deleteReview(reviewId: ID!): Boolean!
  }

  # Custom scalars
  scalar DateTime
`;
