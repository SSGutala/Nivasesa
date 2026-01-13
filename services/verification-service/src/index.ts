import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { unifiedTypeDefs } from './unified-schema.js';
import { unifiedResolvers } from './unified-resolvers.js';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

/**
 * Nivasesa Verification Service
 *
 * GraphQL subgraph for trust and verification:
 * - Email verification (token-based)
 * - Phone verification (OTP-based)
 * - Identity verification (Persona)
 * - Background checks (Checkr)
 * - Visa verification (H1B, F1, etc.)
 * - License verification (Realtor licenses)
 * - Trust score calculation
 * - Verification audit logs
 *
 * Supports both:
 * 1. Unified Verification model (EMAIL, PHONE, IDENTITY, BACKGROUND, VISA)
 * 2. Detailed verification models (IdentityVerification, BackgroundCheck, etc.)
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

  // Merge unified and detailed schemas
  const mergedTypeDefs = mergeTypeDefs([typeDefs, unifiedTypeDefs]);
  const mergedResolvers = mergeResolvers([resolvers, unifiedResolvers]) as any;

  const server = new ApolloServer<ContextValue>({
    schema: buildSubgraphSchema([{ typeDefs: mergedTypeDefs, resolvers: mergedResolvers }]),
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
  console.log('  Unified Verification API:');
  console.log('    - verification, userVerifications, verificationStatus, myVerifications');
  console.log('    - initiateVerification, completeVerification, expireVerification');
  console.log('    - sendEmailVerification, verifyEmail');
  console.log('    - sendPhoneVerification, verifyPhone');
  console.log('\n  Detailed Verification API:');
  console.log('    - verificationStatus, myVerifications, pendingVerifications');
  console.log('    - initIdentityVerification, submitBackgroundCheck,');
  console.log('      submitVisaVerification, submitLicenseVerification,');
  console.log('      updateVerificationStatus');
  console.log('\nVerification Types:');
  console.log('  EMAIL: Token-based email verification');
  console.log('  PHONE: OTP-based phone verification');
  console.log('  IDENTITY: Persona (configurable)');
  console.log('  BACKGROUND: Checkr (configurable)');
  console.log('  VISA: E-Verify (configurable)');
  console.log('  LICENSE: State boards (TX, NJ, CA)');
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
