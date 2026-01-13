'use client';

import { useRouter } from 'next/navigation';
import { UserTypeSelector } from '../../lib/components/survey';
import { SurveyUserType } from '../../actions/survey';
import styles from './page.module.css';

export default function SurveyLandingPage() {
    const router = useRouter();

    const handleUserTypeSelect = (type: SurveyUserType) => {
        // Map user types to their survey pages
        const routes: Record<SurveyUserType, string> = {
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
                        <h3 className={styles.featureTitle}>Find Your Home</h3>
                        <p className={styles.featureText}>
                            Connect with realtors who understand your needs and speak your language.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F91D;</div>
                        <h3 className={styles.featureTitle}>Connect with Agents</h3>
                        <p className={styles.featureText}>
                            Find realtors who speak your language and understand your cultural needs.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>&#x1F4BC;</div>
                        <h3 className={styles.featureTitle}>For Agents</h3>
                        <p className={styles.featureText}>
                            Join our network and get qualified leads from the South Asian community.
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
