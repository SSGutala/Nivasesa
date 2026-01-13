
export type HostContextType = 'individual' | 'family' | 'investor' | 'manager';
export type PropertyType = 'apartment' | 'condo' | 'townhome' | 'house' | 'basement' | 'room' | 'floor';
export type PrivacyType = 'entire' | 'private' | 'shared';
export type DurationType = 'temporary' | 'short' | 'medium' | 'long';

export interface HostOnboardingData {
    // Step 0: Host Context
    hostContext: HostContextType | null;

    // Step 1: Property Type  
    propertyType: PropertyType | null;

    // Step 2: Privacy
    privacyType: PrivacyType | null;

    // Step 3: Location
    location: {
        address: string;
        unit?: string;
        city: string;
        state: string;
        zip: string;
        lat?: number;
        lng?: number;
    };

    // Step 4: Availability
    availability: {
        durationTypes: DurationType[];
        startDate: Date | null;
        endDateFlexible: boolean;
    };

    // Step 5: Household Context
    household: {
        dietary: string[]; // veg, no-beef, etc.
        languages: string[];
        lifestyle: string[]; // quiet, family, etc.
        customLanguage?: string;
    };

    // Step 6: Amenities
    amenities: string[];

    // Step 7: Photos
    photos: string[];
    coverPhotoIndex: number;

    // Step 8: Title & Description
    listingContent: {
        title: string;
        description: string;
    };

    // Step 9: Pricing
    pricing: {
        monthlyRent: number;
        deposit: boolean;
        utilities: 'yes' | 'partial' | 'no' | null;
    };

    // Step 10: Safety
    safety: {
        cameras: boolean;
        noiseMonitors: boolean;
        sharedEntrances: boolean;
        disclosures: string;
    };

    // Step 12: Account Creation
    credentials?: {
        email: string;
        password: string;
    };

    // Step 0-B: Agent Interest
    interestedInAgent: string; // 'yes' | 'no' | 'unsure'
}

export const INITIAL_DATA: HostOnboardingData = {
    hostContext: null,
    propertyType: null,
    privacyType: null,
    location: { address: '', city: '', state: '', zip: '' },
    availability: { durationTypes: [], startDate: null, endDateFlexible: false },
    household: { dietary: [], languages: [], lifestyle: [] },
    amenities: [],
    photos: [],
    coverPhotoIndex: 0,
    listingContent: { title: '', description: '' },
    pricing: { monthlyRent: 0, deposit: false, utilities: null },
    safety: { cameras: false, noiseMonitors: false, sharedEntrances: false, disclosures: '' },
    interestedInAgent: '',
};
