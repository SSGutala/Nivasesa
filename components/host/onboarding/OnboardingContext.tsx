'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HostOnboardingData, INITIAL_DATA } from './types';

interface OnboardingContextType {
    data: HostOnboardingData;
    updateData: (updates: Partial<HostOnboardingData>) => void;
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canProceed: boolean;
    setCanProceed: (canProceeed: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<HostOnboardingData>(INITIAL_DATA);
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('host-onboarding-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Date reconstruction if needed
                if (parsed.availability?.availableFrom) {
                    parsed.availability.availableFrom = new Date(parsed.availability.availableFrom);
                }
                if (parsed.availability?.endDate) {
                    parsed.availability.endDate = new Date(parsed.availability.endDate);
                }
                setData({ ...INITIAL_DATA, ...parsed });
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('host-onboarding-draft', JSON.stringify(data));
    }, [data]);

    const updateData = (updates: Partial<HostOnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        setStep((prev) => prev + 1);
        setCanProceed(false); // Reset for next step
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep((prev) => Math.max(1, prev - 1));
        setCanProceed(true); // Usually can proceed if going back
        window.scrollTo(0, 0);
    };

    return (
        <OnboardingContext.Provider
            value={{
                data,
                updateData,
                step,
                setStep,
                nextStep,
                prevStep,
                canProceed,
                setCanProceed,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
