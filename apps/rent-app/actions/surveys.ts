"use server";

import { prisma } from "../lib/prisma";

export interface SurveyQuestion {
  id: string;
  type: "rating" | "text" | "multiple_choice" | "yes_no";
  question: string;
  required: boolean;
  options?: string[]; // For multiple_choice type
  min?: number; // For rating type
  max?: number; // For rating type
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  type: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  createdAt: Date;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string | number;
}

/**
 * Get a survey by ID with parsed questions
 */
export async function getSurveyByIdAction(
  surveyId: string
): Promise<Survey | null> {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return null;
    }

    return {
      ...survey,
      questions: JSON.parse(survey.questions) as SurveyQuestion[],
    };
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw new Error("Failed to fetch survey");
  }
}

/**
 * Get active survey by type
 */
export async function getActiveSurveyByTypeAction(
  type: string
): Promise<Survey | null> {
  try {
    const survey = await prisma.survey.findFirst({
      where: {
        type,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!survey) {
      return null;
    }

    return {
      ...survey,
      questions: JSON.parse(survey.questions) as SurveyQuestion[],
    };
  } catch (error) {
    console.error("Error fetching survey by type:", error);
    throw new Error("Failed to fetch survey");
  }
}

/**
 * Submit a survey response
 */
export async function submitSurveyResponseAction(
  surveyId: string,
  userId: string,
  userRole: string,
  answers: SurveyAnswer[],
  interactionId?: string,
  interactionType?: string,
  rating?: number,
  feedback?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate survey exists
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return { success: false, error: "Survey not found" };
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    // Check if user already submitted for this interaction
    if (interactionId) {
      const existing = await prisma.surveyResponse.findFirst({
        where: {
          surveyId,
          userId,
          interactionId,
        },
      });

      if (existing) {
        return {
          success: false,
          error: "You have already submitted a response for this interaction",
        };
      }
    }

    // Create survey response
    await prisma.surveyResponse.create({
      data: {
        surveyId,
        userId,
        userRole,
        interactionId,
        interactionType,
        answers: JSON.stringify(answers),
        rating,
        feedback,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting survey response:", error);
    return { success: false, error: "Failed to submit survey response" };
  }
}

/**
 * Trigger survey after video call completes
 * Auto-infers user role based on the video call
 */
export async function triggerSurveyAfterVideoCall(
  videoCallId: string,
  userId: string
): Promise<{ surveyId: string | null; userRole: string }> {
  try {
    // Fetch video call to determine user role
    const videoCall = await prisma.videoCall.findUnique({
      where: { id: videoCallId },
      select: {
        hostId: true,
        guestId: true,
        status: true,
      },
    });

    if (!videoCall || videoCall.status !== "COMPLETED") {
      return { surveyId: null, userRole: "renter" };
    }

    // Infer role: host is typically the listing owner (host), guest is renter
    const userRole = videoCall.hostId === userId ? "host" : "renter";

    // Get active video call survey
    const survey = await getActiveSurveyByTypeAction("video_call");

    return {
      surveyId: survey?.id || null,
      userRole,
    };
  } catch (error) {
    console.error("Error triggering video call survey:", error);
    return { surveyId: null, userRole: "renter" };
  }
}

/**
 * Trigger survey after booking completes
 * Auto-infers user role based on the booking
 */
export async function triggerSurveyAfterBooking(
  bookingId: string,
  userId: string
): Promise<{ surveyId: string | null; userRole: string }> {
  try {
    // Fetch booking to determine user role
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        hostId: true,
        guestId: true,
        status: true,
      },
    });

    if (!booking || booking.status !== "COMPLETED") {
      return { surveyId: null, userRole: "renter" };
    }

    // Infer role: host is the listing owner, guest is renter
    const userRole = booking.hostId === userId ? "host" : "renter";

    // Get active booking survey
    const survey = await getActiveSurveyByTypeAction("booking");

    return {
      surveyId: survey?.id || null,
      userRole,
    };
  } catch (error) {
    console.error("Error triggering booking survey:", error);
    return { surveyId: null, userRole: "renter" };
  }
}

/**
 * Get user's survey responses
 */
export async function getUserSurveyResponsesAction(
  userId: string
): Promise<any[]> {
  try {
    const responses = await prisma.surveyResponse.findMany({
      where: { userId },
      include: {
        survey: {
          select: {
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return responses.map((response) => ({
      ...response,
      answers: JSON.parse(response.answers),
    }));
  } catch (error) {
    console.error("Error fetching user survey responses:", error);
    return [];
  }
}

/**
 * Admin: Create a new survey
 */
export async function createSurveyAction(
  title: string,
  description: string | null,
  type: string,
  questions: SurveyQuestion[]
): Promise<{ success: boolean; surveyId?: string; error?: string }> {
  try {
    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        type,
        questions: JSON.stringify(questions),
        isActive: true,
      },
    });

    return { success: true, surveyId: survey.id };
  } catch (error) {
    console.error("Error creating survey:", error);
    return { success: false, error: "Failed to create survey" };
  }
}

/**
 * Admin: Get all surveys
 */
export async function getAllSurveysAction(): Promise<Survey[]> {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return surveys.map((survey) => ({
      ...survey,
      questions: JSON.parse(survey.questions) as SurveyQuestion[],
    }));
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }
}

/**
 * Admin: Toggle survey active status
 */
export async function toggleSurveyActiveAction(
  surveyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return { success: false, error: "Survey not found" };
    }

    await prisma.survey.update({
      where: { id: surveyId },
      data: {
        isActive: !survey.isActive,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling survey:", error);
    return { success: false, error: "Failed to toggle survey" };
  }
}
