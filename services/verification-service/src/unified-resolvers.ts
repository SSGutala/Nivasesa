import { GraphQLError } from 'graphql';
import { GraphQLScalarType, Kind } from 'graphql';
import crypto from 'crypto';
import { prisma } from './prisma.js';

const DEV_MODE = process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development';

interface Context {
  userId?: string;
  userRole?: string;
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

// Helper to generate random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper to generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock email sending (replace with real email service in production)
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body}`);
  // In production: use SendGrid, AWS SES, etc.
}

// Mock SMS sending (replace with real SMS service in production)
async function sendSMS(to: string, message: string): Promise<void> {
  console.log(`[SMS] To: ${to}`);
  console.log(`[SMS] Message: ${message}`);
  // In production: use Twilio, AWS SNS, etc.
}

// JSON scalar type
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: unknown) {
    return value;
  },
  parseValue(value: unknown) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return ast.value;
      }
    }
    if (ast.kind === Kind.OBJECT) {
      const value: Record<string, unknown> = Object.create(null);
      ast.fields.forEach((field) => {
        value[field.name.value] = JSONScalar.parseLiteral(field.value, {});
      });
      return value;
    }
    return null;
  },
});

// DateTime scalar type
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const unifiedResolvers = {
  Query: {
    verification: async (_: unknown, { id }: { id: string }) => {
      return prisma.verification.findUnique({ where: { id } });
    },

    userVerifications: async (_: unknown, { userId }: { userId: string }) => {
      return prisma.verification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    verificationStatus: async (
      _: unknown,
      { userId, type }: { userId: string; type: string }
    ) => {
      const verification = await prisma.verification.findUnique({
        where: {
          userId_type: {
            userId,
            type,
          },
        },
      });

      return verification?.status || 'PENDING';
    },

    myVerifications: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);
      return prisma.verification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    initiateVerification: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          type: string;
          metadata?: Record<string, unknown>;
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Check if verification already exists
      const existing = await prisma.verification.findUnique({
        where: {
          userId_type: {
            userId,
            type: input.type,
          },
        },
      });

      if (existing && existing.status === 'VERIFIED') {
        throw new GraphQLError('Verification already completed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Delete existing if it exists and is not verified
      if (existing) {
        await prisma.verification.delete({
          where: { id: existing.id },
        });
      }

      // Auto-approve in DEV_MODE
      const status = DEV_MODE ? 'VERIFIED' : 'PENDING';
      const verifiedAt = DEV_MODE ? new Date() : null;

      const verification = await prisma.verification.create({
        data: {
          userId,
          type: input.type,
          status,
          verifiedAt,
          metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        },
      });

      if (DEV_MODE) {
        console.log(`[DEV MODE] Auto-approved ${input.type} verification for user ${userId}`);
      }

      return verification;
    },

    completeVerification: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          id: string;
          result: {
            status: string;
            providerRef?: string;
            metadata?: Record<string, unknown>;
            expiresAt?: Date;
          };
        };
      }
    ) => {
      const verification = await prisma.verification.findUnique({
        where: { id: input.id },
      });

      if (!verification) {
        throw new GraphQLError('Verification not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updated = await prisma.verification.update({
        where: { id: input.id },
        data: {
          status: input.result.status,
          providerRef: input.result.providerRef,
          verifiedAt: input.result.status === 'VERIFIED' ? new Date() : null,
          expiresAt: input.result.expiresAt,
          metadata: input.result.metadata ? JSON.stringify(input.result.metadata) : verification.metadata,
        },
      });

      return updated;
    },

    expireVerification: async (_: unknown, { id }: { id: string }) => {
      await prisma.verification.update({
        where: { id },
        data: {
          status: 'EXPIRED',
        },
      });

      return true;
    },

    sendEmailVerification: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);

      // Generate token
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Check if verification already exists
      const existing = await prisma.verification.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'EMAIL',
          },
        },
      });

      if (existing) {
        // Update existing
        const verification = await prisma.verification.update({
          where: { id: existing.id },
          data: {
            status: DEV_MODE ? 'VERIFIED' : 'PENDING',
            metadata: JSON.stringify({ token }),
            expiresAt,
            verifiedAt: DEV_MODE ? new Date() : null,
          },
        });

        if (!DEV_MODE) {
          // Send email (mock for now)
          await sendEmail(
            'user@example.com', // Get from user service in production
            'Verify your email',
            `Click here to verify: https://nivasesa.com/verify-email?token=${token}`
          );
        }

        return verification;
      }

      // Create new verification
      const verification = await prisma.verification.create({
        data: {
          userId,
          type: 'EMAIL',
          status: DEV_MODE ? 'VERIFIED' : 'PENDING',
          metadata: JSON.stringify({ token }),
          expiresAt,
          verifiedAt: DEV_MODE ? new Date() : null,
        },
      });

      if (!DEV_MODE) {
        // Send email (mock for now)
        await sendEmail(
          'user@example.com', // Get from user service in production
          'Verify your email',
          `Click here to verify: https://nivasesa.com/verify-email?token=${token}`
        );
      } else {
        console.log(`[DEV MODE] Email verification auto-approved. Token: ${token}`);
      }

      return verification;
    },

    verifyEmail: async (_: unknown, { token }: { token: string }, context: Context) => {
      const userId = requireAuth(context);

      const verification = await prisma.verification.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'EMAIL',
          },
        },
      });

      if (!verification) {
        throw new GraphQLError('Email verification not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (verification.status === 'VERIFIED') {
        throw new GraphQLError('Email already verified', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check expiration
      if (verification.expiresAt && verification.expiresAt < new Date()) {
        await prisma.verification.update({
          where: { id: verification.id },
          data: { status: 'EXPIRED' },
        });
        throw new GraphQLError('Verification token expired', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Verify token
      const metadata = verification.metadata ? JSON.parse(verification.metadata) : {};
      if (metadata.token !== token) {
        throw new GraphQLError('Invalid verification token', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Mark as verified
      const updated = await prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });

      return updated;
    },

    sendPhoneVerification: async (
      _: unknown,
      { phoneNumber }: { phoneNumber: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Check if verification already exists
      const existing = await prisma.verification.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'PHONE',
          },
        },
      });

      if (existing) {
        // Update existing
        const verification = await prisma.verification.update({
          where: { id: existing.id },
          data: {
            status: DEV_MODE ? 'VERIFIED' : 'PENDING',
            metadata: JSON.stringify({ otp, phoneNumber }),
            expiresAt,
            verifiedAt: DEV_MODE ? new Date() : null,
          },
        });

        if (!DEV_MODE) {
          // Send SMS (mock for now)
          await sendSMS(phoneNumber, `Your Nivasesa verification code is: ${otp}`);
        } else {
          console.log(`[DEV MODE] Phone verification auto-approved. OTP: ${otp}`);
        }

        return verification;
      }

      // Create new verification
      const verification = await prisma.verification.create({
        data: {
          userId,
          type: 'PHONE',
          status: DEV_MODE ? 'VERIFIED' : 'PENDING',
          metadata: JSON.stringify({ otp, phoneNumber }),
          expiresAt,
          verifiedAt: DEV_MODE ? new Date() : null,
        },
      });

      if (!DEV_MODE) {
        // Send SMS (mock for now)
        await sendSMS(phoneNumber, `Your Nivasesa verification code is: ${otp}`);
      } else {
        console.log(`[DEV MODE] Phone verification auto-approved. OTP: ${otp}`);
      }

      return verification;
    },

    verifyPhone: async (
      _: unknown,
      { verificationId, otp }: { verificationId: string; otp: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const verification = await prisma.verification.findUnique({
        where: { id: verificationId },
      });

      if (!verification || verification.userId !== userId) {
        throw new GraphQLError('Phone verification not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (verification.type !== 'PHONE') {
        throw new GraphQLError('Invalid verification type', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (verification.status === 'VERIFIED') {
        throw new GraphQLError('Phone already verified', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check expiration
      if (verification.expiresAt && verification.expiresAt < new Date()) {
        await prisma.verification.update({
          where: { id: verification.id },
          data: { status: 'EXPIRED' },
        });
        throw new GraphQLError('Verification OTP expired', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Verify OTP
      const metadata = verification.metadata ? JSON.parse(verification.metadata) : {};
      if (metadata.otp !== otp) {
        throw new GraphQLError('Invalid OTP', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Mark as verified
      const updated = await prisma.verification.update({
        where: { id: verification.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });

      return updated;
    },
  },

  // Type resolvers
  Verification: {
    user: (verification: { userId: string }) => ({ id: verification.userId }),
    metadata: (verification: { metadata: string | null }) => {
      if (!verification.metadata) return null;
      try {
        return JSON.parse(verification.metadata);
      } catch {
        return null;
      }
    },
  },

  // Custom scalars
  DateTime: DateTimeScalar,
  JSON: JSONScalar,
};
