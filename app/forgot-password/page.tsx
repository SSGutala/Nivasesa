'use client'

import { useState } from 'react'
import { requestPasswordResetAction } from '@/actions/password-reset'
import styles from '../find-realtor/form.module.css'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const result = await requestPasswordResetAction(email)

    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Check your email for the reset link.')
    } else {
      setStatus('error')
      setMessage(result.error || 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircle size={64} style={{ color: '#28a745', marginBottom: '20px' }} />
            <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Check Your Email</h1>
            <p style={{ color: '#666', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>
              {message}
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '15px',
              }}
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {status === 'error' && message && (
            <div style={{ color: '#dc3545', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>
              {message}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'loading'}
            style={{ width: '100%' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '15px',
              }}
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
