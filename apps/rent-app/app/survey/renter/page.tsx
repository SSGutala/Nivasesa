'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { submitSurvey } from '@/actions/survey';
import { US_STATES } from '@/lib/geo';
import { Copy, Check, Share2 } from 'lucide-react';
import styles from './survey.module.css';

interface RenterSurveyData {
  // Section A: Contact Information
  fullName: string;
  email: string;
  phoneNumber: string;
  preferredContactMethod: 'Email' | 'Text' | 'WhatsApp' | '';

  // Section B: Search Context
  targetCity: string;
  targetState: string;
  targetZipCode: string;
  moveInTimeframe: 'ASAP' | '2-4W' | '1-3M' | 'browsing' | '';
  stayDuration: 'temp' | 'short' | 'long' | '';
  lookingFor: 'room' | 'roommate' | 'either' | '';

  // Section C: Optional Context
  culturalPreference: 'yes' | 'no' | 'notsure' | '';
  additionalNotes: string;
}

export default function RenterSurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenterSurveyData>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      preferredContactMethod: '',
      targetCity: '',
      targetState: '',
      targetZipCode: '',
      moveInTimeframe: '',
      stayDuration: '',
      lookingFor: '',
      culturalPreference: '',
      additionalNotes: '',
    },
  });

  const onSubmit = async (data: RenterSurveyData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Split full name into first and last
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const result = await submitSurvey({
        userType: 'roommate_seeker',
        email: data.email,
        phone: data.phoneNumber || undefined,
        name: data.fullName,
        city: data.targetCity,
        state: data.targetState,
        zipcode: data.targetZipCode || undefined,
        timeline: data.moveInTimeframe || undefined,
        surveyData: {
          preferredContactMethod: data.preferredContactMethod,
          stayDuration: data.stayDuration,
          lookingFor: data.lookingFor,
          culturalPreference: data.culturalPreference,
          additionalNotes: data.additionalNotes,
        },
      });

      if (result.success) {
        // Generate referral code
        const code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setReferralCode(code);
        setShowConfirmation(true);
      } else {
        setSubmitError(result.message || 'Failed to submit survey. Please try again.');
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/survey/renter?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/survey/renter?ref=${referralCode}`;
    const shareData = {
      title: 'Join Nivaesa',
      text: 'Find your perfect room or roommate with Nivaesa!',
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  if (showConfirmation) {
    return (
      <div className={styles.container}>
        <div className={styles.confirmationCard}>
          <div className={styles.confirmationIcon}>
            <Check size={48} />
          </div>
          <h1 className={styles.confirmationTitle}>Thank You!</h1>
          <p className={styles.confirmationMessage}>
            We've received your information and will be in touch soon to help you find your perfect home.
          </p>

          <div className={styles.referralSection}>
            <h2 className={styles.referralTitle}>Invite Friends & Family</h2>
            <p className={styles.referralText}>
              Share Nivaesa with others looking for housing. The more people join, the stronger our community becomes!
            </p>

            <div className={styles.referralActions}>
              <button
                type="button"
                onClick={copyReferralLink}
                className={styles.referralButton}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copy Link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={shareReferral}
                className={styles.referralButton}
              >
                <Share2 size={20} />
                Share
              </button>
            </div>

            <div className={styles.referralCode}>
              Your referral code: <strong>{referralCode}</strong>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className={styles.returnButton}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Find Your Perfect Home</h1>
          <p className={styles.subtitle}>
            Tell us about what you're looking for, and we'll help you connect with the right opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Section A: Contact Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>

            <Input
              label="Full Name"
              required
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              error={errors.fullName?.message}
              placeholder="e.g. Priya Sharma"
            />

            <Input
              label="Email"
              type="email"
              required
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
              placeholder="e.g. priya@example.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              placeholder="e.g. (123) 456-7890"
              hint="Optional"
            />

            <Select
              label="Preferred Contact Method"
              required
              {...register('preferredContactMethod', {
                required: 'Please select a contact method',
              })}
              options={[
                { value: 'Email', label: 'Email' },
                { value: 'Text', label: 'Text Message' },
                { value: 'WhatsApp', label: 'WhatsApp' },
              ]}
              placeholder="Select contact method"
              error={errors.preferredContactMethod?.message}
            />
          </section>

          {/* Section B: Search Context */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Search Details</h2>

            <Input
              label="Target City"
              required
              {...register('targetCity', {
                required: 'City is required',
              })}
              error={errors.targetCity?.message}
              placeholder="e.g. Dallas"
            />

            <Select
              label="Target State"
              required
              {...register('targetState', {
                required: 'State is required',
              })}
              options={US_STATES}
              placeholder="Select state"
              error={errors.targetState?.message}
            />

            <Input
              label="Target ZIP Code"
              type="text"
              {...register('targetZipCode', {
                pattern: {
                  value: /^\d{5}$/,
                  message: 'ZIP code must be 5 digits',
                },
              })}
              error={errors.targetZipCode?.message}
              placeholder="e.g. 75024"
              hint="Optional"
            />

            <Select
              label="Move-In Timeframe"
              required
              {...register('moveInTimeframe', {
                required: 'Please select a timeframe',
              })}
              options={[
                { value: 'ASAP', label: 'ASAP (within 2 weeks)' },
                { value: '2-4W', label: '2-4 weeks' },
                { value: '1-3M', label: '1-3 months' },
                { value: 'browsing', label: 'Just browsing' },
              ]}
              placeholder="Select timeframe"
              error={errors.moveInTimeframe?.message}
            />

            <Select
              label="Intended Stay Duration"
              required
              {...register('stayDuration', {
                required: 'Please select a duration',
              })}
              options={[
                { value: 'temp', label: 'Temporary (1-4 weeks)' },
                { value: 'short', label: 'Short-term (1-3 months)' },
                { value: 'long', label: 'Long-term (6+ months)' },
              ]}
              placeholder="Select duration"
              error={errors.stayDuration?.message}
            />

            <Select
              label="What Are You Looking For?"
              required
              {...register('lookingFor', {
                required: 'Please select an option',
              })}
              options={[
                { value: 'room', label: 'A room' },
                { value: 'roommate', label: 'A roommate to co-lease' },
                { value: 'either', label: 'Either' },
              ]}
              placeholder="Select option"
              error={errors.lookingFor?.message}
            />
          </section>

          {/* Section C: Optional Context */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Information</h2>

            <Select
              label="Do you prefer living with people who share a similar cultural background?"
              {...register('culturalPreference')}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'notsure', label: 'Not sure' },
              ]}
              placeholder="Select preference"
              error={errors.culturalPreference?.message}
              hint="Optional"
            />

            <div className={styles.textareaWrapper}>
              <label htmlFor="additionalNotes" className={styles.textareaLabel}>
                Anything else you'd like to share?
              </label>
              <textarea
                id="additionalNotes"
                {...register('additionalNotes')}
                className={styles.textarea}
                rows={4}
                placeholder="Tell us more about what you're looking for..."
              />
              <p className={styles.textareaHint}>Optional</p>
            </div>
          </section>

          {submitError && (
            <div className={styles.errorAlert}>
              {submitError}
            </div>
          )}

          <div className={styles.submitSection}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
