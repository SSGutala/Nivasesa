import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa Listing Service
 *
 * GraphQL subgraph for listing management:
 * - Room listings CRUD
 * - Search and filtering
 * - Photos and media
 * - Availability calendar
 * - Roommate profiles
 * - Freedom Score calculation
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  console.log('\n🚀 Starting Listing Service...\n');

  const server = new ApolloServer<ContextValue>({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    introspection: true,
  });

  interface Request {
    headers: {
      'x-user-id'?: string;
      'x-user-role'?: string;
    };
  }

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT || '4002') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  console.log(`🚀 Listing Service ready at ${url}`);
  console.log('\nAvailable operations:');
  console.log('  Queries: listing, listings, searchListings, myListings, availability');
  console.log('  Mutations: createListing, updateListing, publishListing, addPhotos');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');
}

startServer().catch((error) => {
  console.error('Failed to start Listing Service:', error);
  process.exit(1);
});
