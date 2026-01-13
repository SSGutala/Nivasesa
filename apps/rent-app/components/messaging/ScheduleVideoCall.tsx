'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Clock, X } from 'lucide-react';
import { scheduleVideoCallAction } from '@/actions/video-call';
import { Button } from '@/components/ui/Button';
import styles from './ScheduleVideoCall.module.css';

interface ScheduleVideoCallProps {
  conversationId: string;
  onClose?: () => void;
  onScheduled?: (callId: string) => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
];

export function ScheduleVideoCall({ conversationId, onClose, onScheduled }: ScheduleVideoCallProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to tomorrow at 2pm
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [duration, setDuration] = useState(30);

  const handleSchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);

      const result = await scheduleVideoCallAction({
        conversationId,
        scheduledAt,
        duration,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      onScheduled?.(result.data!.callId);
      onClose?.();
    } catch (err) {
      setError('Failed to schedule video call');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await scheduleVideoCallAction({
        conversationId,
        scheduledAt: new Date(),
        duration: 30,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Navigate directly to the call
      router.push(`/call/${result.data!.callId}`);
    } catch (err) {
      setError('Failed to start video call');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Video size={24} />
            <h2>Schedule Video Call</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
              <X size={20} />
            </button>
          )}
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            A virtual meet & greet is required before proceeding with any transaction. Schedule a time that works for
            both of you.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          {/* Quick Start Option */}
          <div className={styles.quickStart}>
            <Button onClick={handleStartNow} variant="primary" size="lg" fullWidth loading={isLoading}>
              <Video size={20} />
              Start Call Now
            </Button>
          </div>

          <div className={styles.divider}>
            <span>or schedule for later</span>
          </div>

          {/* Schedule Form */}
          <div className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="date" className={styles.label}>
                <Calendar size={18} />
                Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="time" className={styles.label}>
                <Clock size={18} />
                Time
              </label>
              <input
                type="time"
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Duration</label>
              <div className={styles.durationOptions}>
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDuration(option.value)}
                    className={`${styles.durationBtn} ${duration === option.value ? styles.selected : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={handleSchedule} variant="outline" size="lg" fullWidth loading={isLoading}>
              Schedule Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Floating button to open the schedule modal
 */
interface VideoCallButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function VideoCallButton({ onClick, disabled }: VideoCallButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles.videoCallBtn} title="Schedule video call">
      <Video size={20} />
    </button>
  );
}
