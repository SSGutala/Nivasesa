'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// =============================================================================
// USER DASHBOARD DATA ACTIONS
// =============================================================================

export interface DashboardData {
    myListings: Array<{
        id: string;
        title: string;
        city: string;
        state: string;
        rent: number;
        roomType: string;
        status: string;
        freedomScore: number;
        viewCount: number;
        availableFrom: Date;
        createdAt: Date;
        _count: {
            applications: number;
        };
        applications: Array<{
            id: string;
            status: string;
        }>;
    }>;
    myApplications: Array<{
        id: string;
        status: string;
        message: string | null;
        createdAt: Date;
        updatedAt: Date;
        listing: {
            id: string;
            title: string;
            city: string;
            state: string;
            rent: number;
            roomType: string;
            availableFrom: Date;
            owner: {
                id: string;
                name: string | null;
                image: string | null;
            };
        };
    }>;
    receivedApplications: Array<{
        id: string;
        status: string;
        message: string | null;
        createdAt: Date;
        updatedAt: Date;
        listing: {
            id: string;
            title: string;
        };
        applicant: {
            id: string;
            user: {
                id: string;
                name: string | null;
                email: string;
                image: string | null;
            };
            preferredCities: string;
            maxBudget: number;
            dietaryPreference: string;
            languages: string;
        };
    }>;
}

/**
 * Get all dashboard data for the current user
 */
export async function getDashboardDataAction(): Promise<{
    success: boolean;
    data?: DashboardData;
    message?: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Get user's roommate profile (needed for applications)
        const roommateProfile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        // Get user's room listings
        const myListings = await prisma.roomListing.findMany({
            where: { ownerId: session.user.id },
            select: {
                id: true,
                title: true,
                city: true,
                state: true,
                rent: true,
                roomType: true,
                status: true,
                freedomScore: true,
                viewCount: true,
                availableFrom: true,
                createdAt: true,
                _count: {
                    select: {
                        applications: true,
                    },
                },
                applications: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get user's applications (applications they sent)
        const myApplications = roommateProfile
            ? await prisma.roomApplication.findMany({
                  where: { applicantId: roommateProfile.id },
                  select: {
                      id: true,
                      status: true,
                      message: true,
                      createdAt: true,
                      updatedAt: true,
                      listing: {
                          select: {
                              id: true,
                              title: true,
                              city: true,
                              state: true,
                              rent: true,
                              roomType: true,
                              availableFrom: true,
                              owner: {
                                  select: {
                                      id: true,
                                      name: true,
                                      image: true,
                                  },
                              },
                          },
                      },
                  },
                  orderBy: { createdAt: 'desc' },
              })
            : [];

        // Get applications to user's listings (applications they received)
        const receivedApplications = await prisma.roomApplication.findMany({
            where: {
                listing: {
                    ownerId: session.user.id,
                },
            },
            select: {
                id: true,
                status: true,
                message: true,
                createdAt: true,
                updatedAt: true,
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                applicant: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                        preferredCities: true,
                        maxBudget: true,
                        dietaryPreference: true,
                        languages: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return {
            success: true,
            data: {
                myListings,
                myApplications,
                receivedApplications,
            },
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return { success: false, message: 'Failed to fetch dashboard data' };
    }
}

/**
 * Delete a room listing
 */
export async function deleteListingAction(listingId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only delete your own listings' };
        }

        await prisma.roomListing.delete({
            where: { id: listingId },
        });

        return { success: true, message: 'Listing deleted successfully' };
    } catch (error) {
        console.error('Error deleting listing:', error);
        return { success: false, message: 'Failed to delete listing' };
    }
}

/**
 * Withdraw an application
 */
export async function withdrawApplicationAction(applicationId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const application = await prisma.roomApplication.findUnique({
            where: { id: applicationId },
            include: {
                applicant: {
                    select: { userId: true },
                },
            },
        });

        if (!application) {
            return { success: false, message: 'Application not found' };
        }

        if (application.applicant.userId !== session.user.id) {
            return { success: false, message: 'You can only withdraw your own applications' };
        }

        if (application.status !== 'pending') {
            return {
                success: false,
                message: 'You can only withdraw pending applications',
            };
        }

        await prisma.roomApplication.update({
            where: { id: applicationId },
            data: { status: 'withdrawn' },
        });

        return { success: true, message: 'Application withdrawn successfully' };
    } catch (error) {
        console.error('Error withdrawing application:', error);
        return { success: false, message: 'Failed to withdraw application' };
    }
}

/**
 * Respond to an application (accept/reject)
 */
export async function respondToApplicationAction(
    applicationId: string,
    status: 'accepted' | 'rejected'
): Promise<{
    success: boolean;
    message: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const application = await prisma.roomApplication.findUnique({
            where: { id: applicationId },
            include: {
                listing: {
                    select: { ownerId: true },
                },
            },
        });

        if (!application) {
            return { success: false, message: 'Application not found' };
        }

        if (application.listing.ownerId !== session.user.id) {
            return {
                success: false,
                message: 'You can only respond to applications for your listings',
            };
        }

        await prisma.roomApplication.update({
            where: { id: applicationId },
            data: { status },
        });

        return {
            success: true,
            message: `Application ${status} successfully`,
        };
    } catch (error) {
        console.error('Error responding to application:', error);
        return { success: false, message: 'Failed to respond to application' };
    }
}

/**
 * Mark a listing as rented
 */
export async function markListingAsRentedAction(listingId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only modify your own listings' };
        }

        await prisma.roomListing.update({
            where: { id: listingId },
            data: { status: 'rented' },
        });

        return { success: true, message: 'Listing marked as rented' };
    } catch (error) {
        console.error('Error marking listing as rented:', error);
        return { success: false, message: 'Failed to update listing' };
    }
}

/**
 * Reactivate a listing
 */
export async function reactivateListingAction(listingId: string): Promise<{
    success: boolean;
    message: string;
}> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only modify your own listings' };
        }

        await prisma.roomListing.update({
            where: { id: listingId },
            data: { status: 'active' },
        });

        return { success: true, message: 'Listing reactivated successfully' };
    } catch (error) {
        console.error('Error reactivating listing:', error);
        return { success: false, message: 'Failed to reactivate listing' };
    }
}
