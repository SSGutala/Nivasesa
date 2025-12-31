/**
 * Security Middleware for GraphQL Gateway
 *
 * Implements cybersecurity best practices:
 * - Rate limiting per IP
 * - Query depth limiting
 * - Query complexity analysis
 * - Request size limiting
 * - Error masking in production
 */

import { GraphQLError } from 'graphql';
import type { ApolloServerPlugin } from '@apollo/server';
import {
  getComplexity,
  simpleEstimator,
  fieldExtensionsEstimator,
} from 'graphql-query-complexity';

// Rate limiting store (in-memory for simplicity, use Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const MAX_QUERY_DEPTH = parseInt(process.env.QUERY_MAX_DEPTH || '10', 10);
const MAX_QUERY_COMPLEXITY = parseInt(process.env.QUERY_MAX_COMPLEXITY || '1000', 10);
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUEST_SIZE_BYTES = parseInt(process.env.MAX_REQUEST_SIZE_BYTES || '100000', 10); // 100KB

/**
 * Rate Limiter
 * Tracks requests per IP address and enforces limits
 */
export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS) {
    this.store = rateLimitStore;
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  checkLimit(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetTime) {
      // New window
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(ip: string): number {
    const entry = this.store.get(ip);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(ip: string): number {
    const entry = this.store.get(ip);
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + this.windowMs;
    }
    return entry.resetTime;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(ip);
      }
    }
  }
}

/**
 * Query Depth Limiter
 * Prevents deeply nested queries that could cause performance issues
 */
export function getQueryDepth(
  selections: any,
  depth = 0,
  maxDepth = MAX_QUERY_DEPTH
): number {
  if (!selections || depth > maxDepth) {
    return depth;
  }

  let currentDepth = depth;

  for (const selection of selections) {
    if (selection.selectionSet) {
      const selectionDepth = getQueryDepth(
        selection.selectionSet.selections,
        depth + 1,
        maxDepth
      );
      currentDepth = Math.max(currentDepth, selectionDepth);
    }
  }

  return currentDepth;
}

/**
 * Validate query depth
 */
export function validateQueryDepth(query: any, maxDepth = MAX_QUERY_DEPTH): void {
  if (!query || !query.definitions) {
    return;
  }

  for (const definition of query.definitions) {
    if (definition.kind === 'OperationDefinition' && definition.selectionSet) {
      const depth = getQueryDepth(definition.selectionSet.selections, 0, maxDepth);

      if (depth > maxDepth) {
        throw new GraphQLError(
          `Query depth of ${depth} exceeds maximum allowed depth of ${maxDepth}`,
          {
            extensions: {
              code: 'QUERY_DEPTH_LIMIT_EXCEEDED',
              maxDepth,
              actualDepth: depth,
            },
          }
        );
      }
    }
  }
}


/**
 * Error Masking Plugin
 * Hides internal error details in production
 */
export function createErrorMaskingPlugin(): ApolloServerPlugin {
  return {
    async requestDidStart() {
      return {
        async didEncounterErrors({ errors }) {
          errors.forEach((error) => {
            // Log full error details server-side
            if (isDevelopment) {
              console.error('GraphQL Error:', error);
            } else {
              console.error('GraphQL Error:', {
                message: error.message,
                path: error.path,
                code: error.extensions?.code,
              });
            }

            // Mask sensitive error details in production
            if (!isDevelopment && !error.extensions?.code) {
              error.message = 'An internal server error occurred';
              delete error.extensions?.stacktrace;
              delete error.extensions?.exception;
            }
          });
        },
      };
    },
  };
}

/**
 * Request Size Limiter Plugin
 * Prevents excessively large requests
 */
export function createRequestSizeLimitPlugin(
  maxSizeBytes = MAX_REQUEST_SIZE_BYTES
): ApolloServerPlugin {
  return {
    async requestDidStart({ request }) {
      const requestSize = JSON.stringify(request).length;

      if (requestSize > maxSizeBytes) {
        throw new GraphQLError(
          `Request size of ${requestSize} bytes exceeds maximum allowed size of ${maxSizeBytes} bytes`,
          {
            extensions: {
              code: 'REQUEST_SIZE_LIMIT_EXCEEDED',
              maxSize: maxSizeBytes,
              actualSize: requestSize,
            },
          }
        );
      }

      return {};
    },
  };
}

/**
 * Security Headers
 * Apply security-related HTTP headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Clickjacking protection
    'X-Frame-Options': 'DENY',

    // Strict Transport Security (HTTPS only)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // Content Security Policy
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

    // Remove server fingerprinting
    'X-Powered-By': '',
  };
}

/**
 * CORS Configuration
 * Configure allowed origins based on environment
 */
export function getCorsOptions(): {
  origin: string[] | boolean;
  credentials: boolean;
} {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin: isDevelopment ? true : allowedOrigins,
    credentials: true,
  };
}

/**
 * Validate and sanitize IP address
 */
export function getClientIp(req: any): string {
  // Check for forwarded IP (from proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map((ip: string) => ip.trim());
    return ips[0];
  }

  // Check other common headers
  return (
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Rate Limiting Plugin
 * Enforces rate limits per IP address
 */
export function createRateLimitPlugin(rateLimiter: RateLimiter): ApolloServerPlugin {
  return {
    async requestDidStart({ request, contextValue }) {
      const ip = (contextValue as any).ip || 'unknown';

      if (!rateLimiter.checkLimit(ip)) {
        const resetTime = rateLimiter.getResetTime(ip);
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

        throw new GraphQLError('Too many requests, please try again later', {
          extensions: {
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter,
            resetTime: new Date(resetTime).toISOString(),
          },
        });
      }

      return {
        async willSendResponse({ response }) {
          // Add rate limit headers to response
          if (response.http) {
            response.http.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
            response.http.headers.set(
              'X-RateLimit-Remaining',
              String(rateLimiter.getRemainingRequests(ip))
            );
            response.http.headers.set(
              'X-RateLimit-Reset',
              String(Math.ceil(rateLimiter.getResetTime(ip) / 1000))
            );
          }
        },
      };
    },
  };
}

/**
 * Query Complexity Plugin
 * Analyzes and limits query complexity
 */
export function createComplexityPlugin(
  maxComplexity = MAX_QUERY_COMPLEXITY
): ApolloServerPlugin {
  return {
    async requestDidStart({ request, schema, contextValue }) {
      return {
        async didResolveOperation({ operation, document }) {
          if (!operation) {
            return;
          }

          try {
            const complexity = getComplexity({
              schema,
              query: document,
              operationName: operation.name?.value,
              variables: request.variables || {},
              estimators: [
                simpleEstimator({ defaultComplexity: 1 }),
                fieldExtensionsEstimator(),
              ],
            });

            if (complexity > maxComplexity) {
              throw new GraphQLError(
                `Query complexity of ${complexity} exceeds maximum allowed complexity of ${maxComplexity}`,
                {
                  extensions: {
                    code: 'QUERY_COMPLEXITY_LIMIT_EXCEEDED',
                    maxComplexity,
                    actualComplexity: complexity,
                  },
                }
              );
            }

            if (isDevelopment) {
              console.log(`Query complexity: ${complexity}/${maxComplexity}`);
            }
          } catch (error) {
            if (error instanceof GraphQLError) {
              throw error;
            }
            // If complexity calculation fails, log but don't block the request
            console.error('Failed to calculate query complexity:', error);
          }
        },
      };
    },
  };
}

/**
 * Introspection Control Plugin
 * Disables introspection in production
 */
export function createIntrospectionPlugin(): ApolloServerPlugin {
  return {
    async requestDidStart({ request }) {
      if (!isDevelopment && request.query?.includes('__schema')) {
        throw new GraphQLError('Introspection is disabled in production', {
          extensions: {
            code: 'INTROSPECTION_DISABLED',
          },
        });
      }
      return {};
    },
  };
}
