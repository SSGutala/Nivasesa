'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurveyFormBase } from '../../../lib/components/survey';
import styles from '../../../lib/components/survey/survey.module.css';

export default function BuyerSurveyPage() {
    // Extra fields specific to home buyers
    const [buyerType, setBuyerType] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
    const [preApproved, setPreApproved] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateBuyerFields = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!buyerType) {
            newErrors.buyerType = 'Please select a buyer type';
        }

        if (!budgetRange) {
            newErrors.budgetRange = 'Please select your budget range';
        }

        if (propertyTypes.length === 0) {
            newErrors.propertyTypes = 'Please select at least one property type';
        }

        if (!preApproved) {
            newErrors.preApproved = 'Please indicate your pre-approval status';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getExtraData = () => {
        // Validate before returning data
        if (!validateBuyerFields()) {
            return null;
        }

        return {
            buyerType,
            budgetRange,
            propertyTypes,
            preApproved,
        };
    };

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
                    userType="buyer"
                    title="Home Buyer"
                    subtitle="Connect with realtors who speak your language and understand your needs."
                    onExtraData={getExtraData}
                >
                    {/* Buyer-specific fields */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionHeading}>Buying Details</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="buyerType">
                            What type of buyer are you? <span className={styles.required}>*</span>
                        </label>
                        <select
                            className={`${styles.select} ${errors.buyerType ? styles.inputError : ''}`}
                            id="buyerType"
                            value={buyerType}
                            onChange={(e) => {
                                setBuyerType(e.target.value);
                                if (errors.buyerType) {
                                    setErrors({ ...errors, buyerType: '' });
                                }
                            }}
                            required
                        >
                            <option value="">Select...</option>
                            <option value="First-time buyer">First-time home buyer</option>
                            <option value="Move-up buyer">Moving to a bigger home</option>
                            <option value="Downsizing">Downsizing</option>
                            <option value="Relocating">Relocating from another city/state</option>
                            <option value="Investor">Investor / Rental property</option>
                            <option value="New to US">New to US (H1B/F1 visa)</option>
                        </select>
                        {errors.buyerType && (
                            <div className={styles.errorText}>{errors.buyerType}</div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="budgetRange">
                            Budget range <span className={styles.required}>*</span>
                        </label>
                        <select
                            className={`${styles.select} ${errors.budgetRange ? styles.inputError : ''}`}
                            id="budgetRange"
                            value={budgetRange}
                            onChange={(e) => {
                                setBudgetRange(e.target.value);
                                if (errors.budgetRange) {
                                    setErrors({ ...errors, budgetRange: '' });
                                }
                            }}
                            required
                        >
                            <option value="">Select budget</option>
                            <option value="Under $300K">Under $300K</option>
                            <option value="$300K - $500K">$300K - $500K</option>
                            <option value="$500K - $700K">$500K - $700K</option>
                            <option value="$700K - $1M">$700K - $1M</option>
                            <option value="$1M - $1.5M">$1M - $1.5M</option>
                            <option value="$1.5M+">$1.5M+</option>
                        </select>
                        {errors.budgetRange && (
                            <div className={styles.errorText}>{errors.budgetRange}</div>
                        )}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>
                            Property types interested in (Select all that apply) <span className={styles.required}>*</span>
                        </label>
                        {errors.propertyTypes && (
                            <div className={styles.errorText}>{errors.propertyTypes}</div>
                        )}
                        <div className={styles.languageGrid}>
                            {[
                                'Single family home',
                                'Townhouse',
                                'Condo',
                                'Multi-family',
                                'New construction',
                                'Luxury home',
                            ].map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={propertyTypes.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPropertyTypes([...propertyTypes, option]);
                                            } else {
                                                setPropertyTypes(propertyTypes.filter((p) => p !== option));
                                            }
                                            if (errors.propertyTypes) {
                                                setErrors({ ...errors, propertyTypes: '' });
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Are you pre-approved for a mortgage? <span className={styles.required}>*</span>
                        </label>
                        {errors.preApproved && (
                            <div className={styles.errorText}>{errors.preApproved}</div>
                        )}
                        <div className={styles.radioGroup}>
                            {[
                                { value: 'Yes', label: 'Yes, I have pre-approval' },
                                { value: 'In progress', label: 'Working on it' },
                                { value: 'No', label: 'Not yet' },
                                { value: 'Cash', label: 'Paying cash' },
                            ].map((option) => (
                                <label key={option.value} className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="preApproved"
                                        value={option.value}
                                        checked={preApproved === option.value}
                                        onChange={(e) => {
                                            setPreApproved(e.target.value);
                                            if (errors.preApproved) {
                                                setErrors({ ...errors, preApproved: '' });
                                            }
                                        }}
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
