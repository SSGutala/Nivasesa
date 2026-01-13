'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormLayout from '@/components/join/FormLayout';
import FormInput from '@/components/join/FormInput';
import FormSelect from '@/components/join/FormSelect';
import { auth, db } from '@/lib/firebase';
import { US_STATES } from '@/lib/geo';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Check, X } from 'lucide-react';
import commonStyles from '../auth-steps.module.css';

const STEPS = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'Password' },
    { id: 3, label: 'About You' },
    { id: 4, label: 'Location' },
    { id: 5, label: 'Preferences' },
];

const INITIAL_DATA = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    targetCity: '',
    targetState: '',
    targetZip: '',
    moveInTimeframe: '',
    stayDuration: '',
    lookingFor: '',
    budgetRange: '',
    culturalPreference: '',
    additionalNotes: '',
    newsletterConsent: false,
};

export default function FindPlacePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const updateFormData = (fields: Partial<typeof INITIAL_DATA>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const passwordRequirements = [
        { label: 'One lowercase character', test: (p: string) => /[a-z]/.test(p) },
        { label: 'One uppercase character', test: (p: string) => /[A-Z]/.test(p) },
        { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
        { label: '8 characters minimum', test: (p: string) => p.length >= 8 },
        { label: 'Passwords match', test: (p: string) => p === formData.confirmPassword && p.length > 0 },
    ];

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        } else if (step === 2) {
            if (!formData.password) newErrors.password = 'Password is required';
            else {
                const unmet = passwordRequirements.filter(r => !r.test(formData.password));
                if (unmet.length > 0) newErrors.password = 'Password does not meet requirements';
            }
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        } else if (step === 3) {
            if (!formData.firstName) newErrors.firstName = 'First name is required';
            if (!formData.lastName) newErrors.lastName = 'Last name is required';
        } else if (step === 4) {
            if (!formData.targetCity) newErrors.targetCity = 'City is required';
            if (!formData.targetState) newErrors.targetState = 'State is required';
            if (!formData.moveInTimeframe) newErrors.moveInTimeframe = 'Timeframe is required';
            if (!formData.stayDuration) newErrors.stayDuration = 'Duration is required';
        } else if (step === 5) {
            if (!formData.lookingFor) newErrors.lookingFor = 'Please select an option';
            if (!formData.budgetRange) newErrors.budgetRange = 'Budget is required';
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
        if (!auth || !db) {
            setErrors({ submit: 'Firebase is not configured. Please add your credentials to the .env file.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            const batch = writeBatch(db);

            const userRef = doc(db, 'users', user.uid);
            batch.set(userRef, {
                userId: user.uid,
                userType: 'renter',
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                createdAt: serverTimestamp(),
            });

            const submissionRef = doc(db, 'renter_intake_submissions', crypto.randomUUID());
            batch.set(submissionRef, {
                userId: user.uid,
                ...formData,
                password: '',
                confirmPassword: '',
                createdAt: serverTimestamp(),
            });

            await batch.commit();

            const successUrl = returnUrl ? `/join/success?returnUrl=${encodeURIComponent(returnUrl)}` : '/join/success';
            router.push(successUrl);
        } catch (error: any) {
            console.error('Submission error', error);
            setErrors({ submit: error.message || 'An error occurred during account creation.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px' }}>Find your place.</h1>
                        <p style={{ fontSize: '18px', color: 'var(--color-text-light)', marginBottom: '40px' }}>Enter your email to start your journey with Nivaesa.</p>
                        <FormInput
                            id="email"
                            label="Email Address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ email: e.target.value })}
                            error={errors.email}
                            autoComplete="email"
                            placeholder="e.g. name@example.com"
                        />

                        <div className={commonStyles.divider}>
                            <span>or</span>
                        </div>

                        <button type="button" className={commonStyles.googleBtn}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
                            Sign up with Google
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <h1 className={commonStyles.passwordTitle}>Account Setup</h1>
                        <FormInput
                            id="email-readonly"
                            label="Email"
                            value={formData.email}
                            readOnly
                            className={commonStyles.readonlyInput}
                        />
                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ password: e.target.value })}
                            error={errors.password}
                            autoComplete="new-password"
                        />
                        <FormInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                        />

                        <ul className={commonStyles.requirementList}>
                            {passwordRequirements.map((r, i) => {
                                const isValid = r.test(formData.password);
                                return (
                                    <li key={i} className={`${commonStyles.requirement} ${formData.password ? (isValid ? commonStyles.valid : commonStyles.invalid) : ''}`}>
                                        {formData.password ? (
                                            isValid ? <Check size={16} /> : <X size={16} />
                                        ) : (
                                            <X size={16} />
                                        )}
                                        {r.label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            case 3:
                return (
                    <>
                        <FormInput
                            id="firstName"
                            label="What's your first name?"
                            required
                            value={formData.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ firstName: e.target.value })}
                            error={errors.firstName}
                            autoComplete="given-name"
                        />
                        <FormInput
                            id="lastName"
                            label="And your last name?"
                            required
                            value={formData.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ lastName: e.target.value })}
                            error={errors.lastName}
                            autoComplete="family-name"
                        />
                        <FormInput
                            id="phone"
                            label="Your phone number?"
                            type="tel"
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ phone: e.target.value })}
                            error={errors.phone}
                            autoComplete="tel"
                        />
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                type="checkbox"
                                id="newsletter"
                                checked={formData.newsletterConsent}
                                onChange={e => updateFormData({ newsletterConsent: e.target.checked })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="newsletter" style={{ fontSize: '16px', color: 'var(--color-text)', cursor: 'pointer' }}>
                                Sign up for our newsletter and updates
                            </label>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <FormInput
                            id="targetCity"
                            label="Where are you looking to move?"
                            required
                            value={formData.targetCity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ targetCity: e.target.value })}
                            error={errors.targetCity}
                        />
                        <FormSelect
                            id="targetState"
                            label="State"
                            required
                            value={formData.targetState}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ targetState: e.target.value })}
                            options={US_STATES}
                            error={errors.targetState}
                        />
                        <FormInput
                            id="targetZip"
                            label="ZIP Code (Optional)"
                            value={formData.targetZip}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ targetZip: e.target.value })}
                            error={errors.targetZip}
                        />
                        <FormSelect
                            id="moveInTimeframe"
                            label="When are you planning to move in?"
                            required
                            value={formData.moveInTimeframe}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ moveInTimeframe: e.target.value })}
                            options={[
                                { value: 'ASAP', label: 'ASAP (within 2 weeks)' },
                                { value: '2-4W', label: '2–4 weeks' },
                                { value: '1-3M', label: '1–3 months' },
                                { value: 'browsing', label: 'Just browsing' },
                            ]}
                            error={errors.moveInTimeframe}
                        />
                        <FormSelect
                            id="stayDuration"
                            label="How long do you plan to stay?"
                            required
                            value={formData.stayDuration}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ stayDuration: e.target.value })}
                            options={[
                                { value: 'temp', label: 'Temporary (1–4 weeks)' },
                                { value: 'short', label: 'Short-term (1–3 months)' },
                                { value: 'long', label: 'Long-term (6+ months)' },
                            ]}
                            error={errors.stayDuration}
                        />
                    </>
                );
            case 5:
                return (
                    <>
                        <FormSelect
                            id="lookingFor"
                            label="What kind of arrangement are you looking for?"
                            required
                            value={formData.lookingFor}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ lookingFor: e.target.value })}
                            options={[
                                { value: 'room', label: 'A room in an existing place' },
                                { value: 'roommate', label: 'A roommate to co-lease with' },
                                { value: 'either', label: 'Either' },
                            ]}
                            error={errors.lookingFor}
                        />
                        <FormSelect
                            id="budgetRange"
                            label="What's your monthly budget?"
                            required
                            value={formData.budgetRange}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ budgetRange: e.target.value })}
                            options={[
                                { value: '<800', label: 'Under $800' },
                                { value: '800-1200', label: '$800–$1,200' },
                                { value: '1200-1600', label: '$1,200–$1,600' },
                                { value: '1600-2000', label: '$1,600–$2,000' },
                                { value: '2000+', label: '$2,000+' },
                            ]}
                            error={errors.budgetRange}
                        />
                        <FormSelect
                            id="culturalPreference"
                            label="Any cultural context preference?"
                            value={formData.culturalPreference}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData({ culturalPreference: e.target.value })}
                            options={[
                                { value: 'prefer', label: 'Prefer shared context' },
                                { value: 'open', label: 'Open to anyone' },
                                { value: 'notsure', label: 'Not sure' },
                            ]}
                        />
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ fontSize: '24px', fontWeight: 700, display: 'block', marginBottom: '24px' }}>Anything else we should know?</label>
                            <textarea
                                className="input"
                                style={{
                                    height: '120px',
                                    border: 'none',
                                    borderBottom: '1px solid var(--color-border)',
                                    borderRadius: 0,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    fontSize: '18px'
                                }}
                                placeholder="Additional notes (Optional)"
                                value={formData.additionalNotes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ additionalNotes: e.target.value })}
                            />
                        </div>
                        {errors.submit && <p style={{ color: 'var(--color-error)', marginTop: '24px', fontSize: '14px' }}>{errors.submit}</p>}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <FormLayout
            title={currentStep > 2 ? STEPS[currentStep - 1]?.label : ""}
            subtitle={currentStep > 2 ? "Let's find you a place that feels like home." : ""}
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(id: number) => setCurrentStep(id)}
            completedSteps={completedSteps}
            onBack={handleBack}
            returnUrl={returnUrl}
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
                            {isSubmitting ? 'Creating Account...' : 'Finish & Find a Place'}
                        </button>
                    )}
                </div>
            </div>
        </FormLayout>
    );
}
