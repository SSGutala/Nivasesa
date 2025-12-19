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

            {/* SECTION 5 - APPLICATION FORM */}
            <section id="apply" style={{ marginTop: '120px' }}>
                <div className={styles.formContainer}>

                    {state.success ? (
                        <div className={styles.successMessage}>
                            <h3 className={styles.successTitle}>Application Received</h3>
                            <p>{state.message || "Thank you for applying. Redirecting to account setup..."}</p>
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
                                    {/* 1. Identity & Contact */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>1. Identity & Contact</h3>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="fullName">Full Name</label>
                                        <input className={styles.input} type="text" id="fullName" name="fullName" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="email">Email Address</label>
                                        <input className={styles.input} type="email" id="email" name="email" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="phone">Phone Number</label>
                                        <input className={styles.input} type="tel" id="phone" name="phone" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Preferred Contact Method (Optional)</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}><input type="radio" name="preferredContactMethod" value="Phone" /> Phone</label>
                                            <label className={styles.radioLabel}><input type="radio" name="preferredContactMethod" value="Email" /> Email</label>
                                            <label className={styles.radioLabel}><input type="radio" name="preferredContactMethod" value="Either" /> Either</label>
                                        </div>
                                    </div>

                                    {/* 2. Professional Details */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>2. Professional Details</h3>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="brokerageName">Brokerage Name</label>
                                        <input className={styles.input} type="text" id="brokerageName" name="brokerageName" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="licenseNumber">License Number</label>
                                        <input className={styles.input} type="text" id="licenseNumber" name="licenseNumber" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="statesLicensed">State(s) Licensed In (Multi-select)</label>
                                        <select className={styles.select} id="statesLicensed" name="statesLicensed" multiple required size={5}>
                                            <option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option>
                                            <option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option>
                                            <option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option>
                                            <option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option>
                                            <option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option>
                                            <option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option>
                                            <option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option>
                                            <option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option>
                                            <option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option>
                                            <option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option>
                                            <option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option>
                                            <option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option>
                                            <option value="WI">WI</option><option value="WY">WY</option>
                                        </select>
                                        <p className={styles.helpText}>Hold Cmd/Ctrl to select multiple</p>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="experienceYears">Years of Real Estate Experience</label>
                                        <select className={styles.select} id="experienceYears" name="experienceYears" required>
                                            <option value="">Select...</option>
                                            <option value="Less than 1 year">Less than 1 year</option>
                                            <option value="1–3 years">1–3 years</option>
                                            <option value="3–5 years">3–5 years</option>
                                            <option value="5–10 years">5–10 years</option>
                                            <option value="10+ years">10+ years</option>
                                        </select>
                                    </div>

                                    {/* 3. Market Coverage */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>3. Market Coverage</h3>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="primaryMarkets">Primary Cities / ZIP Codes Served</label>
                                        <input className={styles.input} type="text" id="primaryMarkets" name="primaryMarkets" placeholder="e.g. Frisco, Plano, 75024" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Are You Currently Accepting New Buyer Clients? (Optional)</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}><input type="radio" name="acceptingNewClients" value="Yes" /> Yes</label>
                                            <label className={styles.radioLabel}><input type="radio" name="acceptingNewClients" value="Limited availability" /> Limited availability</label>
                                            <label className={styles.radioLabel}><input type="radio" name="acceptingNewClients" value="Not currently, but interested later" /> Not currently, but interested later</label>
                                        </div>
                                    </div>

                                    {/* 4. Buyer Specialization */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>4. Buyer Specialization (Important)</h3>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Buyer Types You Commonly Work With (Select at least one)</label>
                                        <div className={styles.checkboxGroup}>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="First-time home buyers" /> First-time home buyers</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="Relocation buyers" /> Relocation buyers</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="Investors" /> Investors</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="New construction" /> New construction</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="Luxury homes" /> Luxury homes</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="buyerSpecializations" value="Multi-family / rental properties" /> Multi-family / rental properties</label>
                                        </div>
                                    </div>

                                    {/* 5. Language & Cultural Fit */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>5. Language & Cultural Fit (Core Differentiator)</h3>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Languages Spoken (Select at least one)</label>
                                        <div className={styles.checkboxGroup}>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="English" /> English</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Hindi" /> Hindi</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Urdu" /> Urdu</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Gujarati" /> Gujarati</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Punjabi" /> Punjabi</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Tamil" /> Tamil</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Telugu" /> Telugu</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Bengali" /> Bengali</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Malayalam" /> Malayalam</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Kannada" /> Kannada</label>
                                            <label className={styles.checkboxLabel}><input type="checkbox" name="languages" value="Other" /> Other</label>
                                        </div>
                                        <div style={{ marginTop: '12px' }}>
                                            <input className={styles.input} type="text" name="otherLanguage" placeholder="If 'Other', please specify" />
                                        </div>
                                    </div>

                                    {/* 6. Alignment & Compliance */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>6. Alignment & Compliance</h3>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.checkboxLabel}>
                                            <input type="checkbox" name="referralAcknowledgement" required />
                                            {' '}I understand that Niveasa operates as a real estate referral marketplace and that participation may involve referral-based partnerships subject to separate agreement upon approval.
                                        </label>
                                    </div>

                                    {/* 7. Additional Context */}
                                    <div className={styles.fullWidth}>
                                        <h3 className={styles.sectionHeading}>7. Additional Context (Optional)</h3>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label} htmlFor="additionalContext">Anything Else We Should Know?</label>
                                        <textarea className={styles.textarea} id="additionalContext" name="additionalContext" rows={4} maxLength={500} placeholder="Niche expertise, community involvement, unique background..."></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '32px' }} disabled={isPending}>
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
        </main >
    );
}
