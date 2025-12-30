'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CityData } from '@/lib/cities';
import { submitSurvey } from '@/actions/survey';
import styles from './CityRealtorPage.module.css';

interface CityRealtorPageProps {
    city: CityData;
}

export default function CityRealtorPage({ city }: CityRealtorPageProps) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await submitSurvey({
            userType: 'buyer',
            email,
            city: city.name,
            state: city.stateAbbr,
            referralSource: 'seo_realtor_page',
            surveyData: { citySlug: city.slug, lookingFor: 'realtor' },
        });

        if (result.success) {
            setSubmitted(true);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>
                    Find Indian Realtors in {city.name}, {city.stateAbbr}
                </h1>
                <p className={styles.subtitle}>
                    Connect with trusted South Asian real estate agents who speak {city.topLanguages.slice(0, 3).join(', ')}.
                    Get personalized service from agents who understand your needs.
                </p>

                {/* CTA */}
                <div className={styles.ctaBox}>
                    {submitted ? (
                        <div className={styles.successMessage}>
                            <span className={styles.checkmark}>&#x2714;</span>
                            <p>We'll connect you with top agents in {city.name}!</p>
                        </div>
                    ) : (
                        <>
                            <Link href="/find-a-realtor" className={styles.primaryButton}>
                                Find a Realtor Now
                            </Link>
                            <p className={styles.orDivider}>or join our waitlist for new features</p>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className={styles.emailInput}
                                />
                                <button type="submit" disabled={loading} className={styles.submitButton}>
                                    {loading ? 'Joining...' : 'Join Waitlist'}
                                </button>
                            </form>
                            {error && <p className={styles.error}>{error}</p>}
                        </>
                    )}
                </div>
            </section>

            {/* Why Choose */}
            <section className={styles.whySection}>
                <h2>Why Choose a South Asian Realtor?</h2>
                <div className={styles.whyGrid}>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F5E3;</span>
                        <h3>Language Comfort</h3>
                        <p>Discuss in {city.topLanguages[0]} or {city.topLanguages[1]} for clearer communication</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F3D8;</span>
                        <h3>Local Knowledge</h3>
                        <p>Know the best neighborhoods near temples, grocery stores, and community centers</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F91D;</span>
                        <h3>Cultural Understanding</h3>
                        <p>Understand multi-generational housing needs and cultural preferences</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F4B0;</span>
                        <h3>Trusted Network</h3>
                        <p>Access to vetted lenders, inspectors, and contractors in the community</p>
                    </div>
                </div>
            </section>

            {/* City Stats */}
            <section className={styles.statsSection}>
                <h2>{city.name} Real Estate Overview</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{city.southAsianPop.toLocaleString()}+</div>
                        <div className={styles.statLabel}>South Asian Residents</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{city.neighborhoods.length}+</div>
                        <div className={styles.statLabel}>Key Neighborhoods</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{city.landmarks.length}+</div>
                        <div className={styles.statLabel}>Community Landmarks</div>
                    </div>
                </div>

                <div className={styles.neighborhoodList}>
                    <h3>Popular Neighborhoods in {city.name}</h3>
                    <div className={styles.tags}>
                        {city.neighborhoods.map((n) => (
                            <span key={n} className={styles.tag}>{n}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Buyer Types */}
            <section className={styles.buyerTypes}>
                <h2>We Help All Types of Buyers</h2>
                <div className={styles.buyerGrid}>
                    <div className={styles.buyerCard}>
                        <h3>First-Time Buyers</h3>
                        <p>Patient guidance through the entire home buying process</p>
                    </div>
                    <div className={styles.buyerCard}>
                        <h3>Relocating Families</h3>
                        <p>Find homes near good schools and South Asian communities</p>
                    </div>
                    <div className={styles.buyerCard}>
                        <h3>Investors</h3>
                        <p>Identify high-yield rental properties in growing areas</p>
                    </div>
                    <div className={styles.buyerCard}>
                        <h3>New to US (H1B/F1)</h3>
                        <p>Special support for immigrants navigating the US market</p>
                    </div>
                </div>
            </section>

            {/* CTA Bottom */}
            <section className={styles.bottomCta}>
                <h2>Ready to Find Your Dream Home?</h2>
                <p>Connect with a trusted realtor who speaks your language and understands your needs.</p>
                <Link href="/find-a-realtor" className={styles.primaryButton}>
                    Find a Realtor in {city.name}
                </Link>
            </section>

            {/* Looking for Roommates */}
            <section className={styles.roommatesCta}>
                <h2>Looking for Roommates Instead?</h2>
                <p>Find compatible roommates in {city.name} who share your language and lifestyle.</p>
                <Link href={`/roommates/${city.slug}`} className={styles.secondaryButton}>
                    Find Roommates
                </Link>
            </section>
        </main>
    );
}
