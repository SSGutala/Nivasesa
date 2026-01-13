'use client';

import { CheckCircle, Mail, Phone, ShieldCheck } from 'lucide-react';
import styles from './VerificationBadges.module.css';

interface VerificationBadgesProps {
  emailVerified?: boolean;
  phoneVerified?: boolean;
  idVerified?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function VerificationBadges({
  emailVerified = false,
  phoneVerified = false,
  idVerified = false,
  showLabels = false,
  size = 'medium',
}: VerificationBadgesProps) {
  const badges = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email Verified',
      verified: emailVerified,
      color: '#3b82f6', // blue
    },
    {
      id: 'phone',
      icon: Phone,
      label: 'Phone Verified',
      verified: phoneVerified,
      color: '#10b981', // green
    },
    {
      id: 'id',
      icon: ShieldCheck,
      label: 'ID Verified',
      verified: idVerified,
      color: '#8b5cf6', // purple
    },
  ];

  const verifiedBadges = badges.filter((badge) => badge.verified);

  if (verifiedBadges.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {verifiedBadges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className={styles.badge}
            title={badge.label}
            style={{ color: badge.color }}
          >
            <Icon className={styles.icon} />
            {showLabels && <span className={styles.label}>{badge.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
