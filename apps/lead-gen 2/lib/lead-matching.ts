/**
 * Lead Matching Utilities
 *
 * This library provides helper functions for matching leads with realtors
 * based on various criteria including location, language, and availability.
 */

import { Lead, RealtorProfile } from '@prisma/client';

/**
 * Match Quality Levels
 */
export enum MatchQuality {
  EXCELLENT = 'excellent',  // Score >= 80
  GOOD = 'good',           // Score >= 60
  FAIR = 'fair',           // Score >= 40
  POOR = 'poor',           // Score < 40
}

/**
 * Determine match quality based on score
 */
export function getMatchQuality(score: number): MatchQuality {
  if (score >= 80) return MatchQuality.EXCELLENT;
  if (score >= 60) return MatchQuality.GOOD;
  if (score >= 40) return MatchQuality.FAIR;
  return MatchQuality.POOR;
}

/**
 * Check if a realtor is a good location match for a lead
 */
export function isLocationMatch(lead: Partial<Lead>, realtor: Partial<RealtorProfile>): boolean {
  if (!lead.city || !realtor.cities) return false;

  const realtorCities = realtor.cities.split(',').map(c => c.trim().toLowerCase());
  const leadCity = lead.city.toLowerCase();

  return realtorCities.some(city =>
    city === leadCity ||
    leadCity.includes(city) ||
    city.includes(leadCity)
  );
}

/**
 * Check if a realtor speaks the lead's preferred language
 */
export function isLanguageMatch(lead: Partial<Lead>, realtor: Partial<RealtorProfile>): boolean {
  if (!lead.languagePreference || !realtor.languages) return false;

  const realtorLanguages = realtor.languages.split(',').map(l => l.trim().toLowerCase());
  const leadLanguage = lead.languagePreference.toLowerCase();

  return realtorLanguages.some(lang =>
    lang === leadLanguage ||
    leadLanguage.includes(lang) ||
    lang.includes(leadLanguage)
  );
}

/**
 * Check if a realtor serves the lead's state
 */
export function isStateMatch(lead: Partial<Lead>, realtor: Partial<RealtorProfile>): boolean {
  if (!lead.city || !realtor.states) return false;

  const realtorStates = realtor.states.split(',').map(s => s.trim().toLowerCase());
  const leadState = extractStateFromCity(lead.city);

  if (!leadState) return false;

  return realtorStates.includes(leadState);
}

/**
 * Extract state abbreviation from city name
 */
export function extractStateFromCity(city: string): string | null {
  if (!city) return null;

  const cityToState: Record<string, string> = {
    // Texas cities
    'frisco': 'tx',
    'dallas': 'tx',
    'plano': 'tx',
    'irving': 'tx',
    'austin': 'tx',
    'houston': 'tx',
    'san antonio': 'tx',
    'arlington': 'tx',
    'fort worth': 'tx',
    'mckinney': 'tx',
    'richardson': 'tx',
    'garland': 'tx',
    'denton': 'tx',

    // New Jersey cities
    'jersey city': 'nj',
    'newark': 'nj',
    'paterson': 'nj',
    'elizabeth': 'nj',
    'edison': 'nj',
    'woodbridge': 'nj',
    'lakewood': 'nj',
    'toms river': 'nj',

    // California cities
    'los angeles': 'ca',
    'san francisco': 'ca',
    'san diego': 'ca',
    'san jose': 'ca',
    'fresno': 'ca',
    'sacramento': 'ca',
    'long beach': 'ca',
    'oakland': 'ca',
    'bakersfield': 'ca',
    'anaheim': 'ca',
    'santa ana': 'ca',
    'riverside': 'ca',

    // New York cities
    'new york': 'ny',
    'buffalo': 'ny',
    'rochester': 'ny',
    'yonkers': 'ny',
    'syracuse': 'ny',
  };

  const cityLower = city.toLowerCase();

  // First try exact match
  if (cityToState[cityLower]) {
    return cityToState[cityLower];
  }

  // Try partial match
  for (const [cityName, state] of Object.entries(cityToState)) {
    if (cityLower.includes(cityName) || cityName.includes(cityLower)) {
      return state;
    }
  }

  return null;
}

/**
 * Calculate realtor workload category
 */
export function getWorkloadCategory(leadCount: number): string {
  if (leadCount === 0) return 'Available';
  if (leadCount <= 5) return 'Light Load';
  if (leadCount <= 10) return 'Moderate Load';
  if (leadCount <= 20) return 'Busy';
  if (leadCount <= 30) return 'Very Busy';
  return 'At Capacity';
}

/**
 * Normalize language names for better matching
 */
export function normalizeLanguage(language: string): string {
  const languageMap: Record<string, string> = {
    'hindi': 'hindi',
    'tamil': 'tamil',
    'telugu': 'telugu',
    'malayalam': 'malayalam',
    'kannada': 'kannada',
    'bengali': 'bengali',
    'punjabi': 'punjabi',
    'gujarati': 'gujarati',
    'marathi': 'marathi',
    'urdu': 'urdu',
    'english': 'english',
    'spanish': 'spanish',
  };

  const normalized = language.toLowerCase().trim();

  for (const [key, value] of Object.entries(languageMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  return normalized;
}

/**
 * Parse comma-separated language list into array of normalized languages
 */
export function parseLanguages(languageString: string): string[] {
  if (!languageString) return [];

  return languageString
    .split(',')
    .map(lang => normalizeLanguage(lang.trim()))
    .filter(lang => lang.length > 0);
}

/**
 * Find common languages between lead and realtor
 */
export function findCommonLanguages(
  leadLanguages: string,
  realtorLanguages: string
): string[] {
  const leadLangs = parseLanguages(leadLanguages);
  const realtorLangs = parseLanguages(realtorLanguages);

  return leadLangs.filter(lang => realtorLangs.includes(lang));
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  if (miles < 1) {
    return 'Less than 1 mile';
  } else if (miles < 10) {
    return `${Math.round(miles)} miles`;
  } else {
    return `${Math.round(miles / 5) * 5} miles`;
  }
}

/**
 * Format match score for display
 */
export function formatMatchScore(score: number): string {
  const quality = getMatchQuality(score);

  const qualityLabels = {
    [MatchQuality.EXCELLENT]: 'Excellent Match',
    [MatchQuality.GOOD]: 'Good Match',
    [MatchQuality.FAIR]: 'Fair Match',
    [MatchQuality.POOR]: 'Poor Match',
  };

  return `${score}% - ${qualityLabels[quality]}`;
}

/**
 * Generate match explanation for UI display
 */
export function generateMatchExplanation(
  locationScore: number,
  languageScore: number,
  verificationScore: number,
  availabilityScore: number
): string {
  const reasons: string[] = [];

  if (locationScore >= 35) {
    reasons.push('serves your area');
  } else if (locationScore >= 20) {
    reasons.push('nearby service area');
  }

  if (languageScore >= 25) {
    reasons.push('speaks your language');
  } else if (languageScore >= 15) {
    reasons.push('language compatible');
  }

  if (verificationScore > 0) {
    reasons.push('verified');
  }

  if (availabilityScore >= 8) {
    reasons.push('highly available');
  } else if (availabilityScore >= 5) {
    reasons.push('available');
  }

  if (reasons.length === 0) {
    return 'Potential match';
  }

  return reasons.join(' • ');
}

/**
 * Priority levels for lead assignment
 */
export enum LeadPriority {
  HIGH = 'high',      // Excellent match + high buyer intent
  MEDIUM = 'medium',  // Good match or moderate intent
  LOW = 'low',        // Fair match or exploratory intent
}

/**
 * Determine lead priority based on match quality and lead data
 */
export function calculateLeadPriority(
  matchScore: number,
  lead: Partial<Lead>
): LeadPriority {
  const quality = getMatchQuality(matchScore);
  const timeline = lead.timeline?.toLowerCase();
  const hasContact = !!(lead.buyerEmail || lead.buyerPhone);

  // High priority: excellent match + ready to buy + has contact
  if (quality === MatchQuality.EXCELLENT && timeline?.includes('asap') && hasContact) {
    return LeadPriority.HIGH;
  }

  // High priority: excellent match + near-term timeline
  if (quality === MatchQuality.EXCELLENT && (timeline?.includes('month') || timeline?.includes('asap'))) {
    return LeadPriority.HIGH;
  }

  // Medium priority: good match with any timeline
  if (quality === MatchQuality.GOOD) {
    return LeadPriority.MEDIUM;
  }

  // Medium priority: excellent match but long timeline
  if (quality === MatchQuality.EXCELLENT) {
    return LeadPriority.MEDIUM;
  }

  // Everything else is low priority
  return LeadPriority.LOW;
}

/**
 * Filter realtors by minimum match score
 */
export function filterByMinScore(
  matches: Array<{ score: number }>,
  minScore: number = 40
): Array<{ score: number }> {
  return matches.filter(match => match.score >= minScore);
}

/**
 * Group matches by quality level
 */
export function groupByQuality<T extends { score: number }>(
  matches: T[]
): Record<MatchQuality, T[]> {
  const grouped: Record<MatchQuality, T[]> = {
    [MatchQuality.EXCELLENT]: [],
    [MatchQuality.GOOD]: [],
    [MatchQuality.FAIR]: [],
    [MatchQuality.POOR]: [],
  };

  for (const match of matches) {
    const quality = getMatchQuality(match.score);
    grouped[quality].push(match);
  }

  return grouped;
}
