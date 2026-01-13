'use client';

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/components/host/onboarding/OnboardingContext';
import { WizardStep } from '@/components/host/onboarding/WizardStep';
import {
    Home, Building2, Warehouse, Hotel, Tent, Castle,
    MapPin, Calendar, Utensils, Languages, Users,
    ShieldCheck, DollarSign, Camera, FileText, CheckCircle2,
    Wifi, Car, Tv, Droplets, Wind, Coffee, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// --- ICONS & ASSETS ---
import { Check, X } from 'lucide-react';
const Icons = {
    Apartment: Building2,
    Condo: Building2,
    House: Home,
    Basement: Warehouse,
    Room: Hotel,
    Townhome: Home
};

// --- STEPS ---

// STEP 1: Agent Interest (NEW)
function Step0AgentInterest() {
    const { updateData, data, setCanProceed } = useOnboarding();

    useEffect(() => {
        if (data.interestedInAgent) setCanProceed(true);
    }, [data.interestedInAgent, setCanProceed]);

    return (
        <WizardStep title="Would you like to work with a real estate agent?" description="An agent can help you manage listings, pricing, and guest communication." variant="split">
            <div className="space-y-4 w-full max-w-md">
                {[
                    { id: 'yes', label: 'Yes, I’d like to connect with an agent' },
                    { id: 'no', label: 'No, I’ll manage it myself' },
                    { id: 'unsure', label: 'I’m not sure yet' }
                ].map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => updateData({ interestedInAgent: opt.id })}
                        className={`w-full text-left p-5 rounded-xl border flex items-center justify-between transition-all duration-200 ${data.interestedInAgent === opt.id ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-black bg-white'}`}
                    >
                        <span className="font-semibold text-lg text-gray-900">{opt.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${data.interestedInAgent === opt.id ? 'border-black bg-black' : 'border-gray-300'}`}>
                            {data.interestedInAgent === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                    </button>
                ))}
            </div>
        </WizardStep>
    );
}


// STEP 2: Email (Split Layout)
function Step1Email() {
    const { updateData, data, setCanProceed } = useOnboarding();

    useEffect(() => {
        const email = data.credentials?.email || '';
        const isValid = email && /\S+@\S+\.\S+/.test(email);
        setCanProceed(!!isValid);
    }, [data.credentials, setCanProceed]);

    return (
        <WizardStep title="Host your place." description="Enter your email to start your journey with Nivaesa." variant="split">
            <div className="w-full max-w-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                    type="email"
                    value={data.credentials?.email || ''}
                    onChange={(e) => updateData({ credentials: { ...(data.credentials || { email: '', password: '' }), email: e.target.value } })}
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

// STEP 3: Password
function Step2Password() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRequirements = [
        { label: 'One lowercase character', test: (p: string) => /[a-z]/.test(p) },
        { label: 'One uppercase character', test: (p: string) => /[A-Z]/.test(p) },
        { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
        { label: '8 characters minimum', test: (p: string) => p.length >= 8 },
        { label: 'Passwords match', test: (p: string) => p === confirmPassword && p.length > 0 },
    ];

    useEffect(() => {
        const password = data.credentials?.password || '';
        const allMet = passwordRequirements.every(r => r.test(password));
        setCanProceed(allMet);
    }, [data.credentials, confirmPassword, setCanProceed]);

    return (
        <WizardStep title="Create a password" description="Secure your account." variant="center">
            <div className="max-w-md mx-auto space-y-6 w-full">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" value={data.credentials?.password || ''} onChange={(e) => updateData({ credentials: { ...(data.credentials || { email: '', password: '' }), password: e.target.value } })} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black" />
                </div>

                <div className="space-y-2 pt-4">
                    {passwordRequirements.map((req, i) => {
                        const met = req.test(data.credentials?.password || '');
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

// STEP 4: Host Context
function Step0HostContext() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const options = [
        { id: 'individual', label: 'I’m listing a room in my own home' },
        { id: 'family', label: 'We’re sharing our family home' },
        { id: 'investor', label: 'I own rental properties' },
        { id: 'manager', label: 'I manage properties for others' },
    ];
    useEffect(() => { if (data.hostContext) setCanProceed(true); }, [data.hostContext, setCanProceed]);
    return (
        <WizardStep title="Tell us how you’ll host" description="This helps us tailor the setup to your customized situation." variant="split">
            <div className="space-y-4 w-full">
                {options.map((opt) => (
                    <button key={opt.id} onClick={() => updateData({ hostContext: opt.id as any })} className={`w-full text-left p-5 rounded-xl border flex items-center justify-between transition-all duration-200 ${data.hostContext === opt.id ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-black bg-white'}`}>
                        <span className="block font-semibold text-lg text-gray-900">{opt.label}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${data.hostContext === opt.id ? 'border-black bg-black' : 'border-gray-300'}`}>
                            {data.hostContext === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                    </button>
                ))}
            </div>
        </WizardStep>
    );
}

// STEP 5: Property Type
function Step1PropertyType() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const options = [
        { id: 'apartment', label: 'Apartment', icon: Icons.Apartment },
        { id: 'condo', label: 'Condo', icon: Icons.Condo },
        { id: 'townhome', label: 'Townhome', icon: Icons.Townhome },
        { id: 'house', label: 'Single-family home', icon: Icons.House },
        { id: 'basement', label: 'Basement unit', icon: Icons.Basement },
        { id: 'room', label: 'Private room', icon: Icons.Room },
        { id: 'floor', label: 'Entire floor', icon: Icons.Apartment },
    ];
    useEffect(() => { if (data.propertyType) setCanProceed(true); }, [data.propertyType, setCanProceed]);
    return (
        <WizardStep title="Tell us about your place" variant="center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {options.map((opt) => (
                    <button key={opt.id} onClick={() => updateData({ propertyType: opt.id as any })} className={`h-32 flex flex-col items-center justify-center gap-3 rounded-xl border transition-all duration-200 ${data.propertyType === opt.id ? 'border-2 border-black bg-gray-50 ring-0' : 'border-gray-200 hover:border-black hover:bg-white'}`}>
                        <opt.icon className={`w-8 h-8 ${data.propertyType === opt.id ? 'text-black' : 'text-gray-600'}`} />
                        <span className="font-semibold text-gray-900 text-sm md:text-base text-center px-2">{opt.label}</span>
                    </button>
                ))}
            </div>
        </WizardStep>
    );
}

// STEP 6: Privacy Type
function Step2PrivacyType() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const options = [
        { id: 'entire', label: 'An entire place', desc: 'Guests have the whole place to themselves.' },
        { id: 'private', label: 'A private room', desc: 'Guests sleep in a private room but some areas may be shared.' },
        { id: 'shared', label: 'A shared room', desc: 'Guests share a sleeping area and common spaces.' },
    ];
    useEffect(() => { if (data.privacyType) setCanProceed(true); }, [data.privacyType, setCanProceed]);
    return (
        <WizardStep title="What type of space will the renter have?" variant="center">
            <div className="space-y-4 w-full max-w-xl">
                {options.map((opt) => (
                    <button key={opt.id} onClick={() => updateData({ privacyType: opt.id as any })} className={`w-full text-left p-6 rounded-xl border flex items-center justify-between transition-all duration-200 ${data.privacyType === opt.id ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-black hover:bg-white'}`}>
                        <div><span className="block font-semibold text-lg text-gray-900 mb-1">{opt.label}</span><span className="block text-gray-500 text-sm">{opt.desc}</span></div>
                    </button>
                ))}
            </div>
        </WizardStep>
    );
}

// STEP 7: Location
function Step3Location() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const handleChange = (field: string, value: string) => { updateData({ location: { ...data.location, [field]: value } }); };
    useEffect(() => { const { address, city, state, zip } = data.location; if (address && city && state && zip) setCanProceed(true); else setCanProceed(false); }, [data.location, setCanProceed]);
    return (
        <WizardStep title="Where is your place located?" description="Your exact address is only shared with confirmed guests." variant="center">
            <div className="space-y-4 w-full max-w-lg mx-auto">
                <input type="text" value={data.location.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Street Address" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                <input type="text" value={data.location.unit || ''} onChange={(e) => handleChange('unit', e.target.value)} placeholder="Apt, Suite (optional)" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={data.location.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                    <input type="text" value={data.location.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="State" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
                </div>
                <input type="text" value={data.location.zip} onChange={(e) => handleChange('zip', e.target.value)} placeholder="ZIP Code" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" />
            </div>
        </WizardStep>
    );
}

// STEP 8: Availability
function Step4Availability() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const toggleDuration = (id: string) => {
        const current = data.availability.durationTypes;
        const updated = current.includes(id as any) ? current.filter(x => x !== id) : [...current, id as any];
        updateData({ availability: { ...data.availability, durationTypes: updated } });
    };
    const options = [{ id: 'temporary', label: 'Temporary', desc: '1-4 weeks' }, { id: 'short', label: 'Short-term', desc: '1-3 months' }, { id: 'medium', label: 'Medium-term', desc: '3-6 months' }, { id: 'long', label: 'Long-term', desc: '6+ months' }];
    useEffect(() => { if (data.availability.durationTypes.length > 0) setCanProceed(true); else setCanProceed(false); }, [data.availability.durationTypes, setCanProceed]);
    return (
        <WizardStep title="What type of stay are you offering?" variant="center">
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {options.map((opt) => {
                    const isSelected = data.availability.durationTypes.includes(opt.id as any);
                    return (
                        <button key={opt.id} onClick={() => toggleDuration(opt.id)} className={`px-6 py-3 rounded-full border transition-all text-sm font-semibold flex items-center gap-2 ${isSelected ? 'border-black bg-black text-white hover:bg-gray-800' : 'border-gray-200 bg-white text-gray-700 hover:border-black'}`}>
                            {opt.label} <span className={`opacity-60 text-xs font-normal ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>({opt.desc})</span>
                        </button>
                    );
                })}
            </div>
        </WizardStep>
    );
}

// STEP 9: Household
function Step5Household() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const toggle = (field: 'dietary' | 'languages' | 'lifestyle', value: string) => {
        const current = data.household[field] || [];
        const updated = current.includes(value) ? current.filter(x => x !== value) : [...current, value];
        updateData({ household: { ...data.household, [field]: updated } });
    };
    const SECTIONS = [
        { title: 'Food & Kitchen', field: 'dietary', tags: ['Vegetarian household', 'No beef', 'No pork', 'Eggs allowed', 'Fish allowed', 'No restrictions'] },
        { title: 'Languages Spoken', field: 'languages', tags: ['English', 'Hindi', 'Urdu', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi', 'Malayalam'] },
        { title: 'Lifestyle & Norms', field: 'lifestyle', tags: ['Quiet household', 'Working professionals', 'Family home', 'No parties', 'Guests allowed', 'No smoking', 'Pets allowed', 'No pets'] }
    ];
    useEffect(() => { setCanProceed(true); }, [setCanProceed]);
    return (
        <WizardStep title="Help renters understand your household" description="These cultural and lifestyle tags help find compatible matches." variant="center">
            <div className="space-y-8 max-w-2xl w-full mx-auto text-left">
                {SECTIONS.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                        <div className="flex flex-wrap gap-2">
                            {section.tags.map(tag => {
                                const fieldVal = data.household[section.field as keyof typeof data.household];
                                const isSelected = Array.isArray(fieldVal) && fieldVal.includes(tag);
                                return (
                                    <button key={tag} onClick={() => toggle(section.field as any, tag)} className={`px-4 py-2 rounded-full border text-sm transition-all ${isSelected ? 'border-black bg-gray-50 ring-1 ring-black font-medium text-black' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </WizardStep>
    );
}

// STEP 10: Amenities
function Step6Amenities() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const AMENITIES = [{ id: 'wifi', label: 'Wi-Fi', icon: Wifi }, { id: 'parking', label: 'Parking', icon: Car }, { id: 'laundry', label: 'Washer/Dryer', icon: Droplets }, { id: 'ac', label: 'Air Conditioning', icon: Wind }, { id: 'kitchen', label: 'Kitchen', icon: Coffee }, { id: 'tv', label: 'TV', icon: Tv }];
    const toggle = (id: string) => {
        const current = data.amenities || [];
        const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
        updateData({ amenities: updated });
    };
    useEffect(() => { setCanProceed(true); }, [setCanProceed]);
    return (
        <WizardStep title="What does your place offer?" description="Select the amenities available to guests." variant="center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {AMENITIES.map((item) => {
                    const isSelected = (data.amenities || []).includes(item.id);
                    return (
                        <button key={item.id} onClick={() => toggle(item.id)} className={`h-32 flex flex-col items-center justify-center gap-3 rounded-xl border transition-all duration-200 ${isSelected ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-black hover:bg-white'}`}>
                            <item.icon className={`w-8 h-8 ${isSelected ? 'text-black' : 'text-gray-500'}`} />
                            <span className="font-medium text-gray-900">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </WizardStep>
    );
}

// STEP 11: Photos
function Step7Photos() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const handleUpload = () => {
        const mockPhotos = ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'];
        updateData({ photos: [...(data.photos || []), ...mockPhotos] });
    };
    useEffect(() => { if ((data.photos || []).length >= 1) setCanProceed(true); else setCanProceed(false); }, [data.photos, setCanProceed]);
    return (
        <WizardStep title="Add photos of your space" description="You'll need at least 5 photos to publish. You can add more later." variant="center">
            <div className="max-w-2xl mx-auto space-y-6">
                <div onClick={handleUpload} className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-black hover:bg-gray-50 cursor-pointer transition-all">
                    <Camera className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Drag your photos here</h3>
                    <p className="text-gray-500">Choose at least 5 photos</p>
                    <button className="mt-6 underline font-semibold text-gray-900">Upload from device</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(data.photos || []).map((url, idx) => (
                        <div key={idx} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 group">
                            <img src={url} alt="Listing" className="w-full h-full object-cover" />
                            <button onClick={(e) => { e.stopPropagation(); const newPhotos = data.photos.filter((_, i) => i !== idx); updateData({ photos: newPhotos }); }} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-black text-xs font-bold px-1">✕</span></button>
                        </div>
                    ))}
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 12: Content
function Step8Content() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const handleChange = (field: 'title' | 'description', val: string) => { updateData({ listingContent: { ...data.listingContent, [field]: val } }); };
    useEffect(() => { if (data.listingContent.title && data.listingContent.description.length > 10) setCanProceed(true); else setCanProceed(false); }, [data.listingContent, setCanProceed]);
    return (
        <WizardStep title="Describe your place" description="Share what makes your place special." variant="center">
            <div className="max-w-xl mx-auto space-y-6">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title</label><input type="text" value={data.listingContent.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Cozy 2BR Apartment in Downtown" className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-black outline-none" /><p className="text-xs text-gray-500 mt-1">{data.listingContent.title.length}/60 characters</p></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea value={data.listingContent.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe the decor, light, neighborhood, etc..." rows={6} className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-black outline-none resize-none" /></div>
            </div>
        </WizardStep>
    );
}

// STEP 13: Pricing
function Step9Pricing() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const handleChange = (val: string) => { const num = parseInt(val.replace(/\D/g, '')) || 0; updateData({ pricing: { ...data.pricing, monthlyRent: num } }); };
    useEffect(() => { if (data.pricing.monthlyRent > 0) setCanProceed(true); else setCanProceed(false); }, [data.pricing.monthlyRent, setCanProceed]);
    return (
        <WizardStep title="Set your monthly price" description="You can change this anytime." variant="center">
            <div className="max-w-md mx-auto text-center">
                <div className="relative inline-block w-full mb-8"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-900">$</span><input type="text" value={data.pricing.monthlyRent > 0 ? data.pricing.monthlyRent : ''} onChange={(e) => handleChange(e.target.value)} placeholder="0" className="w-full p-4 pl-12 text-center text-6xl font-bold text-gray-900 border-none focus:ring-0 placeholder:text-gray-300 outline-none" /></div>
                <div className="space-y-4 text-left border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between"><span className="text-gray-700 font-medium">Security Deposit Required?</span><input type="checkbox" checked={data.pricing.deposit} onChange={(e) => updateData({ pricing: { ...data.pricing, deposit: e.target.checked } })} className="w-6 h-6 accent-black" /></div>
                    <div className="flex items-center justify-between"><span className="text-gray-700 font-medium">Utilities Included?</span><select className="p-2 border rounded-md" value={data.pricing.utilities || 'no'} onChange={(e) => updateData({ pricing: { ...data.pricing, utilities: e.target.value as any } })}><option value="no">No</option><option value="partial">Partial</option><option value="yes">Yes</option></select></div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 14: Safety
function Step10Safety() {
    const { updateData, data, setCanProceed } = useOnboarding();
    const toggle = (field: 'cameras' | 'noiseMonitors' | 'sharedEntrances') => { updateData({ safety: { ...data.safety, [field]: !data.safety[field] } }); };
    useEffect(() => { setCanProceed(true); }, [setCanProceed]);
    return (
        <WizardStep title="Share important safety details" description="Transparency builds trust with potential renters." variant="center">
            <div className="max-w-xl mx-auto space-y-6">
                {[{ id: 'cameras', label: 'Security cameras present', desc: 'Exterior cameras only. All indoor cameras must be disclosed.' }, { id: 'noiseMonitors', label: 'Noise monitoring devices', desc: 'Devices that monitor decibel levels but do not record sound.' }, { id: 'sharedEntrances', label: 'Shared entrances', desc: 'You or others use the same entrance.' }].map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border rounded-xl bg-white hover:bg-gray-50 transition-colors">
                        <input type="checkbox" checked={!!data.safety[item.id as keyof typeof data.safety]} onChange={() => toggle(item.id as any)} className="mt-1 w-5 h-5 accent-black" />
                        <div><span className="block font-semibold text-gray-900">{item.label}</span><span className="block text-sm text-gray-500">{item.desc}</span></div>
                    </div>
                ))}
            </div>
        </WizardStep>
    );
}

// STEP 15: Review
function Step11Review() {
    const { data, setCanProceed } = useOnboarding();
    useEffect(() => { setCanProceed(true); }, [setCanProceed]);
    return (
        <WizardStep title="Review your listing" description="Check everything before submitting for verification." variant="center">
            <div className="max-w-2xl mx-auto bg-white border rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200 relative">
                    {data.photos?.[0] ? (<img src={data.photos[0]} alt="Cover" className="w-full h-full object-cover" />) : (<div className="flex items-center justify-center h-full text-gray-400">No Cover Photo</div>)}
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-sm font-bold rounded-md shadow-sm">${data.pricing.monthlyRent}/mo</div>
                </div>
                <div className="p-6 space-y-6">
                    <div><h2 className="text-2xl font-bold text-gray-900 mb-2">{data.listingContent.title || 'Untitled Listing'}</h2><p className="text-gray-500">{data.location.city}, {data.location.state}</p></div>
                    <div className="border-t pt-4"><h3 className="font-semibold mb-2">Details</h3><div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600"><span>Type: {data.propertyType}</span><span>Privacy: {data.privacyType}</span></div></div>
                </div>
            </div>
        </WizardStep>
    );
}

// STEP 16: Submitted (Clean, no buttons)
function Step12Submitted() {
    const { setCanProceed } = useOnboarding();
    useEffect(() => { setCanProceed(true); }, [setCanProceed]); // Footer button handles next
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing submission is being verified</h1>
            <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">Your listing is under review. This process typically takes 24-48 hours. You will be notified via email.</p>
            {/* No buttons here, Footer handles "Create Account" */}
        </div>
    );
}

// STEP 17: Redirect
function Step14Redirect() {
    useEffect(() => { setTimeout(() => { window.location.href = '/host/dashboard'; }, 1500); }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-semibold text-gray-900">Setting up your dashboard...</h2>
        </div>
    );
}

// MAIN CONTROLLER
export default function HostOnboardingPage() {
    const { step } = useOnboarding();
    switch (step) {
        case 1: return <Step1Email />;
        case 2: return <Step2Password />;
        case 3: return <Step0AgentInterest />;
        case 4: return <Step0HostContext />;
        case 5: return <Step1PropertyType />;
        case 6: return <Step2PrivacyType />;
        case 7: return <Step3Location />;
        case 8: return <Step4Availability />;
        case 9: return <Step5Household />;
        case 10: return <Step6Amenities />;
        case 11: return <Step7Photos />;
        case 12: return <Step8Content />;
        case 13: return <Step9Pricing />;
        case 14: return <Step10Safety />;
        case 15: return <Step11Review />;
        case 16: return <Step12Submitted />;
        case 17: return <Step14Redirect />;
        default: return (<WizardStep title="Loading" description="" variant="center"><div></div></WizardStep>);
    }
}
