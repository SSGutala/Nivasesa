import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

/**
 * Nivasesa Verification Service
 *
 * GraphQL subgraph for trust and verification:
 * - Identity verification (Persona)
 * - Background checks (Checkr)
 * - Visa verification (H1B, F1, etc.)
 * - License verification (Realtor licenses)
 * - Trust score calculation
 * - Verification audit logs
 *
 * DEV_MODE: Set DEV_MODE=true to auto-approve all verifications
 */

interface ContextValue {
  userId?: string;
  userRole?: string;
}

async function startServer() {
  const devMode = process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development';

  console.log('\n🔐 Starting Verification Service...\n');

  if (devMode) {
    console.log('⚠️  DEV MODE ENABLED - All verifications will be auto-approved\n');
  }

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
    listen: { port: parseInt(process.env.PORT || '4005') },
    context: async ({ req }: { req: Request }): Promise<ContextValue> => {
      // Extract user info from headers (set by gateway)
      return {
        userId: req.headers['x-user-id'],
        userRole: req.headers['x-user-role'],
      };
    },
  });

  console.log(`🔐 Verification Service ready at ${url}`);
  console.log('\nAvailable operations:');
  console.log('  Queries: verificationStatus, myVerifications, pendingVerifications');
  console.log('  Mutations: initIdentityVerification, submitBackgroundCheck,');
  console.log('             submitVisaVerification, submitLicenseVerification,');
  console.log('             updateVerificationStatus');
  console.log('\nVerification Providers:');
  console.log('  Identity: Persona (configurable)');
  console.log('  Background: Checkr (configurable)');
  console.log('  Visa: E-Verify (configurable)');
  console.log('  License: State boards (TX, NJ, CA)');
  console.log('\nTo use with gateway, start the gateway service:\n');
  console.log('  pnpm --filter @niv/gateway dev\n');

  if (devMode) {
    console.log('💡 To disable auto-approval, set DEV_MODE=false\n');
  }
}

startServer().catch((error) => {
  console.error('Failed to start Verification Service:', error);
  process.exit(1);
});
