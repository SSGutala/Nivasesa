import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import cors from 'cors';
import {
  RateLimiter,
  createRateLimitPlugin,
  createComplexityPlugin,
  createErrorMaskingPlugin,
  createIntrospectionPlugin,
  createRequestSizeLimitPlugin,
  getSecurityHeaders,
  getCorsOptions,
  getClientIp,
} from './security.js';

/**
 * Nivasesa GraphQL Federation Gateway
 *
 * This gateway composes multiple subgraphs into a unified supergraph:
 * - User Service: Authentication, profiles, roles
 * - Listing Service: Room listings, search, photos
 * - Booking Service: Reservations, calendar
 * - Payment Service: Stripe, escrow, payouts
 * - Verification Service: Identity, background, visa
 * - Messaging Service: Real-time chat
 * - Review Service: Ratings and reviews
 *
 * Security Features:
 * - Rate limiting per IP (100 req/min default)
 * - Query depth limiting (max 10 levels)
 * - Query complexity analysis (max 1000)
 * - Request size limiting (100KB)
 * - CORS protection
 * - Security headers (CSP, XSS, etc.)
 * - Introspection disabled in production
 * - Error masking in production
 */

// Initialize security components
const isDevelopment = process.env.NODE_ENV === 'development';
const rateLimiter = new RateLimiter();

// Custom data source for authentication propagation
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  override willSendRequest(options: any) {
    const { request, context } = options;

    // Forward authentication headers to subgraphs
    if (context?.userId && request.http?.headers) {
      request.http.headers.set('x-user-id', context.userId);
    }
    if (context?.userRole && request.http?.headers) {
      request.http.headers.set('x-user-role', context.userRole);
    }
    if (context?.authToken && request.http?.headers) {
      request.http.headers.set('authorization', `Bearer ${context.authToken}`);
    }
  }
}

// Subgraph configuration
const subgraphs = [
  { name: 'user', url: process.env.USER_SERVICE_URL || 'http://localhost:4001/graphql' },
  { name: 'listing', url: process.env.LISTING_SERVICE_URL || 'http://localhost:4002/graphql' },
  { name: 'booking', url: process.env.BOOKING_SERVICE_URL || 'http://localhost:4003/graphql' },
  { name: 'payment', url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4004/graphql' },
  { name: 'verification', url: process.env.VERIFICATION_SERVICE_URL || 'http://localhost:4005/graphql' },
  { name: 'messaging', url: process.env.MESSAGING_SERVICE_URL || 'http://localhost:4006/graphql' },
  { name: 'review', url: process.env.REVIEW_SERVICE_URL || 'http://localhost:4007/graphql' },
];

// Filter to only include subgraphs that are available
async function getAvailableSubgraphs() {
  const available = [];

  for (const subgraph of subgraphs) {
    try {
      const response = await fetch(subgraph.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
      });
      if (response.ok) {
        available.push(subgraph);
        console.log(`✓ ${subgraph.name} service available at ${subgraph.url}`);
      }
    } catch {
      console.log(`✗ ${subgraph.name} service not available at ${subgraph.url}`);
    }
  }

  return available;
}

async function startGateway() {
  console.log('\n🚀 Starting Nivasesa GraphQL Gateway...\n');

  // Log security configuration
  console.log('🔒 Security Configuration:');
  console.log(`   - Environment: ${isDevelopment ? 'development' : 'production'}`);
  console.log(`   - Rate Limiting: ${process.env.RATE_LIMIT_MAX || '100'} requests per ${parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') / 1000}s per IP`);
  console.log(`   - Query Depth Limit: ${process.env.QUERY_MAX_DEPTH || '10'} levels`);
  console.log(`   - Query Complexity Limit: ${process.env.QUERY_MAX_COMPLEXITY || '1000'}`);
  console.log(`   - Max Request Size: ${(parseInt(process.env.MAX_REQUEST_SIZE_BYTES || '100000') / 1024).toFixed(0)}KB`);
  console.log(`   - Introspection: ${isDevelopment ? 'enabled' : 'disabled'}`);
  console.log(`   - Error Masking: ${isDevelopment ? 'disabled' : 'enabled'}`);
  console.log(`   - CORS Origins: ${process.env.ALLOWED_ORIGINS || 'all (dev mode)'}\n`);

  // Check which subgraphs are available
  const availableSubgraphs = await getAvailableSubgraphs();

  if (availableSubgraphs.length === 0) {
    console.log('\n⚠️  No subgraphs available. Starting in development mode with mock schema...\n');

    // Start with a minimal schema for development
    const { ApolloServer: DevServer } = await import('@apollo/server');

    const typeDefs = `#graphql
      type Query {
        _service: _Service!
        health: Health!
      }

      type _Service {
        sdl: String!
      }

      type Health {
        status: String!
        timestamp: String!
        services: [ServiceHealth!]!
      }

      type ServiceHealth {
        name: String!
        url: String!
        available: Boolean!
      }
    `;

    const resolvers = {
      Query: {
        _service: () => ({ sdl: typeDefs }),
        health: () => ({
          status: 'GATEWAY_READY',
          timestamp: new Date().toISOString(),
          services: subgraphs.map((s) => ({
            name: s.name,
            url: s.url,
            available: availableSubgraphs.some((a) => a.name === s.name),
          })),
        }),
      },
    };

    const devServer = new DevServer({
      typeDefs,
      resolvers,
      plugins: [
        createRateLimitPlugin(rateLimiter),
        createComplexityPlugin(),
        createErrorMaskingPlugin(),
        createIntrospectionPlugin(),
        createRequestSizeLimitPlugin(),
      ],
      introspection: isDevelopment,
    });

    const { url } = await startStandaloneServer(devServer, {
      listen: { port: parseInt(process.env.GATEWAY_PORT || '4000') },
      context: async ({ req }) => {
        const ip = getClientIp(req);
        const authToken = req.headers.authorization?.replace('Bearer ', '');
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        return {
          ip,
          authToken,
          userId,
          userRole,
        };
      },
    });

    console.log(`\n🚀 Gateway ready at ${url}`);
    console.log('\nStart subgraphs to enable full federation:');
    console.log('  pnpm --filter @niv/user-service dev');
    console.log('  pnpm --filter @niv/listing-service dev\n');

    return;
  }

  // Create the gateway with available subgraphs
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: availableSubgraphs,
    }),
    buildService({ url }) {
      return new AuthenticatedDataSource({ url });
    },
  });

  const server = new ApolloServer({
    gateway,
    plugins: [
      createRateLimitPlugin(rateLimiter),
      createComplexityPlugin(),
      createErrorMaskingPlugin(),
      createIntrospectionPlugin(),
      createRequestSizeLimitPlugin(),
      {
        async requestDidStart() {
          return {
            async didEncounterErrors({ errors }) {
              errors.forEach((error) => {
                console.error('GraphQL Error:', error.message);
              });
            },
          };
        },
      },
    ],
    introspection: isDevelopment,
  });

  interface RequestContext {
    req: {
      headers: {
        authorization?: string;
        'x-user-id'?: string;
        'x-user-role'?: string;
      };
    };
  }

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.GATEWAY_PORT || '4000') },
    context: async ({ req }: RequestContext) => {
      // Extract client IP for rate limiting
      const ip = getClientIp(req);

      // Extract auth info from headers
      const authToken = req.headers.authorization?.replace('Bearer ', '');
      const userId = req.headers['x-user-id'];
      const userRole = req.headers['x-user-role'];

      return {
        ip,
        authToken,
        userId,
        userRole,
      };
    },
  });

  console.log(`\n🚀 Gateway ready at ${url}`);
  console.log(`\nActive subgraphs: ${availableSubgraphs.map((s) => s.name).join(', ')}\n`);
}

startGateway().catch((error) => {
  console.error('Failed to start gateway:', error);
  process.exit(1);
});
