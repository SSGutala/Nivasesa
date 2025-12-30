'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmailAction } from '@/actions/email-verification'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    async function verify() {
      const result = await verifyEmailAction(token!)
      if (result.success) {
        setStatus('success')
        setMessage(result.message || 'Email verified successfully')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Verification failed')
      }
    }

    verify()
  }, [token, router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {status === 'loading' && (
          <>
            <Loader2 size={64} style={{ margin: '0 auto 20px', animation: 'spin 1s linear infinite', color: '#007bff' }} />
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Verifying Email...</h1>
            <p style={{ color: '#666' }}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={64} style={{ margin: '0 auto 20px', color: '#28a745' }} />
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Email Verified!</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
            <p style={{ fontSize: '14px', color: '#999' }}>Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={64} style={{ margin: '0 auto 20px', color: '#dc3545' }} />
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Verification Failed</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>{message}</p>
            <a
              href="/login"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
              }}
            >
              Go to Login
            </a>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
