import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { performHealthCheck, type HealthCheckResult } from '@/lib/monitoring'

export async function GET() {
  const result: HealthCheckResult = await performHealthCheck([
    {
      name: 'database',
      check: async () => {
        // Try a simple query
        await prisma.$queryRaw`SELECT 1`
        return true
      },
    },
    {
      name: 'memory',
      check: async () => {
        // Check memory usage (fail if > 90%)
        const usage = process.memoryUsage()
        const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100
        return heapUsedPercent < 90
      },
    },
  ])

  // Add version info
  const response = {
    ...result,
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    environment: process.env.NODE_ENV,
  }

  const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503

  return NextResponse.json(response, { status: statusCode })
}

// HEAD request for simple uptime monitoring
export async function HEAD() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return new NextResponse(null, { status: 200 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
