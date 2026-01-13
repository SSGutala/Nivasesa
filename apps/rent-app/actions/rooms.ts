'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { calculateFreedomScore } from '@/lib/freedom-score';

// =============================================================================
// ROOM LISTING ACTIONS
// =============================================================================

interface CreateRoomListingData {
    // Location
    city: string;
    state: string;
    zipcode: string;
    neighborhood?: string;
    address?: string;
    // Room Details
    title: string;
    description: string;
    roomType: string;
    propertyType: string;
    totalBedrooms: number;
    totalBathrooms: number;
    // Amenities
    furnished?: boolean;
    parking?: boolean;
    laundryInUnit?: boolean;
    utilities?: string;
    amenities?: string;
    // Pricing
    rent: number;
    deposit?: number;
    utilitiesIncluded?: boolean;
    // Freedom Score Factors
    overnightGuests?: string;
    extendedStays?: string;
    oppositeGenderVisitors?: string;
    partnerVisits?: string;
    unmarriedCouplesOk?: boolean;
    sameSexCouplesWelcome?: boolean;
    partiesAllowed?: string;
    curfew?: string;
    nightOwlFriendly?: boolean;
    smokingPolicy?: string;
    cannabisPolicy?: string;
    alcoholPolicy?: string;
    dietaryPreference?: string;
    beefPorkCookingOk?: boolean;
    noSmellRestrictions?: boolean;
    fullKitchenAccess?: boolean;
    landlordOnSite?: boolean;
    privateEntrance?: boolean;
    nonJudgmental?: boolean;
    // Other
    lgbtqFriendly?: boolean;
    petsPolicy?: string;
    preferredGender?: string;
    preferredAge?: string;
    languages?: string;
    availableFrom: Date;
    minLease?: string;
}

export async function createRoomListing(data: CreateRoomListingData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Calculate freedom score
        const freedomScore = calculateFreedomScore({
            overnightGuests: data.overnightGuests || 'No Preference',
            extendedStays: data.extendedStays || 'Not Allowed',
            oppositeGenderVisitors: data.oppositeGenderVisitors || 'No Preference',
            partnerVisits: data.partnerVisits || 'No Preference',
            unmarriedCouplesOk: data.unmarriedCouplesOk ?? true,
            sameSexCouplesWelcome: data.sameSexCouplesWelcome ?? true,
            partiesAllowed: data.partiesAllowed || 'Small OK',
            curfew: data.curfew || null,
            nightOwlFriendly: data.nightOwlFriendly ?? true,
            smokingPolicy: data.smokingPolicy || 'No Smoking',
            cannabisPolicy: data.cannabisPolicy || 'No Cannabis',
            alcoholPolicy: data.alcoholPolicy || 'No Preference',
            beefPorkCookingOk: data.beefPorkCookingOk ?? true,
            noSmellRestrictions: data.noSmellRestrictions ?? true,
            fullKitchenAccess: data.fullKitchenAccess ?? true,
            landlordOnSite: data.landlordOnSite ?? false,
            privateEntrance: data.privateEntrance ?? false,
            nonJudgmental: data.nonJudgmental ?? true,
        });

        const listing = await prisma.roomListing.create({
            data: {
                ownerId: session.user.id,
                ...data,
                freedomScore,
            },
        });

        revalidatePath('/rooms');
        return { success: true, listing };
    } catch (error) {
        console.error('Error creating room listing:', error);
        return { success: false, message: 'Failed to create listing' };
    }
}

export async function updateRoomListing(
    listingId: string,
    data: Partial<CreateRoomListingData>
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const existing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!existing) {
            return { success: false, message: 'Listing not found' };
        }

        if (existing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only edit your own listings' };
        }

        // Recalculate freedom score if relevant fields changed
        const freedomScore = calculateFreedomScore({
            overnightGuests: data.overnightGuests || existing.overnightGuests,
            extendedStays: data.extendedStays || existing.extendedStays,
            oppositeGenderVisitors:
                data.oppositeGenderVisitors || existing.oppositeGenderVisitors,
            partnerVisits: data.partnerVisits || existing.partnerVisits,
            unmarriedCouplesOk: data.unmarriedCouplesOk ?? existing.unmarriedCouplesOk,
            sameSexCouplesWelcome:
                data.sameSexCouplesWelcome ?? existing.sameSexCouplesWelcome,
            partiesAllowed: data.partiesAllowed || existing.partiesAllowed,
            curfew: data.curfew ?? existing.curfew,
            nightOwlFriendly: data.nightOwlFriendly ?? existing.nightOwlFriendly,
            smokingPolicy: data.smokingPolicy || existing.smokingPolicy,
            cannabisPolicy: data.cannabisPolicy || existing.cannabisPolicy,
            alcoholPolicy: data.alcoholPolicy || existing.alcoholPolicy,
            beefPorkCookingOk: data.beefPorkCookingOk ?? existing.beefPorkCookingOk,
            noSmellRestrictions:
                data.noSmellRestrictions ?? existing.noSmellRestrictions,
            fullKitchenAccess: data.fullKitchenAccess ?? existing.fullKitchenAccess,
            landlordOnSite: data.landlordOnSite ?? existing.landlordOnSite,
            privateEntrance: data.privateEntrance ?? existing.privateEntrance,
            nonJudgmental: data.nonJudgmental ?? existing.nonJudgmental,
        });

        const listing = await prisma.roomListing.update({
            where: { id: listingId },
            data: {
                ...data,
                freedomScore,
            },
        });

        revalidatePath('/rooms');
        revalidatePath(`/rooms/${listingId}`);
        return { success: true, listing };
    } catch (error) {
        console.error('Error updating room listing:', error);
        return { success: false, message: 'Failed to update listing' };
    }
}

export async function getRoomListings(filters?: {
    city?: string;
    state?: string;
    minRent?: number;
    maxRent?: number;
    roomType?: string;
    minFreedomScore?: number;
    petsPolicy?: string;
    cannabisPolicy?: string;
}) {
    const where: Record<string, unknown> = {
        status: 'AVAILABLE',
    };

    if (filters?.city) where.city = filters.city;
    if (filters?.state) where.state = filters.state;
    if (filters?.roomType) where.roomType = filters.roomType;
    if (filters?.petsPolicy) where.petsPolicy = filters.petsPolicy;
    if (filters?.cannabisPolicy) where.cannabisPolicy = filters.cannabisPolicy;
    if (filters?.minFreedomScore) {
        where.freedomScore = { gte: filters.minFreedomScore };
    }
    if (filters?.minRent || filters?.maxRent) {
        where.rent = {};
        if (filters.minRent) (where.rent as Record<string, number>).gte = filters.minRent;
        if (filters.maxRent) (where.rent as Record<string, number>).lte = filters.maxRent;
    }

    // Fetch listings
    const listings = await prisma.roomListing.findMany({
        where,
        include: {
            owner: {
                select: { id: true, name: true, image: true },
            },
        },
        orderBy: [{ freedomScore: 'desc' }, { createdAt: 'desc' }],
    });

    // Get active boosts for all listings
    const now = new Date();
    const listingIds = listings.map((l) => l.id);

    const activeBoosts = await prisma.boost.findMany({
        where: {
            type: 'listing',
            targetId: { in: listingIds },
            status: 'active',
            endDate: { gte: now },
        },
    });

    // Create boost lookup map
    const boostMap = new Map<string, { tier: string; endDate: Date }>();
    activeBoosts.forEach((boost) => {
        const existing = boostMap.get(boost.targetId);
        // Keep highest tier boost if multiple exist
        if (!existing || getTierPriority(boost.tier) > getTierPriority(existing.tier)) {
            boostMap.set(boost.targetId, { tier: boost.tier, endDate: boost.endDate });
        }
    });

    // Sort listings with boost priority
    // Order: Featured > Premium > Basic > Organic (by Freedom Score)
    const sortedListings = listings.sort((a, b) => {
        const boostA = boostMap.get(a.id);
        const boostB = boostMap.get(b.id);

        // Both boosted - compare tiers
        if (boostA && boostB) {
            const tierDiff = getTierPriority(boostB.tier) - getTierPriority(boostA.tier);
            if (tierDiff !== 0) return tierDiff;
            // Same tier - sort by Freedom Score
            return b.freedomScore - a.freedomScore;
        }

        // Only A boosted
        if (boostA) return -1;

        // Only B boosted
        if (boostB) return 1;

        // Neither boosted - sort by Freedom Score, then created date
        if (b.freedomScore !== a.freedomScore) {
            return b.freedomScore - a.freedomScore;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Attach boost info to listings
    return sortedListings.map((listing) => {
        const boost = boostMap.get(listing.id);
        return {
            ...listing,
            boost: boost ? { tier: boost.tier, endDate: boost.endDate } : null,
        };
    });
}

// Helper function to get tier priority for sorting
function getTierPriority(tier: string): number {
    switch (tier) {
        case 'featured':
            return 3;
        case 'premium':
            return 2;
        case 'basic':
            return 1;
        default:
            return 0;
    }
}

export async function getRoomListingById(listingId: string) {
    const listing = await prisma.roomListing.findUnique({
        where: { id: listingId },
        include: {
            owner: {
                select: { id: true, name: true, image: true },
            },
            applications: {
                include: {
                    applicant: {
                        include: {
                            user: {
                                select: { id: true, name: true, image: true, email: true },
                            },
                        },
                    },
                },
            },
        },
    });

    if (listing) {
        // Increment view count
        await prisma.roomListing.update({
            where: { id: listingId },
            data: { viewCount: { increment: 1 } },
        });
    }

    return listing;
}

export async function getMyListings() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return prisma.roomListing.findMany({
        where: { ownerId: session.user.id },
        include: {
            applications: {
                where: { status: 'pending' },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

// =============================================================================
// ROOM APPLICATION ACTIONS
// =============================================================================

export async function applyToRoom(listingId: string, message?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Check if user has a roommate profile
        const profile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return {
                success: false,
                message: 'Please create a roommate profile first',
            };
        }

        // Check if listing exists
        const listing = await prisma.roomListing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.status !== 'active') {
            return { success: false, message: 'This listing is no longer available' };
        }

        if (listing.ownerId === session.user.id) {
            return { success: false, message: 'You cannot apply to your own listing' };
        }

        // Check for existing application
        const existingApp = await prisma.roomApplication.findUnique({
            where: {
                listingId_applicantId: {
                    listingId,
                    applicantId: profile.id,
                },
            },
        });

        if (existingApp) {
            return { success: false, message: 'You have already applied to this room' };
        }

        await prisma.roomApplication.create({
            data: {
                listingId,
                applicantId: profile.id,
                message,
            },
        });

        revalidatePath(`/rooms/${listingId}`);
        return { success: true, message: 'Application submitted successfully' };
    } catch (error) {
        console.error('Error applying to room:', error);
        return { success: false, message: 'Failed to submit application' };
    }
}

export async function respondToApplication(
    applicationId: string,
    status: 'accepted' | 'rejected'
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const application = await prisma.roomApplication.findUnique({
            where: { id: applicationId },
            include: {
                listing: true,
            },
        });

        if (!application) {
            return { success: false, message: 'Application not found' };
        }

        if (application.listing.ownerId !== session.user.id) {
            return { success: false, message: 'You can only respond to applications for your listings' };
        }

        await prisma.roomApplication.update({
            where: { id: applicationId },
            data: { status },
        });

        revalidatePath(`/rooms/${application.listingId}`);
        return { success: true, message: `Application ${status}` };
    } catch (error) {
        console.error('Error responding to application:', error);
        return { success: false, message: 'Failed to respond to application' };
    }
}

export async function getMyApplications() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const profile = await prisma.roommateProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        return [];
    }

    return prisma.roomApplication.findMany({
        where: { applicantId: profile.id },
        include: {
            listing: {
                include: {
                    owner: {
                        select: { name: true, image: true },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
