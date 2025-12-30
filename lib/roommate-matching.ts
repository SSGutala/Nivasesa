/**
 * Roommate Matching Algorithm
 *
 * Calculates compatibility scores between roommate profiles based on:
 * - Language overlap (30%) - key differentiator for South Asian community
 * - Location overlap (25%) - same city/state preferences
 * - Lifestyle compatibility (25%) - diet, smoking, pets, sleep schedule
 * - Budget compatibility (20%) - overlapping budget ranges
 */

interface RoommateProfile {
    id: string;
    preferredCities: string;
    preferredStates: string;
    maxBudget: number;
    minBudget: number | null;
    dietaryPreference: string;
    smokingPreference: string;
    cannabisPreference: string;
    alcoholPreference: string;
    lgbtqFriendly: string;
    cleanlinessLevel: string;
    sleepSchedule: string;
    workStyle: string;
    petsPreference: string;
    languages: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export interface MatchScore {
    overall: number; // 0-100
    language: number; // 0-30
    location: number; // 0-25
    lifestyle: number; // 0-25
    budget: number; // 0-20
    breakdown: {
        languageOverlap: string[];
        locationMatch: boolean;
        lifestyleMatches: string[];
        lifestyleMismatches: string[];
        budgetOverlap: boolean;
    };
}

export interface RoommateMatch {
    profile: RoommateProfile;
    score: MatchScore;
}

/**
 * Calculate compatibility score between two roommate profiles
 */
export function calculateMatchScore(
    seeker: RoommateProfile,
    candidate: RoommateProfile
): MatchScore {
    const languageScore = calculateLanguageScore(seeker, candidate);
    const locationScore = calculateLocationScore(seeker, candidate);
    const lifestyleResult = calculateLifestyleScore(seeker, candidate);
    const budgetResult = calculateBudgetScore(seeker, candidate);

    const overall =
        languageScore.score +
        locationScore.score +
        lifestyleResult.score +
        budgetResult.score;

    return {
        overall: Math.round(overall),
        language: Math.round(languageScore.score),
        location: Math.round(locationScore.score),
        lifestyle: Math.round(lifestyleResult.score),
        budget: Math.round(budgetResult.score),
        breakdown: {
            languageOverlap: languageScore.overlap,
            locationMatch: locationScore.match,
            lifestyleMatches: lifestyleResult.matches,
            lifestyleMismatches: lifestyleResult.mismatches,
            budgetOverlap: budgetResult.overlap,
        },
    };
}

/**
 * Language compatibility (max 30 points)
 * More shared languages = higher score
 */
function calculateLanguageScore(
    seeker: RoommateProfile,
    candidate: RoommateProfile
): { score: number; overlap: string[] } {
    const seekerLangs = seeker.languages.split(', ').map((l) => l.trim().toLowerCase());
    const candidateLangs = candidate.languages
        .split(', ')
        .map((l) => l.trim().toLowerCase());

    const overlap = seekerLangs.filter((l) => candidateLangs.includes(l));

    // No overlap = 0, 1 language = 15, 2+ = 30
    let score = 0;
    if (overlap.length >= 2) {
        score = 30;
    } else if (overlap.length === 1) {
        // If only English matches, give less points
        if (overlap[0] === 'english') {
            score = 10;
        } else {
            score = 20;
        }
    }

    return {
        score,
        overlap: overlap.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    };
}

/**
 * Location compatibility (max 25 points)
 */
function calculateLocationScore(
    seeker: RoommateProfile,
    candidate: RoommateProfile
): { score: number; match: boolean } {
    const seekerCities = seeker.preferredCities
        .split(',')
        .map((c) => c.trim().toLowerCase());
    const candidateCities = candidate.preferredCities
        .split(',')
        .map((c) => c.trim().toLowerCase());

    const seekerStates = seeker.preferredStates
        .split(',')
        .map((s) => s.trim().toLowerCase());
    const candidateStates = candidate.preferredStates
        .split(',')
        .map((s) => s.trim().toLowerCase());

    // Same city = 25 points
    const cityMatch = seekerCities.some((c) => candidateCities.includes(c));
    if (cityMatch) {
        return { score: 25, match: true };
    }

    // Same state = 15 points
    const stateMatch = seekerStates.some((s) => candidateStates.includes(s));
    if (stateMatch) {
        return { score: 15, match: true };
    }

    // No location preference specified = partial match
    if (!seeker.preferredCities && !candidate.preferredCities) {
        return { score: 10, match: false };
    }

    return { score: 0, match: false };
}

/**
 * Lifestyle compatibility (max 25 points)
 * Considers diet, smoking, cannabis, alcohol, pets, cleanliness, sleep
 */
function calculateLifestyleScore(
    seeker: RoommateProfile,
    candidate: RoommateProfile
): { score: number; matches: string[]; mismatches: string[] } {
    const matches: string[] = [];
    const mismatches: string[] = [];
    let score = 0;

    // Dietary (5 points) - vegetarian/non-veg compatibility
    const dietScore = getDietCompatibility(
        seeker.dietaryPreference,
        candidate.dietaryPreference
    );
    score += dietScore.score;
    if (dietScore.match) matches.push('Diet');
    else if (dietScore.conflict) mismatches.push('Diet');

    // Smoking (4 points)
    const smokingScore = getPreferenceCompatibility(
        seeker.smokingPreference,
        candidate.smokingPreference,
        ['No Smoking'],
        4
    );
    score += smokingScore.score;
    if (smokingScore.match) matches.push('Smoking');
    else if (smokingScore.conflict) mismatches.push('Smoking');

    // Cannabis (4 points)
    const cannabisScore = getPreferenceCompatibility(
        seeker.cannabisPreference,
        candidate.cannabisPreference,
        ['No Cannabis'],
        4
    );
    score += cannabisScore.score;
    if (cannabisScore.match) matches.push('Cannabis');
    else if (cannabisScore.conflict) mismatches.push('Cannabis');

    // Alcohol (3 points)
    const alcoholScore = getPreferenceCompatibility(
        seeker.alcoholPreference,
        candidate.alcoholPreference,
        ['No Alcohol'],
        3
    );
    score += alcoholScore.score;
    if (alcoholScore.match) matches.push('Alcohol');
    else if (alcoholScore.conflict) mismatches.push('Alcohol');

    // Pets (4 points)
    const petsScore = getPetsCompatibility(
        seeker.petsPreference,
        candidate.petsPreference
    );
    score += petsScore.score;
    if (petsScore.match) matches.push('Pets');
    else if (petsScore.conflict) mismatches.push('Pets');

    // Cleanliness (3 points)
    const cleanScore = getCleanlinessCompatibility(
        seeker.cleanlinessLevel,
        candidate.cleanlinessLevel
    );
    score += cleanScore.score;
    if (cleanScore.match) matches.push('Cleanliness');
    else if (cleanScore.conflict) mismatches.push('Cleanliness');

    // Sleep schedule (2 points)
    const sleepScore = getSleepCompatibility(
        seeker.sleepSchedule,
        candidate.sleepSchedule
    );
    score += sleepScore.score;
    if (sleepScore.match) matches.push('Sleep Schedule');
    else if (sleepScore.conflict) mismatches.push('Sleep Schedule');

    return { score, matches, mismatches };
}

/**
 * Budget compatibility (max 20 points)
 */
function calculateBudgetScore(
    seeker: RoommateProfile,
    candidate: RoommateProfile
): { score: number; overlap: boolean } {
    const seekerMin = seeker.minBudget || 0;
    const seekerMax = seeker.maxBudget;
    const candidateMin = candidate.minBudget || 0;
    const candidateMax = candidate.maxBudget;

    // Check for overlap
    const hasOverlap =
        seekerMin <= candidateMax && candidateMin <= seekerMax;

    if (!hasOverlap) {
        return { score: 0, overlap: false };
    }

    // Calculate how much overlap there is
    const overlapStart = Math.max(seekerMin, candidateMin);
    const overlapEnd = Math.min(seekerMax, candidateMax);
    const overlapRange = overlapEnd - overlapStart;

    const seekerRange = seekerMax - seekerMin;
    const candidateRange = candidateMax - candidateMin;
    const avgRange = (seekerRange + candidateRange) / 2 || 1;

    // More overlap = higher score
    const overlapRatio = Math.min(overlapRange / avgRange, 1);
    const score = 10 + overlapRatio * 10; // 10-20 points

    return { score, overlap: true };
}

// Helper functions

function getDietCompatibility(
    pref1: string,
    pref2: string
): { score: number; match: boolean; conflict: boolean } {
    const vegOptions = [
        'Strict Vegetarian',
        'Vegetarian',
        'Jain',
        'Pescatarian',
    ];
    const noPreference = 'No Preference';

    // If either has no preference, partial match
    if (pref1 === noPreference || pref2 === noPreference) {
        return { score: 3, match: false, conflict: false };
    }

    // Exact match
    if (pref1 === pref2) {
        return { score: 5, match: true, conflict: false };
    }

    // Both vegetarian variants
    if (vegOptions.includes(pref1) && vegOptions.includes(pref2)) {
        return { score: 4, match: true, conflict: false };
    }

    // One strict veg, one all meat = conflict
    if (
        (pref1 === 'Strict Vegetarian' && pref2 === 'All Meat') ||
        (pref2 === 'Strict Vegetarian' && pref1 === 'All Meat')
    ) {
        return { score: 0, match: false, conflict: true };
    }

    return { score: 2, match: false, conflict: false };
}

function getPreferenceCompatibility(
    pref1: string,
    pref2: string,
    strictOptions: string[],
    maxPoints: number
): { score: number; match: boolean; conflict: boolean } {
    const noPreference = 'No Preference';

    // Exact match
    if (pref1 === pref2) {
        return { score: maxPoints, match: true, conflict: false };
    }

    // If either has no preference
    if (pref1 === noPreference || pref2 === noPreference) {
        return { score: maxPoints * 0.6, match: false, conflict: false };
    }

    // One strict, one permissive = conflict
    if (
        (strictOptions.includes(pref1) && !strictOptions.includes(pref2)) ||
        (strictOptions.includes(pref2) && !strictOptions.includes(pref1))
    ) {
        return { score: 0, match: false, conflict: true };
    }

    return { score: maxPoints * 0.5, match: false, conflict: false };
}

function getPetsCompatibility(
    pref1: string,
    pref2: string
): { score: number; match: boolean; conflict: boolean } {
    // Allergies vs has pets = major conflict
    if (
        (pref1 === 'Allergies' && pref2 === 'I Have Pets') ||
        (pref2 === 'Allergies' && pref1 === 'I Have Pets')
    ) {
        return { score: 0, match: false, conflict: true };
    }

    if (
        (pref1 === 'No Pets' && pref2 === 'I Have Pets') ||
        (pref2 === 'No Pets' && pref1 === 'I Have Pets')
    ) {
        return { score: 0, match: false, conflict: true };
    }

    // Both have no pets preference or both OK with pets
    if (pref1 === pref2) {
        return { score: 4, match: true, conflict: false };
    }

    // All Pets OK is most flexible
    if (pref1 === 'All Pets' || pref2 === 'All Pets') {
        return { score: 3, match: true, conflict: false };
    }

    return { score: 2, match: false, conflict: false };
}

function getCleanlinessCompatibility(
    level1: string,
    level2: string
): { score: number; match: boolean; conflict: boolean } {
    const levels = ['Very Clean', 'Clean', 'Average', 'Relaxed'];
    const idx1 = levels.indexOf(level1);
    const idx2 = levels.indexOf(level2);

    const diff = Math.abs(idx1 - idx2);

    if (diff === 0) return { score: 3, match: true, conflict: false };
    if (diff === 1) return { score: 2, match: true, conflict: false };
    if (diff === 2) return { score: 1, match: false, conflict: false };
    return { score: 0, match: false, conflict: true };
}

function getSleepCompatibility(
    schedule1: string,
    schedule2: string
): { score: number; match: boolean; conflict: boolean } {
    if (schedule1 === schedule2) {
        return { score: 2, match: true, conflict: false };
    }

    if (schedule1 === 'Flexible' || schedule2 === 'Flexible') {
        return { score: 1.5, match: true, conflict: false };
    }

    // Early bird vs night owl
    if (
        (schedule1 === 'Early Bird' && schedule2 === 'Night Owl') ||
        (schedule2 === 'Early Bird' && schedule1 === 'Night Owl')
    ) {
        return { score: 0.5, match: false, conflict: true };
    }

    return { score: 1, match: false, conflict: false };
}

/**
 * Find and rank matches for a seeker
 */
export function findMatches(
    seeker: RoommateProfile,
    candidates: RoommateProfile[],
    minScore: number = 40
): RoommateMatch[] {
    const matches: RoommateMatch[] = [];

    for (const candidate of candidates) {
        // Don't match with self
        if (candidate.id === seeker.id) continue;

        const score = calculateMatchScore(seeker, candidate);

        if (score.overall >= minScore) {
            matches.push({
                profile: candidate,
                score,
            });
        }
    }

    // Sort by overall score, highest first
    matches.sort((a, b) => b.score.overall - a.score.overall);

    return matches;
}
