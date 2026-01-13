'use client';

import React from 'react';
import Link from 'next/link';
import { OnboardingProvider, useOnboarding } from '@/components/host/onboarding/OnboardingContext';
import { Button } from '@/components/ui';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

function OnboardingLayoutContent({ children }: { children: React.ReactNode }) {
    const { step, nextStep, prevStep, canProceed, data } = useOnboarding();
    const TOTAL_STEPS = 17;
    const progress = (step / TOTAL_STEPS) * 100;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        setIsSubmitting(true);
        try {
            // STEP 2: Create Account
            if (step === 2) {
                if (!data.credentials?.email || !data.credentials?.password) return;

                // MOCK MODE CHECK
                if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                    console.log("Mocking account creation for", data.credentials.email);
                    // Simulate success
                    await new Promise(r => setTimeout(r, 1000));
                    nextStep();
                    return;
                }

                // Create Auth User
                const userCredential = await createUserWithEmailAndPassword(auth, data.credentials.email, data.credentials.password);
                const user = userCredential.user;

                // Create User Doc
                await setDoc(doc(db, 'users', user.uid), {
                    userId: user.uid,
                    accountType: 'host',
                    email: data.credentials.email,
                    createdAt: serverTimestamp(),
                });

                // Continue
                nextStep();
            }
            // STEP 15: Submit Listing (from Review)
            else if (step === 15) {
                // Check auth unless in mock mode
                if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && !auth.currentUser) {
                    throw new Error('Not authenticated');
                }

                const userId = auth.currentUser?.uid || 'mock-user-id';
                // Create Listing Doc
                if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                    const listingId = doc(db, 'listings', 'new').id; // Generate ID
                    await setDoc(doc(db, 'listings', listingId), {
                        hostId: userId,
                        status: 'pending_verification',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        ...data,
                        credentials: null
                    });
                } else {
                    console.log("Mocking listing submission");
                    await new Promise(r => setTimeout(r, 1000));

                    // Update local storage to reflect submitted state for Dashboard mock
                    try {
                        const existing = localStorage.getItem('host-onboarding-draft');
                        if (existing) {
                            const parsed = JSON.parse(existing);
                            const updated = { ...parsed, status: 'pending_verification' };
                            localStorage.setItem('host-onboarding-draft', JSON.stringify(updated));
                        }
                    } catch (e) {
                        console.error("Failed to update mock status", e);
                    }
                }

                // Update Host Profile (optional, if separate from user doc)
                // await setDoc(doc(db, 'host_profiles', userId), { ... }, { merge: true });

                nextStep();
            }
            // Default Next
            else {
                nextStep();
            }
        } catch (error) {
            console.error('Onboarding Error:', error);
            alert('Something went wrong. Please try again. ' + (error as any).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveExit = async () => {
        setIsSubmitting(true);
        try {
            // Save as draft if user is authenticated (Step 3+)
            // Mock Mode or Real Mode Draft Save
            if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && auth.currentUser) {
                const userId = auth.currentUser.uid;
                const listingId = doc(db, 'listings', 'new').id;

                await setDoc(doc(db, 'listings', listingId), {
                    hostId: userId,
                    status: 'Draft',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    ...data,
                    credentials: null
                });
            }

            // Redirect
            window.location.href = '/host/dashboard';
        } catch (error) {
            console.error('Save Exit Error:', error);
            // Fallback redirect
            window.location.href = '/host/dashboard';
        } finally {
            setIsSubmitting(false);
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
                    {step <= 3 && (
                        <Link
                            href="/host/dashboard"
                            className="text-sm font-medium text-gray-500 hover:text-black transition-colors px-4 py-2"
                        >
                            Skip
                        </Link>
                    )}
                    {step > 3 && (
                        <Button variant="ghost" className="text-sm font-medium rounded-full px-6 py-2 hover:bg-gray-100 transition-colors" onClick={handleSaveExit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save & Exit'}
                        </Button>
                    )}
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
                        {step === 2 ? (isSubmitting ? 'Creating...' : 'Create Account') :
                            step === 15 ? (isSubmitting ? 'Submitting...' : 'Submit Listing') :
                                step === 17 ? 'Processing...' : 'Continue'}
                    </Button>
                </div>
            </footer>
        </div>
    );
}

export default function HostOnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <OnboardingProvider>
            <OnboardingLayoutContent>{children}</OnboardingLayoutContent>
        </OnboardingProvider>
    );
}
