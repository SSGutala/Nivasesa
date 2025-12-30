'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurveyFormBase } from '@/components/survey';
import styles from '@/components/survey/survey.module.css';

export default function HostSurveyPage() {
    // Extra fields specific to hosts/landlords
    const [propertyType, setPropertyType] = useState('');
    const [numberOfUnits, setNumberOfUnits] = useState('');
    const [rentRange, setRentRange] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);

    const getExtraData = () => ({
        propertyType,
        numberOfUnits,
        rentRange,
        amenities,
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
                    userType="host"
                    title="Host or Landlord"
                    subtitle="Tell us about your property and find great tenants from the South Asian community."
                    onExtraData={getExtraData}
                >
                    {/* Host-specific fields */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionHeading}>Property Details</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="propertyType">
                            What type of property?
                        </label>
                        <select
                            className={styles.select}
                            id="propertyType"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <option value="">Select property type</option>
                            <option value="Room in my home">Room in my home (I live there)</option>
                            <option value="Room in rental property">Room in my rental property</option>
                            <option value="Whole apartment">Whole apartment</option>
                            <option value="Whole house">Whole house</option>
                            <option value="Apartment building">Apartment building (multiple units)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="numberOfUnits">
                            How many rooms/units are you looking to rent?
                        </label>
                        <select
                            className={styles.select}
                            id="numberOfUnits"
                            value={numberOfUnits}
                            onChange={(e) => setNumberOfUnits(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="1">1 room/unit</option>
                            <option value="2-3">2-3 rooms/units</option>
                            <option value="4-10">4-10 units</option>
                            <option value="10+">10+ units</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="rentRange">
                            Monthly rent range
                        </label>
                        <select
                            className={styles.select}
                            id="rentRange"
                            value={rentRange}
                            onChange={(e) => setRentRange(e.target.value)}
                        >
                            <option value="">Select rent range</option>
                            <option value="Under $500">Under $500</option>
                            <option value="$500 - $800">$500 - $800</option>
                            <option value="$800 - $1,200">$800 - $1,200</option>
                            <option value="$1,200 - $1,500">$1,200 - $1,500</option>
                            <option value="$1,500 - $2,000">$1,500 - $2,000</option>
                            <option value="$2,000+">$2,000+</option>
                        </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Property amenities / policies (Select all that apply)</label>
                        <div className={styles.languageGrid}>
                            {[
                                'Furnished',
                                'Utilities included',
                                'Parking available',
                                'Laundry in unit',
                                'Pets allowed',
                                'Vegetarian household',
                                '420 friendly',
                                'LGBTQ+ friendly',
                            ].map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={amenities.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setAmenities([...amenities, option]);
                                            } else {
                                                setAmenities(amenities.filter((a) => a !== option));
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </SurveyFormBase>
            </div>
        </main>
    );
}
