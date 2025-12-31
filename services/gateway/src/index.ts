import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

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
 */

// Custom data source for authentication propagation
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  override willSendRequest({
    request,
    context,
  }: {
    request: { http?: { headers: Map<string, string> } };
    context: { userId?: string; userRole?: string; authToken?: string };
  }) {
    // Forward authentication headers to subgraphs
    if (context.userId) {
      request.http?.headers.set('x-user-id', context.userId);
    }
    if (context.userRole) {
      request.http?.headers.set('x-user-role', context.userRole);
    }
    if (context.authToken) {
      request.http?.headers.set('authorization', `Bearer ${context.authToken}`);
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

    const devServer = new DevServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(devServer, {
      listen: { port: parseInt(process.env.GATEWAY_PORT || '4000') },
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
      // Extract auth info from headers
      const authToken = req.headers.authorization?.replace('Bearer ', '');
      const userId = req.headers['x-user-id'];
      const userRole = req.headers['x-user-role'];

      return {
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
