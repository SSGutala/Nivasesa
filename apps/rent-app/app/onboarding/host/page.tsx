'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { US_STATES } from '@/lib/geo';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { signIn } from 'next-auth/react';
import { createHostAccount } from '@/actions/host';
import styles from './HostOnboarding.module.css';

const STEPS = [
    { id: 1, label: 'Account' },
    { id: 2, label: 'Password' },
    { id: 3, label: 'Basics' },
    { id: 4, label: 'Location' },
    { id: 5, label: 'Space' },
];

const INITIAL_DATA = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    contactMethod: '',
    city: '',
    state: '',
    zip: '',
    spaceType: '',
    stayDurations: [] as string[],
    availabilityStatus: '',
    earliestDate: '',
    additionalInfo: '',
    newsletterConsent: false,
    username: '',
    interestedInAgent: '',
};

export default function OfferSpacePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const updateFormData = (fields: Partial<typeof INITIAL_DATA>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        }
        if (step === 2) {
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }
        if (step === 3) {
            if (!formData.firstName) newErrors.firstName = 'First name is required';
            if (!formData.lastName) newErrors.lastName = 'Last name is required';
            if (!formData.phone) newErrors.phone = 'Phone number is required';
        }
        if (step === 4) {
            if (!formData.city) newErrors.city = 'City is required';
            if (!formData.state) newErrors.state = 'State is required';
            if (!formData.zip) newErrors.zip = 'Zip code is required';
        }
        if (step === 5) {
            if (!formData.spaceType) newErrors.spaceType = 'Space type is required';
            if (formData.stayDurations.length === 0) newErrors.stayDurations = 'Select at least one stay duration';
            if (!formData.availabilityStatus) newErrors.availabilityStatus = 'Availability status is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateStep(currentStep)) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps(prev => [...prev, currentStep]);
            }
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            // 1. Create/Update User in DB with Host Role
            const result = await createHostAccount(formData);
            if (!result.success) {
                setErrors({ submit: result.message || 'Failed to create account' });
                setIsSubmitting(false);
                return;
            }

            // 2. Sign In to establish NextAuth session
            const signInResult = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setErrors({ submit: 'Failed to sign in. Please try again.' });
                setIsSubmitting(false);
                return;
            }

            // 3. Redirect to Dashboard
            console.log('Redirecting to dashboard...');
            window.location.href = '/host/dashboard';

        } catch (err) {
            console.error(err);
            setErrors({ submit: 'An unexpected error occurred.' });
            setIsSubmitting(false);
        }
    };

    const renderStepper = () => (
        <div className={styles.stepperWrapper}>
            {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className={styles.stepItem}>
                        <div className={`${styles.stepCircle} ${currentStep === step.id ? styles.stepCircleActive : ''}`}>
                            {step.id}
                        </div>
                        <span className={`${styles.stepLabel} ${currentStep === step.id ? styles.stepLabelActive : ''}`}>
                            {step.label}
                        </span>
                    </div>
                    {index < STEPS.length - 1 && <div className={styles.line} />}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Host your community.</h1>
            <p className={styles.subtitle}>Enter your email to start your journey with Nivaesa.</p>

            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                />
                {errors.email && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div className={styles.divider}>
                <span>OR</span>
            </div>

            <button type="button" className={styles.googleBtn}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
                Sign up with Google
            </button>

            <button
                type="button"
                className={styles.continueBtn}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Create a password.</h1>
            <p className={styles.subtitle}>Choose a strong password to secure your account.</p>

            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    id="password"
                    type="password"
                    className={styles.input}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                />
                {errors.password && <p className={styles.errorText}>{errors.password}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    className={styles.input}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
            </div>

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>Back</button>
                <button type="button" className={styles.continueBtn} onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Tell us about yourself.</h1>
            <p className={styles.subtitle}>We need a few details to create your profile.</p>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        className={styles.input}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => updateFormData({ firstName: e.target.value })}
                    />
                    {errors.firstName && <p className={styles.errorText}>{errors.firstName}</p>}
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        className={styles.input}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => updateFormData({ lastName: e.target.value })}
                    />
                    {errors.lastName && <p className={styles.errorText}>{errors.lastName}</p>}
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    placeholder="(555) 555-5555"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
            </div>

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>Back</button>
                <button type="button" className={styles.continueBtn} onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Where is your place?</h1>
            <p className={styles.subtitle}>Help us match you with the right roommates.</p>

            <div className={styles.inputGroup}>
                <label htmlFor="city" className={styles.label}>City</label>
                <input
                    id="city"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. New York"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                />
                {errors.city && <p className={styles.errorText}>{errors.city}</p>}
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label htmlFor="state" className={styles.label}>State</label>
                    <select
                        id="state"
                        className={styles.stepsDropdown}
                        value={formData.state}
                        onChange={(e) => updateFormData({ state: e.target.value })}
                    >
                        <option value="">Select State</option>
                        {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                    </select>
                    {errors.state && <p className={styles.errorText}>{errors.state}</p>}
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="zip" className={styles.label}>Zip Code</label>
                    <input
                        id="zip"
                        type="text"
                        className={styles.input}
                        placeholder="e.g. 10001"
                        value={formData.zip}
                        onChange={(e) => updateFormData({ zip: e.target.value })}
                    />
                    {errors.zip && <p className={styles.errorText}>{errors.zip}</p>}
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>Back</button>
                <button type="button" className={styles.continueBtn} onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Describe your space.</h1>
            <p className={styles.subtitle}>What kind of accommodation are you offering?</p>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Space Type</label>
                <div className={styles.radioGroup}>
                    {['Private Room', 'Shared Room', 'Entire Place'].map(type => (
                        <label key={type} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="spaceType"
                                value={type}
                                checked={formData.spaceType === type}
                                onChange={(e) => updateFormData({ spaceType: e.target.value })}
                            />
                            {type}
                        </label>
                    ))}
                </div>
                {errors.spaceType && <p className={styles.errorText}>{errors.spaceType}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Stay Duration (Select all that apply)</label>
                <div className={styles.checkboxGroup}>
                    {['Short-term (< 3 months)', 'Medium-term (3-6 months)', 'Long-term (6+ months)'].map(duration => (
                        <label key={duration} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={formData.stayDurations.includes(duration)}
                                onChange={(e) => {
                                    const newDurations = e.target.checked
                                        ? [...formData.stayDurations, duration]
                                        : formData.stayDurations.filter(d => d !== duration);
                                    updateFormData({ stayDurations: newDurations });
                                }}
                            />
                            {duration}
                        </label>
                    ))}
                </div>
                {errors.stayDurations && <p className={styles.errorText}>{errors.stayDurations}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Availability Status</label>
                <select
                    className={styles.stepsDropdown}
                    value={formData.availabilityStatus}
                    onChange={(e) => updateFormData({ availabilityStatus: e.target.value })}
                >
                    <option value="">Select Status</option>
                    <option value="Available Now">Available Now</option>
                    <option value="Available Soon">Available Soon</option>
                    <option value="Occupied">Occupied</option>
                </select>
                {errors.availabilityStatus && <p className={styles.errorText}>{errors.availabilityStatus}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Would you like to work with a real estate agent?</label>
                <p className={styles.helperText} style={{ fontSize: '13px', color: '#666', marginTop: '-4px', marginBottom: '12px', lineHeight: '1.4' }}>
                    Some hosts choose to work with real estate agents to ensure a seamless leasing experience and secure tenants aligned with their expectations.
                </p>
                <div className={styles.radioGroup}>
                    {['Yes', 'No'].map(option => (
                        <label key={option} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="interestedInAgent"
                                value={option}
                                checked={formData.interestedInAgent === option}
                                onChange={(e) => updateFormData({ interestedInAgent: e.target.value })}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {errors.submit && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{errors.submit}</p>}

            <div className={styles.buttonGroup}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>Back</button>
                <button
                    type="button"
                    className={styles.continueBtn}
                    onClick={handleComplete}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Finalizing...' : 'Complete Sign up'}
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    N I V A E S A
                </Link>
                <div className={styles.headerNav}>
                    <Link href="/host/dashboard" className={styles.loginLink} style={{ color: '#ef4444', marginRight: '20px' }}>
                        Skip to Dashboard
                    </Link>
                    <Link href="/login" className={styles.loginLink}>
                        Log in
                    </Link>
                    <Link href="/join" className={styles.signupBtn}>
                        Sign up
                    </Link>
                </div>
            </header>

            <main className={styles.mainContent}>
                {renderStepper()}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
            </main>
        </div>
    );
}
