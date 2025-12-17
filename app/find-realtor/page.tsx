'use client';

import { useActionState } from 'react';
import { submitBuyerRequest } from '../actions';
import styles from './form.module.css';
import { Building2, Languages, MapPin, User } from 'lucide-react';

const initialState = {
    message: '',
    errors: null as any,
    success: false,
    matches: [] as any[],
    location: '',
};

export default function FindRealtorPage() {
    // @ts-ignore - types are tricky with useActionState
    const [state, formAction, isPending] = useActionState(submitBuyerRequest, initialState);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Find your partner.</h1>
                <p>Tell us your needs. We&apos;ll match you with a verified local expert.</p>
            </div>

            <form action={formAction} className={styles.form}>
                <h2>Your Preferences</h2>

                {state.message && (
                    <div style={{
                        padding: '16px',
                        marginBottom: '24px',
                        borderRadius: '4px',
                        backgroundColor: state.success ? '#ECFDF5' : '#FEF2F2',
                        color: state.success ? '#047857' : '#DC2626',
                        border: `1px solid ${state.success ? '#A7F3D0' : '#FECACA'}`
                    }}>
                        {state.message}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" required />
                    {state.errors?.name && <p style={{ color: 'red', fontSize: '0.875rem' }}>{state.errors.name}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required />
                        {state.errors?.email && <p style={{ color: 'red', fontSize: '0.875rem' }}>{state.errors.email}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" id="phone" name="phone" required />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="location">Desired City or ZIP</label>
                    <input type="text" id="location" name="location" required placeholder="e.g. Frisco, TX" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className={styles.formGroup}>
                        <label htmlFor="language">Preferred Language</label>
                        <select id="language" name="language">
                            <option value="">Any</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Gujarati">Gujarati</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Punjabi">Punjabi</option>
                            <option value="Tamil">Tamil</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="budget">Max Budget</label>
                        <select id="budget" name="budget">
                            <option value="">Any</option>
                            <option value="500000">$500k</option>
                            <option value="750000">$750k</option>
                            <option value="1000000">$1M+</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="timeframe">Timeframe</label>
                    <select id="timeframe" name="timeframe">
                        <option value="ASAP">ASAP</option>
                        <option value="3 Months">Within 3 Months</option>
                        <option value="6 Months">Within 6 Months</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isPending}>
                    {isPending ? 'Finding Matches...' : 'Find Realtors'}
                </button>

                <p className={styles.disclaimer}>
                    By clicking &quot;Find Realtors&quot;, you agree to our Terms of Use and Privacy Policy.
                </p>
            </form>

            {/* Results Section */}
            {state.matches && state.matches.length > 0 && (
                <div className={styles.resultsSection}>
                    <h2>Your Matches</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        We found {state.matches.length} realtors matching your criteria in {state.location}.
                    </p>

                    <div className={styles.resultGrid}>
                        {state.matches.map((match: any) => (
                            <div key={match.realtor.id} className={styles.card}>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.avatar}>
                                            <User size={32} />
                                        </div>
                                        <div className={styles.realtorInfo}>
                                            <h3>{match.realtor.user.name}</h3>
                                            <p className={styles.brokerage}>{match.realtor.brokerage}</p>
                                        </div>
                                    </div>

                                    <div className={styles.details}>
                                        <div className={styles.detailRow}>
                                            <Languages size={16} className={styles.detailIcon} />
                                            <span>{match.realtor.languages}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <MapPin size={16} className={styles.detailIcon} />
                                            <span>{match.realtor.cities}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <Building2 size={16} className={styles.detailIcon} />
                                            <span>{match.realtor.experienceYears} Years Experience</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cardFooter}>
                                    <button className={`btn btn-secondary ${styles.contactBtn}`}>Contact Agent</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {state.success && state.matches && state.matches.length === 0 && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p>We are searching our network for more agents in {state.location || 'your area'}. Matches will be emailed to you.</p>
                </div>
            )}
        </div>
    );
}
