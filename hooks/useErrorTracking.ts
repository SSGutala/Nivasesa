'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  captureError,
  captureMessage,
  addBreadcrumb,
  setUserContext,
  type ErrorContext,
  type ErrorSeverity,
} from '@/lib/error-tracking'

interface UseErrorTrackingOptions {
  user?: { id: string; email?: string; role?: string } | null
}

/**
 * Hook for error tracking in React components
 */
export function useErrorTracking(options?: UseErrorTrackingOptions) {
  const pathname = usePathname()

  // Set user context when user changes
  useEffect(() => {
    if (options?.user !== undefined) {
      setUserContext(options.user)
    }
  }, [options?.user])

  // Add breadcrumb on route change
  useEffect(() => {
    addBreadcrumb('navigation', `Navigated to ${pathname}`, { pathname })
  }, [pathname])

  // Track error
  const trackError = useCallback(
    (error: Error | string, context?: Partial<ErrorContext>, severity?: ErrorSeverity) => {
      captureError(error, { route: pathname, ...context }, severity)
    },
    [pathname]
  )

  // Track message
  const trackMessage = useCallback(
    (message: string, context?: Partial<ErrorContext>, severity?: ErrorSeverity) => {
      captureMessage(message, { route: pathname, ...context }, severity)
    },
    [pathname]
  )

  // Track action (for user interactions)
  const trackAction = useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      addBreadcrumb('user-action', action, metadata)
    },
    []
  )

  return {
    trackError,
    trackMessage,
    trackAction,
    addBreadcrumb,
  }
}

/**
 * Hook for tracking form errors
 */
export function useFormErrorTracking(formName: string) {
  const { trackError, trackAction } = useErrorTracking()

  const trackFormError = useCallback(
    (fieldName: string, errorMessage: string) => {
      trackError(`Form validation error: ${errorMessage}`, {
        action: 'form-validation',
        metadata: { formName, fieldName },
      })
    },
    [formName, trackError]
  )

  const trackFormSubmit = useCallback(
    (success: boolean, metadata?: Record<string, unknown>) => {
      trackAction(`Form ${success ? 'submitted' : 'failed'}: ${formName}`, metadata)
    },
    [formName, trackAction]
  )

  return {
    trackFormError,
    trackFormSubmit,
  }
}

/**
 * Hook for tracking API errors
 */
export function useApiErrorTracking() {
  const { trackError } = useErrorTracking()

  const trackApiError = useCallback(
    (
      endpoint: string,
      error: Error | string,
      statusCode?: number,
      metadata?: Record<string, unknown>
    ) => {
      trackError(error, {
        action: 'api-call',
        metadata: { endpoint, statusCode, ...metadata },
      })
    },
    [trackError]
  )

  return { trackApiError }
}
