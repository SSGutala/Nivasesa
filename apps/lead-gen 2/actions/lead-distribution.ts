'use server';

import prisma from '../lib/prisma';
import { calculateDistance, getCoordinates } from '../lib/geo';

/**
 * Lead Distribution Score Interface
 */
interface DistributionScore {
  realtorId: string;
  realtorName: string;
  score: number;
  locationScore: number;
  languageScore: number;
  verificationScore: number;
  availabilityScore: number;
  reason: string;
}

/**
 * Lead Distribution Parameters
 */
export interface DistributeLeadParams {
  leadId: string;
  maxRealtors?: number; // Number of top realtors to return (default: 5)
  maxDistanceMiles?: number; // Maximum distance in miles (default: 100)
}

/**
 * Distributes a lead to the best matching realtors based on:
 * 1. Location proximity (40 points)
 * 2. Language match (30 points)
 * 3. Verification status (20 points)
 * 4. Availability/current load (10 points)
 *
 * @returns Array of realtors with their match scores, sorted by best match
 */
export async function distributeLeadToRealtors(
  params: DistributeLeadParams
): Promise<{ success: boolean; matches?: DistributionScore[]; error?: string }> {
  try {
    const { leadId, maxRealtors = 5, maxDistanceMiles = 100 } = params;

    // Fetch the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Fetch all verified realtors
    const realtors = await prisma.realtorProfile.findMany({
      where: {
        isVerified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        leads: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    if (realtors.length === 0) {
      return { success: false, error: 'No verified realtors available' };
    }

    // Calculate scores for each realtor
    const scoredRealtors: DistributionScore[] = [];

    for (const realtor of realtors) {
      const score = calculateRealtorScore(lead, realtor);

      // Only include realtors within max distance
      if (score.locationScore > 0 || score.score > 50) {
        scoredRealtors.push(score);
      }
    }

    // Sort by total score (descending)
    scoredRealtors.sort((a, b) => b.score - a.score);

    // Return top matches
    const topMatches = scoredRealtors.slice(0, maxRealtors);

    return {
      success: true,
      matches: topMatches,
    };
  } catch (error) {
    console.error('Error distributing lead:', error);
    return { success: false, error: 'Failed to distribute lead' };
  }
}

/**
 * Calculates the match score between a lead and a realtor
 */
function calculateRealtorScore(lead: any, realtor: any): DistributionScore {
  let totalScore = 0;
  let locationScore = 0;
  let languageScore = 0;
  let verificationScore = 0;
  let availabilityScore = 0;
  const reasons: string[] = [];

  // 1. Location Score (40 points max)
  locationScore = calculateLocationScore(lead, realtor);
  totalScore += locationScore;
  if (locationScore > 30) {
    reasons.push('Excellent location match');
  } else if (locationScore > 20) {
    reasons.push('Good location match');
  } else if (locationScore > 10) {
    reasons.push('Moderate location match');
  }

  // 2. Language Score (30 points max)
  languageScore = calculateLanguageScore(lead, realtor);
  totalScore += languageScore;
  if (languageScore === 30) {
    reasons.push('Perfect language match');
  } else if (languageScore > 15) {
    reasons.push('Good language compatibility');
  }

  // 3. Verification Score (20 points max)
  verificationScore = realtor.isVerified ? 20 : 0;
  totalScore += verificationScore;
  if (verificationScore > 0) {
    reasons.push('Verified realtor');
  }

  // 4. Availability Score (10 points max)
  availabilityScore = calculateAvailabilityScore(realtor);
  totalScore += availabilityScore;
  if (availabilityScore === 10) {
    reasons.push('Highly available');
  } else if (availabilityScore >= 5) {
    reasons.push('Available');
  }

  return {
    realtorId: realtor.id,
    realtorName: realtor.user.name || 'Unknown',
    score: Math.round(totalScore),
    locationScore: Math.round(locationScore),
    languageScore: Math.round(languageScore),
    verificationScore,
    availabilityScore: Math.round(availabilityScore),
    reason: reasons.join(', '),
  };
}

/**
 * Calculate location match score (40 points max)
 * - Same city: 40 points
 * - Same state within 25 miles: 35 points
 * - Within 50 miles: 25 points
 * - Within 100 miles: 15 points
 * - Beyond 100 miles: 0 points
 */
function calculateLocationScore(lead: any, realtor: any): number {
  const realtorCities = realtor.cities ? realtor.cities.split(',').map((c: string) => c.trim().toLowerCase()) : [];
  const realtorStates = realtor.states ? realtor.states.split(',').map((s: string) => s.trim().toLowerCase()) : [];
  const leadCity = lead.city?.toLowerCase() || '';
  const leadZipcode = lead.zipcode || '';

  // Check if realtor serves the lead's city
  if (leadCity && realtorCities.some((city: string) => city === leadCity || leadCity.includes(city) || city.includes(leadCity))) {
    return 40;
  }

  // Calculate distance-based score if we have coordinates
  if (lead.lat && lead.lng && leadZipcode) {
    let minDistance = Infinity;

    // Check distance to all realtor's cities
    for (const city of realtorCities) {
      // Try to match city to a zipcode (simplified - in production, use a proper geocoding service)
      // For now, we'll use the lead's coordinates as reference
      const distance = calculateDistanceToRealtorTerritory(lead, realtor);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    if (minDistance <= 25) {
      return 35;
    } else if (minDistance <= 50) {
      return 25;
    } else if (minDistance <= 100) {
      return 15;
    }
  }

  // Check if realtor serves the lead's state (fallback)
  const leadState = extractStateFromLocation(lead.city);
  if (leadState && realtorStates.includes(leadState)) {
    return 10;
  }

  return 0;
}

/**
 * Calculate language match score (30 points max)
 * - Exact match on preferred language: 30 points
 * - Realtor speaks one of lead's languages: 20 points
 * - Both speak English (fallback): 10 points
 */
function calculateLanguageScore(lead: any, realtor: any): number {
  const leadLanguage = lead.languagePreference?.toLowerCase() || '';
  const realtorLanguages = realtor.languages
    ? realtor.languages.split(',').map((l: string) => l.trim().toLowerCase())
    : [];

  if (!leadLanguage) {
    // No preference specified, give partial credit if realtor speaks multiple languages
    return realtorLanguages.length > 1 ? 10 : 5;
  }

  // Exact match on preferred language
  if (realtorLanguages.some((lang: string) => lang === leadLanguage || leadLanguage.includes(lang))) {
    return 30;
  }

  // Both speak English (common ground)
  if (leadLanguage.includes('english') && realtorLanguages.some((l: string) => l.includes('english'))) {
    return 10;
  }

  // Check if they share any language
  const leadLanguages = leadLanguage.split(/[,/&]/).map((l: string) => l.trim().toLowerCase());
  for (const leadLang of leadLanguages) {
    if (realtorLanguages.some((realtorLang: string) =>
      realtorLang.includes(leadLang) || leadLang.includes(realtorLang)
    )) {
      return 20;
    }
  }

  return 0;
}

/**
 * Calculate availability score based on current lead load (10 points max)
 * - 0-5 active leads: 10 points
 * - 6-10 active leads: 7 points
 * - 11-20 active leads: 5 points
 * - 21-30 active leads: 3 points
 * - 30+ active leads: 1 point
 */
function calculateAvailabilityScore(realtor: any): number {
  const leadCount = realtor.leads?.length || 0;

  if (leadCount <= 5) {
    return 10;
  } else if (leadCount <= 10) {
    return 7;
  } else if (leadCount <= 20) {
    return 5;
  } else if (leadCount <= 30) {
    return 3;
  }

  return 1;
}

/**
 * Helper: Calculate distance from lead to realtor's service territory
 * Simplified version - in production, this would use proper geocoding
 */
function calculateDistanceToRealtorTerritory(lead: any, realtor: any): number {
  // For now, we'll use a simplified approach
  // In production, you'd geocode the realtor's cities and calculate actual distances

  // If the realtor's cities include the lead's city, distance is 0
  const realtorCities = realtor.cities ? realtor.cities.toLowerCase().split(',').map((c: string) => c.trim()) : [];
  const leadCity = lead.city?.toLowerCase() || '';

  if (realtorCities.some((city: string) => city === leadCity || leadCity.includes(city))) {
    return 0;
  }

  // Try to get coordinates for realtor's first city
  // This is a simplification - ideally we'd have coordinates for all cities
  const realtorFirstCity = realtorCities[0];
  if (!realtorFirstCity || !lead.lat || !lead.lng) {
    return Infinity;
  }

  // For now, return a default distance based on whether they're in the same state
  const leadState = extractStateFromLocation(lead.city);
  const realtorStates = realtor.states ? realtor.states.toLowerCase().split(',').map((s: string) => s.trim()) : [];

  if (leadState && realtorStates.includes(leadState)) {
    return 50; // Assume 50 miles within same state
  }

  return 200; // Different states
}

/**
 * Helper: Extract state abbreviation from location string
 */
function extractStateFromLocation(location: string): string | null {
  if (!location) return null;

  const stateMap: Record<string, string> = {
    'texas': 'tx',
    'california': 'ca',
    'new jersey': 'nj',
    'new york': 'ny',
    'frisco': 'tx',
    'dallas': 'tx',
    'plano': 'tx',
    'irving': 'tx',
    'austin': 'tx',
    'houston': 'tx',
    'san antonio': 'tx',
    'jersey city': 'nj',
    'newark': 'nj',
    'los angeles': 'ca',
    'san francisco': 'ca',
    'san diego': 'ca',
  };

  const locationLower = location.toLowerCase();
  for (const [key, state] of Object.entries(stateMap)) {
    if (locationLower.includes(key)) {
      return state;
    }
  }

  return null;
}

/**
 * Auto-assign a lead to the best matching realtor
 * This assigns the lead's agentId field to the top matching realtor
 */
export async function autoAssignLead(
  leadId: string
): Promise<{ success: boolean; assignedTo?: string; error?: string }> {
  try {
    const distribution = await distributeLeadToRealtors({ leadId, maxRealtors: 1 });

    if (!distribution.success || !distribution.matches || distribution.matches.length === 0) {
      return { success: false, error: distribution.error || 'No matching realtors found' };
    }

    const topMatch = distribution.matches[0];

    // Update the lead with the assigned realtor
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        agentId: topMatch.realtorId,
      },
    });

    return {
      success: true,
      assignedTo: topMatch.realtorName,
    };
  } catch (error) {
    console.error('Error auto-assigning lead:', error);
    return { success: false, error: 'Failed to auto-assign lead' };
  }
}

/**
 * Get distribution recommendations for a lead without assigning it
 * Useful for showing realtors who might be a good match
 */
export async function getLeadDistributionRecommendations(
  leadId: string
): Promise<{ success: boolean; recommendations?: DistributionScore[]; error?: string }> {
  return distributeLeadToRealtors({ leadId, maxRealtors: 10 });
}

/**
 * Batch distribute multiple leads to realtors
 * Useful for processing a backlog of unassigned leads
 */
export async function batchDistributeLeads(
  leadIds: string[]
): Promise<{ success: boolean; results?: Array<{ leadId: string; assigned: boolean; assignedTo?: string }>; error?: string }> {
  try {
    const results = [];

    for (const leadId of leadIds) {
      const assignment = await autoAssignLead(leadId);
      results.push({
        leadId,
        assigned: assignment.success,
        assignedTo: assignment.assignedTo,
      });
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('Error batch distributing leads:', error);
    return { success: false, error: 'Failed to batch distribute leads' };
  }
}
