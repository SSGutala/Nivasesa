'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SurveyFormBase } from '../../../lib/components/survey';
import styles from '../../../lib/components/survey/survey.module.css';

export default function AgentSurveyPage() {
    // Extra fields specific to agents
    const [experienceYears, setExperienceYears] = useState('');
    const [leadSources, setLeadSources] = useState<string[]>([]);
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [brokerageName, setBrokerageName] = useState('');

    const getExtraData = () => ({
        experienceYears,
        leadSources,
        specializations,
        monthlyBudget,
        licenseNumber,
        brokerageName,
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
                    userType="agent"
                    title="Real Estate Agent"
                    subtitle="Join our network and get qualified leads from the South Asian community."
                    onExtraData={getExtraData}
                >
                    {/* Agent-specific fields */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionHeading}>Professional Details</h3>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="licenseNumber">
                            License Number
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            id="licenseNumber"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="Your real estate license number"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="brokerageName">
                            Brokerage Name
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            id="brokerageName"
                            value={brokerageName}
                            onChange={(e) => setBrokerageName(e.target.value)}
                            placeholder="Your brokerage"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="experienceYears">
                            Years of experience
                        </label>
                        <select
                            className={styles.select}
                            id="experienceYears"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Less than 1 year">Less than 1 year</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5-10 years">5-10 years</option>
                            <option value="10+ years">10+ years</option>
                        </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Where do you currently get leads? (Select all that apply)</label>
                        <div className={styles.languageGrid}>
                            {[
                                'Zillow',
                                'Realtor.com',
                                'Referrals',
                                'Social media',
                                'Cold calling',
                                'Open houses',
                                'Sphere of influence',
                                'Other platforms',
                            ].map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={leadSources.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setLeadSources([...leadSources, option]);
                                            } else {
                                                setLeadSources(leadSources.filter((s) => s !== option));
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Specializations (Select all that apply)</label>
                        <div className={styles.languageGrid}>
                            {[
                                'First-time buyers',
                                'Luxury homes',
                                'Investment properties',
                                'New construction',
                                'Relocation',
                                'South Asian community',
                            ].map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={specializations.includes(option)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSpecializations([...specializations, option]);
                                            } else {
                                                setSpecializations(specializations.filter((s) => s !== option));
                                            }
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="monthlyBudget">
                            Monthly budget for leads
                        </label>
                        <select
                            className={styles.select}
                            id="monthlyBudget"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(e.target.value)}
                        >
                            <option value="">Select...</option>
                            <option value="Under $100">Under $100</option>
                            <option value="$100 - $250">$100 - $250</option>
                            <option value="$250 - $500">$250 - $500</option>
                            <option value="$500 - $1000">$500 - $1000</option>
                            <option value="$1000+">$1000+</option>
                            <option value="Pay per lead only">Only interested in pay-per-lead</option>
                        </select>
                    </div>
                </SurveyFormBase>
            </div>
        </main>
    );
}
