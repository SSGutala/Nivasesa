// Target cities with South Asian community data
// Population estimates based on Census data and community studies

export interface CityData {
    slug: string;
    name: string;
    state: string;
    stateAbbr: string;
    metro: string;
    southAsianPop: number; // Estimated South Asian population
    southAsianPercent: number; // Percentage of total population
    topLanguages: string[];
    neighborhoods: string[];
    landmarks: string[]; // Temples, mosques, grocery stores, etc.
    avgRent: number; // Average room rent
    description: string;
}

export const CITIES: CityData[] = [
    {
        slug: 'frisco-tx',
        name: 'Frisco',
        state: 'Texas',
        stateAbbr: 'TX',
        metro: 'Dallas-Fort Worth',
        southAsianPop: 35000,
        southAsianPercent: 18,
        topLanguages: ['Telugu', 'Hindi', 'Tamil', 'Gujarati'],
        neighborhoods: ['Stonebriar', 'Frisco Square', 'Newman Village', 'Phillips Creek Ranch'],
        landmarks: ['DFW Hindu Temple', 'India Bazaar', 'Patel Brothers', 'BAPS Shri Swaminarayan Mandir'],
        avgRent: 850,
        description: 'Frisco has one of the fastest-growing South Asian communities in Texas, with excellent schools and a thriving tech industry.',
    },
    {
        slug: 'plano-tx',
        name: 'Plano',
        state: 'Texas',
        stateAbbr: 'TX',
        metro: 'Dallas-Fort Worth',
        southAsianPop: 45000,
        southAsianPercent: 15,
        topLanguages: ['Hindi', 'Telugu', 'Tamil', 'Urdu'],
        neighborhoods: ['Legacy West', 'West Plano', 'Shops at Legacy', 'Preston Hollow'],
        landmarks: ['Karya Siddhi Hanuman Temple', 'India Bazaar', 'Taj Grocers', 'Islamic Association of Collin County'],
        avgRent: 900,
        description: 'Plano is a major hub for South Asian professionals with numerous tech companies and a well-established Indian community.',
    },
    {
        slug: 'irving-tx',
        name: 'Irving',
        state: 'Texas',
        stateAbbr: 'TX',
        metro: 'Dallas-Fort Worth',
        southAsianPop: 25000,
        southAsianPercent: 10,
        topLanguages: ['Hindi', 'Telugu', 'Urdu', 'Gujarati'],
        neighborhoods: ['Las Colinas', 'Valley Ranch', 'North Irving'],
        landmarks: ['Fun Asia', 'Shalimar Indian Cuisine', 'India Bazaar Irving'],
        avgRent: 750,
        description: 'Irving offers affordable housing near major employers with a diverse South Asian community.',
    },
    {
        slug: 'jersey-city-nj',
        name: 'Jersey City',
        state: 'New Jersey',
        stateAbbr: 'NJ',
        metro: 'New York City',
        southAsianPop: 55000,
        southAsianPercent: 20,
        topLanguages: ['Gujarati', 'Hindi', 'Bengali', 'Punjabi'],
        neighborhoods: ['Journal Square', 'India Square', 'Heights', 'Downtown'],
        landmarks: ['India Square', 'Patel Brothers', 'Swaminarayan Mandir', 'Journal Square Transportation Center'],
        avgRent: 1100,
        description: 'Jersey City\'s India Square is one of the most vibrant South Asian neighborhoods on the East Coast.',
    },
    {
        slug: 'edison-nj',
        name: 'Edison',
        state: 'New Jersey',
        stateAbbr: 'NJ',
        metro: 'New York City',
        southAsianPop: 48000,
        southAsianPercent: 45,
        topLanguages: ['Gujarati', 'Hindi', 'Telugu', 'Tamil'],
        neighborhoods: ['Oak Tree Road', 'Iselin', 'Clara Barton', 'North Edison'],
        landmarks: ['Oak Tree Road', 'Swaminarayan Mandir Edison', 'Subzi Mandi', 'Patel Brothers'],
        avgRent: 950,
        description: 'Edison has the highest concentration of South Asians in New Jersey, centered around the famous Oak Tree Road.',
    },
    {
        slug: 'fremont-ca',
        name: 'Fremont',
        state: 'California',
        stateAbbr: 'CA',
        metro: 'San Francisco Bay Area',
        southAsianPop: 75000,
        southAsianPercent: 30,
        topLanguages: ['Hindi', 'Gujarati', 'Telugu', 'Tamil'],
        neighborhoods: ['Warm Springs', 'Irvington', 'Centerville', 'Niles'],
        landmarks: ['Fremont Hindu Temple', 'India Cash & Carry', 'New Park Mall'],
        avgRent: 1400,
        description: 'Fremont is the heart of the Bay Area\'s South Asian community with excellent tech job opportunities.',
    },
    {
        slug: 'san-jose-ca',
        name: 'San Jose',
        state: 'California',
        stateAbbr: 'CA',
        metro: 'San Francisco Bay Area',
        southAsianPop: 85000,
        southAsianPercent: 12,
        topLanguages: ['Hindi', 'Telugu', 'Tamil', 'Punjabi'],
        neighborhoods: ['Berryessa', 'Evergreen', 'Milpitas border', 'Santa Clara border'],
        landmarks: ['Shiva Vishnu Temple', 'India Community Center', 'Patel Brothers'],
        avgRent: 1500,
        description: 'San Jose offers abundant tech jobs and a large, diverse South Asian community in the heart of Silicon Valley.',
    },
    {
        slug: 'sunnyvale-ca',
        name: 'Sunnyvale',
        state: 'California',
        stateAbbr: 'CA',
        metro: 'San Francisco Bay Area',
        southAsianPop: 35000,
        southAsianPercent: 22,
        topLanguages: ['Telugu', 'Hindi', 'Tamil', 'Kannada'],
        neighborhoods: ['Lakewood', 'Raynor Park', 'Cherry Chase'],
        landmarks: ['Sunnyvale Hindu Temple', 'India Cash & Carry', 'Apna Bazar'],
        avgRent: 1600,
        description: 'Sunnyvale has a strong Telugu and South Indian community with proximity to major tech campuses.',
    },
    {
        slug: 'alpharetta-ga',
        name: 'Alpharetta',
        state: 'Georgia',
        stateAbbr: 'GA',
        metro: 'Atlanta',
        southAsianPop: 18000,
        southAsianPercent: 12,
        topLanguages: ['Telugu', 'Hindi', 'Tamil', 'Gujarati'],
        neighborhoods: ['Johns Creek border', 'Windward', 'Avalon'],
        landmarks: ['BAPS Shri Swaminarayan Mandir Atlanta', 'Patel Brothers', 'Cherians'],
        avgRent: 900,
        description: 'Alpharetta is a growing hub for South Asian tech professionals in the Atlanta metro area.',
    },
    {
        slug: 'iselin-nj',
        name: 'Iselin',
        state: 'New Jersey',
        stateAbbr: 'NJ',
        metro: 'New York City',
        southAsianPop: 15000,
        southAsianPercent: 35,
        topLanguages: ['Gujarati', 'Hindi', 'Telugu', 'Marathi'],
        neighborhoods: ['Oak Tree Road area', 'Woodbridge Township'],
        landmarks: ['Oak Tree Road', 'Patel Brothers', 'Apna Bazar', 'Subzi Mandi'],
        avgRent: 900,
        description: 'Iselin is an extension of the Oak Tree Road corridor with a dense South Asian population.',
    },
];

// Helper functions
export function getCityBySlug(slug: string): CityData | undefined {
    return CITIES.find((city) => city.slug === slug);
}

export function getCitiesByState(stateAbbr: string): CityData[] {
    return CITIES.filter((city) => city.stateAbbr === stateAbbr);
}

export function getCitiesByMetro(metro: string): CityData[] {
    return CITIES.filter((city) => city.metro === metro);
}

export function getAllCitySlugs(): string[] {
    return CITIES.map((city) => city.slug);
}

// For SEO meta tags
export function getCityMetaTitle(city: CityData, type: 'roommates' | 'realtors'): string {
    if (type === 'roommates') {
        return `Find South Asian Roommates in ${city.name}, ${city.stateAbbr} | Nivasesa`;
    }
    return `Find Indian Realtors in ${city.name}, ${city.stateAbbr} | Nivasesa`;
}

export function getCityMetaDescription(city: CityData, type: 'roommates' | 'realtors'): string {
    const languages = city.topLanguages.slice(0, 3).join(', ');
    if (type === 'roommates') {
        return `Find compatible roommates in ${city.name} who speak ${languages}. ${city.description}`;
    }
    return `Connect with trusted Indian realtors in ${city.name} who speak ${languages}. ${city.description}`;
}
