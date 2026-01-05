# Nivasesa GraphQL Gateway

Apollo Federation Gateway that unifies multiple microservices into a single GraphQL API with enterprise-grade security features.

## Features

- Apollo Federation v2 with dynamic subgraph composition
- Enterprise security features (rate limiting, query complexity, etc.)
- Authentication and authorization propagation
- Graceful degradation when subgraphs are unavailable
- Development mode with health checks

## Architecture

The gateway composes these microservices:

- **User Service** (port 4001): Authentication, profiles, roles
- **Listing Service** (port 4002): Room listings, search, photos
- **Booking Service** (port 4003): Reservations, calendar
- **Payment Service** (port 4004): Stripe, escrow, payouts
- **Verification Service** (port 4005): Identity, background, visa
- **Messaging Service** (port 4006): Real-time chat
- **Review Service** (port 4007): Ratings and reviews

## Security Features

Comprehensive cybersecurity protection:

1. **Rate Limiting**: Per-IP request throttling (100 req/min default)
2. **Query Depth Limiting**: Prevent deeply nested queries (max 10 levels)
3. **Query Complexity Analysis**: Prevent expensive queries (max 1000 complexity)
4. **Request Size Limiting**: Max 100KB per request
5. **CORS Protection**: Configurable origin whitelist
6. **Security Headers**: CSP, XSS protection, clickjacking prevention
7. **Introspection Control**: Disabled in production
8. **Error Masking**: Hide internal errors in production

See [SECURITY.md](./SECURITY.md) for detailed documentation.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Install dependencies (from monorepo root)
pnpm install
```

### Development

```bash
# Start gateway in development mode
pnpm dev

# Or from monorepo root
pnpm --filter @niv/gateway dev
```

The gateway will start on port 4000 and automatically detect available subgraphs.

### Production Build

```bash
# Build
pnpm build

# Start
pnpm start
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
# Environment
NODE_ENV=development

# Server
GATEWAY_PORT=4000

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
QUERY_MAX_DEPTH=10
QUERY_MAX_COMPLEXITY=1000
MAX_REQUEST_SIZE_BYTES=100000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Subgraph URLs
USER_SERVICE_URL=http://localhost:4001/graphql
LISTING_SERVICE_URL=http://localhost:4002/graphql
# ... etc
```

## Usage

### Query the Gateway

```graphql
# Health check (always available)
query {
  health {
    status
    timestamp
    services {
      name
      url
      available
    }
  }
}
```

### With Authentication

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"{ me { id name email } }"}'
```

### Check Rate Limits

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1735689660
```

## Development Mode

When no subgraphs are available, the gateway starts in development mode with a minimal schema:

```
🚀 Starting Nivasesa GraphQL Gateway...

🔒 Security Configuration:
   - Environment: development
   - Rate Limiting: 100 requests per 60s per IP
   - Query Depth Limit: 10 levels
   - Query Complexity Limit: 1000
   - Max Request Size: 100KB
   - Introspection: enabled
   - Error Masking: disabled
   - CORS Origins: http://localhost:3000,http://localhost:3001

✗ user service not available at http://localhost:4001/graphql
✗ listing service not available at http://localhost:4002/graphql

⚠️  No subgraphs available. Starting in development mode...

🚀 Gateway ready at http://localhost:4000/
```

## Testing

### Manual Testing

See [test-security.md](./test-security.md) for comprehensive testing guide.

Quick test:

```bash
# Test health endpoint
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ health { status } }"}'

# Test rate limiting (run 105 times)
for i in {1..105}; do
  curl -X POST http://localhost:4000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health { status } }"}'
done
```

### Type Checking

```bash
pnpm typecheck
```

## Production Deployment

### Environment Variables

```env
NODE_ENV=production

# Higher limits for production
RATE_LIMIT_MAX=1000
QUERY_MAX_DEPTH=15
QUERY_MAX_COMPLEXITY=5000
MAX_REQUEST_SIZE_BYTES=500000

# Strict CORS
ALLOWED_ORIGINS=https://nivasesa.com,https://www.nivasesa.com

# Production subgraph URLs
USER_SERVICE_URL=https://user.nivasesa.com/graphql
LISTING_SERVICE_URL=https://listing.nivasesa.com/graphql
# ... etc
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

# Copy built files
COPY dist ./dist

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "dist/index.js"]
```

### Health Checks

The gateway provides a health endpoint that reports:

- Overall gateway status
- Individual subgraph availability
- Timestamp

```graphql
query {
  health {
    status          # "GATEWAY_READY"
    timestamp       # ISO 8601 timestamp
    services {
      name          # "user", "listing", etc.
      url           # Subgraph URL
      available     # true/false
    }
  }
}
```

## Architecture Patterns

### Authentication Propagation

The gateway forwards authentication headers to all subgraphs:

```
Client Request Headers:
  Authorization: Bearer <token>
  x-user-id: <userId>
  x-user-role: <userRole>

↓ Gateway Context

Subgraph Request Headers:
  Authorization: Bearer <token>
  x-user-id: <userId>
  x-user-role: <userRole>
```

### Error Handling

- Development: Full error details including stack traces
- Production: Masked errors with generic messages
- All errors logged server-side regardless of mode

### Graceful Degradation

The gateway continues to operate even when some subgraphs are unavailable:

1. On startup, checks each subgraph's availability
2. Composes schema from available subgraphs only
3. Logs unavailable services
4. Continues serving requests with partial schema

## Troubleshooting

### Gateway won't start

1. Check that the port (4000) is available
2. Verify environment variables are set correctly
3. Check logs for specific errors

### Subgraph connection errors

1. Verify subgraph URLs in `.env`
2. Ensure subgraphs are running
3. Check network connectivity
4. Review subgraph logs

### Rate limit issues

1. Check `X-RateLimit-*` headers in responses
2. Wait for the rate limit window to reset
3. Adjust `RATE_LIMIT_MAX` if needed
4. Consider using Redis for multi-instance deployments

### CORS errors

1. Verify `ALLOWED_ORIGINS` includes your frontend URL
2. Check browser console for specific CORS errors
3. In development, ensure `NODE_ENV=development` for permissive CORS

## Contributing

1. Make changes to `src/index.ts` or `src/security.ts`
2. Run `pnpm typecheck` to verify TypeScript
3. Run `pnpm build` to compile
4. Test with `pnpm dev`
5. Update documentation if needed

## Project Structure

```
services/gateway/
├── src/
│   ├── index.ts        # Main gateway server
│   └── security.ts     # Security middleware and plugins
├── dist/               # Compiled output
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── README.md           # This file
├── SECURITY.md         # Security documentation
└── test-security.md    # Testing guide
```

## License

Proprietary - Nivasesa Inc.

## Support

For issues or questions:
- Create an issue in the monorepo
- Contact: dev@nivasesa.com
- Security issues: security@nivasesa.com
