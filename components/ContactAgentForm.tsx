'use client';

import { useState } from 'react';
import styles from '@/app/find-a-realtor/[id]/profile.module.css';
import { createLead } from '../actions/createLead';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactAgentForm({ agentId, agentName }: { agentId: string, agentName: string }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'Seeking Room',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createLead({
                agentId,
                buyerName: formData.name,
                buyerEmail: formData.email,
                buyerPhone: formData.phone,
                interest: formData.interest,
                message: formData.message,
                zipcode: 'Unknown',
                city: 'Unknown'
            });

            if (result.success) {
                setIsSubmitted(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={styles.confirmation}>
                <div style={{ background: 'var(--color-bg-subtle)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle2 size={32} color="var(--color-primary)" />
                </div>
                <h3>Interest Shared!</h3>
                <p style={{ lineHeight: '1.6' }}>
                    {agentName} has been notified. We'll let you know as soon as they're ready to connect.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label>About You</label>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className={styles.row} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="Email address"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Phone (Optional)</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>I am...</label>
                <select
                    className={styles.select}
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                >
                    <option value="Seeking Room">Looking for a room</option>
                    <option value="Offering Space">Offering a space</option>
                    <option value="Just Exploring">Just exploring options</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>A message for {agentName.split(' ')[0]}</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Briefly introduce yourself and your goals..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading ? 'Sharing...' : (
                        <>
                            <span>Share Interest</span>
                            <Send size={18} />
                        </>
                    )}
                </div>
            </button>

            <p style={{ fontSize: '12px', marginTop: '20px', textAlign: 'center', color: 'var(--color-text-light)', lineHeight: '1.4' }}>
                By sharing interest, you agree to Nivaesa's <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Trust & Safety</span> guidelines.
            </p>
        </form>
    );
}
