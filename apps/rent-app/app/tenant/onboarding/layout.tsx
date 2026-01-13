'use client';

import React from 'react';
import Link from 'next/link';
import { TenantOnboardingProvider, useTenantOnboarding } from '@/components/tenant/onboarding/TenantContext';
import { Button } from '@/components/ui';

function TenantLayoutContent({ children }: { children: React.ReactNode }) {
    const { step, nextStep, prevStep, canProceed } = useTenantOnboarding();
    const TOTAL_STEPS = 8;
    const progress = (step / TOTAL_STEPS) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            {/* Top Bar */}


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
                        onClick={nextStep}
                        disabled={!canProceed}
                        className={`
                            px-8 py-3.5 rounded-lg text-base font-semibold text-white transition-all duration-200
                            ${canProceed
                                ? 'bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {step === 7 ? 'Complete Sign Up' :
                            step === 8 ? 'Explore Listings' : 'Continue'}
                    </Button>
                </div>
            </footer>
        </div>
    );
}

export default function TenantOnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <TenantOnboardingProvider>
            <TenantLayoutContent>{children}</TenantLayoutContent>
        </TenantOnboardingProvider>
    );
}
