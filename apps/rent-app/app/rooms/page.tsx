import { Metadata } from 'next';
import Link from 'next/link';
import { getRoomListings } from '@/actions/rooms';
import { getFreedomScoreLabel } from '@/lib/freedom-score';
import { CITIES } from '@/lib/cities';
import { auth } from '@/auth';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Browse Rooms | Nivasesa',
    description: 'Find rooms for rent in the South Asian community. Filter by Freedom Score, 420-friendly, pets, and more.',
};

export default async function RoomsPage({
    searchParams,
}: {
    searchParams: {
        city?: string;
        state?: string;
        minRent?: string;
        maxRent?: string;
        minFreedom?: string;
        cannabis?: string;
        pets?: string;
    };
}) {
    const session = await auth();

    const listings = await getRoomListings({
        city: searchParams.city,
        state: searchParams.state,
        minRent: searchParams.minRent ? parseInt(searchParams.minRent) : undefined,
        maxRent: searchParams.maxRent ? parseInt(searchParams.maxRent) : undefined,
        minFreedomScore: searchParams.minFreedom
            ? parseInt(searchParams.minFreedom)
            : undefined,
        cannabisPolicy: searchParams.cannabis,
        petsPolicy: searchParams.pets,
    });

    const states = [...new Set(CITIES.map((c) => c.state))];

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Find Your Room</h1>
                <p className={styles.subtitle}>
                    Browse rooms for rent in the South Asian community.
                    Our Freedom Score shows how flexible each household is.
                </p>
                {session?.user && (
                    <Link href="/rooms/post" className={styles.postButton}>
                        List Your Room
                    </Link>
                )}
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <form className={styles.filterForm}>
                    <select name="state" defaultValue={searchParams.state || ''}>
                        <option value="">All States</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    <select name="city" defaultValue={searchParams.city || ''}>
                        <option value="">All Cities</option>
                        {CITIES.map((city) => (
                            <option key={city.slug} value={city.name}>
                                {city.name}, {city.stateAbbr}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="maxRent"
                        placeholder="Max rent"
                        defaultValue={searchParams.maxRent}
                        className={styles.rentInput}
                    />
                    <select name="minFreedom" defaultValue={searchParams.minFreedom || ''}>
                        <option value="">Any Freedom Score</option>
                        <option value="90">90+ (Ultra Flexible)</option>
                        <option value="75">75+ (Very Flexible)</option>
                        <option value="60">60+ (Flexible)</option>
                        <option value="40">40+ (Moderate)</option>
                    </select>
                    <select name="cannabis" defaultValue={searchParams.cannabis || ''}>
                        <option value="">Cannabis Policy</option>
                        <option value="420 Friendly">420 Friendly</option>
                        <option value="Outside Only">Outside Only</option>
                        <option value="No Cannabis">No Cannabis</option>
                    </select>
                    <select name="pets" defaultValue={searchParams.pets || ''}>
                        <option value="">Pets Policy</option>
                        <option value="All Pets">All Pets OK</option>
                        <option value="Dogs OK">Dogs OK</option>
                        <option value="Cats OK">Cats OK</option>
                        <option value="No Pets">No Pets</option>
                    </select>
                    <button type="submit" className={styles.filterButton}>
                        Filter
                    </button>
                </form>
            </section>

            {/* Listings Grid */}
            <section className={styles.listingsSection}>
                {listings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No rooms found</h2>
                        <p>Try adjusting your filters or be the first to list!</p>
                        {session?.user && (
                            <Link href="/rooms/post" className={styles.postButton}>
                                List Your Room
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={styles.listingsGrid}>
                        {listings.map((listing: typeof listings[0]) => {
                            const freedomLabel = getFreedomScoreLabel(listing.freedomScore);
                            return (
                                <Link
                                    key={listing.id}
                                    href={`/rooms/${listing.id}`}
                                    className={styles.listingCard}
                                >
                                    <div className={styles.listingHeader}>
                                        <div>
                                            <h3>{listing.title}</h3>
                                            <p className={styles.location}>
                                                {listing.city}, {listing.state}
                                            </p>
                                        </div>
                                        <div className={styles.rent}>
                                            <span className={styles.rentAmount}>
                                                ${listing.rent.toLocaleString()}
                                            </span>
                                            <span className={styles.rentPeriod}>/mo</span>
                                        </div>
                                    </div>

                                    <div
                                        className={styles.freedomScore}
                                        style={{ borderColor: freedomLabel.color }}
                                    >
                                        <div
                                            className={styles.freedomBadge}
                                            style={{ backgroundColor: freedomLabel.color }}
                                        >
                                            {listing.freedomScore}
                                        </div>
                                        <div>
                                            <span
                                                className={styles.freedomLabel}
                                                style={{ color: freedomLabel.color }}
                                            >
                                                {freedomLabel.label}
                                            </span>
                                            <span className={styles.freedomDesc}>
                                                Freedom Score
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.listingTags}>
                                        <span className={styles.tag}>{listing.roomType}</span>
                                        {listing.cannabisPolicy === '420 Friendly' && (
                                            <span className={styles.tag + ' ' + styles.greenTag}>
                                                420 Friendly
                                            </span>
                                        )}
                                        {listing.petsPolicy !== 'No Pets' && (
                                            <span className={styles.tag}>{listing.petsPolicy}</span>
                                        )}
                                        {listing.lgbtqFriendly && (
                                            <span className={styles.tag + ' ' + styles.prideTag}>
                                                LGBTQ+ Friendly
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.listingMeta}>
                                        <span>{listing.totalBedrooms} BR</span>
                                        <span>•</span>
                                        <span>{listing.totalBathrooms} BA</span>
                                        <span>•</span>
                                        <span>{listing.propertyType}</span>
                                    </div>

                                    {listing.languages && (
                                        <p className={styles.languages}>
                                            Speaks: {listing.languages}
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <h2>Have a room to rent?</h2>
                <p>
                    List your room and connect with South Asian tenants. Set your Freedom
                    Score to attract the right roommates.
                </p>
                <Link
                    href={session?.user ? '/rooms/post' : '/login?callbackUrl=/rooms/post'}
                    className={styles.postButton}
                >
                    {session?.user ? 'List Your Room' : 'Sign In to List'}
                </Link>
            </section>
        </main>
    );
}
