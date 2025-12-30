'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoommateProfile, updateRoommateProfile } from '@/actions/groups';
import { CITIES } from '@/lib/cities';
import styles from './page.module.css';

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
        dietaryPreference: existingProfile?.dietaryPreference || 'No Preference',
        smokingPreference: existingProfile?.smokingPreference || 'No Preference',
        cannabisPreference: existingProfile?.cannabisPreference || 'No Preference',
        alcoholPreference: existingProfile?.alcoholPreference || 'No Preference',
        lgbtqFriendly: existingProfile?.lgbtqFriendly || 'No Preference',
        cleanlinessLevel: existingProfile?.cleanlinessLevel || 'Clean',
        sleepSchedule: existingProfile?.sleepSchedule || 'Flexible',
        workStyle: existingProfile?.workStyle || 'Hybrid',
        petsPreference: existingProfile?.petsPreference || 'No Preference',
        hasPets: existingProfile?.hasPets || '',
        gender: existingProfile?.gender || '',
        ageRange: existingProfile?.ageRange || '',
        occupation: existingProfile?.occupation || '',
        isLookingForRoom: existingProfile?.isLookingForRoom ?? true,
        isLookingForRoommate: existingProfile?.isLookingForRoommate ?? false,
        moveInDate: existingProfile?.moveInDate
            ? new Date(existingProfile.moveInDate).toISOString().split('T')[0]
            : '',
        leaseDuration: existingProfile?.leaseDuration || '',
        bio: existingProfile?.bio || '',
    });

    const states = [...new Set(CITIES.map((c) => c.state))];

    const handleLanguageToggle = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                router.push('/groups');
            }
        } else {
            setError(result.message || 'An error occurred');
            setLoading(false);
        }
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

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>{existingProfile ? 'Edit' : 'Create'} Your Roommate Profile</h1>
                <p>
                    Help us find you compatible roommates by sharing your preferences.
                </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Languages */}
                <section className={styles.section}>
                    <h2>Languages You Speak *</h2>
                    <div className={styles.languageGrid}>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                className={`${styles.languageChip} ${
                                    selectedLanguages.includes(lang) ? styles.selected : ''
                                }`}
                                onClick={() => handleLanguageToggle(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Location & Budget */}
                <section className={styles.section}>
                    <h2>Location & Budget</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="preferredStates">Preferred States</label>
                            <select
                                id="preferredStates"
                                name="preferredStates"
                                value={formData.preferredStates}
                                onChange={handleChange}
                            >
                                <option value="">Any State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="preferredCities">Preferred Cities</label>
                            <input
                                type="text"
                                id="preferredCities"
                                name="preferredCities"
                                value={formData.preferredCities}
                                onChange={handleChange}
                                placeholder="e.g., Frisco, Plano, Irving"
                            />
                        </div>
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="minBudget">Min Budget ($/mo)</label>
                            <input
                                type="number"
                                id="minBudget"
                                name="minBudget"
                                value={formData.minBudget}
                                onChange={handleChange}
                                placeholder="500"
                                min="0"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="maxBudget">Max Budget ($/mo) *</label>
                            <input
                                type="number"
                                id="maxBudget"
                                name="maxBudget"
                                value={formData.maxBudget}
                                onChange={handleChange}
                                placeholder="1500"
                                min="0"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Lifestyle */}
                <section className={styles.section}>
                    <h2>Lifestyle Preferences</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="dietaryPreference">Dietary Preference</label>
                            <select
                                id="dietaryPreference"
                                name="dietaryPreference"
                                value={formData.dietaryPreference}
                                onChange={handleChange}
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

                        <div className={styles.field}>
                            <label htmlFor="cleanlinessLevel">Cleanliness Level</label>
                            <select
                                id="cleanlinessLevel"
                                name="cleanlinessLevel"
                                value={formData.cleanlinessLevel}
                                onChange={handleChange}
                            >
                                <option value="Very Clean">Very Clean / Neat Freak</option>
                                <option value="Clean">Clean / Tidy</option>
                                <option value="Average">Average</option>
                                <option value="Relaxed">Relaxed / Messy OK</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="sleepSchedule">Sleep Schedule</label>
                            <select
                                id="sleepSchedule"
                                name="sleepSchedule"
                                value={formData.sleepSchedule}
                                onChange={handleChange}
                            >
                                <option value="Early Bird">Early Bird (before 10pm)</option>
                                <option value="Night Owl">Night Owl (after midnight)</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="workStyle">Work Style</label>
                            <select
                                id="workStyle"
                                name="workStyle"
                                value={formData.workStyle}
                                onChange={handleChange}
                            >
                                <option value="Work From Home">Work From Home (need quiet)</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Office">Office (rarely home during day)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Substances */}
                <section className={styles.section}>
                    <h2>Substance Preferences</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="smokingPreference">Smoking</label>
                            <select
                                id="smokingPreference"
                                name="smokingPreference"
                                value={formData.smokingPreference}
                                onChange={handleChange}
                            >
                                <option value="No Smoking">No Smoking</option>
                                <option value="Outside Only">Outside Only</option>
                                <option value="Cigarettes OK">Cigarettes OK</option>
                                <option value="No Preference">No Preference</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="cannabisPreference">Cannabis / 420</label>
                            <select
                                id="cannabisPreference"
                                name="cannabisPreference"
                                value={formData.cannabisPreference}
                                onChange={handleChange}
                            >
                                <option value="No Cannabis">No Cannabis</option>
                                <option value="Outside Only">Outside Only</option>
                                <option value="Cannabis Friendly">Cannabis Friendly</option>
                                <option value="420 Friendly">420 Friendly (active user)</option>
                                <option value="No Preference">No Preference</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="alcoholPreference">Alcohol</label>
                        <select
                            id="alcoholPreference"
                            name="alcoholPreference"
                            value={formData.alcoholPreference}
                            onChange={handleChange}
                        >
                            <option value="No Alcohol">No Alcohol in Home</option>
                            <option value="Social Drinking">Social Drinking OK</option>
                            <option value="Alcohol Friendly">Alcohol Friendly</option>
                            <option value="No Preference">No Preference</option>
                        </select>
                    </div>
                </section>

                {/* Identity */}
                <section className={styles.section}>
                    <h2>Identity & Inclusivity</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="lgbtqFriendly">LGBTQ+ Friendly</label>
                            <select
                                id="lgbtqFriendly"
                                name="lgbtqFriendly"
                                value={formData.lgbtqFriendly}
                                onChange={handleChange}
                            >
                                <option value="LGBTQ+ Friendly">LGBTQ+ Friendly</option>
                                <option value="LGBTQ+ Household">LGBTQ+ Household</option>
                                <option value="No Preference">No Preference</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="petsPreference">Pets</label>
                            <select
                                id="petsPreference"
                                name="petsPreference"
                                value={formData.petsPreference}
                                onChange={handleChange}
                            >
                                <option value="No Pets">No Pets</option>
                                <option value="Cats OK">Cats OK</option>
                                <option value="Dogs OK">Dogs OK</option>
                                <option value="All Pets">All Pets OK</option>
                                <option value="I Have Pets">I Have Pets</option>
                                <option value="Allergies">Allergies (no pets)</option>
                            </select>
                        </div>
                    </div>

                    {formData.petsPreference === 'I Have Pets' && (
                        <div className={styles.field}>
                            <label htmlFor="hasPets">Describe Your Pets</label>
                            <input
                                type="text"
                                id="hasPets"
                                name="hasPets"
                                value={formData.hasPets}
                                onChange={handleChange}
                                placeholder="e.g., 1 small dog, 2 cats"
                            />
                        </div>
                    )}
                </section>

                {/* About You */}
                <section className={styles.section}>
                    <h2>About You</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Prefer not to say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="ageRange">Age Range</label>
                            <select
                                id="ageRange"
                                name="ageRange"
                                value={formData.ageRange}
                                onChange={handleChange}
                            >
                                <option value="">Prefer not to say</option>
                                <option value="18-24">18-24</option>
                                <option value="25-30">25-30</option>
                                <option value="31-40">31-40</option>
                                <option value="40+">40+</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="occupation">Occupation</label>
                        <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            placeholder="e.g., Software Engineer, Student"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell potential roommates about yourself..."
                            rows={4}
                        />
                    </div>
                </section>

                {/* Timeline */}
                <section className={styles.section}>
                    <h2>Timeline</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="moveInDate">Move-in Date</label>
                            <input
                                type="date"
                                id="moveInDate"
                                name="moveInDate"
                                value={formData.moveInDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="leaseDuration">Lease Duration</label>
                            <select
                                id="leaseDuration"
                                name="leaseDuration"
                                value={formData.leaseDuration}
                                onChange={handleChange}
                            >
                                <option value="">Flexible</option>
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="12 months">12 months</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="isLookingForRoom"
                                checked={formData.isLookingForRoom}
                                onChange={handleChange}
                            />
                            <span>I'm looking for a room to rent</span>
                        </label>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="isLookingForRoommate"
                                checked={formData.isLookingForRoommate}
                                onChange={handleChange}
                            />
                            <span>I'm looking for roommates (have a place or forming a group)</span>
                        </label>
                    </div>
                </section>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading
                            ? 'Saving...'
                            : existingProfile
                              ? 'Update Profile'
                              : 'Create Profile'}
                    </button>
                </div>
            </form>
        </main>
    );
}
