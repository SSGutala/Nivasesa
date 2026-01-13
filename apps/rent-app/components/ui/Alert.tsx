'use client'

import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'
import styles from './Alert.module.css'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  icon?: React.ReactNode
}

const icons: Record<AlertVariant, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertCircle size={20} />,
  error: <XCircle size={20} />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  icon,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className={`${styles.alert} ${styles[variant]} ${className}`} role="alert">
      <div className={styles.iconWrapper}>{icon || icons[variant]}</div>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

// Convenience components for common variants
export function InfoAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert variant="info" {...props} />
}

export function SuccessAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert variant="success" {...props} />
}

export function WarningAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert variant="warning" {...props} />
}

export function ErrorAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert variant="error" {...props} />
}
