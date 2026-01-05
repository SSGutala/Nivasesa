import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa User Service
 *
 * GraphQL subgraph for user management:
 * - Authentication (register, login, OAuth)
 * - User profiles
 * - Roles (RENTER, LANDLORD, AGENT, ADMIN)
 * - Verification status
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  console.log('\n🚀 Starting User Service...\n');

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
    listen: { port: parseInt(process.env.PORT || '4001') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      // Extract user info from headers (set by gateway)
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  console.log(`🚀 User Service ready at ${url}`);
  console.log('\nAvailable operations:');
  console.log('  Queries: me, user, users, emailAvailable');
  console.log('  Mutations: register, login, updateProfile, changePassword');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');
}

startServer().catch((error) => {
  console.error('Failed to start User Service:', error);
  process.exit(1);
});
