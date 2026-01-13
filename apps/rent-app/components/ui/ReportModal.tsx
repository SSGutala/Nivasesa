'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { reportContentAction } from '@/actions/moderation';
import styles from './ReportModal.module.css';

interface ReportModalProps {
  targetType: 'user' | 'listing' | 'message';
  targetId: string;
  targetName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or Scam' },
  { value: 'harassment', label: 'Harassment or Bullying' },
  { value: 'fraud', label: 'Fraud or Deceptive' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
] as const;

export default function ReportModal({
  targetType,
  targetId,
  targetName,
  isOpen,
  onClose,
}: ReportModalProps) {
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await reportContentAction(
        targetType,
        targetId,
        reason as 'spam' | 'harassment' | 'fraud' | 'inappropriate',
        description
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setReason('');
          setDescription('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit report');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setReason('');
      setDescription('');
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Flag className={styles.icon} />
            <h2 className={styles.title}>Report {targetType}</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        {success ? (
          <div className={styles.successMessage}>
            <p>Thank you for your report. Our team will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {targetName && (
              <p className={styles.targetInfo}>
                Reporting: <strong>{targetName}</strong>
              </p>
            )}

            <div className={styles.field}>
              <label htmlFor="reason" className={styles.label}>
                Reason for report <span className={styles.required}>*</span>
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.select}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a reason...</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Additional details (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Please provide any additional context..."
                disabled={isSubmitting}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
