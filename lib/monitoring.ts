/**
 * Server-side Monitoring Utilities
 *
 * Provides monitoring for server actions, API routes, and database operations
 */

// Metric types
type MetricType = 'counter' | 'histogram' | 'gauge'

interface Metric {
  name: string
  type: MetricType
  value: number
  labels?: Record<string, string>
  timestamp: number
}

// In-memory metrics store (for demo; use proper metrics service in production)
const metrics: Metric[] = []
const MAX_METRICS = 1000

/**
 * Record a counter metric
 */
export function incrementCounter(name: string, labels?: Record<string, string>, value = 1) {
  recordMetric(name, 'counter', value, labels)
}

/**
 * Record a histogram/timing metric
 */
export function recordHistogram(name: string, value: number, labels?: Record<string, string>) {
  recordMetric(name, 'histogram', value, labels)
}

/**
 * Record a gauge metric
 */
export function setGauge(name: string, value: number, labels?: Record<string, string>) {
  recordMetric(name, 'gauge', value, labels)
}

function recordMetric(
  name: string,
  type: MetricType,
  value: number,
  labels?: Record<string, string>
) {
  const metric: Metric = {
    name,
    type,
    value,
    labels,
    timestamp: Date.now(),
  }

  metrics.push(metric)

  // Keep metrics bounded
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }

  // In production, send to metrics service
  if (process.env.METRICS_ENDPOINT) {
    // Could batch and send metrics periodically
    // fetch(process.env.METRICS_ENDPOINT, { method: 'POST', body: JSON.stringify(metric) })
  }
}

/**
 * Get metrics (for debugging/health checks)
 */
export function getMetrics(filter?: { name?: string; since?: number }) {
  let filtered = metrics

  if (filter?.name) {
    filtered = filtered.filter((m) => m.name === filter.name)
  }

  if (filter && filter.since !== undefined) {
    filtered = filtered.filter((m) => m.timestamp >= filter.since!)
  }

  return filtered
}

/**
 * Time an async function and record the duration
 */
export async function timed<T>(
  metricName: string,
  fn: () => Promise<T>,
  labels?: Record<string, string>
): Promise<T> {
  const start = performance.now()
  let success = true

  try {
    const result = await fn()
    return result
  } catch (error) {
    success = false
    throw error
  } finally {
    const duration = performance.now() - start
    recordHistogram(`${metricName}_duration_ms`, duration, {
      ...labels,
      success: String(success),
    })
    incrementCounter(`${metricName}_total`, { ...labels, success: String(success) })
  }
}

/**
 * Wrapper for server actions with monitoring
 */
export function withMonitoring<T extends (...args: unknown[]) => Promise<unknown>>(
  actionName: string,
  action: T
): T {
  return (async (...args: unknown[]) => {
    return timed(
      `server_action`,
      () => action(...args),
      { action: actionName }
    )
  }) as T
}

/**
 * Database query monitoring wrapper
 */
export function withDbMonitoring<T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<T> {
  return timed('database_query', fn, { operation: operationName })
}

/**
 * Health check utilities
 */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    name: string
    status: 'pass' | 'fail'
    message?: string
    duration?: number
  }[]
  timestamp: string
}

export async function performHealthCheck(
  checks: {
    name: string
    check: () => Promise<boolean>
  }[]
): Promise<HealthCheckResult> {
  const results = await Promise.all(
    checks.map(async ({ name, check }) => {
      const start = performance.now()
      try {
        const passed = await check()
        return {
          name,
          status: passed ? 'pass' : 'fail',
          duration: performance.now() - start,
        } as const
      } catch (error) {
        return {
          name,
          status: 'fail' as const,
          message: error instanceof Error ? error.message : 'Unknown error',
          duration: performance.now() - start,
        }
      }
    })
  )

  const failedCount = results.filter((r) => r.status === 'fail').length
  const status = failedCount === 0 ? 'healthy' : failedCount < results.length / 2 ? 'degraded' : 'unhealthy'

  return {
    status,
    checks: results,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Log structured data for log aggregation
 */
export function log(
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
) {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  }

  switch (level) {
    case 'debug':
      console.debug(JSON.stringify(logEntry))
      break
    case 'info':
      console.info(JSON.stringify(logEntry))
      break
    case 'warn':
      console.warn(JSON.stringify(logEntry))
      break
    case 'error':
      console.error(JSON.stringify(logEntry))
      break
  }
}
