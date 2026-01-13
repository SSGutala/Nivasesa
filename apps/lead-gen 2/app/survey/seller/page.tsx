'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurveyFormBase } from '../../../lib/components/survey';
import styles from '../../../lib/components/survey/survey.module.css';

export default function SellerSurveyPage() {
    // Extra fields specific to home sellers
    const [propertyType, setPropertyType] = useState('');
    const [estimatedValue, setEstimatedValue] = useState('');
    const [sellingReason, setSellingReason] = useState('');
    const [listedBefore, setListedBefore] = useState('');

    const getExtraData = () => ({
        propertyType,
        estimatedValue,
        sellingReason,
        listedBefore,
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
                    userType="seller"
                    title="Home Seller"
                    subtitle="Connect with agents who can market your home to the right buyers."
                    onExtraData={getExtraData}
                >
                    {/* Seller-specific fields */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionHeading}>Property Details</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="propertyType">
                            Type of property
                        </label>
                        <select
                            className={styles.select}
                            id="propertyType"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Single family home">Single family home</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Condo">Condo</option>
                            <option value="Multi-family">Multi-family</option>
                            <option value="Land">Land / Lot</option>
                            <option value="Investment property">Investment property</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="estimatedValue">
                            Estimated value
                        </label>
                        <select
                            className={styles.select}
                            id="estimatedValue"
                            value={estimatedValue}
                            onChange={(e) => setEstimatedValue(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Under $300K">Under $300K</option>
                            <option value="$300K - $500K">$300K - $500K</option>
                            <option value="$500K - $700K">$500K - $700K</option>
                            <option value="$700K - $1M">$700K - $1M</option>
                            <option value="$1M - $1.5M">$1M - $1.5M</option>
                            <option value="$1.5M+">$1.5M+</option>
                            <option value="Not sure">Not sure</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="sellingReason">
                            Reason for selling
                        </label>
                        <select
                            className={styles.select}
                            id="sellingReason"
                            value={sellingReason}
                            onChange={(e) => setSellingReason(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Upgrading">Upgrading to bigger home</option>
                            <option value="Downsizing">Downsizing</option>
                            <option value="Relocating">Relocating to another area</option>
                            <option value="Investment">Selling investment property</option>
                            <option value="Life change">Life change (divorce, inheritance, etc.)</option>
                            <option value="Financial">Financial reasons</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Have you listed this property before?</label>
                        <div className={styles.radioGroup}>
                            {[
                                { value: 'No', label: 'No, first time listing' },
                                { value: 'Yes, expired', label: 'Yes, listing expired' },
                                { value: 'Yes, withdrew', label: 'Yes, withdrew listing' },
                                { value: 'FSBO', label: 'Tried selling by owner' },
                            ].map((option) => (
                                <label key={option.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="listedBefore"
                                        value={option.value}
                                        checked={listedBefore === option.value}
                                        onChange={(e) => setListedBefore(e.target.value)}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </SurveyFormBase>
            </div>
        </main>
    );
}
