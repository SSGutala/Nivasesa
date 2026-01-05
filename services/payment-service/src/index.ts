import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa Payment Service
 *
 * GraphQL subgraph for payment processing:
 * - Payment processing via Stripe
 * - Payment methods management
 * - Payouts to landlords/hosts
 * - Transaction history
 * - Refunds
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  console.log('\n🚀 Starting Payment Service...\n');

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
    listen: { port: parseInt(process.env.PORT || '4004') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      // Extract user info from headers (set by gateway)
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  const stripeMode = process.env.STRIPE_SECRET_KEY ? 'LIVE' : 'DEV (simulated)';
  console.log(`🚀 Payment Service ready at ${url}`);
  console.log(`💳 Stripe mode: ${stripeMode}\n`);
  console.log('Available operations:');
  console.log('  Queries: payment, paymentForBooking, myPayments, myPaymentMethods, myPayouts, myBalance');
  console.log('  Mutations: createPayment, processPayment, refundPayment, addPaymentMethod, createPayout');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');
}

startServer().catch((error) => {
  console.error('Failed to start Payment Service:', error);
  process.exit(1);
});
