'use client'

import { Inbox, Search, FileX, Users, Home } from 'lucide-react'
import styles from './EmptyState.module.css'

type EmptyStateVariant = 'default' | 'search' | 'file' | 'users' | 'listings'

export interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const defaultIcons: Record<EmptyStateVariant, React.ReactNode> = {
  default: <Inbox size={48} />,
  search: <Search size={48} />,
  file: <FileX size={48} />,
  users: <Users size={48} />,
  listings: <Home size={48} />,
}

const defaultTitles: Record<EmptyStateVariant, string> = {
  default: 'No items yet',
  search: 'No results found',
  file: 'No files',
  users: 'No users found',
  listings: 'No listings available',
}

const defaultDescriptions: Record<EmptyStateVariant, string> = {
  default: 'There are no items to display at this time.',
  search: 'Try adjusting your search or filter criteria.',
  file: 'No files have been uploaded yet.',
  users: 'No users match your criteria.',
  listings: 'No room listings are available right now.',
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>{icon || defaultIcons[variant]}</div>
      <h3 className={styles.title}>{title || defaultTitles[variant]}</h3>
      <p className={styles.description}>{description || defaultDescriptions[variant]}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
