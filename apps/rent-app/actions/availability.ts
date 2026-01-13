'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =============================================================================
// AVAILABILITY MANAGEMENT ACTIONS
// =============================================================================

/**
 * Get availability for a listing within a date range
 */
export async function getAvailabilityAction(
    listingId: string,
    startDate: Date,
    endDate: Date
) {
    try {
        const availability = await prisma.availability.findMany({
            where: {
                listingId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        return { success: true, availability };
    } catch (error) {
        console.error('Error fetching availability:', error);
        return { success: false, message: 'Failed to fetch availability' };
    }
}

/**
 * Set availability for specific dates (bulk operation)
 */
export async function setAvailabilityAction(
    listingId: string,
    dates: Array<{
        date: Date;
        available: boolean;
        priceOverride?: number;
        minStay?: number;
        note?: string;
    }>
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user owns the listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        // Use upsert for each date to handle create or update
        await Promise.all(
            dates.map((dateConfig) =>
                prisma.availability.upsert({
                    where: {
                        listingId_date: {
                            listingId,
                            date: dateConfig.date,
                        },
                    },
                    create: {
                        listingId,
                        date: dateConfig.date,
                        available: dateConfig.available,
                        priceOverride: dateConfig.priceOverride,
                        minStay: dateConfig.minStay,
                        note: dateConfig.note,
                    },
                    update: {
                        available: dateConfig.available,
                        priceOverride: dateConfig.priceOverride,
                        minStay: dateConfig.minStay,
                        note: dateConfig.note,
                    },
                })
            )
        );

        revalidatePath('/dashboard/calendar');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Availability updated successfully' };
    } catch (error) {
        console.error('Error setting availability:', error);
        return { success: false, message: 'Failed to update availability' };
    }
}

/**
 * Block dates for a listing (mark as unavailable)
 */
export async function blockDatesAction(
    listingId: string,
    startDate: Date,
    endDate: Date,
    note?: string
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user owns the listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        // Generate all dates in range
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Block all dates in range
        await Promise.all(
            dates.map((date) =>
                prisma.availability.upsert({
                    where: {
                        listingId_date: {
                            listingId,
                            date,
                        },
                    },
                    create: {
                        listingId,
                        date,
                        available: false,
                        note,
                    },
                    update: {
                        available: false,
                        note,
                    },
                })
            )
        );

        revalidatePath('/dashboard/calendar');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Dates blocked successfully' };
    } catch (error) {
        console.error('Error blocking dates:', error);
        return { success: false, message: 'Failed to block dates' };
    }
}

/**
 * Unblock dates for a listing (mark as available)
 */
export async function unblockDatesAction(
    listingId: string,
    startDate: Date,
    endDate: Date
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user owns the listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        // Generate all dates in range
        const dates = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Unblock all dates in range
        await Promise.all(
            dates.map((date) =>
                prisma.availability.upsert({
                    where: {
                        listingId_date: {
                            listingId,
                            date,
                        },
                    },
                    create: {
                        listingId,
                        date,
                        available: true,
                    },
                    update: {
                        available: true,
                        note: null,
                    },
                })
            )
        );

        revalidatePath('/dashboard/calendar');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Dates unblocked successfully' };
    } catch (error) {
        console.error('Error unblocking dates:', error);
        return { success: false, message: 'Failed to unblock dates' };
    }
}

/**
 * Set price override for a specific date
 */
export async function setPriceOverrideAction(
    listingId: string,
    date: Date,
    price: number
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user owns the listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        await prisma.availability.upsert({
            where: {
                listingId_date: {
                    listingId,
                    date,
                },
            },
            create: {
                listingId,
                date,
                available: true,
                priceOverride: price,
            },
            update: {
                priceOverride: price,
            },
        });

        revalidatePath('/dashboard/calendar');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Price override set successfully' };
    } catch (error) {
        console.error('Error setting price override:', error);
        return { success: false, message: 'Failed to set price override' };
    }
}

/**
 * Set minimum stay requirement for a specific date
 */
export async function setMinStayAction(
    listingId: string,
    date: Date,
    minStay: number
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user owns the listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        await prisma.availability.upsert({
            where: {
                listingId_date: {
                    listingId,
                    date,
                },
            },
            create: {
                listingId,
                date,
                available: true,
                minStay,
            },
            update: {
                minStay,
            },
        });

        revalidatePath('/dashboard/calendar');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Minimum stay updated successfully' };
    } catch (error) {
        console.error('Error setting minimum stay:', error);
        return { success: false, message: 'Failed to set minimum stay' };
    }
}
