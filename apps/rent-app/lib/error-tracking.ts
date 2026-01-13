/**
 * Error Tracking and Monitoring Utilities
 *
 * This module provides error tracking capabilities that can be configured
 * to use various monitoring services (Sentry, LogRocket, etc.)
 */

// Error severity levels
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'

// Error context for additional debugging info
export interface ErrorContext {
  userId?: string
  sessionId?: string
  route?: string
  action?: string
  metadata?: Record<string, unknown>
}

// Error tracking configuration
interface ErrorTrackingConfig {
  enabled: boolean
  dsn?: string
  environment: string
  release?: string
  debug: boolean
}

// Default configuration
const config: ErrorTrackingConfig = {
  enabled: process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  debug: process.env.NODE_ENV === 'development',
}

/**
 * Initialize error tracking (call this in app initialization)
 */
export function initErrorTracking() {
  if (!config.enabled) {
    console.log('[ErrorTracking] Disabled in current environment')
    return
  }

  // If Sentry DSN is configured, initialize Sentry
  // This is a placeholder - actual Sentry initialization would go here
  // import * as Sentry from '@sentry/nextjs'
  // Sentry.init({ dsn: config.dsn, environment: config.environment })

  console.log('[ErrorTracking] Initialized')
}

/**
 * Capture an error with optional context
 */
export function captureError(
  error: Error | string,
  context?: ErrorContext,
  severity: ErrorSeverity = 'error'
) {
  const errorObj = typeof error === 'string' ? new Error(error) : error
  const timestamp = new Date().toISOString()

  // Log to console in development
  if (config.debug) {
    console.group(`[${severity.toUpperCase()}] ${timestamp}`)
    console.error(errorObj)
    if (context) {
      console.log('Context:', context)
    }
    console.groupEnd()
  }

  // In production, send to error tracking service
  if (config.enabled) {
    // Placeholder for Sentry integration
    // Sentry.captureException(errorObj, {
    //   level: severity,
    //   extra: context,
    // })

    // For now, log structured error that can be picked up by logging services
    const errorLog = {
      timestamp,
      severity,
      message: errorObj.message,
      stack: errorObj.stack,
      ...context,
    }

    // This could be sent to a logging endpoint
    if (typeof window !== 'undefined') {
      // Client-side: could send to API endpoint
      console.error('[ErrorTracking]', JSON.stringify(errorLog))
    } else {
      // Server-side: log to stdout for log aggregation
      console.error('[ErrorTracking]', JSON.stringify(errorLog))
    }
  }
}

/**
 * Capture a message (for non-error events)
 */
export function captureMessage(
  message: string,
  context?: ErrorContext,
  severity: ErrorSeverity = 'info'
) {
  const timestamp = new Date().toISOString()

  if (config.debug) {
    console.log(`[${severity.toUpperCase()}] ${timestamp}: ${message}`, context || '')
  }

  if (config.enabled) {
    // Placeholder for Sentry integration
    // Sentry.captureMessage(message, { level: severity, extra: context })
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; email?: string; role?: string } | null) {
  if (!config.enabled) return

  // Placeholder for Sentry integration
  // Sentry.setUser(user ? { id: user.id, email: user.email } : null)

  if (config.debug && user) {
    console.log('[ErrorTracking] User context set:', user.id)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>
) {
  if (!config.enabled) return

  // Placeholder for Sentry integration
  // Sentry.addBreadcrumb({ category, message, data })

  if (config.debug) {
    console.log(`[Breadcrumb] ${category}: ${message}`, data || '')
  }
}

/**
 * Create a wrapped function that captures errors
 */
export function withErrorCapture<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context?: Omit<ErrorContext, 'action'>
): T {
  return ((...args: unknown[]) => {
    try {
      const result = fn(...args)
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureError(error, { ...context, action: fn.name })
          throw error
        })
      }
      return result
    } catch (error) {
      captureError(error as Error, { ...context, action: fn.name })
      throw error
    }
  }) as T
}

/**
 * Performance monitoring
 */
export function startTransaction(name: string, op: string) {
  const startTime = performance.now()

  return {
    finish: () => {
      const duration = performance.now() - startTime
      if (config.debug) {
        console.log(`[Performance] ${op}/${name}: ${duration.toFixed(2)}ms`)
      }
      // Placeholder for Sentry performance monitoring
      // transaction.finish()
    },
  }
}

/**
 * Measure async operation
 */
export async function measureAsync<T>(
  name: string,
  op: string,
  fn: () => Promise<T>
): Promise<T> {
  const transaction = startTransaction(name, op)
  try {
    const result = await fn()
    return result
  } finally {
    transaction.finish()
  }
}
