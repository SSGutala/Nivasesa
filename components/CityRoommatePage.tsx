'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CityData } from '@/lib/cities';
import { submitSurvey } from '@/actions/survey';
import styles from './CityRoommatePage.module.css';

interface CityRoommatePageProps {
    city: CityData;
}

export default function CityRoommatePage({ city }: CityRoommatePageProps) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await submitSurvey({
            userType: 'roommate_seeker',
            email,
            city: city.name,
            state: city.stateAbbr,
            referralSource: 'seo_city_page',
            surveyData: { citySlug: city.slug },
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
                    Find South Asian Roommates in {city.name}, {city.stateAbbr}
                </h1>
                <p className={styles.subtitle}>
                    Connect with compatible roommates who speak {city.topLanguages.slice(0, 3).join(', ')}.
                    Join {city.southAsianPop.toLocaleString()}+ South Asians in the {city.metro} area.
                </p>

                {/* Waitlist Form */}
                <div className={styles.waitlistBox}>
                    {submitted ? (
                        <div className={styles.successMessage}>
                            <span className={styles.checkmark}>&#x2714;</span>
                            <p>You're on the waitlist! We'll notify you when we launch in {city.name}.</p>
                        </div>
                    ) : (
                        <>
                            <p className={styles.comingSoon}>Coming Soon to {city.name}</p>
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

            {/* Trust Factors */}
            <section className={styles.trustSection}>
                <div className={styles.trustGrid}>
                    <div className={styles.trustCard}>
                        <span className={styles.trustIcon}>&#x1F5E3;</span>
                        <h3>Language Match</h3>
                        <p>Find roommates who speak {city.topLanguages[0]}, {city.topLanguages[1]}, and more</p>
                    </div>
                    <div className={styles.trustCard}>
                        <span className={styles.trustIcon}>&#x1F37D;</span>
                        <h3>Cultural Fit</h3>
                        <p>Vegetarian-friendly, shared kitchen preferences, lifestyle compatibility</p>
                    </div>
                    <div className={styles.trustCard}>
                        <span className={styles.trustIcon}>&#x1F3E0;</span>
                        <h3>Verified Listings</h3>
                        <p>All rooms and profiles are verified for your safety</p>
                    </div>
                    <div className={styles.trustCard}>
                        <span className={styles.trustIcon}>&#x1F308;</span>
                        <h3>Inclusive</h3>
                        <p>LGBTQ+ friendly, 420-friendly, and pet-friendly options available</p>
                    </div>
                </div>
            </section>

            {/* City Info */}
            <section className={styles.cityInfo}>
                <h2>About the South Asian Community in {city.name}</h2>
                <p className={styles.cityDescription}>{city.description}</p>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{city.southAsianPop.toLocaleString()}+</div>
                        <div className={styles.statLabel}>South Asian Residents</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{city.southAsianPercent}%</div>
                        <div className={styles.statLabel}>of Population</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>${city.avgRent}</div>
                        <div className={styles.statLabel}>Avg. Room Rent</div>
                    </div>
                </div>

                <div className={styles.infoColumns}>
                    <div>
                        <h3>Popular Neighborhoods</h3>
                        <ul>
                            {city.neighborhoods.map((n) => (
                                <li key={n}>{n}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Community Landmarks</h3>
                        <ul>
                            {city.landmarks.map((l) => (
                                <li key={l}>{l}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Languages Spoken</h3>
                        <ul>
                            {city.topLanguages.map((l) => (
                                <li key={l}>{l}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2>Looking for a Realtor Instead?</h2>
                <p>Connect with trusted Indian realtors in {city.name} who speak your language.</p>
                <Link href="/find-a-realtor" className={styles.ctaButton}>
                    Find a Realtor
                </Link>
            </section>

            {/* Other Cities */}
            <section className={styles.otherCities}>
                <h2>Other Cities We're Launching In</h2>
                <div className={styles.cityLinks}>
                    {['Frisco, TX', 'Plano, TX', 'Jersey City, NJ', 'Edison, NJ', 'Fremont, CA', 'San Jose, CA'].map((c) => (
                        <span key={c} className={styles.cityTag}>{c}</span>
                    ))}
                </div>
            </section>
        </main>
    );
}
