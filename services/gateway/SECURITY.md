# GraphQL Gateway Security Features

## Overview

The Nivasesa GraphQL Gateway implements comprehensive cybersecurity best practices to protect against common attack vectors including DDoS, query complexity attacks, and data exposure.

## Security Features

### 1. Rate Limiting

**Purpose:** Prevent DDoS attacks and API abuse by limiting requests per IP address.

**Configuration:**
```env
RATE_LIMIT_MAX=100              # Max requests per window
RATE_LIMIT_WINDOW_MS=60000      # Time window in ms (1 minute)
```

**Behavior:**
- Tracks requests per IP address using in-memory store
- Returns `RATE_LIMIT_EXCEEDED` error when limit is reached
- Includes rate limit headers in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when window resets

**Production Recommendation:** Use Redis-backed store for multi-instance deployments.

### 2. Query Depth Limiting

**Purpose:** Prevent deeply nested queries that could cause performance degradation.

**Configuration:**
```env
QUERY_MAX_DEPTH=10
```

**Example Attack (Prevented):**
```graphql
# This query with depth > 10 will be rejected
query DeepNesting {
  user {
    friends {
      friends {
        friends {
          # ... 10+ levels deep
        }
      }
    }
  }
}
```

**Error:** `QUERY_DEPTH_LIMIT_EXCEEDED`

### 3. Query Complexity Analysis

**Purpose:** Prevent expensive queries that could consume excessive server resources.

**Configuration:**
```env
QUERY_MAX_COMPLEXITY=1000
```

**How it works:**
- Each field has a complexity score (default: 1)
- List fields and connections have higher scores
- Total query complexity is calculated before execution
- Queries exceeding the limit are rejected

**Example:**
```graphql
# High complexity query
query ExpensiveQuery {
  users(limit: 100) {        # 100 complexity
    posts(limit: 50) {       # 50 x 100 = 5000 complexity
      comments(limit: 20) {  # 20 x 5000 = 100000 complexity (REJECTED)
        author {
          name
        }
      }
    }
  }
}
```

**Error:** `QUERY_COMPLEXITY_LIMIT_EXCEEDED`

### 4. Request Size Limiting

**Purpose:** Prevent large payload attacks and file upload abuse.

**Configuration:**
```env
MAX_REQUEST_SIZE_BYTES=100000  # 100KB
```

**Behavior:**
- Validates request size before processing
- Rejects oversized requests with `REQUEST_SIZE_LIMIT_EXCEEDED`

### 5. CORS Protection

**Purpose:** Control which origins can access the API.

**Configuration:**
```env
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Production
ALLOWED_ORIGINS=https://nivasesa.com,https://www.nivasesa.com
```

**Behavior:**
- Development: Accepts all origins (for easier testing)
- Production: Strict whitelist enforcement

### 6. Security Headers

**Purpose:** Protect against XSS, clickjacking, and other browser-based attacks.

**Headers Applied:**
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enable XSS filtering
- `X-Frame-Options: DENY` - Prevent clickjacking
- `Strict-Transport-Security` - Enforce HTTPS
- `Content-Security-Policy` - Restrict resource loading
- `Referrer-Policy` - Control referrer information
- `Permissions-Policy` - Disable unnecessary browser features

### 7. Introspection Control

**Purpose:** Hide schema details in production to prevent reconnaissance attacks.

**Configuration:**
```env
NODE_ENV=production  # Disables introspection
```

**Behavior:**
- Development: Introspection queries allowed (for GraphQL Playground, etc.)
- Production: Introspection queries return `INTROSPECTION_DISABLED`

**Example Blocked Query:**
```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
    }
  }
}
```

### 8. Error Masking

**Purpose:** Prevent sensitive information leakage through error messages.

**Configuration:**
```env
NODE_ENV=production  # Enables error masking
```

**Behavior:**
- Development: Full error details including stack traces
- Production: Generic error messages, internal details logged server-side only

**Example:**
```javascript
// Development error response
{
  "errors": [{
    "message": "Cannot read property 'id' of null",
    "path": ["user"],
    "locations": [{ "line": 2, "column": 3 }],
    "extensions": {
      "code": "INTERNAL_SERVER_ERROR",
      "stacktrace": ["at getUserById (/app/resolvers.js:42:15)", ...]
    }
  }]
}

// Production error response (masked)
{
  "errors": [{
    "message": "An internal server error occurred",
    "path": ["user"],
    "locations": [{ "line": 2, "column": 3 }]
  }]
}
```

## Environment-Based Behavior

### Development Mode
```env
NODE_ENV=development
```
- Rate limiting: Enabled but lenient
- Introspection: Enabled
- CORS: Permissive (all origins)
- Error details: Full stack traces
- Complexity logging: Console output for debugging

### Production Mode
```env
NODE_ENV=production
```
- Rate limiting: Strict enforcement
- Introspection: Disabled
- CORS: Strict whitelist
- Error details: Masked
- Complexity logging: Errors only

## Monitoring and Alerts

### Rate Limit Monitoring

Check rate limit headers in responses:
```bash
curl -I http://localhost:4000/graphql \
  -H "Content-Type: application/json"

# Response headers:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 95
# X-RateLimit-Reset: 1735689660
```

### Query Complexity Monitoring

In development mode, complexity is logged to console:
```
Query complexity: 245/1000
```

### Error Monitoring

All errors are logged server-side with full details:
```javascript
console.error('GraphQL Error:', {
  message: error.message,
  path: error.path,
  code: error.extensions?.code,
  // Full stack trace in development
});
```

## Testing Security Features

### Test Rate Limiting
```bash
# Send 101 requests quickly
for i in {1..101}; do
  curl -X POST http://localhost:4000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health { status } }"}'
done

# 101st request should return:
# {
#   "errors": [{
#     "message": "Too many requests, please try again later",
#     "extensions": {
#       "code": "RATE_LIMIT_EXCEEDED",
#       "retryAfter": 60
#     }
#   }]
# }
```

### Test Query Depth Limit
```graphql
# This will fail if depth > 10
query DeepQuery {
  user {
    friends { # depth 1
      friends { # depth 2
        friends { # depth 3
          # ... continue to depth 11
        }
      }
    }
  }
}

# Response:
# {
#   "errors": [{
#     "message": "Query depth of 11 exceeds maximum allowed depth of 10",
#     "extensions": {
#       "code": "QUERY_DEPTH_LIMIT_EXCEEDED"
#     }
#   }]
# }
```

### Test Request Size Limit
```bash
# Create a very large query (>100KB)
query=$(printf '{"query":"{ health { status } }","variables":{"data":"%0.s-"' {1..100000})
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d "$query"

# Response:
# {
#   "errors": [{
#     "message": "Request size exceeds maximum allowed size",
#     "extensions": {
#       "code": "REQUEST_SIZE_LIMIT_EXCEEDED"
#     }
#   }]
# }
```

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure strict `ALLOWED_ORIGINS`
- [ ] Set appropriate rate limits based on expected traffic
- [ ] Increase complexity limits if needed for legitimate queries
- [ ] Set up Redis for rate limiting in multi-instance deployments
- [ ] Configure proper logging/monitoring
- [ ] Review and test all security headers
- [ ] Ensure HTTPS is enforced (update HSTS header)
- [ ] Test all security features in staging environment
- [ ] Set up alerts for rate limit violations
- [ ] Document any custom complexity estimators

## Production Configuration Example

```env
NODE_ENV=production

# Higher limits for production traffic
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW_MS=60000

# Reasonable limits for typical queries
QUERY_MAX_DEPTH=15
QUERY_MAX_COMPLEXITY=5000

# Allow larger requests for file uploads
MAX_REQUEST_SIZE_BYTES=500000

# Strict CORS
ALLOWED_ORIGINS=https://nivasesa.com,https://www.nivasesa.com

# Secure JWT
JWT_SECRET=your-very-secure-randomly-generated-secret
```

## Advanced Configuration

### Custom Complexity Estimators

For fields that should have custom complexity:

```typescript
// In your schema definition
type User {
  name: String
  posts(limit: Int!): [Post!]! @complexity(multiplier: 2)
}
```

### Redis-Backed Rate Limiting

For production deployments with multiple instances:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

class RedisRateLimiter extends RateLimiter {
  async checkLimit(ip: string): Promise<boolean> {
    const key = `rate:${ip}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, this.windowMs / 1000);
    }

    return count <= this.maxRequests;
  }
}
```

## Security Best Practices

1. **Keep dependencies updated**: Regularly update security-related packages
2. **Monitor logs**: Watch for suspicious patterns (repeated rate limit hits, complex queries)
3. **Use HTTPS**: Always use TLS in production
4. **Implement authentication**: Don't rely on security features alone
5. **Test regularly**: Include security tests in CI/CD pipeline
6. **Rate limit by user**: Consider stricter limits for unauthenticated requests
7. **Implement request signatures**: For sensitive operations
8. **Use API keys**: For service-to-service communication
9. **Enable audit logging**: Track all mutations and sensitive queries
10. **Regular security audits**: Review and update security configuration quarterly

## Support

For security concerns or questions, contact: security@nivasesa.com
