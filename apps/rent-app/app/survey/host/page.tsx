'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { submitSurvey } from '@/actions/survey';
import { US_STATES } from '@/lib/geo';
import { Copy, Mail, MessageCircle, Check } from 'lucide-react';
import styles from './survey.module.css';

const hostSurveySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(['Email', 'Text', 'WhatsApp'], 'Please select a contact method'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  spaceType: z.enum(['Private room', 'Entire apartment/home', 'Shared room'], 'Please select a space type'),
  stayDurations: z.array(z.string()).min(1, 'Select at least one stay duration'),
  availabilityStatus: z.enum(['Available now', 'Available soon', 'Not yet/just exploring'], 'Please select availability status'),
  earliestAvailabilityDate: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type HostSurveyFormData = z.infer<typeof hostSurveySchema>;

const STAY_DURATIONS = [
  'Temporary 1-4 weeks',
  'Short-term 1-3 months',
  'Long-term 6+ months',
];

export default function HostSurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HostSurveyFormData>({
    resolver: zodResolver(hostSurveySchema),
    defaultValues: {
      stayDurations: [],
    },
  });

  const stayDurations = watch('stayDurations') || [];

  const toggleStayDuration = (duration: string) => {
    const current = stayDurations;
    if (current.includes(duration)) {
      setValue('stayDurations', current.filter((d) => d !== duration));
    } else {
      setValue('stayDurations', [...current, duration]);
    }
  };

  const onSubmit = async (data: HostSurveyFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitSurvey({
        userType: 'host',
        email: data.email,
        phone: data.phone,
        name: data.fullName,
        city: data.city,
        state: data.state,
        zipcode: data.zipCode,
        surveyData: {
          preferredContactMethod: data.preferredContactMethod,
          spaceType: data.spaceType,
          stayDurations: data.stayDurations,
          availabilityStatus: data.availabilityStatus,
          earliestAvailabilityDate: data.earliestAvailabilityDate,
          additionalInfo: data.additionalInfo,
        },
      });

      if (result.success) {
        // Generate referral link (in production, this would come from the server)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const referralCode = result.id?.substring(0, 8) || 'WELCOME';
        setReferralLink(`${baseUrl}/survey?ref=${referralCode}`);
        setIsSuccess(true);
      } else {
        setSubmitError(result.message || 'Failed to submit survey. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Survey submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join Nivaesa - Find Your Perfect Housing Match');
    const body = encodeURIComponent(
      `I just joined Nivaesa, a platform for finding housing and roommates with shared expectations.\n\nJoin using my link and we'll both get a profile boost at launch:\n${referralLink}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `I just joined Nivaesa! Join using my link and we'll both get a profile boost: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <Check size={48} />
          </div>
          <h1 className={styles.successTitle}>Account Successfully Created</h1>
          <p className={styles.successMessage}>
            Nivaesa is currently under development. You will receive an email with next steps and
            updates as the platform progresses. Once Nivaesa is fully launched, you will be able to
            complete your profile, upload photos and videos of your property, add detailed listing
            information, and publish your space to begin attracting interested renters.
          </p>

          <div className={styles.referralSection}>
            <h2 className={styles.referralTitle}>Invite Others to Join Nivaesa</h2>
            <p className={styles.referralDescription}>
              Share your personal referral link. If someone signs up using your link:
            </p>
            <ul className={styles.referralBenefits}>
              <li>You&apos;ll receive a free profile boost for 14 days at launch</li>
              <li>They&apos;ll receive a free profile boost for 7 days at launch</li>
            </ul>

            <div className={styles.referralLinkContainer}>
              <input
                type="text"
                readOnly
                value={referralLink}
                className={styles.referralLinkInput}
              />
              <Button
                onClick={handleCopyLink}
                variant="primary"
                size="md"
                className={styles.copyButton}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div className={styles.shareButtons}>
              <Button onClick={handleShareEmail} variant="outline" size="md">
                <Mail size={20} />
                Share via Email
              </Button>
              <Button onClick={handleShareWhatsApp} variant="outline" size="md">
                <MessageCircle size={20} />
                Share via WhatsApp
              </Button>
            </div>
          </div>

          <Button onClick={() => router.push('/')} variant="ghost" size="md" fullWidth>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Host / Landlord Survey</h1>
        <p className={styles.subtitle}>
          Help us understand your space and preferences to connect you with the right tenants.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Section A: Contact Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>

            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              required
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              hint="Optional"
            />

            <Select
              label="Preferred Contact Method"
              {...register('preferredContactMethod')}
              options={[
                { value: 'Email', label: 'Email' },
                { value: 'Text', label: 'Text' },
                { value: 'WhatsApp', label: 'WhatsApp' },
              ]}
              placeholder="Select contact method"
              error={errors.preferredContactMethod?.message}
              required
            />
          </div>

          {/* Section B: Listing Context */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Listing Context</h2>

            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
              required
            />

            <Select
              label="State"
              {...register('state')}
              options={US_STATES}
              placeholder="Select state"
              error={errors.state?.message}
              required
            />

            <Input
              label="ZIP Code"
              {...register('zipCode')}
              error={errors.zipCode?.message}
              hint="5-digit ZIP code"
              required
            />

            <Select
              label="Type of Space Offered"
              {...register('spaceType')}
              options={[
                { value: 'Private room', label: 'Private room' },
                { value: 'Entire apartment/home', label: 'Entire apartment/home' },
                { value: 'Shared room', label: 'Shared room' },
              ]}
              placeholder="Select space type"
              error={errors.spaceType?.message}
              required
            />

            <div className={styles.multiSelectField}>
              <label className={styles.multiSelectLabel}>
                Stay Duration(s) Offered
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.multiSelectButtons}>
                {STAY_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => toggleStayDuration(duration)}
                    className={`${styles.multiSelectButton} ${
                      stayDurations.includes(duration) ? styles.selected : ''
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
              {errors.stayDurations && (
                <p className={styles.error}>{errors.stayDurations.message}</p>
              )}
            </div>

            <Select
              label="Current Availability Status"
              {...register('availabilityStatus')}
              options={[
                { value: 'Available now', label: 'Available now' },
                { value: 'Available soon', label: 'Available soon' },
                { value: 'Not yet/just exploring', label: 'Not yet / just exploring' },
              ]}
              placeholder="Select availability status"
              error={errors.availabilityStatus?.message}
              required
            />

            <Input
              label="Earliest Availability Date"
              type="date"
              {...register('earliestAvailabilityDate')}
              error={errors.earliestAvailabilityDate?.message}
              hint="Optional"
            />
          </div>

          {/* Section C: Additional Context */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Context</h2>

            <div className={styles.textareaField}>
              <label htmlFor="additionalInfo" className={styles.textareaLabel}>
                Anything else you&apos;d like to share
              </label>
              <textarea
                id="additionalInfo"
                {...register('additionalInfo')}
                className={styles.textarea}
                placeholder="Optional - share any additional details about your space or preferences"
                rows={4}
              />
              {errors.additionalInfo && (
                <p className={styles.error}>{errors.additionalInfo.message}</p>
              )}
            </div>
          </div>

          {submitError && (
            <div className={styles.errorBox}>
              {submitError}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </Button>
        </form>
      </div>
    </div>
  );
}
