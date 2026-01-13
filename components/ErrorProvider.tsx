'use client'

import { useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { initErrorTracking, captureError, setUserContext } from '@/lib/error-tracking'

interface ErrorProviderContextValue {
  reportError: (error: Error | string, context?: Record<string, unknown>) => void
  setUser: (user: { id: string; email?: string; role?: string } | null) => void
}

const ErrorProviderContext = createContext<ErrorProviderContextValue | null>(null)

export function useErrorProvider() {
  const context = useContext(ErrorProviderContext)
  if (!context) {
    throw new Error('useErrorProvider must be used within ErrorProvider')
  }
  return context
}

interface ErrorProviderProps {
  children: ReactNode
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  // Initialize error tracking on mount
  useEffect(() => {
    initErrorTracking()

    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      captureError(event.error || event.message, {
        action: 'uncaught-error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    }

    // Global handler for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      captureError(
        event.reason instanceof Error ? event.reason : String(event.reason),
        { action: 'unhandled-rejection' },
        'error'
      )
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const reportError = useCallback(
    (error: Error | string, context?: Record<string, unknown>) => {
      captureError(error, { metadata: context })
    },
    []
  )

  const setUser = useCallback(
    (user: { id: string; email?: string; role?: string } | null) => {
      setUserContext(user)
    },
    []
  )

  const handleBoundaryError = useCallback((error: Error) => {
    captureError(error, { action: 'error-boundary' }, 'fatal')
  }, [])

  return (
    <ErrorProviderContext.Provider value={{ reportError, setUser }}>
      <ErrorBoundary onError={handleBoundaryError}>{children}</ErrorBoundary>
    </ErrorProviderContext.Provider>
  )
}
