export interface Listing {
    id: string;
    title: string;
    price: number;
    neighborhood: string;
    city: string;
    // 5. Space Type
    spaceType: 'Private Room' | 'Shared Room' | 'Studio' | 'Basement' | 'Entire Place' | 'Room in House' | 'Apartment' | 'Condo' | 'Townhome' | 'Single-Family Home';
    // 6. Lease & Stay Type
    leaseTerms: ('Short-Term' | 'Long-Term' | 'Sublease' | 'Lease' | 'Month-to-Month' | 'Flexible Stay' | 'Internship Friendly' | 'Temporary Stay')[];
    leaseType: 'lease' | 'sublease'; // Keeping for backward compatibility with toggle for now, can derive later

    roommates: number;
    availability: 'Available Now' | 'Available Soon' | 'In Discussion' | 'Waitlist Open' | 'High Demand' | 'Low Availability';

    images: string[];

    // 1. Dietary & Food Preferences
    dietary: {
        vegetarian?: boolean;
        vegan?: boolean;
        eggFree?: boolean;
        nonVegFriendly?: boolean;
        noBeef?: boolean;
        noPork?: boolean;
        halalFriendly?: boolean;
        jainFriendly?: boolean;
        seafoodOk?: boolean;
        chickenOk?: boolean;
        kitchen: 'Shared Kitchen' | 'Separate Kitchen Access';
    };

    // 2. Language Comfort
    languages: string[];

    // 3. Cultural & Lifestyle Norms
    lifestyle: ('Quiet Home' | 'Social Home' | 'Early Riser Household' | 'Late-Night Friendly' | 'Family-Oriented' | 'Student-Friendly' | 'Working Professionals' | 'Religious Practices Respected' | 'Festival-Friendly' | 'Shoes-Off Home' | 'Guests OK' | 'Limited Guests' | 'No Overnight Guests')[];

    // 4. House Rules
    rules: {
        smoking: 'No Smoking' | 'No Drugs' | 'Alcohol OK' | 'Alcohol-Free';
        pets: 'Pets OK' | 'No Pets';
        partying: 'No Parties' | 'Small Gatherings OK';
    };

    // 7. Furnishing & Utilities
    furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
    utilities: ('Utilities Included' | 'Wi-Fi Included' | 'Electric Extra' | 'Water Included')[];

    // 8. Amenities
    amenities: string[];

    // 9. Building / Community Features
    communityFeatures: string[];

    // 11. Compatibility Signals
    compatibility: 'Women-Only' | 'Men-Only' | 'Mixed Household' | 'Couples OK' | 'Singles Preferred';

    // 12. Visual Priority Tags
    visualTags: ('Featured' | 'Boosted' | 'New Listing' | 'Verified Listing')[];

    description: string;
    lat: number;
    lng: number;

    // Legacy mapping (to avoid immediate breakage in components I haven't updated yet)
    // I will map new fields to these where possible or keep them until full migration
    type?: string;
    stayDuration?: string;
    badges?: string[];
    preferences?: any;
}

export const MOCK_LISTINGS: Listing[] = [
    // --- LEASE LISTINGS (Target: 5) ---
    // 1. NYC (Manhattan)
    {
        id: '2',
        title: 'Spacious Midtown Room with View',
        price: 1425,
        neighborhood: 'Midtown',
        city: 'Manhattan',
        spaceType: 'Private Room',
        leaseType: 'lease',
        leaseTerms: ['Long-Term', 'Flexible Stay'],
        roommates: 2,
        availability: 'In Discussion',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            nonVegFriendly: true,
            noBeef: true,
            noPork: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['Telugu', 'Kannada', 'English'],
        lifestyle: ['Working Professionals', 'Shoes-Off Home'],
        rules: {
            smoking: 'No Smoking',
            pets: 'No Pets',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Unfurnished',
        utilities: ['Water Included', 'Wi-Fi Included'],
        amenities: ['Doorman', 'Gym', 'Elevator'],
        communityFeatures: ['Near Transit', 'Walkable Area'],
        compatibility: 'Women-Only',
        visualTags: ['Featured', 'Verified Listing'],
        description: 'Spacious room in a luxury building.',
        lat: 40.758,
        lng: -73.985
    },
    // 2. Washington DC
    {
        id: 'dc-1',
        title: 'Capitol Hill Historic Rowhouse',
        price: 1600,
        neighborhood: 'Capitol Hill',
        city: 'Washington DC',
        spaceType: 'Private Room',
        leaseType: 'lease',
        leaseTerms: ['Long-Term'],
        roommates: 3,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            vegetarian: true,
            jainFriendly: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['Hindi', 'English'],
        lifestyle: ['Social Home', 'Working Professionals', 'Shoes-Off Home'],
        rules: {
            smoking: 'No Smoking',
            pets: 'Pets OK',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Semi-Furnished',
        utilities: ['Water Included'],
        amenities: ['Washer/Dryer', 'Backyard'],
        communityFeatures: ['Walkable Area', 'Near Transit'],
        compatibility: 'Mixed Household',
        visualTags: ['New Listing'],
        description: 'Charming room in a historic rowhouse near Eastern Market.',
        lat: 38.8899,
        lng: -77.0091
    },
    // 3. San Francisco
    {
        id: 'sf-1',
        title: 'Sunny Mission District Flat',
        price: 1950,
        neighborhood: 'Mission District',
        city: 'San Francisco',
        spaceType: 'Private Room',
        leaseType: 'lease',
        leaseTerms: ['Long-Term'],
        roommates: 2,
        availability: 'Available Soon',
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            halalFriendly: true,
            noPork: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['English', 'Urdu'],
        lifestyle: ['Social Home', 'Working Professionals', 'Guests OK'],
        rules: {
            smoking: 'Alcohol OK',
            pets: 'No Pets',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Unfurnished',
        utilities: ['Wi-Fi Included'],
        amenities: ['In-Unit Laundry', 'Bike storage', 'Balcony'],
        communityFeatures: ['Walkable Area', 'Near Transit'],
        compatibility: 'Mixed Household',
        visualTags: ['Verified Listing'],
        description: 'Light-filled room in the heart of the Mission.',
        lat: 37.7599,
        lng: -122.4148
    },
    // 4. Los Angeles
    {
        id: 'la-1',
        title: 'Silver Lake Artiste Bungalow',
        price: 1650,
        neighborhood: 'Silver Lake',
        city: 'Los Angeles',
        spaceType: 'Private Room',
        leaseType: 'lease',
        leaseTerms: ['Long-Term', 'Month-to-Month'],
        roommates: 2,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            vegan: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['English', 'Gujarati'],
        lifestyle: ['Quiet Home', 'Early Riser Household', 'Shoes-Off Home'],
        rules: {
            smoking: 'No Smoking',
            pets: 'Pets OK',
            partying: 'No Parties'
        },
        furnishing: 'Furnished',
        utilities: ['Utilities Included', 'Wi-Fi Included'],
        amenities: ['Central AC', 'Backyard', 'Parking'],
        communityFeatures: ['Quiet Building'],
        compatibility: 'Mixed Household',
        visualTags: ['Featured'],
        description: 'Boho-chic bungalow near Sunset Junction.',
        lat: 34.0869,
        lng: -118.2702
    },
    // 5. Miami
    {
        id: 'mia-1',
        title: 'Brickell High-Rise Room',
        price: 1700,
        neighborhood: 'Brickell',
        city: 'Miami',
        spaceType: 'Private Room',
        leaseType: 'lease',
        leaseTerms: ['Long-Term'],
        roommates: 1,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            nonVegFriendly: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['Spanish', 'English', 'Punjabi'],
        lifestyle: ['Social Home', 'Late-Night Friendly'],
        rules: {
            smoking: 'Alcohol OK',
            pets: 'No Pets',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Unfurnished',
        utilities: ['Water Included'],
        amenities: ['Pool', 'Gym', 'Valet', 'Central AC'],
        communityFeatures: ['Doorman', 'Security Cameras', 'Near Transit'],
        compatibility: 'Couples OK',
        visualTags: ['Boosted'],
        description: 'Live in the heart of Miami financial district.',
        lat: 25.7617,
        lng: -80.1918
    },

    // --- SUBLEASE LISTINGS (Target: 4) ---
    // 1. Jersey City
    {
        id: '1',
        title: 'Modern Room in Journal Square',
        price: 1150,
        neighborhood: 'Journal Square',
        city: 'Jersey City',
        spaceType: 'Private Room',
        leaseType: 'sublease',
        leaseTerms: ['Sublease', 'Short-Term', 'Internship Friendly'],
        roommates: 2,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            vegetarian: true,
            noPork: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['Tamil', 'Hindi', 'English'],
        lifestyle: ['Quiet Home', 'Working Professionals', 'No Overnight Guests'],
        rules: {
            smoking: 'No Smoking',
            pets: 'No Pets',
            partying: 'No Parties'
        },
        furnishing: 'Furnished',
        utilities: ['Utilities Included', 'Wi-Fi Included'],
        amenities: ['In-Unit Laundry', 'Central AC', 'Dishwasher'],
        communityFeatures: ['Near Transit', 'Walkable Area'],
        compatibility: 'Mixed Household',
        visualTags: ['Verified Listing'],
        description: 'A beautiful, quiet room in the heart of Jersey City.',
        lat: 40.733,
        lng: -74.063
    },
    // 2. Chicago (Wicker Park)
    {
        id: 'chi-2',
        title: 'Wicker Park Vintage Walk-up',
        price: 950,
        neighborhood: 'Wicker Park',
        city: 'Chicago',
        spaceType: 'Private Room',
        leaseType: 'sublease',
        leaseTerms: ['Sublease', 'Short-Term'],
        roommates: 3,
        availability: 'Available Soon',
        images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            nonVegFriendly: true,
            kitchen: 'Shared Kitchen'
        },
        languages: ['English', 'Bengali'],
        lifestyle: ['Social Home', 'Student-Friendly'],
        rules: {
            smoking: 'Alcohol OK',
            pets: 'Pets OK',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Semi-Furnished',
        utilities: ['Water Included'],
        amenities: ['Backyard', 'Washer/Dryer'],
        communityFeatures: ['Near Transit', 'Walkable Area'],
        compatibility: 'Mixed Household',
        visualTags: [],
        description: 'Classic Chicago walk-up with exposed brick.',
        lat: 41.9088,
        lng: -87.6796
    },
    // 3. Austin/Houston (actually Houston Downtown)
    {
        id: 'hou-2',
        title: 'Downtown Houston Loft',
        price: 1300,
        neighborhood: 'Downtown',
        city: 'Houston',
        spaceType: 'Entire Place',
        leaseType: 'sublease',
        leaseTerms: ['Sublease', 'Short-Term', 'Temporary Stay'],
        roommates: 0,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            nonVegFriendly: true,
            kitchen: 'Separate Kitchen Access'
        },
        languages: ['English', 'Malayalam'],
        lifestyle: ['Quiet Home'],
        rules: {
            smoking: 'No Smoking',
            pets: 'No Pets',
            partying: 'No Parties'
        },
        furnishing: 'Furnished',
        utilities: ['Utilities Included', 'Wi-Fi Included'],
        amenities: ['Pool', 'Gym', 'Concierge', 'Elevator'],
        communityFeatures: ['Gated Community', 'Security Cameras'],
        compatibility: 'Couples OK',
        visualTags: ['New Listing'],
        description: 'Industrial loft available for 3-month sublet.',
        lat: 29.7604,
        lng: -95.3698
    },
    // 4. Las Vegas (Strip View)
    {
        id: 'lv-2',
        title: 'Strip View High-Rise Sublet',
        price: 1800,
        neighborhood: 'The Strip',
        city: 'Las Vegas',
        spaceType: 'Entire Place',
        leaseType: 'sublease',
        leaseTerms: ['Sublease', 'Short-Term'],
        roommates: 0,
        availability: 'Available Now',
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'],
        dietary: {
            nonVegFriendly: true,
            kitchen: 'Separate Kitchen Access'
        },
        languages: ['English', 'Marathi'],
        lifestyle: ['Late-Night Friendly', 'Guests OK'],
        rules: {
            smoking: 'Alcohol OK',
            pets: 'No Pets',
            partying: 'Small Gatherings OK'
        },
        furnishing: 'Furnished',
        utilities: ['Utilities Included', 'Wi-Fi Included'],
        amenities: ['Pool', 'Valet', 'Gym', 'Central AC'],
        communityFeatures: ['Doorman', 'Security Cameras'],
        compatibility: 'Couples OK',
        visualTags: ['Featured'],
        description: 'Live the high rolling life for a few months. Amazing views.',
        lat: 36.1147,
        lng: -115.1728
    }
];
