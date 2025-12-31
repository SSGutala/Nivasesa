import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

interface Context {
  userId?: string;
  userRole?: string;
}

// Helper to generate JWT token
function generateToken(userId: string): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, expiresAt };
}

// Helper to verify authentication
function requireAuth(context: Context): string {
  if (!context.userId) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.userId;
}

// Helper to require admin role
function requireAdmin(context: Context): void {
  requireAuth(context);
  if (context.userRole !== 'ADMIN') {
    throw new GraphQLError('Not authorized', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.userId) return null;
      return prisma.user.findUnique({
        where: { id: context.userId },
        include: { profile: true, verification: true },
      });
    },

    user: async (_: unknown, { id }: { id: string }) => {
      return prisma.user.findUnique({
        where: { id },
        include: { profile: true, verification: true },
      });
    },

    users: async (
      _: unknown,
      {
        role,
        verified,
        limit = 20,
        offset = 0,
      }: { role?: string; verified?: boolean; limit?: number; offset?: number }
    ) => {
      const where: Record<string, unknown> = {};

      if (role) {
        where.role = role;
      }

      if (verified !== undefined) {
        where.emailVerified = verified ? { not: null } : null;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.user.findMany({
          where,
          take: limit,
          skip: offset,
          include: { profile: true, verification: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        nodes,
        totalCount,
        pageInfo: {
          hasNextPage: offset + nodes.length < totalCount,
          hasPreviousPage: offset > 0,
          startCursor: nodes[0]?.id,
          endCursor: nodes[nodes.length - 1]?.id,
        },
      };
    },

    emailAvailable: async (_: unknown, { email }: { email: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return !user;
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      {
        input,
      }: {
        input: { email: string; password: string; name?: string; role: string };
      }
    ) => {
      // Check if email exists
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new GraphQLError('Email already registered', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user with profile
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
          profile: {
            create: {
              languages: [],
            },
          },
          verification: {
            create: {
              identityStatus: 'NOT_STARTED',
              backgroundStatus: 'NOT_STARTED',
            },
          },
        },
        include: { profile: true, verification: true },
      });

      const { token, expiresAt } = generateToken(user.id);

      return { token, user, expiresAt };
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } }
    ) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { profile: true, verification: true },
      });

      if (!user || !user.password) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const valid = await bcrypt.compare(input.password, user.password);

      if (!valid) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const { token, expiresAt } = generateToken(user.id);

      return { token, user, expiresAt };
    },

    loginWithOAuth: async (
      _: unknown,
      { provider, accessToken }: { provider: string; accessToken: string }
    ) => {
      // TODO: Implement OAuth verification with provider
      // For now, return an error
      throw new GraphQLError(`OAuth with ${provider} not yet implemented`, {
        extensions: { code: 'NOT_IMPLEMENTED' },
      });
    },

    logout: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);
      // In a real implementation, invalidate the session/token
      return true;
    },

    updateProfile: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Update user name if provided
      if (input.name) {
        await prisma.user.update({
          where: { id: userId },
          data: { name: input.name as string },
        });
      }

      // Update profile
      const profileData: Record<string, unknown> = {};

      if (input.bio !== undefined) profileData.bio = input.bio;
      if (input.occupation !== undefined) profileData.occupation = input.occupation;
      if (input.company !== undefined) profileData.company = input.company;
      if (input.languages !== undefined) profileData.languages = input.languages;
      if (input.dietaryPreference !== undefined)
        profileData.dietaryPreference = input.dietaryPreference;
      if (input.smokingAllowed !== undefined)
        profileData.smokingAllowed = input.smokingAllowed;
      if (input.petsAllowed !== undefined) profileData.petsAllowed = input.petsAllowed;
      if (input.partyFriendly !== undefined)
        profileData.partyFriendly = input.partyFriendly;
      if (input.location !== undefined) profileData.location = input.location;
      if (input.moveInDate !== undefined) profileData.moveInDate = input.moveInDate;
      if (input.budgetMin !== undefined || input.budgetMax !== undefined) {
        profileData.budgetMin = input.budgetMin;
        profileData.budgetMax = input.budgetMax;
      }

      await prisma.profile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          languages: [],
          ...profileData,
        },
      });

      return prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, verification: true },
      });
    },

    changePassword: async (
      _: unknown,
      { input }: { input: { currentPassword: string; newPassword: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user?.password) {
        throw new GraphQLError('Cannot change password for OAuth accounts', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const valid = await bcrypt.compare(input.currentPassword, user.password);

      if (!valid) {
        throw new GraphQLError('Current password is incorrect', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return true;
    },

    requestPasswordReset: async (_: unknown, { email }: { email: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Don't reveal if email exists
        return true;
      }

      // TODO: Send password reset email
      // For now, just return true
      return true;
    },

    resetPassword: async (
      _: unknown,
      { token, newPassword }: { token: string; newPassword: string }
    ) => {
      // TODO: Implement password reset with token
      throw new GraphQLError('Password reset not yet implemented', {
        extensions: { code: 'NOT_IMPLEMENTED' },
      });
    },

    verifyEmail: async (_: unknown, { token }: { token: string }) => {
      // TODO: Implement email verification
      throw new GraphQLError('Email verification not yet implemented', {
        extensions: { code: 'NOT_IMPLEMENTED' },
      });
    },

    requestPhoneVerification: async (
      _: unknown,
      { phone }: { phone: string },
      context: Context
    ) => {
      requireAuth(context);
      // TODO: Implement phone verification with Twilio
      throw new GraphQLError('Phone verification not yet implemented', {
        extensions: { code: 'NOT_IMPLEMENTED' },
      });
    },

    verifyPhone: async (
      _: unknown,
      { code }: { code: string },
      context: Context
    ) => {
      requireAuth(context);
      // TODO: Implement phone verification
      throw new GraphQLError('Phone verification not yet implemented', {
        extensions: { code: 'NOT_IMPLEMENTED' },
      });
    },

    updateUserRole: async (
      _: unknown,
      { userId, role }: { userId: string; role: string },
      context: Context
    ) => {
      requireAdmin(context);

      return prisma.user.update({
        where: { id: userId },
        data: { role },
        include: { profile: true, verification: true },
      });
    },

    deleteAccount: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);

      await prisma.user.delete({ where: { id: userId } });

      return true;
    },
  },

  // User type resolvers for federation
  User: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.user.findUnique({
        where: { id: reference.id },
        include: { profile: true, verification: true },
      });
    },

    phoneVerified: (user: { phone?: string }) => !!user.phone,

    emailVerified: (user: { emailVerified?: Date }) => !!user.emailVerified,

    trustScore: async (user: { id: string }) => {
      const verification = await prisma.verification.findUnique({
        where: { userId: user.id },
      });

      if (!verification) return 0;

      let score = 0;

      // Identity verified: +30
      if (verification.identityStatus === 'VERIFIED') score += 30;

      // Background clear: +30
      if (
        verification.backgroundStatus === 'VERIFIED' &&
        verification.backgroundResult === 'CLEAR'
      ) {
        score += 30;
      }

      // TODO: Add review score, tenure, response rate

      return score;
    },

    verification: async (user: { id: string }) => {
      const v = await prisma.verification.findUnique({
        where: { userId: user.id },
      });

      if (!v) {
        return {
          identity: 'NOT_STARTED',
          background: 'NOT_STARTED',
          visa: null,
          license: null,
          overallStatus: 'NOT_STARTED',
        };
      }

      // Calculate overall status
      let overallStatus = 'NOT_STARTED';
      if (v.identityStatus === 'VERIFIED') {
        overallStatus = 'VERIFIED';
      } else if (v.identityStatus === 'PENDING' || v.identityStatus === 'IN_REVIEW') {
        overallStatus = 'PENDING';
      } else if (v.identityStatus === 'FAILED') {
        overallStatus = 'FAILED';
      }

      return {
        identity: v.identityStatus,
        background: v.backgroundStatus,
        visa: v.visaStatus,
        license: v.licenseStatus,
        overallStatus,
      };
    },
  },

  // Custom scalar for DateTime
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
