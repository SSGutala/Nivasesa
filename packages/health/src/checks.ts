import type { HealthCheck, HealthStatus, HealthReport } from './types';

/**
 * Check database connection health
 * @param prisma - Prisma client instance
 * @returns Health check result for database
 */
export async function checkDatabase(prisma: any): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      name: 'database',
      status: latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy',
      message: latency < 100 ? 'Database connection healthy' : 'Database connection slow',
      latency,
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
      latency: Date.now() - start,
    };
  }
}

/**
 * Check memory usage
 * @returns Health check result for memory
 */
export function checkMemory(): HealthCheck {
  const start = Date.now();
  try {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;

    let status: HealthStatus = 'healthy';
    let message = `Memory usage: ${heapUsedMB.toFixed(2)}MB / ${heapTotalMB.toFixed(2)}MB (${usagePercent.toFixed(1)}%)`;

    if (usagePercent > 90) {
      status = 'unhealthy';
      message = `Critical memory usage: ${usagePercent.toFixed(1)}%`;
    } else if (usagePercent > 75) {
      status = 'degraded';
      message = `High memory usage: ${usagePercent.toFixed(1)}%`;
    }

    return {
      name: 'memory',
      status,
      message,
      latency: Date.now() - start,
    };
  } catch (error) {
    return {
      name: 'memory',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Memory check failed',
      latency: Date.now() - start,
    };
  }
}

/**
 * Check disk space (optional - requires additional dependencies)
 * Returns a basic check that always passes for now
 * @returns Health check result for disk space
 */
export function checkDiskSpace(): HealthCheck {
  const start = Date.now();

  // Basic implementation - always returns healthy
  // For production use, consider using 'check-disk-space' npm package
  return {
    name: 'disk',
    status: 'healthy',
    message: 'Disk space check not implemented',
    latency: Date.now() - start,
  };
}

/**
 * Aggregate all health checks into a single report
 * @param checks - Array of individual health checks
 * @returns Aggregated health report
 */
export function getHealthStatus(checks: HealthCheck[]): HealthReport {
  let overallStatus: HealthStatus = 'healthy';

  // If any check is unhealthy, overall is unhealthy
  // If any check is degraded (and none unhealthy), overall is degraded
  for (const check of checks) {
    if (check.status === 'unhealthy') {
      overallStatus = 'unhealthy';
      break;
    } else if (check.status === 'degraded' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }
  }

  return {
    status: overallStatus,
    checks,
    timestamp: new Date(),
  };
}
