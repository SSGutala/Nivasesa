import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa Messaging Service
 *
 * GraphQL subgraph for messaging functionality:
 * - Conversations between users
 * - Message sending and receiving
 * - Read receipts
 * - Archive/unarchive conversations
 * - Real-time subscriptions (schema only)
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  console.log('\n🚀 Starting Messaging Service...\n');

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
    listen: { port: parseInt(process.env.PORT || '4006') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      // Extract user info from headers (set by gateway)
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  console.log(`🚀 Messaging Service ready at ${url}`);
  console.log('\nAvailable operations:');
  console.log('  Queries: myConversations, conversation, messages');
  console.log('  Mutations: createConversation, sendMessage, markAsRead, archiveConversation');
  console.log('  Subscriptions: messageReceived, conversationUpdated (schema only)');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');
}

startServer().catch((error) => {
  console.error('Failed to start Messaging Service:', error);
  process.exit(1);
});
