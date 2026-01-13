import prisma from './prisma';
import { Prisma } from '@prisma/client';

export async function findMatches({ city, language }: { city: string; language?: string }) {
    // Simple matching logic:
    // ...

    const allRealtors = await prisma.realtorProfile.findMany({
        where: {
            isVerified: true,
        },
        include: {
            user: true,
        },
    });

    // Perform in-memory filtering for more flexibility with the comma-separated strings
    const matches = allRealtors.filter((realtor: typeof allRealtors[0]) => {
        // Location Match (City or State)
        const locationMatch =
            realtor.cities.toLowerCase().includes(city.toLowerCase()) ||
            realtor.states.toLowerCase().includes(city.toLowerCase()); // Supporting "TX" as search too

        // Language Match (if specified)
        let langMatch = true;
        if (language && language !== 'English') {
            langMatch = realtor.languages.toLowerCase().includes(language.toLowerCase());
        }

        return locationMatch && langMatch;
    });

    return matches;
}
