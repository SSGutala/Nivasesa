'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurveyFormBase } from '@/components/survey';
import styles from '@/components/survey/survey.module.css';

export default function RoommateSurveyPage() {
    // Extra fields specific to roommate seekers
    const [lookingFor, setLookingFor] = useState<string[]>([]);
    const [budget, setBudget] = useState('');
    const [moveInUrgency, setMoveInUrgency] = useState('');

    const getExtraData = () => ({
        lookingFor,
        budget,
        moveInUrgency,
    });

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>
            <Link
                href="/survey"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    marginBottom: '24px',
                    fontSize: '14px',
                }}
            >
                &#x2190; Back
            </Link>

            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <SurveyFormBase
                    userType="roommate_seeker"
                    title="Looking for Housing"
                    subtitle="Tell us what you're looking for and we'll help you find the perfect match."
                    onExtraData={getExtraData}
                >
                    {/* Roommate-specific fields */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionHeading}>Housing Preferences</h3>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>What are you looking for? (Select all that apply)</label>
                        <div className={styles.languageGrid}>
                            {[
                                'Room in a shared house',
                                'Roommates to find a place together',
                                'Whole apartment/house to rent',
                                'Looking to buy a home',
                                'Looking to sell a home',
                            ].map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={lookingFor.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setLookingFor([...lookingFor, option]);
                                            } else {
                                                setLookingFor(lookingFor.filter((o) => o !== option));
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="budget">
                            Monthly Budget
                        </label>
                        <select
                            className={styles.select}
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        >
                            <option value="">Select budget range</option>
                            <option value="Under $500">Under $500</option>
                            <option value="$500 - $800">$500 - $800</option>
                            <option value="$800 - $1,200">$800 - $1,200</option>
                            <option value="$1,200 - $1,500">$1,200 - $1,500</option>
                            <option value="$1,500 - $2,000">$1,500 - $2,000</option>
                            <option value="$2,000+">$2,000+</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="moveInUrgency">
                            How urgently do you need housing?
                        </label>
                        <select
                            className={styles.select}
                            id="moveInUrgency"
                            value={moveInUrgency}
                            onChange={(e) => setMoveInUrgency(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Immediately">Immediately (within 2 weeks)</option>
                            <option value="Soon">Soon (within 1 month)</option>
                            <option value="Planning">Planning ahead (1-3 months)</option>
                            <option value="Exploring">Just exploring options</option>
                        </select>
                    </div>
                </SurveyFormBase>
            </div>
        </main>
    );
}
