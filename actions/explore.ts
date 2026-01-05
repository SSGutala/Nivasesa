'use server';

import { prisma } from '@/lib/prisma';
import type { Listing } from '@/lib/listings-data';
import type { RoomListing } from '@prisma/client';

// =============================================================================
// EXPLORE PAGE ACTIONS - Transform RoomListing to Sai's Listing interface
// =============================================================================

export interface ExploreFilters {
    // Location
    city?: string;
    state?: string;

    // Price
    minPrice?: number;
    maxPrice?: number;

    // Room type
    roomType?: 'Entire place' | 'Private room' | 'Shared room';

    // Cultural preferences
    diet?: 'Vegetarian' | 'Mixed' | 'No preference';
    cooking?: 'No pork' | 'No beef' | 'No restrictions';

    // Lifestyle
    lifestyle?: string[];
    guestPolicy?: string;

    // Freedom Score
    minFreedomScore?: number;
}

// Transform database RoomListing to frontend Listing interface
function transformToListing(room: RoomListing & { owner?: { name: string | null; image: string | null } }): Listing {
    // Parse photos JSON
    const photos = room.photos ? JSON.parse(room.photos) : [];
    const images = photos.length > 0
        ? photos
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'];

    // Build badges based on preferences
    const badges: string[] = [];

    // Diet badge
    if (room.dietaryPreference === 'Vegetarian Only') {
        badges.push('Vegetarian household');
    } else if (room.dietaryPreference === 'Halal Only') {
        badges.push('Halal household');
    }

    // Cooking restrictions
    if (!room.beefPorkCookingOk) {
        badges.push('No beef/pork cooked');
    }

    // Languages
    if (room.languages) {
        const langs = room.languages.split(',').slice(0, 2).join(' / ');
        badges.push(`${langs} spoken`);
    }

    // LGBTQ+ friendly
    if (room.lgbtqFriendly) {
        badges.push('LGBTQ+ friendly');
    }

    // Freedom score badge
    if (room.freedomScore >= 80) {
        badges.push('High freedom');
    }

    // Build tags
    const tags: string[] = [];
    if (room.dietaryPreference?.includes('Vegetarian')) tags.push('Vegetarian');
    if (room.nightOwlFriendly) tags.push('Night owl friendly');
    if (room.partiesAllowed !== 'No Parties') tags.push('Social');
    if (room.curfew) tags.push('Quiet');

    // Map room type
    const typeMap: Record<string, Listing['type']> = {
        'Private Room': 'Private room',
        'Shared Room': 'Shared room',
        'Master Bedroom': 'Private room',
        'Studio': 'Entire place',
    };

    // Map availability status based on applications count (simplified)
    const availability: Listing['availability'] = room.status === 'active' ? 'available' : 'in_discussion';

    // Map stay duration based on minLease
    const stayDuration: Listing['stayDuration'] =
        room.minLease === '3 months' ? 'Short-term' :
        room.minLease === '12 months' ? 'Long-term' : 'Both';

    // Map diet preference
    const dietMap: Record<string, Listing['preferences']['diet']> = {
        'Vegetarian Only': 'Vegetarian',
        'Halal Only': 'Mixed',
        'No Preference': 'No preference',
    };

    // Map cooking preference
    const cookingPref: Listing['preferences']['cooking'] =
        !room.beefPorkCookingOk ? 'No beef' : 'No restrictions';

    // Build lifestyle array
    const lifestyle: string[] = [];
    if (room.curfew) lifestyle.push('Quiet');
    if (room.nightOwlFriendly) lifestyle.push('Night owl friendly');
    if (room.partiesAllowed !== 'No Parties') lifestyle.push('Social');
    if (!room.landlordOnSite) lifestyle.push('Independent');

    // Parse amenities
    const amenities = room.amenities ? room.amenities.split(',').map(a => a.trim()) : [];
    if (room.laundryInUnit) amenities.push('In-unit laundry');
    if (room.parking) amenities.push('Parking');
    if (room.furnished) amenities.push('Furnished');

    return {
        id: room.id,
        title: room.title,
        price: room.rent,
        neighborhood: room.neighborhood || room.city,
        city: room.city,
        type: typeMap[room.roomType] || 'Private room',
        roommates: room.totalBedrooms - 1, // Estimate based on bedrooms
        stayDuration,
        availability,
        images,
        badges,
        tags,
        preferences: {
            diet: dietMap[room.dietaryPreference] || 'No preference',
            cooking: cookingPref,
            languages: room.languages ? room.languages.split(',').map(l => l.trim()) : ['English'],
            lifestyle,
            guestPolicy: room.overnightGuests || 'No Preference',
            genderPreference: room.preferredGender || 'Open to all',
        },
        amenities,
        description: room.description,
        // Note: lat/lng would come from geocoding the address
        // For now, use approximate coords based on city
        lat: getCityLat(room.city, room.state),
        lng: getCityLng(room.city, room.state),
    };
}

// Approximate city coordinates (would use geocoding API in production)
function getCityLat(city: string, state: string): number {
    const coords: Record<string, number> = {
        'Jersey City_NJ': 40.7282,
        'Manhattan_NY': 40.7831,
        'Brooklyn_NY': 40.6782,
        'Frisco_TX': 33.1507,
        'Dallas_TX': 32.7767,
        'Irving_TX': 32.8140,
        'Plano_TX': 33.0198,
    };
    return coords[`${city}_${state}`] || 40.7128;
}

function getCityLng(city: string, state: string): number {
    const coords: Record<string, number> = {
        'Jersey City_NJ': -74.0776,
        'Manhattan_NY': -73.9712,
        'Brooklyn_NY': -73.9442,
        'Frisco_TX': -96.8236,
        'Dallas_TX': -96.7970,
        'Irving_TX': -96.9489,
        'Plano_TX': -96.6989,
    };
    return coords[`${city}_${state}`] || -74.0060;
}

// =============================================================================
// MAIN EXPLORE ACTION
// =============================================================================

export async function getExploreListings(filters?: ExploreFilters): Promise<Listing[]> {
    // Build Prisma where clause
    const where: Record<string, unknown> = {
        status: 'active',
    };

    // Location filters
    if (filters?.city) where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters?.state) where.state = filters.state;

    // Price filters
    if (filters?.minPrice || filters?.maxPrice) {
        where.rent = {};
        if (filters.minPrice) (where.rent as Record<string, number>).gte = filters.minPrice;
        if (filters.maxPrice) (where.rent as Record<string, number>).lte = filters.maxPrice;
    }

    // Room type filter
    if (filters?.roomType) {
        const typeMap: Record<string, string[]> = {
            'Entire place': ['Studio'],
            'Private room': ['Private Room', 'Master Bedroom'],
            'Shared room': ['Shared Room'],
        };
        where.roomType = { in: typeMap[filters.roomType] || [filters.roomType] };
    }

    // Diet filter
    if (filters?.diet) {
        if (filters.diet === 'Vegetarian') {
            where.dietaryPreference = 'Vegetarian Only';
        } else if (filters.diet === 'Mixed') {
            where.dietaryPreference = { not: 'Vegetarian Only' };
        }
    }

    // Cooking filter
    if (filters?.cooking) {
        if (filters.cooking === 'No beef' || filters.cooking === 'No pork') {
            where.beefPorkCookingOk = false;
        }
    }

    // Freedom score filter
    if (filters?.minFreedomScore) {
        where.freedomScore = { gte: filters.minFreedomScore };
    }

    try {
        const rooms = await prisma.roomListing.findMany({
            where,
            include: {
                owner: {
                    select: { name: true, image: true },
                },
            },
            orderBy: [
                { freedomScore: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 50, // Limit results
        });

        return rooms.map(transformToListing);
    } catch (error) {
        console.error('Error fetching explore listings:', error);
        return [];
    }
}

// Get a single listing for the detail page
export async function getExploreListing(id: string): Promise<Listing | null> {
    try {
        const room = await prisma.roomListing.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { name: true, image: true },
                },
            },
        });

        if (!room) return null;

        // Increment view count
        await prisma.roomListing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return transformToListing(room);
    } catch (error) {
        console.error('Error fetching listing:', error);
        return null;
    }
}

// Get listing counts by city for search suggestions
export async function getListingCountsByCity(): Promise<Array<{ city: string; state: string; count: number }>> {
    try {
        const counts = await prisma.roomListing.groupBy({
            by: ['city', 'state'],
            where: { status: 'active' },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        return counts.map(c => ({
            city: c.city,
            state: c.state,
            count: c._count.id,
        }));
    } catch (error) {
        console.error('Error fetching city counts:', error);
        return [];
    }
}
