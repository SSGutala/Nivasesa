'use client'

import styles from './Progress.module.css'

export interface ProgressProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const displayLabel = label || `${Math.round(percentage)}%`

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      {showLabel && <div className={styles.label}>{displayLabel}</div>}
      <div
        className={`${styles.progressBar} ${styles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`${styles.progressFill} ${styles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export interface ProgressCircleProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressCircle({
  value,
  max = 100,
  variant = 'default',
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  label,
  className = '',
}: ProgressCircleProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const displayLabel = label || `${Math.round(percentage)}%`

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={`${styles.progressCircleContainer} ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles.progressCircle}>
        <circle
          className={styles.progressCircleBackground}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={`${styles.progressCircleFill} ${styles[`circle-${variant}`]}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showLabel && <div className={styles.progressCircleLabel}>{displayLabel}</div>}
    </div>
  )
}

export interface ProgressStepsProps {
  steps: string[]
  currentStep: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export function ProgressSteps({ steps, currentStep, variant = 'default', className = '' }: ProgressStepsProps) {
  return (
    <div className={`${styles.progressSteps} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={index} className={styles.progressStep}>
            <div
              className={`
                ${styles.progressStepIndicator}
                ${isCompleted ? styles.completed : ''}
                ${isCurrent ? `${styles.current} ${styles[`step-${variant}`]}` : ''}
              `}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className={styles.progressStepLabel}>{step}</div>
            {index < steps.length - 1 && (
              <div className={`${styles.progressStepLine} ${isCompleted ? styles.completed : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
