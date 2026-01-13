'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =============================================================================
// REVIEW TYPES
// =============================================================================

export type ReviewType = 'host_to_renter' | 'renter_to_host';

interface SubmitReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
}

interface ReviewResult {
  success: boolean;
  message: string;
  review?: any;
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

// =============================================================================
// SUBMIT REVIEW
// =============================================================================

export async function submitReviewAction(
  data: SubmitReviewData
): Promise<ReviewResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'You must be logged in to submit a review' };
  }

  try {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, message: 'Rating must be between 1 and 5 stars' };
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return { success: false, message: 'You can only review completed bookings' };
    }

    // Determine review type and verify user is part of booking
    let reviewType: ReviewType;
    let revieweeId: string;

    if (booking.hostId === session.user.id) {
      // Host is reviewing renter
      reviewType = 'host_to_renter';
      revieweeId = booking.guestId;
    } else if (booking.guestId === session.user.id) {
      // Renter is reviewing host
      reviewType = 'renter_to_host';
      revieweeId = booking.hostId;
    } else {
      return { success: false, message: 'You are not part of this booking' };
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId_reviewerId: {
          bookingId: data.bookingId,
          reviewerId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return { success: false, message: 'You have already reviewed this booking' };
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        reviewerId: session.user.id,
        revieweeId,
        rating: data.rating,
        comment: data.comment,
        type: reviewType,
      },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/bookings');
    revalidatePath(`/dashboard/bookings/${data.bookingId}`);

    return {
      success: true,
      message: 'Review submitted successfully',
      review,
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}

// =============================================================================
// GET REVIEWS FOR USER
// =============================================================================

export async function getReviewsForUserAction(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, message: 'Failed to fetch reviews', reviews: [] };
  }
}

// =============================================================================
// GET AVERAGE RATING
// =============================================================================

export async function getAverageRatingAction(
  userId: string
): Promise<AverageRatingResult> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: userId,
      },
      select: {
        rating: true,
      },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    // Calculate average
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate breakdown
    const ratingBreakdown = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingBreakdown,
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}

// =============================================================================
// CHECK IF USER CAN REVIEW
// =============================================================================

export async function canReviewAction(
  bookingId: string
): Promise<CanReviewResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { canReview: false, reason: 'You must be logged in' };
  }

  try {
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { canReview: false, reason: 'Booking not found' };
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return { canReview: false, reason: 'Booking must be completed to leave a review' };
    }

    // Determine review type
    let reviewType: ReviewType | undefined;

    if (booking.hostId === session.user.id) {
      reviewType = 'host_to_renter';
    } else if (booking.guestId === session.user.id) {
      reviewType = 'renter_to_host';
    } else {
      return { canReview: false, reason: 'You are not part of this booking' };
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId_reviewerId: {
          bookingId,
          reviewerId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return { canReview: false, reason: 'You have already reviewed this booking' };
    }

    return { canReview: true, reviewType };
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return { canReview: false, reason: 'Failed to check review eligibility' };
  }
}

// =============================================================================
// GET REVIEW FOR BOOKING
// =============================================================================

export async function getReviewForBookingAction(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'You must be logged in' };
  }

  try {
    const review = await prisma.review.findUnique({
      where: {
        bookingId_reviewerId: {
          bookingId,
          reviewerId: session.user.id,
        },
      },
    });

    return { success: true, review };
  } catch (error) {
    console.error('Error fetching review:', error);
    return { success: false, message: 'Failed to fetch review', review: null };
  }
}

// =============================================================================
// GET ALL REVIEWS FOR BOOKING (BOTH HOST AND RENTER)
// =============================================================================

export async function getBookingReviewsAction(bookingId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        bookingId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('Error fetching booking reviews:', error);
    return { success: false, message: 'Failed to fetch reviews', reviews: [] };
  }
}

// =============================================================================
// GET REVIEWS BY TYPE (HOST OR RENTER REVIEWS)
// =============================================================================

export async function getReviewsByTypeAction(
  userId: string,
  type: ReviewType
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: userId,
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('Error fetching reviews by type:', error);
    return { success: false, message: 'Failed to fetch reviews', reviews: [] };
  }
}
