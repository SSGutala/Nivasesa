import { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/lib/cities';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Find South Asian Roommates | Nivasesa',
    description: 'Find compatible roommates in the South Asian community. Connect with Telugu, Hindi, Tamil, and other language speakers. Filter by diet, lifestyle, and cultural preferences.',
    openGraph: {
        title: 'Find South Asian Roommates | Nivasesa',
        description: 'Find compatible roommates in the South Asian community. Connect with Telugu, Hindi, Tamil, and other language speakers.',
        type: 'website',
    },
};

export default function FindRoommatesPage() {
    // Group cities by state
    const citiesByState = CITIES.reduce((acc, city) => {
        if (!acc[city.state]) {
            acc[city.state] = [];
        }
        acc[city.state].push(city);
        return acc;
    }, {} as Record<string, typeof CITIES>);

    const totalPopulation = CITIES.reduce((sum, city) => sum + city.southAsianPop, 0);

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>
                    Find South Asian Roommates
                </h1>
                <p className={styles.subtitle}>
                    Connect with roommates who speak your language, understand your culture,
                    and share your lifestyle preferences. From vegetarian-only homes to 420-friendly spaces.
                </p>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{CITIES.length}</span>
                        <span className={styles.statLabel}>Cities</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>{(totalPopulation / 1000000).toFixed(1)}M+</span>
                        <span className={styles.statLabel}>South Asian Residents</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>10+</span>
                        <span className={styles.statLabel}>Languages Supported</span>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className={styles.whySection}>
                <h2>Why Find Roommates Through Nivasesa?</h2>
                <div className={styles.whyGrid}>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F5E3;</span>
                        <h3>Language Match</h3>
                        <p>Find roommates who speak Hindi, Telugu, Tamil, Gujarati, Bengali, Urdu, and more</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F957;</span>
                        <h3>Dietary Compatibility</h3>
                        <p>Filter for vegetarian-only, Jain, Halal, or all-diet-friendly households</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F3E0;</span>
                        <h3>Lifestyle Fit</h3>
                        <p>Match on sleep schedules, cleanliness, guests policy, and substance preferences</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F91D;</span>
                        <h3>Cultural Understanding</h3>
                        <p>Roommates who understand extended family visits and cultural celebrations</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F3F3;&#xFE0F;&#x200D;&#x1F308;</span>
                        <h3>LGBTQ+ Friendly</h3>
                        <p>Find welcoming, inclusive households where you can be yourself</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyIcon}>&#x1F436;</span>
                        <h3>Pet Preferences</h3>
                        <p>Filter for pet-friendly homes or households without pets</p>
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section className={styles.citiesSection}>
                <h2>Browse by City</h2>
                <p className={styles.citiesSubtitle}>
                    Select your city to find South Asian roommates in your area
                </p>

                {Object.entries(citiesByState).map(([state, cities]) => (
                    <div key={state} className={styles.stateGroup}>
                        <h3 className={styles.stateName}>{state}</h3>
                        <div className={styles.cityGrid}>
                            {cities.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/roommates/${city.slug}`}
                                    className={styles.cityCard}
                                >
                                    <h4>{city.name}</h4>
                                    <p className={styles.cityStats}>
                                        {city.southAsianPop.toLocaleString()}+ South Asian residents
                                    </p>
                                    <p className={styles.cityLanguages}>
                                        {city.topLanguages.slice(0, 3).join(', ')}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* How It Works */}
            <section className={styles.howSection}>
                <h2>How It Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3>Create Your Profile</h3>
                        <p>Share your preferences: languages, diet, lifestyle, and what you're looking for</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3>Get Matched</h3>
                        <p>Our algorithm finds compatible roommates based on your preferences</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3>Form a Group</h3>
                        <p>Create or join a roommate group to search for housing together</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>4</div>
                        <h3>Find Housing</h3>
                        <p>Connect with South Asian realtors who help your group find the perfect place</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2>Ready to Find Your Roommates?</h2>
                <p>Join thousands of South Asian professionals finding compatible housing</p>
                <div className={styles.ctaButtons}>
                    <Link href="/survey/roommate" className={styles.primaryButton}>
                        Get Started
                    </Link>
                    <Link href="/find-a-realtor" className={styles.secondaryButton}>
                        Find a Realtor Instead
                    </Link>
                </div>
            </section>

            {/* Looking to List */}
            <section className={styles.listSection}>
                <h2>Have a Room to Rent?</h2>
                <p>List your room and find compatible tenants in the South Asian community</p>
                <Link href="/survey/host" className={styles.outlineButton}>
                    List Your Room
                </Link>
            </section>
        </main>
    );
}
