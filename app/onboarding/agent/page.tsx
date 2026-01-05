'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormLayout from '@/components/join/FormLayout';
import FormInput from '@/components/join/FormInput';
import FormSelect from '@/components/join/FormSelect';
import { submitRealtorApplication } from '@/actions/apply';
import { signIn } from 'next-auth/react';
import { Check, X } from 'lucide-react';
import commonStyles from '@/app/join/auth-steps.module.css'; // Reusing styles for consistency
import { US_STATES } from '@/lib/geo'; // Reusing US_STATES

const STEPS = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Professional' },
    { id: 3, label: 'Service Area' },
    { id: 4, label: 'Specialization' },
    { id: 5, label: 'Account Security' },
];

// Initial State matching the previous form requirements
const INITIAL_DATA = {
    fullName: '',
    email: '',
    phone: '',
    preferredContactMethod: '',
    brokerageName: '',
    licenseNumber: '',
    statesLicensed: [] as string[],
    experienceYears: '',
    primaryMarkets: '',
    acceptingNewClients: '',
    buyerSpecializations: [] as string[],
    languages: [] as string[],
    otherLanguage: '',
    referralAcknowledgement: false,
    additionalContext: '',
    password: '',
    confirmPassword: '',
};

export default function AgentOnboardingPage() {
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
            if (!formData.fullName) newErrors.fullName = 'Full Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
            if (!formData.phone) newErrors.phone = 'Phone Number is required';
        }
        if (step === 2) {
            if (!formData.brokerageName) newErrors.brokerageName = 'Brokerage Name is required';
            if (!formData.licenseNumber) newErrors.licenseNumber = 'License Number is required';
            if (formData.statesLicensed.length === 0) newErrors.statesLicensed = 'Select at least one state';
            if (!formData.experienceYears) newErrors.experienceYears = 'Experience is required';
        }
        if (step === 3) {
            if (!formData.primaryMarkets) newErrors.primaryMarkets = 'Primary Markets are required';
        }
        if (step === 4) {
            if (formData.languages.length === 0) newErrors.languages = 'Select at least one language';
            if (!formData.referralAcknowledgement) newErrors.referralAcknowledgement = 'Acknowledgement is required';
        }
        if (step === 5) {
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Adapt formData to FormData object expected by the server action
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => submissionData.append(key, v));
                } else if (typeof value === 'boolean') {
                    if (value) submissionData.append(key, 'on');
                } else {
                    submissionData.append(key, value);
                }
            });

            const result = await submitRealtorApplication({ message: '', success: false }, submissionData);

            if (result.success) {
                // Auto-login before redirecting
                const signInResult = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (signInResult?.error) {
                    console.error('Auto-login failed:', signInResult.error);
                    // Fallback to login page if auto-login fails
                    router.push('/login');
                } else {
                    // Determine redirection
                    const redirect = (result as any).redirectTo || '/dashboard';
                    router.push(redirect);
                }
            } else {
                setErrors({ submit: result.message || 'Submission failed' });
                setIsSubmitting(false);
            }

        } catch (error: any) {
            console.error('Submission error', error);
            setErrors({ submit: error.message || 'An error occurred during submission.' });
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Let's get started.</h1>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-light)', marginBottom: '40px' }}>Tell us a bit about who you are.</p>

                        <FormInput
                            id="fullName"
                            label="Full Name"
                            required
                            value={formData.fullName}
                            onChange={(e) => updateFormData({ fullName: e.target.value })}
                            error={errors.fullName}
                        />
                        <FormInput
                            id="email"
                            label="Email Address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            error={errors.email}
                        />
                        <FormInput
                            id="phone"
                            label="Phone Number"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            error={errors.phone}
                        />

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Preferred Contact Method</label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                {['Phone', 'Email', 'Either'].map(method => (
                                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value={method}
                                            checked={formData.preferredContactMethod === method}
                                            onChange={(e) => updateFormData({ preferredContactMethod: e.target.value })}
                                        />
                                        {method}
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                );
            case 2:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Professional Details</h1>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-light)', marginBottom: '40px' }}>Verify your licensing and experience.</p>

                        <FormInput
                            id="brokerageName"
                            label="Brokerage Name"
                            required
                            value={formData.brokerageName}
                            onChange={(e) => updateFormData({ brokerageName: e.target.value })}
                            error={errors.brokerageName}
                        />
                        <FormInput
                            id="licenseNumber"
                            label="License Number"
                            required
                            value={formData.licenseNumber}
                            onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
                            error={errors.licenseNumber}
                        />

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>States Licensed In</label>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Select all that apply</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                                {US_STATES.map(state => (
                                    <label key={state.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.statesLicensed.includes(state.value)}
                                            onChange={(e) => {
                                                const newStates = e.target.checked
                                                    ? [...formData.statesLicensed, state.value]
                                                    : formData.statesLicensed.filter(s => s !== state.value);
                                                updateFormData({ statesLicensed: newStates });
                                            }}
                                        />
                                        {state.value}
                                    </label>
                                ))}
                            </div>
                            {errors.statesLicensed && <p style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{errors.statesLicensed}</p>}
                        </div>

                        <FormSelect
                            id="experienceYears"
                            label="Years of Experience"
                            required
                            value={formData.experienceYears}
                            onChange={(e) => updateFormData({ experienceYears: e.target.value })}
                            options={[
                                { value: 'Less than 1 year', label: 'Less than 1 year' },
                                { value: '1–3 years', label: '1–3 years' },
                                { value: '3–5 years', label: '3–5 years' },
                                { value: '5–10 years', label: '5–10 years' },
                                { value: '10+ years', label: '10+ years' },
                            ]}
                            error={errors.experienceYears}
                        />
                    </div>
                );
            case 3:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Service Area</h1>
                        <FormInput
                            id="primaryMarkets"
                            label="Primary Cities / ZIP Codes"
                            placeholder="e.g. Frisco, Plano, 75024"
                            required
                            value={formData.primaryMarkets}
                            onChange={(e) => updateFormData({ primaryMarkets: e.target.value })}
                            error={errors.primaryMarkets}
                        />

                        <div style={{ marginBottom: '20px', marginTop: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Are you expecting new buyer clients?</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['Yes', 'Limited availability', 'Not currently, but interested later'].map(opt => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="acceptingNewClients"
                                            value={opt}
                                            checked={formData.acceptingNewClients === opt}
                                            onChange={(e) => updateFormData({ acceptingNewClients: e.target.value })}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Specialization</h1>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-light)', marginBottom: '40px' }}>Help us match you with the right homebuyers.</p>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Buyer Types You Work With</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['First-time home buyers', 'Relocation buyers', 'Investors', 'New construction', 'Luxury homes', 'Multi-family / rental properties'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.buyerSpecializations.includes(type)}
                                            onChange={(e) => {
                                                const newTypes = e.target.checked
                                                    ? [...formData.buyerSpecializations, type]
                                                    : formData.buyerSpecializations.filter(t => t !== type);
                                                updateFormData({ buyerSpecializations: newTypes });
                                            }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Languages Spoken</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {['English', 'Hindi', 'Urdu', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Malayalam', 'Kannada', 'Other'].map(lang => (
                                    <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.languages.includes(lang)}
                                            onChange={(e) => {
                                                const newLangs = e.target.checked
                                                    ? [...formData.languages, lang]
                                                    : formData.languages.filter(l => l !== lang);
                                                updateFormData({ languages: newLangs });
                                            }}
                                        />
                                        {lang}
                                    </label>
                                ))}
                            </div>
                            {formData.languages.includes('Other') && (
                                <div style={{ marginTop: '12px' }}>
                                    <FormInput
                                        id="otherLanguage"
                                        label="Please specify"
                                        value={formData.otherLanguage}
                                        onChange={(e) => updateFormData({ otherLanguage: e.target.value })}
                                    />
                                </div>
                            )}
                            {errors.languages && <p style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{errors.languages}</p>}
                        </div>

                        <div style={{ marginBottom: '32px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', fontSize: '14px' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.referralAcknowledgement}
                                    onChange={(e) => updateFormData({ referralAcknowledgement: e.target.checked })}
                                    required
                                />
                                <span style={{ lineHeight: '1.5' }}>
                                    I understand that Niveasa operates as a real estate referral marketplace and participation may involve referral-based partnerships.
                                </span>
                            </label>
                            {errors.referralAcknowledgement && <p style={{ color: 'red', fontSize: '13px', marginTop: '4px' }}>{errors.referralAcknowledgement}</p>}
                        </div>

                        {errors.submit && <p style={{ color: 'var(--color-error)', marginTop: '24px', fontSize: '14px', textAlign: 'center' }}>{errors.submit}</p>}
                    </div>
                );
            case 5:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Account Security</h1>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-light)', marginBottom: '40px' }}>Set a password to access your dashboard.</p>

                        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                            <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                                <strong>Username:</strong> {formData.email || 'Your email address'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                Your email address will be used as your username.
                            </p>
                        </div>

                        <FormInput
                            id="password"
                            label="Create Password"
                            type="password"
                            required
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={(e) => updateFormData({ password: e.target.value })}
                            error={errors.password}
                        />
                        <FormInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            required
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                        />

                        {errors.submit && <p style={{ color: 'var(--color-error)', marginTop: '24px', fontSize: '14px', textAlign: 'center' }}>{errors.submit}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <FormLayout
            title={currentStep > 1 ? STEPS[currentStep - 1]?.label : ""}
            subtitle=""
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(id: number) => setCurrentStep(id)}
            completedSteps={completedSteps}
            onBack={handleBack}
            returnUrl="/join-the-network"
            backLabel="Back to Agent Discovery"
            headerRight={
                <Link href="/dashboard" style={{ color: '#ef4444', fontSize: '14px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Skip
                </Link>
            }
        >
            <div style={{ minHeight: '300px', marginTop: '20px' }}>
                {renderStep()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    {currentStep < 5 ? (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: '14px' }}
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '18px', fontSize: '18px', borderRadius: '14px' }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verifying...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </div>
        </FormLayout>
    );
}
