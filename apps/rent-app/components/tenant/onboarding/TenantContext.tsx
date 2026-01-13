'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TenantOnboardingData, INITIAL_TENANT_DATA } from './types';

interface TenantContextType {
    data: TenantOnboardingData;
    updateData: (updates: Partial<TenantOnboardingData> | ((prev: TenantOnboardingData) => TenantOnboardingData)) => void;
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canProceed: boolean;
    setCanProceed: (canProceed: boolean) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantOnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<TenantOnboardingData>(INITIAL_TENANT_DATA);
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('tenant-onboarding-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({ ...INITIAL_TENANT_DATA, ...parsed });
            } catch (e) {
                console.error("Failed to load tenant draft", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        // Exclude password from local storage for security basic heuristic
        const { password, confirmPassword, ...safeData } = data;
        localStorage.setItem('tenant-onboarding-draft', JSON.stringify(safeData));
    }, [data]);

    const updateData = (updates: Partial<TenantOnboardingData> | ((prev: TenantOnboardingData) => TenantOnboardingData)) => {
        setData((prev) => {
            if (typeof updates === 'function') {
                return updates(prev);
            }
            // Deep merge for nested objects if needed, but simple spread often suffices for top-level partials
            // For nested, we usually rely on the caller to provide the full nested object or usage of spread in the update call
            return { ...prev, ...updates };
        });
    };

    const nextStep = () => {
        setStep((prev) => prev + 1);
        setCanProceed(false);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep((prev) => Math.max(1, prev - 1));
        setCanProceed(true);
        window.scrollTo(0, 0);
    };

    return (
        <TenantContext.Provider
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
        </TenantContext.Provider>
    );
}

export function useTenantOnboarding() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenantOnboarding must be used within a TenantOnboardingProvider');
    }
    return context;
}
