'use client'

import { User } from 'lucide-react'
import styles from './Avatar.module.css'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'circle' | 'rounded' | 'square'
  fallbackIcon?: React.ReactNode
  className?: string
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  fallbackIcon,
  className = '',
}: AvatarProps) {
  const getInitials = (name?: string): string => {
    if (!name) return ''
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <div className={`${styles.avatar} ${styles[size]} ${styles[variant]} ${className}`}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className={styles.image} />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : (
        <span className={styles.fallback}>{fallbackIcon || <User size={16} />}</span>
      )}
    </div>
  )
}

export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AvatarGroup({ children, max = 5, size = 'md', className = '' }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children]
  const displayChildren = childArray.slice(0, max)
  const remaining = childArray.length - max

  return (
    <div className={`${styles.avatarGroup} ${className}`}>
      {displayChildren.map((child, index) => (
        <div key={index} className={styles.avatarGroupItem}>
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${styles.avatar} ${styles[size]} ${styles.circle} ${styles.remaining}`}>
          <span className={styles.initials}>+{remaining}</span>
        </div>
      )}
    </div>
  )
}
