'use client'

import { useState, useEffect } from 'react'
import {
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
  type NotificationPreferences,
} from '@/actions/notifications'
import { Button } from './Button'
import { useToast } from './Toast'
import styles from './NotificationPreferences.module.css'

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    setLoading(true)
    const result = await getNotificationPreferencesAction()
    if (result.success && result.preferences) {
      setPreferences(result.preferences)
    } else {
      toast.error(result.error || 'Failed to load preferences')
    }
    setLoading(false)
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!preferences) return
    setPreferences({ ...preferences, [key]: !preferences[key] })
  }

  const handleSave = async () => {
    if (!preferences) return

    setSaving(true)
    const result = await updateNotificationPreferencesAction(preferences)
    if (result.success) {
      toast.success('Preferences saved successfully')
    } else {
      toast.error(result.error || 'Failed to save preferences')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading preferences...</p>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className={styles.error}>
        <p>Failed to load notification preferences</p>
        <Button onClick={fetchPreferences}>Retry</Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>Email Notifications</h3>
        <p className={styles.description}>
          Choose which notifications you want to receive via email.
        </p>

        <div className={styles.preferences}>
          <PreferenceToggle
            label="Booking Notifications"
            description="Receive emails when bookings are confirmed, cancelled, or completed"
            checked={preferences.emailBookings}
            onChange={() => handleToggle('emailBookings')}
          />

          <PreferenceToggle
            label="Message Notifications"
            description="Receive emails when you get new messages"
            checked={preferences.emailMessages}
            onChange={() => handleToggle('emailMessages')}
          />

          <PreferenceToggle
            label="Review Notifications"
            description="Receive emails when you receive new reviews"
            checked={preferences.emailReviews}
            onChange={() => handleToggle('emailReviews')}
          />

          <PreferenceToggle
            label="Marketing Emails"
            description="Receive promotional emails and product updates"
            checked={preferences.emailMarketing}
            onChange={() => handleToggle('emailMarketing')}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3>In-App Notifications</h3>
        <p className={styles.description}>
          Choose which notifications you want to see in the app.
        </p>

        <div className={styles.preferences}>
          <PreferenceToggle
            label="Booking Notifications"
            description="Get notified in the app about booking updates"
            checked={preferences.inAppBookings}
            onChange={() => handleToggle('inAppBookings')}
          />

          <PreferenceToggle
            label="Message Notifications"
            description="Get notified in the app when you receive messages"
            checked={preferences.inAppMessages}
            onChange={() => handleToggle('inAppMessages')}
          />

          <PreferenceToggle
            label="Review Notifications"
            description="Get notified in the app when you receive reviews"
            checked={preferences.inAppReviews}
            onChange={() => handleToggle('inAppReviews')}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}

interface PreferenceToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function PreferenceToggle({ label, description, checked, onChange }: PreferenceToggleProps) {
  return (
    <div className={styles.preference}>
      <div className={styles.info}>
        <label className={styles.label}>{label}</label>
        <p className={styles.detail}>{description}</p>
      </div>
      <button
        className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
        onClick={onChange}
        role="switch"
        aria-checked={checked}
      >
        <span className={styles.toggleSlider} />
      </button>
    </div>
  )
}
