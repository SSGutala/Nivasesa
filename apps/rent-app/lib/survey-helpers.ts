/**
 * Survey Helper Utilities
 *
 * This file contains helper functions to trigger surveys after various interactions
 * and to auto-infer user roles based on the context.
 */

import { prisma } from "./prisma";

/**
 * Auto-infer user role from a video call
 */
export async function inferRoleFromVideoCall(
  videoCallId: string,
  userId: string
): Promise<"host" | "renter"> {
  const videoCall = await prisma.videoCall.findUnique({
    where: { id: videoCallId },
    select: {
      hostId: true,
      guestId: true,
    },
  });

  if (!videoCall) {
    return "renter"; // Default fallback
  }

  return videoCall.hostId === userId ? "host" : "renter";
}

/**
 * Auto-infer user role from a booking
 */
export async function inferRoleFromBooking(
  bookingId: string,
  userId: string
): Promise<"host" | "renter"> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      hostId: true,
      guestId: true,
    },
  });

  if (!booking) {
    return "renter"; // Default fallback
  }

  return booking.hostId === userId ? "host" : "renter";
}

/**
 * Check if user has already submitted survey for an interaction
 */
export async function hasUserSubmittedSurvey(
  userId: string,
  interactionId: string,
  interactionType: string
): Promise<boolean> {
  const existing = await prisma.surveyResponse.findFirst({
    where: {
      userId,
      interactionId,
      interactionType,
    },
  });

  return !!existing;
}

/**
 * Get survey URL for a video call
 */
export function getVideoCallSurveyUrl(
  surveyId: string,
  videoCallId: string
): string {
  return `/survey/${surveyId}?interactionId=${videoCallId}&interactionType=video_call`;
}

/**
 * Get survey URL for a booking
 */
export function getBookingSurveyUrl(
  surveyId: string,
  bookingId: string
): string {
  return `/survey/${surveyId}?interactionId=${bookingId}&interactionType=booking`;
}

/**
 * Get general survey URL
 */
export function getGeneralSurveyUrl(surveyId: string): string {
  return `/survey/${surveyId}`;
}

/**
 * Generate survey notification message
 */
export function getSurveyNotificationMessage(type: string): string {
  switch (type) {
    case "video_call":
      return "How was your video call? Share your feedback to help us improve!";
    case "booking":
      return "Your stay is complete! Please share your experience.";
    case "general":
      return "We'd love to hear your thoughts about Nivasesa!";
    default:
      return "We'd appreciate your feedback!";
  }
}

/**
 * Calculate survey response statistics
 */
export async function getSurveyStats(surveyId: string) {
  const responses = await prisma.surveyResponse.findMany({
    where: { surveyId },
    select: {
      rating: true,
      userRole: true,
      createdAt: true,
    },
  });

  const totalResponses = responses.length;
  const avgRating =
    responses.reduce((sum, r) => sum + (r.rating || 0), 0) / totalResponses ||
    0;

  const roleBreakdown = responses.reduce(
    (acc, r) => {
      acc[r.userRole] = (acc[r.userRole] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalResponses,
    avgRating: avgRating.toFixed(2),
    roleBreakdown,
    responses,
  };
}
