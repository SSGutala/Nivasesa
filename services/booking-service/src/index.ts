import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa Booking Service
 *
 * GraphQL subgraph for booking management:
 * - Booking creation and management
 * - Booking status transitions (PENDING -> CONFIRMED -> COMPLETED)
 * - Availability checking
 * - Cancellation handling
 * - Integration with User and Listing services via federation
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  console.log('\n🚀 Starting Booking Service...\n');

  const server = new ApolloServer<ContextValue>({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    introspection: true,
  });

  interface Request {
    headers: {
      'x-user-id'?: string;
      'x-user-role'?: string;
      authorization?: string;
    };
  }

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT || '4003') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      // Extract user info from headers (set by gateway)
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  console.log(`🚀 Booking Service ready at ${url}`);
  console.log('\nAvailable operations:');
  console.log('  Queries: booking, myBookings, hostBookings, bookingsForListing, checkAvailability');
  console.log('  Mutations: createBooking, confirmBooking, cancelBooking, completeBooking');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');
}

startServer().catch((error) => {
  console.error('Failed to start Booking Service:', error);
  process.exit(1);
});
