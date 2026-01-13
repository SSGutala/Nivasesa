'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  releaseEscrowAction,
  cancelEscrowAction,
  getEscrowStatusAction,
} from '@/actions/escrow'
import styles from './EscrowNudge.module.css'

interface EscrowNudgeProps {
  bookingId: string
  escrowStatus: 'authorized' | 'captured' | 'cancelled' | 'refunded'
  userRole: 'renter' | 'host'
  amount: number // Amount in cents
  platformFeeAmount?: number
  hostAmount?: number
  onStatusChange?: () => void
}

export default function EscrowNudge({
  bookingId,
  escrowStatus,
  userRole,
  amount,
  platformFeeAmount,
  hostAmount,
  onStatusChange,
}: EscrowNudgeProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  const handleReleaseEscrow = async () => {
    if (!confirm('Are you sure you want to release the escrow payment? This confirms the renter has moved in.')) {
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await releaseEscrowAction(bookingId)

    if ('error' in result) {
      setError(result.error)
      setIsLoading(false)
    } else {
      onStatusChange?.()
      router.refresh()
    }
  }

  const handleCancelEscrow = async () => {
    const reason = prompt('Please provide a reason for cancelling this booking:')

    if (!reason) {
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await cancelEscrowAction(bookingId, reason)

    if ('error' in result) {
      setError(result.error)
      setIsLoading(false)
    } else {
      onStatusChange?.()
      router.refresh()
    }
  }

  const handleViewDetails = () => {
    router.push(`/dashboard/bookings/${bookingId}`)
  }

  // Don't show nudge for completed states unless there's an error
  if ((escrowStatus === 'captured' || escrowStatus === 'cancelled' || escrowStatus === 'refunded') && !error) {
    return null
  }

  const getNudgeContent = () => {
    if (escrowStatus === 'authorized') {
      if (userRole === 'renter') {
        return {
          icon: '💳',
          title: 'Payment Authorized',
          description: `Your payment of ${formatCurrency(amount)} is held securely. It will be charged when the host confirms your move-in.`,
          variant: 'authorized' as const,
          actions: (
            <>
              <button
                onClick={handleCancelEscrow}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.loading} /> : 'Cancel Booking'}
              </button>
              <button
                onClick={handleViewDetails}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                View Details
              </button>
            </>
          ),
        }
      } else {
        // host
        return {
          icon: '🔔',
          title: 'Action Required: Confirm Move-In',
          description: `Release ${formatCurrency(hostAmount || amount - (platformFeeAmount || 0))} to your account by confirming the renter has moved in. Platform fee: ${formatCurrency(platformFeeAmount || 0)}.`,
          variant: 'pending' as const,
          actions: (
            <>
              <button
                onClick={handleCancelEscrow}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.loading} /> : 'Cancel'}
              </button>
              <button
                onClick={handleReleaseEscrow}
                className={`${styles.button} ${styles.primaryButton}`}
                disabled={isLoading}
              >
                {isLoading ? <span className={styles.loading} /> : 'Confirm Move-In'}
              </button>
            </>
          ),
        }
      }
    }

    // Fallback
    return {
      icon: 'ℹ️',
      title: 'Escrow Payment',
      description: `Status: ${escrowStatus}`,
      variant: escrowStatus,
      actions: (
        <button
          onClick={handleViewDetails}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          View Details
        </button>
      ),
    }
  }

  const content = getNudgeContent()

  return (
    <div className={`${styles.nudgeBanner} ${styles[content.variant]}`}>
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          {content.icon}
        </div>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{content.title}</h3>
          <p className={styles.description}>{content.description}</p>
          {error && (
            <p className={styles.description} style={{ color: '#dc2626', marginTop: '0.25rem' }}>
              Error: {error}
            </p>
          )}
        </div>
      </div>
      <div className={styles.actions}>{content.actions}</div>
    </div>
  )
}
