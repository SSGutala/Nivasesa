'use client';

import React from 'react';
import Link from 'next/link';
import { AgentOnboardingProvider, useAgentOnboarding } from '@/components/agent/onboarding/AgentOnboardingContext';
import { Button } from '@/components/ui';
import { submitRealtorApplication } from '@/actions/apply';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

function OnboardingLayoutContent({ children }: { children: React.ReactNode }) {
    const { step, nextStep, prevStep, canProceed, data } = useAgentOnboarding();
    const TOTAL_STEPS = 5;
    const progress = (step / TOTAL_STEPS) * 100;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Adapt formData to FormData object expected by the server action
            const submissionData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
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
                // Auto-login
                const signInResult = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResult?.error) {
                    console.error('Auto-login failed:', signInResult.error);
                    window.location.href = '/login';
                } else {
                    const redirect = (result as any).redirectTo || '/dashboard';
                    window.location.href = redirect;
                }
            } else {
                alert(result.message || 'Submission failed');
                setIsSubmitting(false);
            }

        } catch (error: any) {
            console.error('Submission error', error);
            alert(error.message || 'An error occurred during submission.');
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        if (step === TOTAL_STEPS) {
            await handleSubmit();
        } else {
            nextStep();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between bg-white z-50">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-black hover:opacity-80 transition-opacity">
                    NIVAESA
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-500 hover:text-black transition-colors px-4 py-2"
                    >
                        Skip
                    </Link>
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-20" />

            {/* Main Content Area */}
            <main className="flex-1 relative">
                {children}
            </main>

            {/* Spacer for fixed footer */}
            <div className="h-24" />

            {/* Persistent Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center justify-between px-6 md:px-12 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
                    <div
                        className="h-full bg-black transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex-1">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="underline text-base font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                        >
                            Back
                        </button>
                    )}
                </div>

                <div className="flex-1 flex justify-end">
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed || isSubmitting}
                        className={`
                            px-8 py-3.5 rounded-lg text-base font-semibold text-white transition-all duration-200
                            ${canProceed
                                ? 'bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {step === TOTAL_STEPS ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Continue'}
                    </Button>
                </div>
            </footer>
        </div>
    );
}

export default function AgentOnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <AgentOnboardingProvider>
            <OnboardingLayoutContent>{children}</OnboardingLayoutContent>
        </AgentOnboardingProvider>
    );
}
