'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle } from 'lucide-react';
import styles from './profile.module.css';

interface ContactAgentFormProps {
  agentId: string;
  agentName: string;
}

export function ContactAgentForm({ agentId, agentName }: ContactAgentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    timeline: '',
    budgetMin: '',
    budgetMax: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          ...formData,
          budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
          budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successMessage}>
        <CheckCircle size={48} className={styles.successIcon} />
        <h3>Message Sent!</h3>
        <p>{agentName} will reach out to you shortly.</p>
        <button onClick={() => router.push('/agents')} className={styles.backBtn}>
          Browse More Agents
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Your Name *</label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timeline">When are you looking to move?</label>
        <select
          id="timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
        >
          <option value="">Select timeframe</option>
          <option value="ASAP">As soon as possible</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6+ months">6+ months</option>
          <option value="Just browsing">Just browsing</option>
        </select>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="budgetMin">Min Budget</label>
          <input
            id="budgetMin"
            type="number"
            value={formData.budgetMin}
            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
            placeholder="$200,000"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="budgetMax">Max Budget</label>
          <input
            id="budgetMax"
            type="number"
            value={formData.budgetMax}
            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
            placeholder="$500,000"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell the agent about what you're looking for..."
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      <p className={styles.disclaimer}>
        By sending this message, you agree to be contacted by {agentName} regarding your real estate needs.
      </p>
    </form>
  );
}
