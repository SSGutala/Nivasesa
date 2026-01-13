'use client';

import React, { useEffect, useState } from 'react';
import { useAgentOnboarding } from '@/components/agent/onboarding/AgentOnboardingContext';
import { WizardStep } from '@/components/host/onboarding/WizardStep';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

// Reusing US_STATES from your existing codebase location
import { US_STATES } from '@/lib/geo';

// STEP 1: Identity
function Step1Identity() {
    const { updateData, data, setCanProceed } = useAgentOnboarding();
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const isValid = !!(data.fullName && data.email && /\S+@\S+\.\S+/.test(data.email) && data.phone);
        setCanProceed(isValid);
    }, [data.fullName, data.email, data.phone, setCanProceed]);

    return (
        <WizardStep title="Let's get started." description="Tell us a bit about who you are." variant="split">
            <div className="w-full max-w-sm space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => updateData({ fullName: e.target.value })}
                        placeholder="Enter full name"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData({ email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => updateData({ phone: e.target.value })}
                        placeholder="(555) 555-5555"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Contact Method</label>
                    <div className="flex gap-4">
                        {['Phone', 'Email', 'Either'].map(method => (
                            <label key={method} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contactMethod"
                                    value={method}
                                    checked={data.preferredContactMethod === method}
                                    onChange={(e) => updateData({ preferredContactMethod: e.target.value })}
                                    className="w-4 h-4 accent-black"
                                />
                                <span className="text-gray-700">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 2: Professional Details
function Step2Professional() {
    const { updateData, data, setCanProceed } = useAgentOnboarding();

    useEffect(() => {
        const isValid = !!(data.brokerageName && data.licenseNumber && data.statesLicensed.length > 0 && data.experienceYears);
        setCanProceed(isValid);
    }, [data.brokerageName, data.licenseNumber, data.statesLicensed, data.experienceYears, setCanProceed]);

    return (
        <WizardStep title="Professional Details" description="Verify your licensing and experience." variant="center">
            <div className="w-full max-w-md space-y-6 mx-auto">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brokerage Name</label>
                    <input
                        type="text"
                        value={data.brokerageName}
                        onChange={(e) => updateData({ brokerageName: e.target.value })}
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
                    <input
                        type="text"
                        value={data.licenseNumber}
                        onChange={(e) => updateData({ licenseNumber: e.target.value })}
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">States Licensed In</label>
                    <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 grid grid-cols-2 gap-2">
                        {US_STATES.map(state => (
                            <label key={state.value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <input
                                    type="checkbox"
                                    checked={data.statesLicensed.includes(state.value)}
                                    onChange={(e) => {
                                        const newStates = e.target.checked
                                            ? [...data.statesLicensed, state.value]
                                            : data.statesLicensed.filter(s => s !== state.value);
                                        updateData({ statesLicensed: newStates });
                                    }}
                                    className="rounded border-gray-300 text-black focus:ring-black accent-black"
                                />
                                {state.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                    <select
                        value={data.experienceYears}
                        onChange={(e) => updateData({ experienceYears: e.target.value })}
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black bg-white"
                    >
                        <option value="">Select experience</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1–3 years">1–3 years</option>
                        <option value="3–5 years">3–5 years</option>
                        <option value="5–10 years">5–10 years</option>
                        <option value="10+ years">10+ years</option>
                    </select>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 3: Service Area
function Step3ServiceArea() {
    const { updateData, data, setCanProceed } = useAgentOnboarding();

    useEffect(() => {
        setCanProceed(!!data.primaryMarkets);
    }, [data.primaryMarkets, setCanProceed]);

    return (
        <WizardStep title="Service Area" description="Where do you primarily operate?" variant="center">
            <div className="w-full max-w-md space-y-8 mx-auto">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Cities / ZIP Codes</label>
                    <input
                        type="text"
                        value={data.primaryMarkets}
                        onChange={(e) => updateData({ primaryMarkets: e.target.value })}
                        placeholder="e.g. Frisco, Plano, 75024"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Are you expecting new buyer clients?</label>
                    <div className="space-y-3">
                        {['Yes', 'Limited availability', 'Not currently, but interested later'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => updateData({ acceptingNewClients: opt })}
                                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${data.acceptingNewClients === opt
                                        ? 'border-2 border-black bg-gray-50'
                                        : 'border-gray-200 hover:border-black'
                                    }`}
                            >
                                <span className="font-medium text-gray-900">{opt}</span>
                                {data.acceptingNewClients === opt && <div className="w-3 h-3 bg-black rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 4: Specialization
function Step4Specialization() {
    const { updateData, data, setCanProceed } = useAgentOnboarding();

    useEffect(() => {
        const isValid = data.languages.length > 0 && data.referralAcknowledgement;
        setCanProceed(isValid);
    }, [data.languages, data.referralAcknowledgement, setCanProceed]);

    const handleLanguageToggle = (lang: string) => {
        const newLangs = data.languages.includes(lang)
            ? data.languages.filter(l => l !== lang)
            : [...data.languages, lang];
        updateData({ languages: newLangs });
    };

    const handleSpecializationToggle = (type: string) => {
        const newTypes = data.buyerSpecializations.includes(type)
            ? data.buyerSpecializations.filter(t => t !== type)
            : [...data.buyerSpecializations, type];
        updateData({ buyerSpecializations: newTypes });
    };

    return (
        <WizardStep title="Specialization" description="Help us match you with the right homebuyers." variant="center">
            <div className="w-full max-w-xl space-y-8 mx-auto">

                {/* Buyer Types */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Types You Work With</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['First-time home buyers', 'Relocation buyers', 'Investors', 'New construction', 'Luxury homes', 'Multi-family'].map(type => (
                            <button
                                key={type}
                                onClick={() => handleSpecializationToggle(type)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${data.buyerSpecializations.includes(type)
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-200 text-gray-600 hover:border-black'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages Spoken</h3>
                    <div className="flex flex-wrap gap-2">
                        {['English', 'Hindi', 'Urdu', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Malayalam', 'Kannada', 'Other'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageToggle(lang)}
                                className={`px-4 py-2 rounded-full border text-sm transition-all ${data.languages.includes(lang)
                                        ? 'border-black bg-gray-50 ring-1 ring-black font-medium text-black'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    {data.languages.includes('Other') && (
                        <div className="mt-4">
                            <input
                                type="text"
                                value={data.otherLanguage}
                                onChange={(e) => updateData({ otherLanguage: e.target.value })}
                                placeholder="Specify other language"
                                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    )}
                </div>

                {/* Acknowledgement */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.referralAcknowledgement}
                            onChange={(e) => updateData({ referralAcknowledgement: e.target.checked })}
                            className="mt-1 w-5 h-5 accent-black shrink-0"
                        />
                        <span className="text-sm text-gray-600 leading-relaxed">
                            I understand that Nivaesa operates as a real estate referral marketplace and participation may involve referral-based partnerships.
                        </span>
                    </label>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 5: Account Security
function Step5Security() {
    const { updateData, data, setCanProceed } = useAgentOnboarding();

    // Password requirements logic reused from other flows could be added here
    // For simplicity, just checking length and match
    useEffect(() => {
        const isValid = data.password.length >= 8 && data.password === data.confirmPassword;
        setCanProceed(isValid);
    }, [data.password, data.confirmPassword, setCanProceed]);

    return (
        <WizardStep title="Account Security" description="Set a password to access your dashboard." variant="center">
            <div className="w-full max-w-md space-y-6 mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-6">
                    <strong>Username:</strong> {data.email || 'Your email address'}
                    <div className="text-xs text-gray-500 mt-1">Your email address will be used as your username.</div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => updateData({ password: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={data.confirmPassword}
                        onChange={(e) => updateData({ confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {data.password && data.password !== data.confirmPassword && (
                    <p className="text-red-500 text-sm">Passwords do not match.</p>
                )}
            </div>
        </WizardStep>
    );
}


// MAIN CONTROLLER
export default function AgentOnboardingPage() {
    const { step } = useAgentOnboarding();

    switch (step) {
        case 1: return <Step1Identity />;
        case 2: return <Step2Professional />;
        case 3: return <Step3ServiceArea />;
        case 4: return <Step4Specialization />;
        case 5: return <Step5Security />;
        default: return <div>Loading...</div>;
    }
}
