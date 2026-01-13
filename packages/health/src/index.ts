/**
 * @niv/health - Health check service for monitoring
 *
 * Provides health check functions for database, memory, and disk space monitoring.
 */

// Export types
export type { HealthCheck, HealthStatus, HealthReport } from './types';

// Export check functions
export {
  checkDatabase,
  checkMemory,
  checkDiskSpace,
  getHealthStatus,
} from './checks';
