'use client'

import { X } from 'lucide-react'
import styles from './Badge.module.css'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onRemove?: () => void
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  onRemove,
  className = '',
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}

export interface BadgeDotProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}

export function BadgeDot({ variant = 'default', children, className = '' }: BadgeDotProps) {
  return (
    <span className={`${styles.badgeDot} ${className}`}>
      <span className={`${styles.dot} ${styles[`dot-${variant}`]}`} />
      <span>{children}</span>
    </span>
  )
}

export interface BadgeCountProps {
  count: number
  max?: number
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export function BadgeCount({ count, max = 99, variant = 'error', className = '' }: BadgeCountProps) {
  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <span className={`${styles.badgeCount} ${styles[`count-${variant}`]} ${className}`}>
      {displayCount}
    </span>
  )
}
