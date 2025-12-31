import { GraphQLError } from 'graphql';
import { prisma } from './prisma.js';

interface Context {
  userId?: string;
  userRole?: string;
}

// Helper to verify authentication
function requireAuth(context: Context): string {
  if (!context.userId) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.userId;
}

// Helper to require admin role
function requireAdmin(context: Context): void {
  requireAuth(context);
  if (context.userRole !== 'ADMIN') {
    throw new GraphQLError('Not authorized', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

// Helper to calculate review summary
async function calculateReviewSummary(
  where: { revieweeId?: string; listingId?: string }
): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
}> {
  const reviews = await prisma.review.findMany({ where });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
      },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingBreakdown = {
    oneStar: reviews.filter((r) => r.rating === 1).length,
    twoStar: reviews.filter((r) => r.rating === 2).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    fiveStar: reviews.filter((r) => r.rating === 5).length,
  };

  return { averageRating, totalReviews, ratingBreakdown };
}

export const resolvers = {
  Query: {
    review: async (_: unknown, { id }: { id: string }) => {
      return prisma.review.findUnique({ where: { id } });
    },

    reviewsForUser: async (
      _: unknown,
      {
        userId,
        limit = 20,
        offset = 0,
      }: { userId: string; limit?: number; offset?: number }
    ) => {
      const [nodes, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: { revieweeId: userId },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where: { revieweeId: userId } }),
      ]);

      return {
        nodes,
        totalCount,
        pageInfo: {
          hasNextPage: offset + nodes.length < totalCount,
          hasPreviousPage: offset > 0,
          startCursor: nodes[0]?.id,
          endCursor: nodes[nodes.length - 1]?.id,
        },
      };
    },

    reviewsForListing: async (
      _: unknown,
      {
        listingId,
        limit = 20,
        offset = 0,
      }: { listingId: string; limit?: number; offset?: number }
    ) => {
      const [nodes, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: { listingId },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where: { listingId } }),
      ]);

      return {
        nodes,
        totalCount,
        pageInfo: {
          hasNextPage: offset + nodes.length < totalCount,
          hasPreviousPage: offset > 0,
          startCursor: nodes[0]?.id,
          endCursor: nodes[nodes.length - 1]?.id,
        },
      };
    },

    myReviews: async (
      _: unknown,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const [nodes, totalCount] = await Promise.all([
        prisma.review.findMany({
          where: { reviewerId: userId },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where: { reviewerId: userId } }),
      ]);

      return {
        nodes,
        totalCount,
        pageInfo: {
          hasNextPage: offset + nodes.length < totalCount,
          hasPreviousPage: offset > 0,
          startCursor: nodes[0]?.id,
          endCursor: nodes[nodes.length - 1]?.id,
        },
      };
    },

    pendingReviews: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);
      // TODO: This would query a booking service to find completed bookings
      // without reviews. For now, return empty array.
      return [];
    },

    userReviewSummary: async (_: unknown, { userId }: { userId: string }) => {
      return calculateReviewSummary({ revieweeId: userId });
    },

    listingReviewSummary: async (
      _: unknown,
      { listingId }: { listingId: string }
    ) => {
      return calculateReviewSummary({ listingId });
    },
  },

  Mutation: {
    createReview: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          revieweeId: string;
          listingId?: string;
          bookingId?: string;
          rating: number;
          comment?: string;
          type: string;
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Validate rating
      if (input.rating < 1 || input.rating > 5) {
        throw new GraphQLError('Rating must be between 1 and 5', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Cannot review yourself
      if (userId === input.revieweeId) {
        throw new GraphQLError('Cannot review yourself', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check for duplicate review (same reviewer, reviewee, and booking)
      if (input.bookingId) {
        const existing = await prisma.review.findFirst({
          where: {
            reviewerId: userId,
            revieweeId: input.revieweeId,
            bookingId: input.bookingId,
          },
        });

        if (existing) {
          throw new GraphQLError('Review already exists for this booking', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
      }

      return prisma.review.create({
        data: {
          reviewerId: userId,
          revieweeId: input.revieweeId,
          listingId: input.listingId,
          bookingId: input.bookingId,
          rating: input.rating,
          comment: input.comment,
          type: input.type,
        },
      });
    },

    respondToReview: async (
      _: unknown,
      { input }: { input: { reviewId: string; response: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const review = await prisma.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review) {
        throw new GraphQLError('Review not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only the reviewee can respond
      if (review.revieweeId !== userId) {
        throw new GraphQLError('Not authorized to respond to this review', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.review.update({
        where: { id: input.reviewId },
        data: { response: input.response },
      });
    },

    reportReview: async (
      _: unknown,
      { input }: { input: { reviewId: string; reason: string } },
      context: Context
    ) => {
      requireAuth(context);

      const review = await prisma.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review) {
        throw new GraphQLError('Review not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return prisma.review.update({
        where: { id: input.reviewId },
        data: {
          isReported: true,
          reportedAt: new Date(),
          reportReason: input.reason,
        },
      });
    },

    deleteReview: async (
      _: unknown,
      { reviewId }: { reviewId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new GraphQLError('Review not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Admin can delete anytime
      if (context.userRole === 'ADMIN') {
        await prisma.review.delete({ where: { id: reviewId } });
        return true;
      }

      // Owner can delete within 24 hours
      if (review.reviewerId === userId) {
        const hoursSinceCreated =
          (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreated > 24) {
          throw new GraphQLError('Can only delete own review within 24 hours', {
            extensions: { code: 'FORBIDDEN' },
          });
        }

        await prisma.review.delete({ where: { id: reviewId } });
        return true;
      }

      throw new GraphQLError('Not authorized to delete this review', {
        extensions: { code: 'FORBIDDEN' },
      });
    },
  },

  // Review type resolvers
  Review: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.review.findUnique({ where: { id: reference.id } });
    },

    reviewer: (review: { reviewerId: string }) => {
      return { __typename: 'User', id: review.reviewerId };
    },

    reviewee: (review: { revieweeId: string }) => {
      return { __typename: 'User', id: review.revieweeId };
    },

    listing: (review: { listingId?: string | null }) => {
      if (!review.listingId) return null;
      return { __typename: 'Listing', id: review.listingId };
    },
  },

  // User type resolvers for federation
  User: {
    __resolveReference: async (reference: { id: string }) => {
      return { id: reference.id };
    },

    reviews: async (user: { id: string }) => {
      return prisma.review.findMany({
        where: { reviewerId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    reviewsReceived: async (user: { id: string }) => {
      return prisma.review.findMany({
        where: { revieweeId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    reviewSummary: async (user: { id: string }) => {
      return calculateReviewSummary({ revieweeId: user.id });
    },
  },

  // Listing type resolvers for federation
  Listing: {
    __resolveReference: async (reference: { id: string }) => {
      return { id: reference.id };
    },

    reviews: async (listing: { id: string }) => {
      return prisma.review.findMany({
        where: { listingId: listing.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    reviewSummary: async (listing: { id: string }) => {
      return calculateReviewSummary({ listingId: listing.id });
    },
  },

  // Custom scalar for DateTime
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
