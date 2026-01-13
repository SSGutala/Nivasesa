'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { validateResetTokenAction, resetPasswordAction } from '@/actions/password-reset'
import styles from '../find-realtor/form.module.css'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [tokenStatus, setTokenStatus] = useState<'validating' | 'valid' | 'invalid'>('validating')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid')
      return
    }

    async function validateToken() {
      const result = await validateResetTokenAction(token!)
      setTokenStatus(result.valid ? 'valid' : 'invalid')
    }

    validateToken()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setStatus('error')
      setMessage('Password must be at least 8 characters')
      return
    }

    setStatus('loading')

    const result = await resetPasswordAction(token!, password)

    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Password reset successfully')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      setStatus('error')
      setMessage(result.error || 'Something went wrong')
    }
  }

  // Token validation in progress
  if (tokenStatus === 'validating') {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#007bff', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Validating Reset Link...</h1>
          <p style={{ color: '#666' }}>Please wait.</p>
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Invalid or expired token
  if (tokenStatus === 'invalid') {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <XCircle size={64} style={{ color: '#dc3545', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invalid or Expired Link</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  // Password reset successful
  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CheckCircle size={64} style={{ color: '#28a745', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Password Reset!</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
          <p style={{ fontSize: '14px', color: '#999' }}>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Password reset form
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {status === 'error' && message && (
            <div style={{ color: '#dc3545', textAlign: 'center', fontSize: '0.9rem', marginBottom: '20px' }}>
              {message}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#999',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#999',
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === 'loading'}
            style={{ width: '100%' }}
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
