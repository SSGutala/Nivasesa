export interface TenantOnboardingData {
    // Step 1: Email (Identity)
    email: string;

    // Step 2: Account Security
    password?: string;
    confirmPassword?: string;

    // Step 3: Bio
    firstName: string;
    lastName: string;
    phone: string;
    newsletterConsent: boolean;

    // Step 4: Location
    location: {
        city: string;
        state: string;
        zip: string;
    };

    // Step 5: Timeline
    moveIn: {
        timeframe: string; // 'ASAP', '2-4W', etc.
        duration: string;  // 'temp', 'short', 'long'
    };

    // Step 6: Preferences
    preferences: {
        lookingFor: string; // 'room', 'roommate', 'either'
        budgetRange: string;
        cultural: string;   // 'prefer', 'open', 'notsure'
        notes: string;
    };
}

export const INITIAL_TENANT_DATA: TenantOnboardingData = {
    email: '',
    // password not stored in initial state usually for security references in simple context, but needed for submission
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    newsletterConsent: false,
    location: { city: '', state: '', zip: '' },
    moveIn: { timeframe: '', duration: '' },
    preferences: { lookingFor: '', budgetRange: '', cultural: '', notes: '' }
};
