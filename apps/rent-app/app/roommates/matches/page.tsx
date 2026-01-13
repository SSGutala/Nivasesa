import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { findMatches } from '@/lib/roommate-matching';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Your Roommate Matches | Nivasesa',
    description: 'View your personalized roommate matches based on compatibility.',
};

export default async function MatchesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/roommates/matches');
    }

    // Get user's roommate profile
    const myProfile = await prisma.roommateProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    if (!myProfile) {
        redirect('/roommates/profile?redirect=/roommates/matches');
    }

    // Get all other active profiles
    const candidates = await prisma.roommateProfile.findMany({
        where: {
            isActive: true,
            userId: { not: session.user.id },
        },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    // Calculate matches
    const matches = findMatches(myProfile, candidates, 30);

    return (
        <main className={styles.container}>
            <section className={styles.header}>
                <Link href="/roommates" className={styles.backLink}>
                    &larr; Back to Roommates
                </Link>
                <h1 className={styles.title}>Your Matches</h1>
                <p className={styles.subtitle}>
                    Based on your profile, here are your most compatible potential roommates.
                </p>
            </section>

            {matches.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No matches found yet</h2>
                    <p>
                        As more users join Nivasesa, you'll see compatible roommates here.
                        Make sure your profile is complete to get better matches!
                    </p>
                    <Link href="/roommates/profile" className={styles.editButton}>
                        Edit Your Profile
                    </Link>
                </div>
            ) : (
                <section className={styles.matchesGrid}>
                    {matches.map(({ profile, score }) => (
                        <div key={profile.id} className={styles.matchCard}>
                            <div className={styles.matchHeader}>
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
                                <div className={styles.matchInfo}>
                                    <h3>{profile.user.name || 'Anonymous'}</h3>
                                    <p className={styles.location}>
                                        {profile.preferredCities || 'Flexible location'}
                                    </p>
                                </div>
                                <div className={styles.scoreCircle}>
                                    <span className={styles.scoreValue}>{score.overall}</span>
                                    <span className={styles.scoreLabel}>Match</span>
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className={styles.scoreBreakdown}>
                                <div className={styles.scoreBar}>
                                    <span className={styles.scoreBarLabel}>Language</span>
                                    <div className={styles.scoreBarTrack}>
                                        <div
                                            className={styles.scoreBarFill}
                                            style={{ width: `${(score.language / 30) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.scoreBarValue}>{score.language}/30</span>
                                </div>
                                <div className={styles.scoreBar}>
                                    <span className={styles.scoreBarLabel}>Location</span>
                                    <div className={styles.scoreBarTrack}>
                                        <div
                                            className={styles.scoreBarFill}
                                            style={{ width: `${(score.location / 25) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.scoreBarValue}>{score.location}/25</span>
                                </div>
                                <div className={styles.scoreBar}>
                                    <span className={styles.scoreBarLabel}>Lifestyle</span>
                                    <div className={styles.scoreBarTrack}>
                                        <div
                                            className={styles.scoreBarFill}
                                            style={{ width: `${(score.lifestyle / 25) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.scoreBarValue}>{score.lifestyle}/25</span>
                                </div>
                                <div className={styles.scoreBar}>
                                    <span className={styles.scoreBarLabel}>Budget</span>
                                    <div className={styles.scoreBarTrack}>
                                        <div
                                            className={styles.scoreBarFill}
                                            style={{ width: `${(score.budget / 20) * 100}%` }}
                                        />
                                    </div>
                                    <span className={styles.scoreBarValue}>{score.budget}/20</span>
                                </div>
                            </div>

                            {/* Match Details */}
                            <div className={styles.matchDetails}>
                                {score.breakdown.languageOverlap.length > 0 && (
                                    <div className={styles.matchDetail}>
                                        <span className={styles.matchIcon}>&#x1F5E3;</span>
                                        <span>
                                            Speaks: {score.breakdown.languageOverlap.join(', ')}
                                        </span>
                                    </div>
                                )}
                                {score.breakdown.lifestyleMatches.length > 0 && (
                                    <div className={styles.matchDetail}>
                                        <span className={styles.matchIcon}>&#x2714;</span>
                                        <span>
                                            Matches: {score.breakdown.lifestyleMatches.join(', ')}
                                        </span>
                                    </div>
                                )}
                                {score.breakdown.lifestyleMismatches.length > 0 && (
                                    <div className={styles.matchDetail + ' ' + styles.mismatch}>
                                        <span className={styles.matchIcon}>&#x26A0;</span>
                                        <span>
                                            Differs: {score.breakdown.lifestyleMismatches.join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Profile Snippet */}
                            <div className={styles.profileSnippet}>
                                <div className={styles.snippetItem}>
                                    <span className={styles.snippetLabel}>Diet</span>
                                    <span>{profile.dietaryPreference}</span>
                                </div>
                                <div className={styles.snippetItem}>
                                    <span className={styles.snippetLabel}>Budget</span>
                                    <span>${profile.maxBudget}/mo</span>
                                </div>
                                <div className={styles.snippetItem}>
                                    <span className={styles.snippetLabel}>Sleep</span>
                                    <span>{profile.sleepSchedule}</span>
                                </div>
                            </div>

                            <button className={styles.connectButton}>Connect</button>
                        </div>
                    ))}
                </section>
            )}

            <section className={styles.ctaSection}>
                <h2>Want better matches?</h2>
                <p>Complete more of your profile to improve match accuracy.</p>
                <Link href="/roommates/profile" className={styles.editButton}>
                    Update Your Profile
                </Link>
            </section>
        </main>
    );
}
