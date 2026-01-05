'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitRealtorApplication } from '@/actions/apply';
import styles from './page.module.css';

const initialState = {
    message: '',
    success: false,
};

export default function JoinNetworkPage() {
    const router = useRouter();
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(submitRealtorApplication, initialState);

    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                if ((state as any).redirectTo) {
                    router.push((state as any).redirectTo);
                } else {
                    router.push('/dashboard');
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, (state as any).redirectTo, router]);

    // Professional, warm imagery
    const imgMeeting = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"; // Professional handshake/meeting
    const imgRealtor = "https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=2670&auto=format&fit=crop"; // Professional woman confident

    return (
        <main className={styles.container}>
            {/* SECTION 1 - HERO */}
            <div className={styles.hero}>
                <h1 className={styles.title}>Join the Niveasa Network</h1>
                <p className={styles.subtitle}>
                    A curated partnership for licensed real estate agents serving<br /> South Asian homebuyers across the U.S.
                </p>
            </div>

            {/* SECTION 2 - WHO THIS IS FOR (Split Layout) */}
            <section className={styles.gridSection}>
                <div className={styles.imageCol}>
                    <div className={styles.imageContainer}>
                        <img src={imgRealtor} alt="Professional Realtor" className={styles.img} />
                    </div>
                </div>
                <div className={styles.textCol}>
                    <h2 className={styles.sectionTitle}>Who This Is For</h2>
                    <div className={styles.content}>
                        <p style={{ marginBottom: '24px' }}>
                            We are looking for partners who understand that finding a home is about more than just the property—it's about the people.
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Licensed real estate agents in the U.S.</li>
                            <li className={styles.listItem}>Agents who understand nuances of South Asian culture</li>
                            <li className={styles.listItem}>Fluent in languages like Hindi, Telugu, or Gujarati</li>
                            <li className={styles.listItem}>Focused on trust and long-term client relationships</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECTION 3 - HOW IT WORKS (Reverse Split) */}
            <section className={`${styles.gridSection} ${styles.reverse}`}>
                <div className={styles.imageCol}>
                    <div className={styles.imageContainer}>
                        <img src={imgMeeting} alt="Client Meeting" className={styles.img} />
                    </div>
                </div>
                <div className={styles.textCol}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <div className={styles.content}>
                        <p style={{ marginBottom: '24px' }}>
                            Your expertise deserves the right audience.
                        </p>
                        <p>
                            Buyers use Niveasa to find culturally aligned realtors they can trust.
                            We screen and route qualified inquiries directly to you, allowing you to focus on what you do best: guiding them home.
                        </p>
                        <div style={{ marginTop: '32px', padding: '24px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-family)', marginBottom: '8px', fontWeight: 600 }}>A Curated Network</h3>
                            <p style={{ fontSize: '15px' }}>
                                This is not an open directory. We limit partners per market to ensure quality over volume.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 - CALL TO ACTION */}
            <section id="apply" style={{ marginTop: '120px', textAlign: 'center', maxWidth: '600px', margin: '120px auto 40px' }}>
                <h2 className={styles.formTitle}>Ready to Join?</h2>
                <p className={styles.formSubtitle} style={{ marginBottom: '32px' }}>
                    Start your application to become a verified Nivaesa partner agent.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => router.push('/onboarding/agent')}
                    style={{ padding: '20px 40px', fontSize: '18px', borderRadius: '100px' }}
                >
                    Apply Now
                </button>
            </section>
        </main >
    );
}
