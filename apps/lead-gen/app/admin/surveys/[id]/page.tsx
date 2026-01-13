'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSurveyResponseById, updateSurveyStatus } from '../../../actions/survey';
import styles from './page.module.css';

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'converted', label: 'Converted' },
];

const userTypeLabels: Record<string, string> = {
    roommate_seeker: 'Roommate Seeker',
    host: 'Host / Landlord',
    buyer: 'Home Buyer',
    seller: 'Home Seller',
    agent: 'Agent',
};

export default function SurveyDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Form state
    const [status, setStatus] = useState('');
    const [callNotes, setCallNotes] = useState('');
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchResponse() {
            const result = await getSurveyResponseById(params.id);
            if (result.success && result.data) {
                setResponse(result.data);
                setStatus(result.data.status);
                setCallNotes(result.data.callNotes || '');
            } else {
                setError(result.message || 'Failed to load response');
            }
            setLoading(false);
        }
        fetchResponse();
    }, [params.id]);

    const handleSave = () => {
        setSaveMessage(null);
        startTransition(async () => {
            const result = await updateSurveyStatus(params.id, {
                status,
                callNotes,
                calledAt: status === 'contacted' ? new Date() : undefined,
                interviewedAt: status === 'interviewed' ? new Date() : undefined,
            });

            if (result.success) {
                setSaveMessage('Saved successfully!');
                setTimeout(() => setSaveMessage(null), 3000);
            } else {
                setSaveMessage(result.message || 'Failed to save');
            }
        });
    };

    const handleMarkContacted = () => {
        setStatus('contacted');
        startTransition(async () => {
            await updateSurveyStatus(params.id, {
                status: 'contacted',
                calledAt: new Date(),
            });
            setSaveMessage('Marked as contacted!');
            setTimeout(() => setSaveMessage(null), 3000);
        });
    };

    if (loading) {
        return (
            <main className={styles.container}>
                <p>Loading...</p>
            </main>
        );
    }

    if (error || !response) {
        return (
            <main className={styles.container}>
                <div className={styles.error}>
                    <h1>Error</h1>
                    <p>{error || 'Response not found'}</p>
                    <Link href="/admin/surveys">Back to Dashboard</Link>
                </div>
            </main>
        );
    }

    const surveyData = response.surveyData ? JSON.parse(response.surveyData) : {};

    return (
        <main className={styles.container}>
            <Link href="/admin/surveys" className={styles.backLink}>
                &#x2190; Back to Dashboard
            </Link>

            <div className={styles.header}>
                <div>
                    <span className={styles.userTypeBadge}>
                        {userTypeLabels[response.userType] || response.userType}
                    </span>
                    <h1 className={styles.title}>{response.name || response.email}</h1>
                    <p className={styles.meta}>
                        Submitted on {new Date(response.createdAt).toLocaleDateString()} at{' '}
                        {new Date(response.createdAt).toLocaleTimeString()}
                    </p>
                </div>
                <div className={styles.quickActions}>
                    <a href={`mailto:${response.email}`} className={styles.emailButton}>
                        Email
                    </a>
                    {response.phone && (
                        <a href={`tel:${response.phone}`} className={styles.phoneButton}>
                            Call
                        </a>
                    )}
                </div>
            </div>

            <div className={styles.grid}>
                {/* Contact Info */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Contact Information</h2>
                    <div className={styles.infoGrid}>
                        <div>
                            <label>Email</label>
                            <p>{response.email}</p>
                        </div>
                        <div>
                            <label>Phone</label>
                            <p>{response.phone || '-'}</p>
                        </div>
                        <div>
                            <label>Name</label>
                            <p>{response.name || '-'}</p>
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Location</h2>
                    <div className={styles.infoGrid}>
                        <div>
                            <label>City</label>
                            <p>{response.city || '-'}</p>
                        </div>
                        <div>
                            <label>State</label>
                            <p>{response.state || '-'}</p>
                        </div>
                        <div>
                            <label>ZIP Code</label>
                            <p>{response.zipcode || '-'}</p>
                        </div>
                    </div>
                </section>

                {/* Details */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Survey Details</h2>
                    <div className={styles.infoGrid}>
                        <div>
                            <label>Timeline</label>
                            <p>{response.timeline || '-'}</p>
                        </div>
                        <div>
                            <label>Languages</label>
                            <p>{response.languages || '-'}</p>
                        </div>
                        <div>
                            <label>Referral Source</label>
                            <p>{response.referralSource || '-'}</p>
                        </div>
                    </div>
                </section>

                {/* Pain Points */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Pain Points</h2>
                    <div className={styles.painPoints}>
                        <div>
                            <label>Biggest Challenge</label>
                            <p>{response.biggestChallenge || 'Not provided'}</p>
                        </div>
                        <div>
                            <label>Current Solution</label>
                            <p>{response.currentSolution || 'Not provided'}</p>
                        </div>
                    </div>
                </section>

                {/* Type-Specific Data */}
                {Object.keys(surveyData).length > 0 && (
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>Additional Details</h2>
                        <div className={styles.infoGrid}>
                            {Object.entries(surveyData).map(([key, value]) => (
                                <div key={key}>
                                    <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                    <p>
                                        {Array.isArray(value)
                                            ? value.join(', ') || '-'
                                            : (value as string) || '-'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Status & Notes */}
                <section className={`${styles.card} ${styles.fullWidth}`}>
                    <h2 className={styles.cardTitle}>Follow-up Tracking</h2>

                    <div className={styles.trackingGrid}>
                        <div>
                            <label className={styles.formLabel}>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={styles.select}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.timestamps}>
                            {response.calledAt && (
                                <p>
                                    <strong>Called:</strong>{' '}
                                    {new Date(response.calledAt).toLocaleString()}
                                </p>
                            )}
                            {response.interviewedAt && (
                                <p>
                                    <strong>Interviewed:</strong>{' '}
                                    {new Date(response.interviewedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label className={styles.formLabel}>Call Notes</label>
                        <textarea
                            value={callNotes}
                            onChange={(e) => setCallNotes(e.target.value)}
                            className={styles.textarea}
                            rows={6}
                            placeholder="Add notes from your call or interview..."
                        />
                    </div>

                    <div className={styles.actionBar}>
                        {response.status === 'new' && (
                            <button
                                onClick={handleMarkContacted}
                                className={styles.secondaryButton}
                                disabled={isPending}
                            >
                                Mark as Contacted
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            className={styles.saveButton}
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                        {saveMessage && (
                            <span className={styles.saveMessage}>{saveMessage}</span>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
