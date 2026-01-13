'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface AgentOnboardingData {
    fullName: string;
    email: string;
    phone: string;
    preferredContactMethod: string;
    brokerageName: string;
    licenseNumber: string;
    statesLicensed: string[];
    experienceYears: string;
    primaryMarkets: string;
    acceptingNewClients: string;
    buyerSpecializations: string[];
    languages: string[];
    otherLanguage: string;
    referralAcknowledgement: boolean;
    additionalContext: string;
    password: string;
    confirmPassword: string;
}

export const INITIAL_DATA: AgentOnboardingData = {
    fullName: '',
    email: '',
    phone: '',
    preferredContactMethod: '',
    brokerageName: '',
    licenseNumber: '',
    statesLicensed: [],
    experienceYears: '',
    primaryMarkets: '',
    acceptingNewClients: '',
    buyerSpecializations: [],
    languages: [],
    otherLanguage: '',
    referralAcknowledgement: false,
    additionalContext: '',
    password: '',
    confirmPassword: '',
};

interface AgentOnboardingContextType {
    data: AgentOnboardingData;
    updateData: (updates: Partial<AgentOnboardingData>) => void;
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    canProceed: boolean;
    setCanProceed: (canProceed: boolean) => void;
}

const AgentOnboardingContext = createContext<AgentOnboardingContextType | undefined>(undefined);

export function AgentOnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AgentOnboardingData>(INITIAL_DATA);
    const [step, setStep] = useState(1);
    const [canProceed, setCanProceed] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('agent-onboarding-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({ ...INITIAL_DATA, ...parsed });
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Save to local storage on change (excluding sensitive data)
    useEffect(() => {
        const { password, confirmPassword, ...safeData } = data;
        localStorage.setItem('agent-onboarding-draft', JSON.stringify(safeData));
    }, [data]);

    const updateData = (updates: Partial<AgentOnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
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
        <AgentOnboardingContext.Provider
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
        </AgentOnboardingContext.Provider>
    );
}

export function useAgentOnboarding() {
    const context = useContext(AgentOnboardingContext);
    if (context === undefined) {
        throw new Error('useAgentOnboarding must be used within an AgentOnboardingProvider');
    }
    return context;
}
