import { getExploreListings } from '@/actions/explore';
import { MOCK_LISTINGS } from '@/lib/listings-data';
import ExploreClient from './ExploreClient';

// Server Component - fetches data
export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    // Build filters from URL params
    const filters = {
        city: typeof params.city === 'string' ? params.city : undefined,
        state: typeof params.state === 'string' ? params.state : undefined,
        minPrice: params.minPrice ? parseInt(params.minPrice as string) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice as string) : undefined,
        roomType: params.roomType as 'Entire place' | 'Private room' | 'Shared room' | undefined,
        diet: params.diet as 'Vegetarian' | 'Mixed' | 'No preference' | undefined,
    };

    // Fetch real listings from database
    let listings = await getExploreListings(filters);

    // Fall back to mock data if no real listings exist
    if (listings.length === 0) {
        listings = MOCK_LISTINGS;
    }

    // Build dynamic title based on filters
    const cityText = filters.city || 'Jersey City & Manhattan';
    const listingCount = listings.length > 50 ? 'Over 50' : listings.length.toString();

    return (
        <ExploreClient
            initialListings={listings}
            title={`${listingCount} places in ${cityText}`}
        />
    );
}
