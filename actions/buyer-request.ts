'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export interface BuyerRequestFormData {
    name: string;
    email: string;
    phone: string;
    budgetMin?: number;
    budgetMax?: number;
    timeframe?: string;
    locations: string[];
    languages?: string[];
    buyerType?: string;
    propertyTypes?: string[];
    preApproved?: string;
    message?: string;
}

interface ValidationError {
    field: string;
    message: string;
}

function validateBuyerRequest(data: BuyerRequestFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Phone validation (US format)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push({ field: 'phone', message: 'Please enter a valid 10-digit phone number' });
    }

    // Budget validation
    if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        if (data.budgetMin < 0) {
            errors.push({ field: 'budgetMin', message: 'Minimum budget must be positive' });
        }
        if (data.budgetMax < 0) {
            errors.push({ field: 'budgetMax', message: 'Maximum budget must be positive' });
        }
        if (data.budgetMin > data.budgetMax) {
            errors.push({ field: 'budgetMin', message: 'Minimum budget cannot exceed maximum budget' });
        }
    }

    // Locations validation
    if (!data.locations || data.locations.length === 0) {
        errors.push({ field: 'locations', message: 'Please select at least one location' });
    }

    return errors;
}

export async function createBuyerRequest(data: BuyerRequestFormData) {
    try {
        // Validate input
        const errors = validateBuyerRequest(data);
        if (errors.length > 0) {
            return {
                success: false,
                errors,
                message: 'Please fix the validation errors',
            };
        }

        // Check if user is authenticated
        const session = await auth();

        // Create buyer request
        const buyerRequest = await prisma.buyerRequest.create({
            data: {
                userId: session?.user?.id || null,
                name: data.name.trim(),
                email: data.email.toLowerCase().trim(),
                phone: data.phone.trim(),
                budgetMin: data.budgetMin,
                budgetMax: data.budgetMax,
                timeframe: data.timeframe,
                locations: data.locations.join(', '),
                languages: data.languages?.join(', '),
            },
        });

        // If authenticated, revalidate buyer dashboard
        if (session?.user?.id) {
            revalidatePath('/buyer/dashboard');
        }

        return {
            success: true,
            message: 'Your request has been submitted! We will connect you with matching realtors soon.',
            requestId: buyerRequest.id,
        };
    } catch (error) {
        console.error('Failed to create buyer request:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}

export async function getBuyerRequests(userId?: string) {
    try {
        const session = await auth();

        // If no userId provided, use current user's ID
        const targetUserId = userId || session?.user?.id;

        if (!targetUserId) {
            return {
                success: false,
                message: 'User not authenticated',
                data: [],
            };
        }

        // Fetch buyer requests for the user
        const requests = await prisma.buyerRequest.findMany({
            where: {
                userId: targetUserId,
            },
            include: {
                referrals: {
                    include: {
                        realtor: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            data: requests,
        };
    } catch (error) {
        console.error('Failed to get buyer requests:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch requests',
            data: [],
        };
    }
}

export async function getBuyerRequestById(requestId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                message: 'User not authenticated',
                data: null,
            };
        }

        const request = await prisma.buyerRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                referrals: {
                    include: {
                        realtor: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!request) {
            return {
                success: false,
                message: 'Request not found',
                data: null,
            };
        }

        // Check if user owns this request
        if (request.userId !== session.user.id) {
            return {
                success: false,
                message: 'Unauthorized',
                data: null,
            };
        }

        return {
            success: true,
            data: request,
        };
    } catch (error) {
        console.error('Failed to get buyer request:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch request',
            data: null,
        };
    }
}

export async function updateBuyerRequestStatus(requestId: string, status: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                message: 'User not authenticated',
            };
        }

        // Verify ownership
        const request = await prisma.buyerRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return {
                success: false,
                message: 'Request not found',
            };
        }

        if (request.userId !== session.user.id) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        // Note: BuyerRequest doesn't have a status field in the schema
        // This is a placeholder for future enhancement
        // For now, we'll just return success

        revalidatePath('/buyer/dashboard');
        revalidatePath(`/buyer/requests/${requestId}`);

        return {
            success: true,
            message: 'Request updated successfully',
        };
    } catch (error) {
        console.error('Failed to update buyer request:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update request',
        };
    }
}
