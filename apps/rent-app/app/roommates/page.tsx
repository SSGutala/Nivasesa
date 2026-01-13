import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { CITIES } from '@/lib/cities';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Browse Roommates | Nivasesa',
    description: 'Find compatible South Asian roommates. Browse profiles by city, language, and lifestyle preferences.',
};

export default async function RoommatesPage({
    searchParams,
}: {
    searchParams: { city?: string; state?: string; diet?: string };
}) {
    const session = await auth();

    const where: Record<string, unknown> = {
        isActive: true,
        isLookingForRoommate: true,
    };

    if (searchParams.state) {
        where.preferredStates = { contains: searchParams.state };
    }
    if (searchParams.city) {
        where.preferredCities = { contains: searchParams.city };
    }
    if (searchParams.diet && searchParams.diet !== 'all') {
        where.dietaryPreference = searchParams.diet;
    }

    const profiles = await prisma.roommateProfile.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    const states = [...new Set(CITIES.map((c) => c.state))];

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Find Roommates</h1>
                <p className={styles.subtitle}>
                    Browse profiles of South Asian professionals looking for roommates.
                    Filter by location, language, and lifestyle.
                </p>
                <div className={styles.heroActions}>
                    <Link href="/roommates/profile" className={styles.createButton}>
                        Create Your Profile
                    </Link>
                    {session?.user && (
                        <Link href="/roommates/matches" className={styles.matchesButton}>
                            View My Matches
                        </Link>
                    )}
                </div>
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
                    <select name="diet" defaultValue={searchParams.diet || 'all'}>
                        <option value="all">All Diets</option>
                        <option value="Strict Vegetarian">Strict Vegetarian</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Jain">Jain</option>
                        <option value="Halal">Halal</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                    <button type="submit" className={styles.filterButton}>
                        Filter
                    </button>
                </form>
            </section>

            {/* Profiles Grid */}
            <section className={styles.profilesSection}>
                {profiles.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No profiles found</h2>
                        <p>Be the first to create a profile in this area!</p>
                        <Link href="/roommates/profile" className={styles.createButton}>
                            Create Your Profile
                        </Link>
                    </div>
                ) : (
                    <div className={styles.profilesGrid}>
                        {profiles.map((profile: typeof profiles[0]) => (
                            <div key={profile.id} className={styles.profileCard}>
                                <div className={styles.profileHeader}>
                                    <div className={styles.avatar}>
                                        {profile.user.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={profile.user.image} alt="" />
                                        ) : (
                                            <span>
                                                {(profile.user.name || 'A')[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3>{profile.user.name || 'Anonymous'}</h3>
                                        <p className={styles.location}>
                                            {profile.preferredCities || 'Flexible location'}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.profileTags}>
                                    {profile.languages.split(', ').slice(0, 3).map((lang: string) => (
                                        <span key={lang} className={styles.tag}>
                                            {lang}
                                        </span>
                                    ))}
                                </div>

                                <div className={styles.profileDetails}>
                                    <div className={styles.detail}>
                                        <span className={styles.detailLabel}>Diet</span>
                                        <span>{profile.dietaryPreference}</span>
                                    </div>
                                    <div className={styles.detail}>
                                        <span className={styles.detailLabel}>Budget</span>
                                        <span>
                                            ${profile.minBudget || 0} - ${profile.maxBudget}/mo
                                        </span>
                                    </div>
                                    <div className={styles.detail}>
                                        <span className={styles.detailLabel}>Cleanliness</span>
                                        <span>{profile.cleanlinessLevel}</span>
                                    </div>
                                </div>

                                {profile.bio && (
                                    <p className={styles.bio}>
                                        {profile.bio.slice(0, 100)}
                                        {profile.bio.length > 100 ? '...' : ''}
                                    </p>
                                )}

                                <div className={styles.profileActions}>
                                    {session?.user ? (
                                        <button className={styles.connectButton}>
                                            Connect
                                        </button>
                                    ) : (
                                        <Link href="/login" className={styles.connectButton}>
                                            Sign in to Connect
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <h2>Looking to form a group?</h2>
                <p>Create or join a roommate group to search for housing together.</p>
                <Link href="/groups" className={styles.groupsButton}>
                    Browse Groups
                </Link>
            </section>
        </main>
    );
}
