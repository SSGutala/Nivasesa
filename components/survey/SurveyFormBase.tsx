'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitSurvey, SurveyFormData, SurveyUserType } from '@/actions/survey';
import LanguageSelect from './LanguageSelect';
import styles from './survey.module.css';

interface SurveyFormBaseProps {
    userType: SurveyUserType;
    title: string;
    subtitle?: string;
    children?: React.ReactNode; // For user-type specific fields
    onExtraData?: () => Record<string, unknown>; // Get extra data from type-specific fields
}

const TIMELINES = [
    { value: 'ASAP', label: 'As soon as possible' },
    { value: '1-3 months', label: '1-3 months' },
    { value: '3-6 months', label: '3-6 months' },
    { value: '6+ months', label: '6+ months' },
    { value: 'Just exploring', label: 'Just exploring' },
];

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function SurveyFormBase({
    userType,
    title,
    subtitle,
    children,
    onExtraData,
}: SurveyFormBaseProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [timeline, setTimeline] = useState('');
    const [languages, setLanguages] = useState<string[]>([]);
    const [biggestChallenge, setBiggestChallenge] = useState('');
    const [currentSolution, setCurrentSolution] = useState('');
    const [referralSource, setReferralSource] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData: SurveyFormData = {
            userType,
            email,
            name: name || undefined,
            phone: phone || undefined,
            city: city || undefined,
            state: state || undefined,
            zipcode: zipcode || undefined,
            timeline: timeline || undefined,
            languages: languages.length > 0 ? languages : undefined,
            biggestChallenge: biggestChallenge || undefined,
            currentSolution: currentSolution || undefined,
            referralSource: referralSource || undefined,
            surveyData: onExtraData ? onExtraData() : undefined,
        };

        startTransition(async () => {
            const result = await submitSurvey(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/survey/thank-you');
                }, 1500);
            } else {
                setError(result.message);
            }
        });
    };

    if (success) {
        return (
            <div className={styles.successMessage}>
                <div className={styles.successIcon}>&#x2714;&#xFE0F;</div>
                <h3 className={styles.successTitle}>Thank You!</h3>
                <p className={styles.successText}>
                    We've received your information. Redirecting you now...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>{title}</h2>
            {subtitle && (
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>{subtitle}</p>
            )}

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGrid}>
                {/* Contact Info */}
                <div className={styles.fullWidth}>
                    <h3 className={styles.sectionHeading}>Contact Information</h3>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">
                        Full Name
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">
                        Email <span className={styles.required}>*</span>
                    </label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="phone">
                        Phone Number
                    </label>
                    <input
                        className={styles.input}
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(123) 456-7890"
                    />
                </div>

                {/* Location */}
                <div className={styles.fullWidth}>
                    <h3 className={styles.sectionHeading}>Location</h3>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="city">
                        City / Metro Area
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Frisco, Dallas, Jersey City"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="state">
                        State
                    </label>
                    <select
                        className={styles.select}
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="">Select a state</option>
                        {US_STATES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="zipcode">
                        ZIP Code
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        id="zipcode"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        placeholder="e.g., 75024"
                        maxLength={10}
                    />
                </div>

                {/* Timeline */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="timeline">
                        Timeline
                    </label>
                    <select
                        className={styles.select}
                        id="timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                    >
                        <option value="">When are you looking?</option>
                        {TIMELINES.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Languages */}
                <div className={styles.fullWidth}>
                    <LanguageSelect
                        value={languages}
                        onChange={setLanguages}
                        label="Languages You Speak"
                    />
                </div>

                {/* Type-specific fields */}
                {children}

                {/* Pain Points */}
                <div className={styles.fullWidth}>
                    <h3 className={styles.sectionHeading}>Tell Us More</h3>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label} htmlFor="biggestChallenge">
                        What's your biggest challenge right now?
                    </label>
                    <textarea
                        className={styles.textarea}
                        id="biggestChallenge"
                        value={biggestChallenge}
                        onChange={(e) => setBiggestChallenge(e.target.value)}
                        placeholder="Tell us what problems you're facing..."
                        rows={3}
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label} htmlFor="currentSolution">
                        What are you currently using to solve this?
                    </label>
                    <textarea
                        className={styles.textarea}
                        id="currentSolution"
                        value={currentSolution}
                        onChange={(e) => setCurrentSolution(e.target.value)}
                        placeholder="e.g., Craigslist, Sulekha, Facebook groups, friends..."
                        rows={2}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="referralSource">
                        How did you hear about us?
                    </label>
                    <select
                        className={styles.select}
                        id="referralSource"
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="google">Google Search</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="friend">Friend / Family</option>
                        <option value="community">Community Group</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isPending}
            >
                {isPending ? 'Submitting...' : 'Join the Waitlist'}
            </button>

            <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                We'll reach out to learn more about your needs and give you early access when we launch.
            </p>
        </form>
    );
}
