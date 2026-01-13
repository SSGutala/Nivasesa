/**
 * Health check status types
 */
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

/**
 * Individual health check result
 */
export interface HealthCheck {
  name: string;
  status: HealthStatus;
  message?: string;
  latency?: number;
}

/**
 * Aggregated health report
 */
export interface HealthReport {
  status: HealthStatus;
  checks: HealthCheck[];
  timestamp: Date;
}
