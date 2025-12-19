'use client';

import { useState } from 'react';
import styles from '@/app/find-a-realtor/[id]/profile.module.css';
import { createLead } from '@/actions/createLead';

export default function ContactAgentForm({ agentId, agentName }: { agentId: string, agentName: string }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'Buying',
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
                zipcode: 'Unknown', // Could be enhanced with geo-location or extra field
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
            <div className={styles.contactCard}>
                <div className={styles.confirmation}>
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out to {agentName}. They will contact you shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.contactCard}>
            <h2>Connect with {agentName.split(' ')[0]}</h2>
            <p>Fill out the form below to start a conversation about your home goals.</p>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>NAME</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Your full name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>EMAIL</label>
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
                    <label>PHONE (OPTIONAL)</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>I AM INTERESTED IN</label>
                    <select
                        className={styles.select}
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
                        <option value="Buying">Buying a home</option>
                        <option value="Selling">Selling a home</option>
                        <option value="Investing">Real Estate Investing</option>
                        <option value="Renting">Renting / Property Management</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>MESSAGE / GOALS</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="What are you looking for?"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p style={{ fontSize: '11px', marginTop: '20px', textAlign: 'center' }}>
                    By clicking &quot;Send Message&quot;, you agree to share your information with this agent and our platform.
                </p>
            </form>
        </div>
    );
}
