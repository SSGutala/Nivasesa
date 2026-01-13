'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Survey user types (only realtor-relevant)
export type SurveyUserType = 'buyer' | 'seller' | 'agent';

export interface SurveyFormData {
    userType: SurveyUserType;
    email: string;
    phone?: string;
    name?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    timeline?: string;
    languages?: string[];
    biggestChallenge?: string;
    currentSolution?: string;
    surveyData?: Record<string, unknown>;
    referralSource?: string;
}

export async function submitSurvey(data: SurveyFormData) {
    try {
        // Basic validation
        if (!data.email || !data.userType) {
            return { success: false, message: 'Email and user type are required.' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, message: 'Please enter a valid email address.' };
        }

        // Create survey response
        const surveyResponse = await prisma.surveyResponse.create({
            data: {
                userType: data.userType,
                email: data.email.toLowerCase(),
                phone: data.phone || null,
                name: data.name || null,
                city: data.city || null,
                state: data.state || null,
                zipcode: data.zipcode || null,
                timeline: data.timeline || null,
                languages: data.languages?.join(', ') || null,
                biggestChallenge: data.biggestChallenge || null,
                currentSolution: data.currentSolution || null,
                surveyData: data.surveyData ? JSON.stringify(data.surveyData) : null,
                referralSource: data.referralSource || null,
                status: 'new',
            },
        });

        return {
            success: true,
            message: 'Thank you for your interest! We\'ll be in touch soon.',
            id: surveyResponse.id,
        };
    } catch (error) {
        console.error('Failed to submit survey:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}

export async function getSurveyResponses(filters?: {
    userType?: SurveyUserType;
    status?: string;
    search?: string;
}) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: [] };
        }

        const where: Record<string, unknown> = {};

        if (filters?.userType) {
            where.userType = filters.userType;
        }

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { email: { contains: filters.search } },
                { name: { contains: filters.search } },
                { city: { contains: filters.search } },
                { phone: { contains: filters.search } },
            ];
        }

        const responses = await prisma.surveyResponse.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: responses };
    } catch (error) {
        console.error('Failed to get survey responses:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey responses.',
            data: [],
        };
    }
}

export async function getSurveyResponseById(id: string) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: null };
        }

        const response = await prisma.surveyResponse.findUnique({
            where: { id },
        });

        if (!response) {
            return { success: false, message: 'Survey response not found.', data: null };
        }

        return { success: true, data: response };
    } catch (error) {
        console.error('Failed to get survey response:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey response.',
            data: null,
        };
    }
}

export async function updateSurveyStatus(
    id: string,
    updates: {
        status?: string;
        callNotes?: string;
        calledAt?: Date;
        interviewedAt?: Date;
    }
) {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized' };
        }

        const surveyResponse = await prisma.surveyResponse.update({
            where: { id },
            data: {
                ...updates,
                updatedAt: new Date(),
            },
        });

        revalidatePath('/admin/surveys');
        revalidatePath(`/admin/surveys/${id}`);

        return { success: true, data: surveyResponse };
    } catch (error) {
        console.error('Failed to update survey response:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update survey response.',
        };
    }
}

export async function getSurveyStats() {
    try {
        // Check if user is admin
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: null };
        }

        const [
            total,
            buyers,
            sellers,
            agents,
            newStatus,
            contacted,
            scheduled,
            interviewed,
            converted,
        ] = await Promise.all([
            prisma.surveyResponse.count(),
            prisma.surveyResponse.count({ where: { userType: 'buyer' } }),
            prisma.surveyResponse.count({ where: { userType: 'seller' } }),
            prisma.surveyResponse.count({ where: { userType: 'agent' } }),
            prisma.surveyResponse.count({ where: { status: 'new' } }),
            prisma.surveyResponse.count({ where: { status: 'contacted' } }),
            prisma.surveyResponse.count({ where: { status: 'scheduled' } }),
            prisma.surveyResponse.count({ where: { status: 'interviewed' } }),
            prisma.surveyResponse.count({ where: { status: 'converted' } }),
        ]);

        return {
            success: true,
            data: {
                total,
                byUserType: {
                    buyer: buyers,
                    seller: sellers,
                    agent: agents,
                },
                byStatus: {
                    new: newStatus,
                    contacted,
                    scheduled,
                    interviewed,
                    converted,
                },
            },
        };
    } catch (error) {
        console.error('Failed to get survey stats:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch survey stats.',
            data: null,
        };
    }
}
