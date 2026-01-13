/**
 * Freedom Score Calculation
 *
 * A score from 0-100 indicating how flexible/permissive a listing is.
 * Higher score = more freedom for tenants.
 */

export interface FreedomScoreFactors {
    // Guests & Visitors (max 20 points)
    overnightGuests: string;
    extendedStays: string;
    oppositeGenderVisitors: string;
    // Romantic Partners (max 20 points)
    partnerVisits: string;
    unmarriedCouplesOk: boolean;
    sameSexCouplesWelcome: boolean;
    // Social Life (max 20 points)
    partiesAllowed: string;
    curfew: string | null;
    nightOwlFriendly: boolean;
    // Substances (max 20 points)
    smokingPolicy: string;
    cannabisPolicy: string;
    alcoholPolicy: string;
    // Diet & Cooking (max 10 points)
    beefPorkCookingOk: boolean;
    noSmellRestrictions: boolean;
    fullKitchenAccess: boolean;
    // Independence (max 10 points)
    landlordOnSite: boolean;
    privateEntrance: boolean;
    nonJudgmental: boolean;
}

export function calculateFreedomScore(factors: FreedomScoreFactors): number {
    let score = 0;

    // Guests & Visitors (max 20 points)
    const guestsScore: Record<string, number> = {
        'Anytime OK': 8,
        'Regular': 6,
        'Occasional': 3,
        'No Overnight': 0,
        'No Preference': 5,
    };
    score += guestsScore[factors.overnightGuests] || 5;

    const extendedScore: Record<string, number> = {
        'Flexible': 6,
        'Up to 1 month': 5,
        'Up to 2 weeks': 3,
        'Up to 1 week': 2,
        'Not Allowed': 0,
    };
    score += extendedScore[factors.extendedStays] || 0;

    const genderVisitorsScore: Record<string, number> = {
        'Anytime OK': 6,
        'No Preference': 6,
        'Daytime Only': 3,
        'Not Comfortable': 0,
    };
    score += genderVisitorsScore[factors.oppositeGenderVisitors] || 3;

    // Romantic Partners (max 20 points)
    const partnerScore: Record<string, number> = {
        'Anytime OK': 10,
        'Overnight OK': 8,
        'Regular OK': 6,
        'Occasional OK': 3,
        'Not Allowed': 0,
        'No Preference': 8,
    };
    score += partnerScore[factors.partnerVisits] || 5;

    if (factors.unmarriedCouplesOk) score += 5;
    if (factors.sameSexCouplesWelcome) score += 5;

    // Social Life (max 20 points)
    const partiesScore: Record<string, number> = {
        'Large OK': 10,
        'Medium OK': 7,
        'Small OK': 4,
        'No Parties': 0,
    };
    score += partiesScore[factors.partiesAllowed] || 4;

    if (!factors.curfew) score += 5; // No curfew
    else if (factors.curfew === '12am') score += 3;
    else if (factors.curfew === '11pm') score += 2;
    else if (factors.curfew === '10pm') score += 1;

    if (factors.nightOwlFriendly) score += 5;

    // Substances (max 20 points)
    const smokingScore: Record<string, number> = {
        'Smoking OK': 8,
        'Outside Only': 4,
        'No Smoking': 0,
    };
    score += smokingScore[factors.smokingPolicy] || 0;

    const cannabisScore: Record<string, number> = {
        '420 Friendly': 7,
        'Outside Only': 3,
        'No Cannabis': 0,
    };
    score += cannabisScore[factors.cannabisPolicy] || 0;

    const alcoholScore: Record<string, number> = {
        'No Preference': 5,
        'Social OK': 3,
        'No Alcohol': 0,
    };
    score += alcoholScore[factors.alcoholPolicy] || 3;

    // Diet & Cooking (max 10 points)
    if (factors.beefPorkCookingOk) score += 5;
    if (factors.noSmellRestrictions) score += 3;
    if (factors.fullKitchenAccess) score += 2;

    // Independence (max 10 points)
    if (!factors.landlordOnSite) score += 3;
    if (factors.privateEntrance) score += 3;
    if (factors.nonJudgmental) score += 4;

    return Math.min(100, score);
}

export function getFreedomScoreLabel(score: number): {
    label: string;
    color: string;
    description: string;
} {
    if (score >= 90) {
        return {
            label: 'Ultra Flexible',
            color: '#16a34a',
            description: 'One of the most flexible listings!',
        };
    }
    if (score >= 75) {
        return {
            label: 'Very Flexible',
            color: '#22c55e',
            description: 'Highly accommodating household',
        };
    }
    if (score >= 60) {
        return {
            label: 'Flexible',
            color: '#84cc16',
            description: 'Reasonable flexibility',
        };
    }
    if (score >= 40) {
        return {
            label: 'Moderate',
            color: '#eab308',
            description: 'Some restrictions apply',
        };
    }
    return {
        label: 'Traditional',
        color: '#f97316',
        description: 'More traditional household rules',
    };
}
