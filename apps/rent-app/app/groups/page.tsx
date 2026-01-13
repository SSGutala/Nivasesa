import { Metadata } from 'next';
import Link from 'next/link';
import { getGroups } from '@/actions/groups';
import { CITIES } from '@/lib/cities';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Browse Roommate Groups | Nivasesa',
    description: 'Find or create a roommate group to search for housing together. Join South Asian professionals looking for compatible roommates.',
};

export default async function GroupsPage({
    searchParams,
}: {
    searchParams: { city?: string; state?: string };
}) {
    const groups = await getGroups({
        city: searchParams.city,
        state: searchParams.state,
        isPublic: true,
        status: 'forming',
    });

    // Get unique states from cities
    const states = [...new Set(CITIES.map((c) => c.state))];

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Find a Roommate Group</h1>
                <p className={styles.subtitle}>
                    Join a group of compatible roommates looking for housing together.
                    Share costs, find better places, and make the process easier.
                </p>
                <Link href="/groups/create" className={styles.createButton}>
                    Create a Group
                </Link>
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
                        {CITIES.filter(
                            (c) => !searchParams.state || c.state === searchParams.state
                        ).map((city) => (
                            <option key={city.slug} value={city.name}>
                                {city.name}, {city.stateAbbr}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className={styles.filterButton}>
                        Filter
                    </button>
                </form>
            </section>

            {/* Groups Grid */}
            <section className={styles.groupsSection}>
                {groups.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No groups found</h2>
                        <p>Be the first to create a group in this area!</p>
                        <Link href="/groups/create" className={styles.createButton}>
                            Create a Group
                        </Link>
                    </div>
                ) : (
                    <div className={styles.groupsGrid}>
                        {groups.map((group: typeof groups[0]) => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.id}`}
                                className={styles.groupCard}
                            >
                                <div className={styles.groupHeader}>
                                    <h3>{group.name}</h3>
                                    <span className={styles.memberCount}>
                                        {group.members.length}/{group.maxMembers} members
                                    </span>
                                </div>
                                <p className={styles.groupLocation}>
                                    {group.targetCity}, {group.targetState}
                                </p>
                                {group.description && (
                                    <p className={styles.groupDescription}>
                                        {group.description.slice(0, 100)}
                                        {group.description.length > 100 ? '...' : ''}
                                    </p>
                                )}
                                <div className={styles.groupMeta}>
                                    {group.targetBudgetMax && (
                                        <span className={styles.metaItem}>
                                            ${group.targetBudgetMin?.toLocaleString() || 0} - $
                                            {group.targetBudgetMax.toLocaleString()}/mo
                                        </span>
                                    )}
                                    {group.bedroomsNeeded && (
                                        <span className={styles.metaItem}>
                                            {group.bedroomsNeeded} BR
                                        </span>
                                    )}
                                </div>
                                <div className={styles.memberAvatars}>
                                    {group.members.slice(0, 4).map((member: typeof group.members[0]) => (
                                        <div
                                            key={member.id}
                                            className={styles.avatar}
                                            title={member.profile.user.name || 'Member'}
                                        >
                                            {member.profile.user.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={member.profile.user.image}
                                                    alt=""
                                                />
                                            ) : (
                                                <span>
                                                    {(member.profile.user.name || 'M')[0].toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {group.members.length > 4 && (
                                        <div className={styles.moreMembers}>
                                            +{group.members.length - 4}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <h2>Don't see a group for you?</h2>
                <p>Create your own and invite compatible roommates to join.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/groups/create" className={styles.primaryButton}>
                        Create a Group
                    </Link>
                    <Link href="/roommates/profile" className={styles.secondaryButton}>
                        Create Your Profile First
                    </Link>
                </div>
            </section>
        </main>
    );
}
