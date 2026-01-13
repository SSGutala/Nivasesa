import React from 'react';
import styles from './BoostBadge.module.css';

interface BoostBadgeProps {
  tier: 'basic' | 'premium' | 'featured';
  variant?: 'compact' | 'full';
  className?: string;
}

const TIER_CONFIG = {
  basic: {
    label: 'Boosted',
    icon: '⚡',
    color: 'blue',
  },
  premium: {
    label: 'Premium',
    icon: '✨',
    color: 'purple',
  },
  featured: {
    label: 'Featured',
    icon: '🌟',
    color: 'gold',
  },
} as const;

export default function BoostBadge({ tier, variant = 'compact', className = '' }: BoostBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <div
      className={`${styles.badge} ${styles[tier]} ${styles[variant]} ${className}`}
      role="status"
      aria-label={`${config.label} listing`}
    >
      <span className={styles.icon} aria-hidden="true">
        {config.icon}
      </span>
      {variant === 'full' && <span className={styles.label}>{config.label}</span>}
    </div>
  );
}

/**
 * User Badge Display Component
 */
interface UserBadgeProps {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export function UserBadge({
  name,
  displayName,
  description,
  icon,
  earnedAt,
  size = 'medium',
  showTooltip = true,
}: UserBadgeProps) {
  return (
    <div
      className={`${styles.userBadge} ${styles[size]}`}
      title={showTooltip ? `${displayName}: ${description}` : undefined}
    >
      <div className={styles.badgeIcon}>
        {/* You can replace this with Lucide icons based on icon name */}
        <span aria-label={displayName}>{icon}</span>
      </div>
      <div className={styles.badgeInfo}>
        <div className={styles.badgeName}>{displayName}</div>
        {earnedAt && <div className={styles.badgeDate}>Earned {new Date(earnedAt).toLocaleDateString()}</div>}
      </div>
    </div>
  );
}

/**
 * Badge Collection Display
 */
interface BadgeCollectionProps {
  badges: Array<{
    id: string;
    badge: {
      name: string;
      displayName: string;
      description: string;
      icon: string;
    };
    earnedAt: Date;
  }>;
  maxDisplay?: number;
  size?: 'small' | 'medium' | 'large';
}

export function BadgeCollection({ badges, maxDisplay = 5, size = 'small' }: BadgeCollectionProps) {
  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={styles.badgeCollection}>
      {displayBadges.map((userBadge) => (
        <UserBadge
          key={userBadge.id}
          name={userBadge.badge.name}
          displayName={userBadge.badge.displayName}
          description={userBadge.badge.description}
          icon={userBadge.badge.icon}
          earnedAt={userBadge.earnedAt}
          size={size}
        />
      ))}
      {remaining > 0 && <div className={styles.badgeMore}>+{remaining} more</div>}
    </div>
  );
}
