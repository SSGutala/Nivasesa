'use client';

import { useActionState } from 'react';
import { submitRealtorApplication } from '@/actions/apply';
import styles from './page.module.css';

const initialState = {
    message: '',
    success: false,
};

export default function JoinNetworkPage() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(submitRealtorApplication, initialState);

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

            {/* SECTION 5 - APPLICATION FORM */}
            <section id="apply" style={{ marginTop: '120px' }}>
                <div className={styles.formContainer}>

                    {state.success ? (
                        <div className={styles.successMessage}>
                            <h3 className={styles.successTitle}>Application Received</h3>
                            <p>Thank you for applying. Our team will review your details and follow up shortly.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className={styles.formTitle}>Apply to Join</h2>
                            <p className={styles.formSubtitle}>Share your details below to become a partner.</p>

                            {state.message && !state.success && (
                                <p style={{ color: 'red', textAlign: 'center', marginBottom: '24px' }}>{state.message}</p>
                            )}

                            <form action={formAction}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="name">Full Name</label>
                                        <input className={styles.input} type="text" id="name" name="name" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="email">Email</label>
                                        <input className={styles.input} type="email" id="email" name="email" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="phone">Phone</label>
                                        <input className={styles.input} type="tel" id="phone" name="phone" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="brokerage">Brokerage Name</label>
                                        <input className={styles.input} type="text" id="brokerage" name="brokerage" required />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="licenseNumber">License Number</label>
                                        <input className={styles.input} type="text" id="licenseNumber" name="licenseNumber" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="experienceYears">Experience</label>
                                        <select className={styles.select} id="experienceYears" name="experienceYears" required>
                                            <option value="">Select...</option>
                                            <option value="1-2 Years">1-2 Years</option>
                                            <option value="3-5 Years">3-5 Years</option>
                                            <option value="5-10 Years">5-10 Years</option>
                                            <option value="10+ Years">10+ Years</option>
                                        </select>
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label} htmlFor="states">State(s) Licensed In</label>
                                        <input className={styles.input} type="text" id="states" name="states" placeholder="e.g. TX, CA, NJ" required />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label} htmlFor="cities">Primary Cities / ZIPs Served</label>
                                        <input className={styles.input} type="text" id="cities" name="cities" placeholder="e.g. Frisco, Plano, 75024" required />
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Languages Spoken</label>
                                        <div className={styles.checkboxGroup}>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Hindi" /> Hindi</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Gujarati" /> Gujarati</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Telugu" /> Telugu</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Punjabi" /> Punjabi</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Tamil" /> Tamil</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Urdu" /> Urdu</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Bengali" /> Bengali</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Other" /> Other</label>
                                        </div>
                                    </div>

                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label} htmlFor="notes">Anything else we should know? (Optional)</label>
                                        <textarea className={styles.textarea} id="notes" name="notes" rows={3}></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={isPending}>
                                    {isPending ? 'Submitting Application...' : 'Submit Application'}
                                </button>

                                <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                                    Niveasa is a real estate referral marketplace and does not provide brokerage services.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
