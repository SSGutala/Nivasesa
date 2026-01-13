'use client';

import { useState } from 'react';
import { CheckCircle, Mail, Phone, ShieldCheck } from 'lucide-react';
import VerificationBadges from '@/components/ui/VerificationBadges';
import {
  requestPhoneVerificationAction,
  verifyPhoneAction,
  submitIdVerificationAction,
} from '@/actions/trust';
import styles from './VerificationPage.module.css';

interface VerificationPageProps {
  initialStatus?: {
    emailVerified: boolean;
    phoneVerified: boolean;
    idVerified: boolean;
    idDocumentUrl?: string | null;
  };
  userEmail: string;
}

export default function VerificationPage({
  initialStatus,
  userEmail,
}: VerificationPageProps) {
  const [status, setStatus] = useState(
    initialStatus || {
      emailVerified: false,
      phoneVerified: false,
      idVerified: false,
    }
  );

  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // ID verification state
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [idLoading, setIdLoading] = useState(false);
  const [idError, setIdError] = useState<string | null>(null);

  const handleSendCode = async () => {
    setPhoneLoading(true);
    setPhoneError(null);

    const result = await requestPhoneVerificationAction(phoneNumber);
    if (result.success) {
      setCodeSent(true);
      // For development, show the code
      if (result.code) {
        alert(`Development mode: Your verification code is ${result.code}`);
      }
    } else {
      setPhoneError(result.error || 'Failed to send code');
    }

    setPhoneLoading(false);
  };

  const handleVerifyPhone = async () => {
    setPhoneLoading(true);
    setPhoneError(null);

    const result = await verifyPhoneAction(verificationCode);
    if (result.success) {
      setStatus((prev) => ({ ...prev, phoneVerified: true }));
      setCodeSent(false);
      setPhoneNumber('');
      setVerificationCode('');
    } else {
      setPhoneError(result.error || 'Failed to verify code');
    }

    setPhoneLoading(false);
  };

  const handleSubmitId = async () => {
    setIdLoading(true);
    setIdError(null);

    const result = await submitIdVerificationAction(idDocumentUrl);
    if (result.success) {
      alert('ID document submitted for review. We will notify you once verified.');
      setIdDocumentUrl('');
    } else {
      setIdError(result.error || 'Failed to submit ID');
    }

    setIdLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Verification</h1>
        <p className={styles.subtitle}>
          Verify your account to build trust with other users
        </p>
      </div>

      <div className={styles.badgesSection}>
        <h2 className={styles.sectionTitle}>Your Verification Status</h2>
        <VerificationBadges
          emailVerified={status.emailVerified}
          phoneVerified={status.phoneVerified}
          idVerified={status.idVerified}
          showLabels
          size="large"
        />
        {!status.emailVerified && !status.phoneVerified && !status.idVerified && (
          <p className={styles.noBadges}>No verifications yet. Get started below!</p>
        )}
      </div>

      <div className={styles.sections}>
        {/* Email Verification */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Mail className={styles.sectionIcon} />
            <div>
              <h3 className={styles.sectionTitle}>Email Verification</h3>
              <p className={styles.sectionDescription}>
                Confirm your email address: {userEmail}
              </p>
            </div>
          </div>
          {status.emailVerified ? (
            <div className={styles.verified}>
              <CheckCircle className={styles.verifiedIcon} />
              <span>Verified</span>
            </div>
          ) : (
            <p className={styles.pending}>
              Check your email for a verification link. If you did not receive it, contact
              support.
            </p>
          )}
        </div>

        {/* Phone Verification */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Phone className={styles.sectionIcon} />
            <div>
              <h3 className={styles.sectionTitle}>Phone Verification</h3>
              <p className={styles.sectionDescription}>
                Verify your phone number to increase trust
              </p>
            </div>
          </div>
          {status.phoneVerified ? (
            <div className={styles.verified}>
              <CheckCircle className={styles.verifiedIcon} />
              <span>Verified</span>
            </div>
          ) : (
            <div className={styles.form}>
              {!codeSent ? (
                <>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.input}
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={phoneLoading || !phoneNumber}
                    className={styles.button}
                  >
                    {phoneLoading ? 'Sending...' : 'Send Code'}
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={styles.input}
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={phoneLoading || verificationCode.length !== 6}
                    className={styles.button}
                  >
                    {phoneLoading ? 'Verifying...' : 'Verify'}
                  </button>
                  <button
                    onClick={() => setCodeSent(false)}
                    className={styles.linkButton}
                  >
                    Use different number
                  </button>
                </>
              )}
              {phoneError && <div className={styles.error}>{phoneError}</div>}
            </div>
          )}
        </div>

        {/* ID Verification */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <ShieldCheck className={styles.sectionIcon} />
            <div>
              <h3 className={styles.sectionTitle}>ID Verification</h3>
              <p className={styles.sectionDescription}>
                Upload a government-issued ID for the highest level of trust
              </p>
            </div>
          </div>
          {status.idVerified ? (
            <div className={styles.verified}>
              <CheckCircle className={styles.verifiedIcon} />
              <span>Verified</span>
            </div>
          ) : (
            <div className={styles.form}>
              <p className={styles.info}>
                Accepted documents: Driver's License, Passport, State ID
              </p>
              <input
                type="text"
                placeholder="Document URL (upload to your preferred service)"
                value={idDocumentUrl}
                onChange={(e) => setIdDocumentUrl(e.target.value)}
                className={styles.input}
              />
              <button
                onClick={handleSubmitId}
                disabled={idLoading || !idDocumentUrl}
                className={styles.button}
              >
                {idLoading ? 'Submitting...' : 'Submit for Review'}
              </button>
              {idError && <div className={styles.error}>{idError}</div>}
              <p className={styles.note}>
                Note: ID verification requires manual review and may take 1-2 business days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
