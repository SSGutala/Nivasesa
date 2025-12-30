'use client';

import { useRouter } from 'next/navigation';
import { UserTypeSelector } from '@/components/survey';
import { SurveyUserType } from '@/actions/survey';
import styles from './page.module.css';

export default function SurveyLandingPage() {
    const router = useRouter();

    const handleUserTypeSelect = (type: SurveyUserType) => {
        // Map user types to their survey pages
        const routes: Record<SurveyUserType, string> = {
            roommate_seeker: '/survey/roommate',
            host: '/survey/host',
            buyer: '/survey/buyer',
            seller: '/survey/seller',
            agent: '/survey/agent',
        };

        router.push(routes[type]);
    };

    return (
        <main className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Find Your Home in the South Asian Community</h1>
                <p className={styles.subtitle}>
                    We're building a housing platform designed for the South Asian diaspora.
                    <br />
                    Join our waitlist to get early access.
                </p>
            </div>

            <section className={styles.content}>
                <h2 className={styles.sectionTitle}>I am...</h2>
                <UserTypeSelector onSelect={handleUserTypeSelect} />
            </section>

            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>What We're Building</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F3E0;</div>
                        <h3 className={styles.featureTitle}>Find Roommates</h3>
                        <p className={styles.featureText}>
                            Match with compatible roommates who share your language, diet preferences, and lifestyle.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F465;</div>
                        <h3 className={styles.featureTitle}>Form Groups</h3>
                        <p className={styles.featureText}>
                            Create or join roommate groups and find housing together with agent support.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F91D;</div>
                        <h3 className={styles.featureTitle}>Connect with Agents</h3>
                        <p className={styles.featureText}>
                            Find realtors who speak your language and understand your needs.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F512;</div>
                        <h3 className={styles.featureTitle}>Inclusive Housing</h3>
                        <p className={styles.featureText}>
                            420-friendly, LGBTQ+ welcoming, pet-friendly options clearly marked.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.communities}>
                <h2 className={styles.sectionTitle}>For the South Asian Community</h2>
                <p className={styles.communitiesText}>
                    Serving Indian, Pakistani, Bangladeshi, Sri Lankan, Nepali, and the broader South Asian diaspora
                    across the United States. Find housing with people who understand your culture.
                </p>
                <div className={styles.languageList}>
                    <span>Hindi</span>
                    <span>Telugu</span>
                    <span>Tamil</span>
                    <span>Gujarati</span>
                    <span>Bengali</span>
                    <span>Punjabi</span>
                    <span>Urdu</span>
                    <span>Malayalam</span>
                    <span>Kannada</span>
                    <span>Marathi</span>
                </div>
            </section>
        </main>
    );
}
