'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/actions/groups';
import { CITIES } from '@/lib/cities';
import styles from './page.module.css';

export default function CreateGroupForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        targetCity: '',
        targetState: '',
        targetBudgetMin: '',
        targetBudgetMax: '',
        targetMoveIn: '',
        propertyType: '',
        bedroomsNeeded: '',
        maxMembers: '4',
        isPublic: true,
    });

    const states = [...new Set(CITIES.map((c) => c.state))];
    const cities = CITIES.filter((c) => c.state === formData.targetState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.targetCity || !formData.targetState) {
            setError('Please select a city and state');
            setLoading(false);
            return;
        }

        const result = await createGroup({
            name: formData.name,
            description: formData.description || undefined,
            targetCity: formData.targetCity,
            targetState: formData.targetState,
            targetBudgetMin: formData.targetBudgetMin
                ? parseInt(formData.targetBudgetMin)
                : undefined,
            targetBudgetMax: formData.targetBudgetMax
                ? parseInt(formData.targetBudgetMax)
                : undefined,
            targetMoveIn: formData.targetMoveIn
                ? new Date(formData.targetMoveIn)
                : undefined,
            propertyType: formData.propertyType || undefined,
            bedroomsNeeded: formData.bedroomsNeeded
                ? parseInt(formData.bedroomsNeeded)
                : undefined,
            maxMembers: parseInt(formData.maxMembers),
            isPublic: formData.isPublic,
        });

        if (result.success && result.group) {
            router.push(`/groups/${result.group.id}`);
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
            // Reset city when state changes
            ...(name === 'targetState' ? { targetCity: '' } : {}),
        }));
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>Create a Roommate Group</h1>
                <p>
                    Start a group to find housing together with compatible roommates.
                    You'll be the admin of this group.
                </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Group Info */}
                <section className={styles.section}>
                    <h2>Group Information</h2>

                    <div className={styles.field}>
                        <label htmlFor="name">Group Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Telugu Tech Roomies - Frisco"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell potential roommates about your group..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="maxMembers">Max Members</label>
                            <select
                                id="maxMembers"
                                name="maxMembers"
                                value={formData.maxMembers}
                                onChange={handleChange}
                            >
                                <option value="2">2 members</option>
                                <option value="3">3 members</option>
                                <option value="4">4 members</option>
                                <option value="5">5 members</option>
                                <option value="6">6 members</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={handleChange}
                                />
                                <span>Public group (anyone can join)</span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className={styles.section}>
                    <h2>Target Location</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="targetState">State *</label>
                            <select
                                id="targetState"
                                name="targetState"
                                value={formData.targetState}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="targetCity">City *</label>
                            <select
                                id="targetCity"
                                name="targetCity"
                                value={formData.targetCity}
                                onChange={handleChange}
                                required
                                disabled={!formData.targetState}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.slug} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Housing Preferences */}
                <section className={styles.section}>
                    <h2>Housing Preferences</h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="targetBudgetMin">Min Budget ($/mo)</label>
                            <input
                                type="number"
                                id="targetBudgetMin"
                                name="targetBudgetMin"
                                value={formData.targetBudgetMin}
                                onChange={handleChange}
                                placeholder="1000"
                                min="0"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="targetBudgetMax">Max Budget ($/mo)</label>
                            <input
                                type="number"
                                id="targetBudgetMax"
                                name="targetBudgetMax"
                                value={formData.targetBudgetMax}
                                onChange={handleChange}
                                placeholder="3000"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label htmlFor="bedroomsNeeded">Bedrooms Needed</label>
                            <select
                                id="bedroomsNeeded"
                                name="bedroomsNeeded"
                                value={formData.bedroomsNeeded}
                                onChange={handleChange}
                            >
                                <option value="">Any</option>
                                <option value="2">2 bedrooms</option>
                                <option value="3">3 bedrooms</option>
                                <option value="4">4 bedrooms</option>
                                <option value="5">5+ bedrooms</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="propertyType">Property Type</label>
                            <select
                                id="propertyType"
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleChange}
                            >
                                <option value="">Any</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Condo">Condo</option>
                                <option value="Townhouse">Townhouse</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="targetMoveIn">Target Move-in Date</label>
                        <input
                            type="date"
                            id="targetMoveIn"
                            name="targetMoveIn"
                            value={formData.targetMoveIn}
                            onChange={handleChange}
                        />
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
                        {loading ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </form>
        </main>
    );
}
