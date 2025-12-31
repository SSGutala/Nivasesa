'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoommateProfile, updateRoommateProfile } from '@/actions/groups';
import { CITIES } from '@/lib/cities';
import { Home, Heart, User, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface RoommateProfile {
    id: string;
    preferredCities: string;
    preferredStates: string;
    maxBudget: number;
    minBudget: number | null;
    dietaryPreference: string;
    smokingPreference: string;
    cannabisPreference: string;
    alcoholPreference: string;
    substancePreference: string | null;
    lgbtqFriendly: string;
    relationshipStatus: string | null;
    guestPolicy: string | null;
    cleanlinessLevel: string;
    sleepSchedule: string;
    workStyle: string;
    noiseLevel: string | null;
    petsPreference: string;
    hasPets: string | null;
    gender: string | null;
    ageRange: string | null;
    occupation: string | null;
    languages: string;
    isLookingForRoom: boolean;
    isLookingForRoommate: boolean;
    moveInDate: Date | null;
    leaseDuration: string | null;
    bio: string | null;
}

interface Props {
    existingProfile: RoommateProfile | null;
    redirectTo?: string;
}

const STEPS = ['basic', 'lifestyle', 'identity', 'bio'];

const LANGUAGES = [
    'Hindi',
    'Telugu',
    'Tamil',
    'Gujarati',
    'Bengali',
    'Marathi',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'English',
];

export default function RoommateProfileForm({ existingProfile, redirectTo }: Props) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        existingProfile?.languages.split(', ').filter(Boolean) || ['English']
    );

    const [formData, setFormData] = useState({
        preferredStates: existingProfile?.preferredStates || '',
        preferredCities: existingProfile?.preferredCities || '',
        maxBudget: existingProfile?.maxBudget?.toString() || '',
        minBudget: existingProfile?.minBudget?.toString() || '',
        moveInDate: existingProfile?.moveInDate
            ? new Date(existingProfile.moveInDate).toISOString().split('T')[0]
            : '',
        leaseDuration: existingProfile?.leaseDuration || '',
        dietaryPreference: existingProfile?.dietaryPreference || 'No Preference',
        smokingPreference: existingProfile?.smokingPreference || 'No Preference',
        cannabisPreference: existingProfile?.cannabisPreference || 'No Preference',
        alcoholPreference: existingProfile?.alcoholPreference || 'No Preference',
        cleanlinessLevel: existingProfile?.cleanlinessLevel || 'Clean',
        sleepSchedule: existingProfile?.sleepSchedule || 'Flexible',
        workStyle: existingProfile?.workStyle || 'Hybrid',
        lgbtqFriendly: existingProfile?.lgbtqFriendly || 'LGBTQ+ Friendly',
        petsPreference: existingProfile?.petsPreference || 'No Preference',
        hasPets: existingProfile?.hasPets || '',
        gender: existingProfile?.gender || '',
        ageRange: existingProfile?.ageRange || '',
        occupation: existingProfile?.occupation || '',
        bio: existingProfile?.bio || '',
        isLookingForRoom: existingProfile?.isLookingForRoom ?? true,
        isLookingForRoommate: existingProfile?.isLookingForRoommate ?? false,
    });

    const states = [...new Set(CITIES.map((c) => c.state))];

    const handleLanguageToggle = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        if (selectedLanguages.length === 0) {
            setError('Please select at least one language');
            setLoading(false);
            return;
        }

        if (!formData.maxBudget) {
            setError('Please enter your maximum budget');
            setLoading(false);
            return;
        }

        const profileData = {
            preferredCities: formData.preferredCities,
            preferredStates: formData.preferredStates,
            maxBudget: parseInt(formData.maxBudget),
            minBudget: formData.minBudget ? parseInt(formData.minBudget) : undefined,
            dietaryPreference: formData.dietaryPreference,
            smokingPreference: formData.smokingPreference,
            cannabisPreference: formData.cannabisPreference,
            alcoholPreference: formData.alcoholPreference,
            lgbtqFriendly: formData.lgbtqFriendly,
            cleanlinessLevel: formData.cleanlinessLevel,
            sleepSchedule: formData.sleepSchedule,
            workStyle: formData.workStyle,
            petsPreference: formData.petsPreference,
            hasPets: formData.hasPets || undefined,
            gender: formData.gender || undefined,
            ageRange: formData.ageRange || undefined,
            occupation: formData.occupation || undefined,
            languages: selectedLanguages.join(', '),
            isLookingForRoom: formData.isLookingForRoom,
            isLookingForRoommate: formData.isLookingForRoommate,
            moveInDate: formData.moveInDate ? new Date(formData.moveInDate) : undefined,
            leaseDuration: formData.leaseDuration || undefined,
            bio: formData.bio || undefined,
        };

        const result = existingProfile
            ? await updateRoommateProfile(profileData)
            : await createRoommateProfile(profileData);

        if (result.success) {
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.push('/roommates');
            }
        } else {
            setError(result.message || 'An error occurred');
            setLoading(false);
        }
    };

    const canProceed = () => {
        if (step === 0) {
            return formData.maxBudget && selectedLanguages.length > 0;
        }
        if (step === 1) {
            return true;
        }
        if (step === 2) {
            return true;
        }
        return true;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
                    {existingProfile ? 'Edit' : 'Create'} Roommate Profile
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                    Find compatible roommates by sharing your preferences
                </p>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            style={{
                                flex: 1,
                                height: '4px',
                                borderRadius: '2px',
                                backgroundColor: i <= step ? '#3b82f6' : '#e5e7eb',
                            }}
                        />
                    ))}
                </div>

                {error && (
                    <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e5e7eb' }}>
                    {step === 0 && (
                        <BasicInfoStep
                            formData={formData}
                            handleChange={handleChange}
                            selectedLanguages={selectedLanguages}
                            handleLanguageToggle={handleLanguageToggle}
                            states={states}
                        />
                    )}
                    {step === 1 && (
                        <LifestyleStep formData={formData} handleChange={handleChange} />
                    )}
                    {step === 2 && (
                        <IdentityStep formData={formData} handleChange={handleChange} />
                    )}
                    {step === 3 && (
                        <BioReviewStep formData={formData} handleChange={handleChange} selectedLanguages={selectedLanguages} />
                    )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 0}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            cursor: step === 0 ? 'not-allowed' : 'pointer',
                            opacity: step === 0 ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 500,
                        }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canProceed()}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                fontWeight: 600,
                                cursor: canProceed() ? 'pointer' : 'not-allowed',
                                opacity: canProceed() ? 1 : 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#16a34a',
                                color: 'white',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Step 1: Basic Info
function BasicInfoStep({
    formData,
    handleChange,
    selectedLanguages,
    handleLanguageToggle,
    states,
}: {
    formData: any;
    handleChange: any;
    selectedLanguages: string[];
    handleLanguageToggle: (lang: string) => void;
    states: string[];
}) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Home size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Basic Information</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Languages */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Languages You Speak *
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageToggle(lang)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '9999px',
                                    border: selectedLanguages.includes(lang)
                                        ? '2px solid #3b82f6'
                                        : '1px solid #d1d5db',
                                    backgroundColor: selectedLanguages.includes(lang)
                                        ? '#eff6ff'
                                        : 'white',
                                    color: selectedLanguages.includes(lang) ? '#1d4ed8' : '#374151',
                                    fontWeight: selectedLanguages.includes(lang) ? 600 : 400,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Preferred States
                        </label>
                        <select
                            name="preferredStates"
                            value={formData.preferredStates}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="">Any State</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Preferred Cities
                        </label>
                        <input
                            type="text"
                            name="preferredCities"
                            value={formData.preferredCities}
                            onChange={handleChange}
                            placeholder="e.g., Frisco, Plano, Irving"
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                {/* Budget */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Min Budget ($/mo)
                        </label>
                        <input
                            type="number"
                            name="minBudget"
                            value={formData.minBudget}
                            onChange={handleChange}
                            placeholder="500"
                            min="0"
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Max Budget ($/mo) *
                        </label>
                        <input
                            type="number"
                            name="maxBudget"
                            value={formData.maxBudget}
                            onChange={handleChange}
                            placeholder="1500"
                            min="0"
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Move-in Date
                        </label>
                        <input
                            type="date"
                            name="moveInDate"
                            value={formData.moveInDate}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Lease Duration
                        </label>
                        <select
                            name="leaseDuration"
                            value={formData.leaseDuration}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="">Flexible</option>
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                            <option value="12 months">12 months</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Step 2: Lifestyle
function LifestyleStep({ formData, handleChange }: { formData: any; handleChange: any }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Heart size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Lifestyle Preferences</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Diet */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Dietary Preference
                    </label>
                    <select
                        name="dietaryPreference"
                        value={formData.dietaryPreference}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                        <option value="Strict Vegetarian">Strict Vegetarian (no eggs)</option>
                        <option value="Vegetarian">Vegetarian (eggs OK)</option>
                        <option value="Jain">Jain Vegetarian</option>
                        <option value="Pescatarian">Pescatarian</option>
                        <option value="Chicken & Fish">Chicken & Fish only</option>
                        <option value="All Meat">All Meat (including beef/pork)</option>
                        <option value="Halal">Halal only</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                </div>

                {/* Substances */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Smoking
                        </label>
                        <select
                            name="smokingPreference"
                            value={formData.smokingPreference}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="No Smoking">No Smoking</option>
                            <option value="Outside Only">Outside Only</option>
                            <option value="Cigarettes OK">Cigarettes OK</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Cannabis
                        </label>
                        <select
                            name="cannabisPreference"
                            value={formData.cannabisPreference}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="No Cannabis">No Cannabis</option>
                            <option value="Outside Only">Outside Only</option>
                            <option value="Cannabis Friendly">Cannabis Friendly</option>
                            <option value="420 Friendly">420 Friendly</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Alcohol
                        </label>
                        <select
                            name="alcoholPreference"
                            value={formData.alcoholPreference}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="No Alcohol">No Alcohol</option>
                            <option value="Social Drinking">Social Drinking</option>
                            <option value="Alcohol Friendly">Alcohol Friendly</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                    </div>
                </div>

                {/* Living Style */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Cleanliness Level
                        </label>
                        <select
                            name="cleanlinessLevel"
                            value={formData.cleanlinessLevel}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="Very Clean">Very Clean / Neat Freak</option>
                            <option value="Clean">Clean / Tidy</option>
                            <option value="Average">Average</option>
                            <option value="Relaxed">Relaxed / Messy OK</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Sleep Schedule
                        </label>
                        <select
                            name="sleepSchedule"
                            value={formData.sleepSchedule}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="Early Bird">Early Bird (before 10pm)</option>
                            <option value="Night Owl">Night Owl (after midnight)</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Work Style
                    </label>
                    <select
                        name="workStyle"
                        value={formData.workStyle}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                        <option value="Work From Home">Work From Home (need quiet)</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Office">Office (rarely home during day)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

// Step 3: Identity
function IdentityStep({ formData, handleChange }: { formData: any; handleChange: any }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <User size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Identity & Preferences</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Demographics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Age Range
                        </label>
                        <select
                            name="ageRange"
                            value={formData.ageRange}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="18-24">18-24</option>
                            <option value="25-30">25-30</option>
                            <option value="31-40">31-40</option>
                            <option value="40+">40+</option>
                        </select>
                    </div>
                </div>

                {/* LGBTQ+ */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        LGBTQ+ Friendly
                    </label>
                    <select
                        name="lgbtqFriendly"
                        value={formData.lgbtqFriendly}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                        <option value="LGBTQ+ Friendly">LGBTQ+ Friendly</option>
                        <option value="LGBTQ+ Household">LGBTQ+ Household</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                </div>

                {/* Pets */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Pets Preference
                    </label>
                    <select
                        name="petsPreference"
                        value={formData.petsPreference}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    >
                        <option value="No Pets">No Pets</option>
                        <option value="Cats OK">Cats OK</option>
                        <option value="Dogs OK">Dogs OK</option>
                        <option value="All Pets">All Pets OK</option>
                        <option value="I Have Pets">I Have Pets</option>
                        <option value="Allergies">Allergies (no pets)</option>
                        <option value="No Preference">No Preference</option>
                    </select>
                </div>

                {formData.petsPreference === 'I Have Pets' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            Describe Your Pets
                        </label>
                        <input
                            type="text"
                            name="hasPets"
                            value={formData.hasPets}
                            onChange={handleChange}
                            placeholder="e.g., 1 small dog, 2 cats"
                            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                        />
                    </div>
                )}

                {/* Occupation */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Occupation
                    </label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer, Student"
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );
}

// Step 4: Bio & Review
function BioReviewStep({ formData, handleChange, selectedLanguages }: { formData: any; handleChange: any; selectedLanguages: string[] }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <FileText size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Bio & Review</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Bio */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Short Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell potential roommates about yourself..."
                        rows={4}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'vertical' }}
                    />
                </div>

                {/* Looking For */}
                <div>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                        What are you looking for?
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isLookingForRoom"
                                checked={formData.isLookingForRoom}
                                onChange={handleChange}
                            />
                            <span>I'm looking for a room to rent</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isLookingForRoommate"
                                checked={formData.isLookingForRoommate}
                                onChange={handleChange}
                            />
                            <span>I'm looking for roommates (have a place or forming a group)</span>
                        </label>
                    </div>
                </div>

                {/* Review Summary */}
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Profile Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                        <p><strong>Languages:</strong> {selectedLanguages.join(', ')}</p>
                        <p><strong>Budget:</strong> ${formData.minBudget || '0'} - ${formData.maxBudget || '0'}/mo</p>
                        {formData.preferredCities && <p><strong>Cities:</strong> {formData.preferredCities}</p>}
                        <p><strong>Diet:</strong> {formData.dietaryPreference}</p>
                        <p><strong>Work:</strong> {formData.workStyle}</p>
                        {formData.moveInDate && <p><strong>Move-in:</strong> {formData.moveInDate}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
