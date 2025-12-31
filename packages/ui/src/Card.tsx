'use client'

import styles from './Card.module.css'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  className?: string
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
}: CardProps) {
  const isInteractive = clickable || !!onClick
  const Component = isInteractive ? 'button' : 'div'

  return (
    <Component
      className={`
        ${styles.card}
        ${styles[variant]}
        ${styles[`padding-${padding}`]}
        ${hoverable ? styles.hoverable : ''}
        ${isInteractive ? styles.clickable : ''}
        ${className}
      `}
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
    >
      {children}
    </Component>
  )
}

export interface CardHeaderProps {
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function CardHeader({ children, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      <div className={styles.cardHeaderContent}>{children}</div>
      {action && <div className={styles.cardHeaderAction}>{action}</div>}
    </div>
  )
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`${styles.cardDescription} ${className}`}>{children}</p>
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`${styles.cardContent} ${className}`}>{children}</div>
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`${styles.cardFooter} ${className}`}>{children}</div>
}
