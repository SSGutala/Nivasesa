'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type SearchParams = {
  location: string;
  language?: string;
  buyerType?: string;
  propertyType?: string;
};

export async function searchRealtors(params: SearchParams) {
  // In a real app, strict database filtering is better.
  // For MVP with comma-separated strings strings, we fetch mostly all and filter in memory or use crude contains.
  // We will try to filter as much as possible in DB query if possible, or just fetch verified and filter in JS.
  
  const verifiedRealtors = await prisma.realtorProfile.findMany({
    where: {
      isVerified: true,
      // Minimal DB filtering to avoid over-fetching
      OR: [
        { cities: { contains: params.location } },
        { states: { contains: params.location } } // Naive search
      ]
    },
    include: {
      user: true
    }
  });

  // Refined filtering in JS
  const hits = verifiedRealtors.filter((r: typeof verifiedRealtors[0]) => {
    const loc = params.location.toLowerCase();
    const cityMatch = r.cities.toLowerCase().includes(loc) || r.states.toLowerCase().includes(loc);
    if (!cityMatch) return false;

    if (params.language && params.language !== 'Any') {
      if (!r.languages.toLowerCase().includes(params.language.toLowerCase())) return false;
    }

    if (params.buyerType && params.buyerType !== 'Any') {
      if (!r.buyerTypes?.toLowerCase().includes(params.buyerType.toLowerCase())) return false;
    }

    if (params.propertyType && params.propertyType !== 'Any') {
      if (!r.propertyTypes?.toLowerCase().includes(params.propertyType.toLowerCase())) return false;
    }

    return true;
  });

  return hits;
}
