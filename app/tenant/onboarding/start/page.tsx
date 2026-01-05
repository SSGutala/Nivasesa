'use client';

import React, { useEffect, useState } from 'react';
import { useTenantOnboarding } from '@/components/tenant/onboarding/TenantContext';
import { WizardStep } from '@/components/host/onboarding/WizardStep';
import { US_STATES } from '@/lib/geo';
import { Check, X, Search, Home, MapPin, Calendar, DollarSign, Heart } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';

// --- STEPS ---

// STEP 1: Email (Split Layout)
function Step1Email() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();

    useEffect(() => {
        const isValid = data.email && /\S+@\S+\.\S+/.test(data.email);
        setCanProceed(!!isValid);
    }, [data.email, setCanProceed]);

    return (
        <WizardStep title="Find your place." description="Enter your email to start your journey with Nivaesa." variant="split">
            <div className="w-full max-w-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black mb-6 transition-all"
                />

                <div className="relative flex items-center justify-center border-t border-gray-200 my-6">
                    <span className="absolute bg-white px-3 text-sm text-gray-500">or</span>
                </div>

                <button className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors font-medium text-gray-700">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                    Sign up with Google
                </button>
            </div>
        </WizardStep>
    );
}

// STEP 2: Password
function Step2Password() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();

    const passwordRequirements = [
        { label: 'One lowercase character', test: (p: string) => /[a-z]/.test(p) },
        { label: 'One uppercase character', test: (p: string) => /[A-Z]/.test(p) },
        { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
        { label: '8 characters minimum', test: (p: string) => p.length >= 8 },
        { label: 'Passwords match', test: (p: string) => p === data.confirmPassword && p.length > 0 },
    ];

    useEffect(() => {
        const password = data.password || '';
        const allMet = passwordRequirements.every(r => r.test(password));
        setCanProceed(allMet);
    }, [data.password, data.confirmPassword, setCanProceed]);

    return (
        <WizardStep title="Create a password" description="Secure your account." variant="center">
            <div className="max-w-md mx-auto space-y-6 w-full">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" value={data.password || ''} onChange={(e) => updateData({ password: e.target.value })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input type="password" value={data.confirmPassword || ''} onChange={(e) => updateData({ confirmPassword: e.target.value })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>

                <div className="space-y-2 pt-4">
                    {passwordRequirements.map((req, i) => {
                        const met = req.test(data.password || '');
                        return (
                            <div key={i} className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-400'}`}>
                                {met ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
                                {req.label}
                            </div>
                        );
                    })}
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 3: Identity
function Step3Identity() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();
    useEffect(() => {
        setCanProceed(!!(data.firstName && data.lastName && data.phone));
    }, [data.firstName, data.lastName, data.phone, setCanProceed]);

    return (
        <WizardStep title="Tell us about yourself" variant="center">
            <div className="max-w-md mx-auto space-y-6 w-full">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <input type="text" value={data.firstName} onChange={(e) => updateData({ firstName: e.target.value })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <input type="text" value={data.lastName} onChange={(e) => updateData({ lastName: e.target.value })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" checked={data.newsletterConsent} onChange={(e) => updateData({ newsletterConsent: e.target.checked })} className="w-5 h-5 accent-black" />
                    <span className="text-gray-600">Sign up for our newsletter and updates</span>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 4: Location
function Step4Location() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();
    useEffect(() => {
        setCanProceed(!!(data.location.city && data.location.state));
    }, [data.location, setCanProceed]);

    return (
        <WizardStep title="Where are you moving?" variant="center">
            <div className="max-w-md mx-auto space-y-6 w-full">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input type="text" value={data.location.city} onChange={(e) => updateData({ location: { ...data.location, city: e.target.value } })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <select value={data.location.state} onChange={(e) => updateData({ location: { ...data.location, state: e.target.value } })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black bg-white">
                            <option value="">Select</option>
                            {US_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP (Optional)</label>
                        <input type="text" value={data.location.zip} onChange={(e) => updateData({ location: { ...data.location, zip: e.target.value } })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                    </div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 5: Timeline
function Step5Timeline() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();
    useEffect(() => {
        setCanProceed(!!(data.moveIn.timeframe && data.moveIn.duration));
    }, [data.moveIn, setCanProceed]);

    return (
        <WizardStep title="When are you moving?" variant="center">
            <div className="max-w-xl mx-auto space-y-8 w-full">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Move-in Timeframe</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[{ v: 'ASAP', l: 'ASAP (2 wks)' }, { v: '2-4W', l: '2-4 Weeks' }, { v: '1-3M', l: '1-3 Months' }, { v: 'browsing', l: 'Just Browsing' }].map(opt => (
                            <button key={opt.v} onClick={() => updateData({ moveIn: { ...data.moveIn, timeframe: opt.v } })} className={`p-4 rounded-xl border text-left transition-all ${data.moveIn.timeframe === opt.v ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}>
                                {opt.l}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Stay Duration</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ v: 'temp', l: 'Temporary (<1mo)' }, { v: 'short', l: 'Short (1-3mo)' }, { v: 'long', l: 'Long (6mo+)' }].map(opt => (
                            <button key={opt.v} onClick={() => updateData({ moveIn: { ...data.moveIn, duration: opt.v } })} className={`p-4 rounded-xl border text-center text-sm font-medium transition-all ${data.moveIn.duration === opt.v ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}>
                                {opt.l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 6: Preferences (Budget & Type)
function Step6Preferences() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();
    useEffect(() => {
        setCanProceed(!!(data.preferences.lookingFor && data.preferences.budgetRange));
    }, [data.preferences, setCanProceed]);

    return (
        <WizardStep title="What are you looking for?" variant="center">
            <div className="max-w-xl mx-auto space-y-8 w-full">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Arrangement Type</h3>
                    <div className="space-y-3">
                        {[{ v: 'room', l: 'A room in an existing place' }, { v: 'roommate', l: 'A roommate to co-lease with' }, { v: 'either', l: 'Either works' }].map(opt => (
                            <button key={opt.v} onClick={() => updateData({ preferences: { ...data.preferences, lookingFor: opt.v } })} className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${data.preferences.lookingFor === opt.v ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}>
                                <span className="font-medium text-gray-900">{opt.l}</span>
                                {data.preferences.lookingFor === opt.v && <div className="w-3 h-3 bg-black rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
                    <select value={data.preferences.budgetRange} onChange={(e) => updateData({ preferences: { ...data.preferences, budgetRange: e.target.value } })} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black bg-white text-lg">
                        <option value="">Select a range</option>
                        <option value="<800">Under $800</option>
                        <option value="800-1200">$800 - $1,200</option>
                        <option value="1200-1600">$1,200 - $1,600</option>
                        <option value="1600-2000">$1,600 - $2,000</option>
                        <option value="2000+">$2,000+</option>
                    </select>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 7: Culture & Notes
function Step7Context() {
    const { updateData, data, setCanProceed } = useTenantOnboarding();
    useEffect(() => { setCanProceed(true); }, [setCanProceed]);

    return (
        <WizardStep title="Final Touches" description="Help us match you better." variant="center">
            <div className="max-w-xl mx-auto space-y-8 w-full">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Cultural Context Preference</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ v: 'prefer', l: 'Prefer shared context' }, { v: 'open', l: 'Open to anyone' }, { v: 'notsure', l: 'Not sure' }].map(opt => (
                            <button key={opt.v} onClick={() => updateData({ preferences: { ...data.preferences, cultural: opt.v } })} className={`p-4 rounded-xl border text-center text-sm font-medium transition-all ${data.preferences.cultural === opt.v ? 'border-black bg-gray-900 text-white' : 'border-gray-200 hover:border-black'}`}>
                                {opt.l}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
                    <textarea value={data.preferences.notes} onChange={(e) => updateData({ preferences: { ...data.preferences, notes: e.target.value } })} placeholder="Anything else? (Dietary, pets, lifestyle...)" rows={4} className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none" />
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 8: Submit & Redirect
function Step8Submit() {
    const { data } = useTenantOnboarding();
    const [status, setStatus] = useState<'submitting' | 'success' | 'error'>('submitting');

    useEffect(() => {
        const submit = async () => {
            // Check for mock mode
            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                console.log('Mock Mode: Simulating tenant signup');
                setTimeout(() => {
                    setStatus('success');
                    setTimeout(() => window.location.href = '/logged-in/explore', 1500);
                }, 2000);
                return;
            }

            if (!auth || !db) return;
            try {
                // 1. Create Auth User
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password || '');
                const user = userCredential.user;
                const batch = writeBatch(db);

                // 2. User Doc
                const userRef = doc(db, 'users', user.uid);
                batch.set(userRef, {
                    userId: user.uid,
                    accountType: 'renter',
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    createdAt: serverTimestamp(),
                });

                // 3. Renter Profile Doc
                const profileRef = doc(db, 'renter_profiles', user.uid);
                batch.set(profileRef, {
                    userId: user.uid,
                    ...data,
                    password: '', // secure
                    confirmPassword: '',
                    createdAt: serverTimestamp(),
                });

                await batch.commit();
                setStatus('success');
                setTimeout(() => window.location.href = '/logged-in/explore', 1500);

            } catch (e) {
                console.error(e);
                setStatus('error');
            }
        };
        submit();
    }, []); // Run once on mount

    if (status === 'error') return (
        <WizardStep title="Error" variant="center">
            <div className="text-center text-red-600">Something went wrong. Please try again.</div>
        </WizardStep>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {status === 'success' ? (
                <>
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><Check className="w-10 h-10" /></div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Created!</h1>
                    <p className="text-lg text-gray-500">Redirecting you...</p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6" />
                    <h2 className="text-xl font-semibold text-gray-900">Creating your profile...</h2>
                </>
            )}
        </div>
    );
}

export default function TenantOnboardingPage() {
    const { step } = useTenantOnboarding();
    switch (step) {
        case 1: return <Step1Email />;
        case 2: return <Step2Password />;
        case 3: return <Step3Identity />;
        case 4: return <Step4Location />;
        case 5: return <Step5Timeline />;
        case 6: return <Step6Preferences />;
        case 7: return <Step7Context />;
        case 8: return <Step8Submit />;
        default: return <div>Loading...</div>;
    }
}
