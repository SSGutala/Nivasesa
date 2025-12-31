export interface Listing {
    id: string;
    title: string;
    price: number;
    neighborhood: string;
    city: string;
    type: 'Entire place' | 'Private room' | 'Shared room';
    roommates: number;
    stayDuration: 'Short-term' | 'Long-term' | 'Both';
    availability: 'available' | 'in_discussion' | 'waitlist_open';
    images: string[];
    badges: string[];
    tags: string[]; // Added tags field
    preferences: {
        diet: 'Vegetarian' | 'Mixed' | 'No preference';
        cooking: 'No pork' | 'No beef' | 'No restrictions';
        languages: string[];
        lifestyle: string[];
        guestPolicy: string;
        genderPreference?: string;
    };
    amenities: string[];
    description: string;
    lat: number;
    lng: number;
}

export const MOCK_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Modern Room in Journal Square',
        price: 1150,
        neighborhood: 'Journal Square',
        city: 'Jersey City',
        type: 'Private room',
        roommates: 2,
        stayDuration: 'Long-term',
        availability: 'available',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        badges: ['Vegetarian household', 'Tamil / Hindi spoken', 'No pork cooked'],
        tags: ['Vegetarian', 'Professional', 'Quiet'],
        preferences: {
            diet: 'Vegetarian',
            cooking: 'No pork',
            languages: ['Tamil', 'Hindi', 'English'],
            lifestyle: ['Quiet', 'Working professionals'],
            guestPolicy: 'Limited',
            genderPreference: 'Open to all'
        },
        amenities: ['Laundry', 'WiFi', 'Modern Kitchen', 'Near PATH'],
        description: 'A beautiful, quiet room in the heart of Jersey City. Perfect for working professionals.',
        lat: 40.733,
        lng: -74.063
    },
    {
        id: '2',
        title: 'Spacious Midtown Room with View',
        price: 1425,
        neighborhood: 'Midtown',
        city: 'Manhattan',
        type: 'Private room',
        roommates: 2,
        stayDuration: 'Both',
        availability: 'in_discussion',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
        badges: ['Working professionals', 'Telugu / Kannada spoken', 'No beef cooked'],
        tags: ['Professional', 'Active', 'Flexible'],
        preferences: {
            diet: 'Mixed',
            cooking: 'No beef',
            languages: ['Telugu', 'Kannada', 'English'],
            lifestyle: ['Professional', 'Active'],
            guestPolicy: 'Guests allowed',
            genderPreference: 'Women preferred'
        },
        amenities: ['Doorman', 'Gym', 'Subway Access'],
        description: 'Spacious room in a luxury building. Seeking a clean and respectful roommate.',
        lat: 40.758,
        lng: -73.985
    },
    {
        id: '3',
        title: 'Upper West Side Shared Space',
        price: 1800,
        neighborhood: 'Upper West Side',
        city: 'Manhattan',
        type: 'Entire place',
        roommates: 3,
        stayDuration: 'Long-term',
        availability: 'available',
        images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
        badges: ['Vegetarian household', 'Gujarati spoken', 'Indian family'],
        tags: ['Vegetarian', 'Family-friendly', 'Traditional'],
        preferences: {
            diet: 'Vegetarian',
            cooking: 'No restrictions',
            languages: ['Gujarati', 'Hindi', 'English'],
            lifestyle: ['Family-friendly', 'Traditional'],
            guestPolicy: 'No overnight guests',
            genderPreference: 'Open to all'
        },
        amenities: ['Garden', 'Full Kitchen', 'Quiet Street'],
        description: 'Beautiful garden apartment on the UWS. Close to Central Park.',
        lat: 40.783,
        lng: -73.971
    }
];
