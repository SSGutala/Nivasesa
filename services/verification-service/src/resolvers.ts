import { GraphQLError } from 'graphql';
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

// Helper to require admin role
function requireAdmin(context: Context): void {
  requireAuth(context);
  if (context.userRole !== 'ADMIN') {
    throw new GraphQLError('Not authorized', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

// Helper to calculate trust score
function calculateTrustScore(verifications: {
  identity?: { status: string } | null;
  background?: { status: string; result?: string | null } | null;
  visa?: { status: string } | null;
  license?: { status: string } | null;
}): number {
  let score = 0;

  // Identity verified: +30
  if (verifications.identity?.status === 'VERIFIED') score += 30;

  // Background clear: +30
  if (
    verifications.background?.status === 'VERIFIED' &&
    verifications.background.result === 'CLEAR'
  ) {
    score += 30;
  }

  // Visa verified: +20
  if (verifications.visa?.status === 'VERIFIED') score += 20;

  // License verified: +20
  if (verifications.license?.status === 'VERIFIED') score += 20;

  return score;
}

// Helper to determine overall status
function getOverallStatus(verifications: {
  identity?: { status: string } | null;
  background?: { status: string } | null;
  visa?: { status: string } | null;
  license?: { status: string } | null;
}): string {
  const statuses = [
    verifications.identity?.status,
    verifications.background?.status,
    verifications.visa?.status,
    verifications.license?.status,
  ].filter(Boolean);

  if (statuses.includes('FAILED')) return 'FAILED';
  if (statuses.includes('IN_REVIEW')) return 'IN_REVIEW';
  if (statuses.includes('PENDING')) return 'PENDING';
  if (statuses.some((s) => s === 'VERIFIED')) return 'VERIFIED';
  if (statuses.includes('EXPIRED')) return 'EXPIRED';

  return 'NOT_STARTED';
}

// Helper to create audit log
async function createAuditLog(
  userId: string,
  verificationType: string,
  action: string,
  previousStatus: string | null,
  newStatus: string,
  performedBy?: string,
  reason?: string
) {
  await prisma.verificationAuditLog.create({
    data: {
      userId,
      verificationType,
      action,
      previousStatus,
      newStatus,
      performedBy,
      reason,
    },
  });
}

// Mock auto-approval for DEV_MODE
function shouldAutoApprove(): boolean {
  return DEV_MODE;
}

export const resolvers = {
  Query: {
    verificationStatus: async (_: unknown, { userId }: { userId: string }) => {
      const [identity, background, visa, license] = await Promise.all([
        prisma.identityVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.backgroundCheck.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.visaVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.licenseVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const verifications = { identity, background, visa, license };
      const overallStatus = getOverallStatus(verifications);
      const trustScore = calculateTrustScore(verifications);

      const lastUpdated =
        [
          identity?.updatedAt,
          background?.updatedAt,
          visa?.updatedAt,
          license?.updatedAt,
        ]
          .filter(Boolean)
          .sort((a, b) => b!.getTime() - a!.getTime())[0] || new Date();

      return {
        userId,
        identity,
        background,
        visa,
        license,
        overallStatus,
        trustScore,
        lastUpdated,
      };
    },

    myVerifications: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);

      const [identity, background, visa, license] = await Promise.all([
        prisma.identityVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.backgroundCheck.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.visaVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.licenseVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const verifications = { identity, background, visa, license };
      const overallStatus = getOverallStatus(verifications);
      const trustScore = calculateTrustScore(verifications);

      const lastUpdated =
        [
          identity?.updatedAt,
          background?.updatedAt,
          visa?.updatedAt,
          license?.updatedAt,
        ]
          .filter(Boolean)
          .sort((a, b) => b!.getTime() - a!.getTime())[0] || new Date();

      return {
        userId,
        identity,
        background,
        visa,
        license,
        overallStatus,
        trustScore,
        lastUpdated,
      };
    },

    identityVerification: async (_: unknown, { id }: { id: string }) => {
      return prisma.identityVerification.findUnique({ where: { id } });
    },

    backgroundCheck: async (_: unknown, { id }: { id: string }) => {
      return prisma.backgroundCheck.findUnique({ where: { id } });
    },

    visaVerification: async (_: unknown, { id }: { id: string }) => {
      return prisma.visaVerification.findUnique({ where: { id } });
    },

    licenseVerification: async (_: unknown, { id }: { id: string }) => {
      return prisma.licenseVerification.findUnique({ where: { id } });
    },

    identityVerifications: async (_: unknown, { userId }: { userId: string }) => {
      return prisma.identityVerification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    backgroundChecks: async (_: unknown, { userId }: { userId: string }) => {
      return prisma.backgroundCheck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    visaVerifications: async (_: unknown, { userId }: { userId: string }) => {
      return prisma.visaVerification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    licenseVerifications: async (_: unknown, { userId }: { userId: string }) => {
      return prisma.licenseVerification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    },

    verificationAuditLogs: async (
      _: unknown,
      {
        userId,
        limit = 20,
        offset = 0,
      }: { userId: string; limit?: number; offset?: number }
    ) => {
      return prisma.verificationAuditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    },

    pendingVerifications: async (
      _: unknown,
      {
        verificationType,
        limit = 20,
        offset = 0,
      }: { verificationType?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      requireAdmin(context);

      const whereClause = {
        status: { in: ['PENDING', 'IN_REVIEW'] },
      };

      const [identityVerifications, backgroundChecks, visaVerifications, licenseVerifications] =
        await Promise.all([
          !verificationType || verificationType === 'IDENTITY'
            ? prisma.identityVerification.findMany({
                where: whereClause,
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip: offset,
              })
            : [],
          !verificationType || verificationType === 'BACKGROUND'
            ? prisma.backgroundCheck.findMany({
                where: whereClause,
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip: offset,
              })
            : [],
          !verificationType || verificationType === 'VISA'
            ? prisma.visaVerification.findMany({
                where: whereClause,
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip: offset,
              })
            : [],
          !verificationType || verificationType === 'LICENSE'
            ? prisma.licenseVerification.findMany({
                where: whereClause,
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip: offset,
              })
            : [],
        ]);

      const totalCount =
        identityVerifications.length +
        backgroundChecks.length +
        visaVerifications.length +
        licenseVerifications.length;

      return {
        identityVerifications,
        backgroundChecks,
        visaVerifications,
        licenseVerifications,
        totalCount,
      };
    },
  },

  Mutation: {
    initIdentityVerification: async (
      _: unknown,
      { input }: { input: { provider?: string; documentType?: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const initialStatus = shouldAutoApprove() ? 'VERIFIED' : 'PENDING';

      const verification = await prisma.identityVerification.create({
        data: {
          userId,
          status: initialStatus,
          provider: input.provider || 'PERSONA',
          documentType: input.documentType,
          verifiedAt: shouldAutoApprove() ? new Date() : null,
        },
      });

      await createAuditLog(userId, 'IDENTITY', 'INITIATED', null, initialStatus, userId);

      if (shouldAutoApprove()) {
        console.log(`[DEV MODE] Auto-approved identity verification for user ${userId}`);
      }

      return verification;
    },

    submitBackgroundCheck: async (
      _: unknown,
      { input }: { input: { package: string; consentGiven: boolean } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      if (!input.consentGiven) {
        throw new GraphQLError('Consent must be given to proceed with background check', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const initialStatus = shouldAutoApprove() ? 'VERIFIED' : 'PENDING';
      const result = shouldAutoApprove() ? 'CLEAR' : null;

      const backgroundCheck = await prisma.backgroundCheck.create({
        data: {
          userId,
          status: initialStatus,
          provider: 'CHECKR',
          package: input.package,
          result,
          consentGivenAt: new Date(),
          completedAt: shouldAutoApprove() ? new Date() : null,
          criminalRecords: shouldAutoApprove() ? false : null,
          sexOffenderRegistry: shouldAutoApprove() ? false : null,
          globalWatchlist: shouldAutoApprove() ? false : null,
          ssnTrace: shouldAutoApprove() ? true : null,
        },
      });

      await createAuditLog(userId, 'BACKGROUND', 'SUBMITTED', null, initialStatus, userId);

      if (shouldAutoApprove()) {
        console.log(`[DEV MODE] Auto-approved background check for user ${userId}`);
      }

      return backgroundCheck;
    },

    submitVisaVerification: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          visaType: string;
          i94Number?: string;
          sevisId?: string;
          documentUrls?: string[];
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const initialStatus = shouldAutoApprove() ? 'VERIFIED' : 'PENDING';

      const visaVerification = await prisma.visaVerification.create({
        data: {
          userId,
          visaType: input.visaType,
          status: initialStatus,
          i94Number: input.i94Number,
          sevisId: input.sevisId,
          documentUrls: input.documentUrls ? JSON.stringify(input.documentUrls) : null,
          verifiedAt: shouldAutoApprove() ? new Date() : null,
          expiresAt: shouldAutoApprove()
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : null, // 1 year
        },
      });

      await createAuditLog(userId, 'VISA', 'SUBMITTED', null, initialStatus, userId);

      if (shouldAutoApprove()) {
        console.log(`[DEV MODE] Auto-approved visa verification for user ${userId}`);
      }

      return visaVerification;
    },

    submitLicenseVerification: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          licenseType: string;
          licenseNumber: string;
          state: string;
          issueDate?: Date;
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const initialStatus = shouldAutoApprove() ? 'VERIFIED' : 'PENDING';

      const licenseVerification = await prisma.licenseVerification.create({
        data: {
          userId,
          licenseType: input.licenseType,
          licenseNumber: input.licenseNumber,
          state: input.state,
          status: initialStatus,
          issueDate: input.issueDate,
          verifiedAt: shouldAutoApprove() ? new Date() : null,
          expiresAt: shouldAutoApprove()
            ? new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)
            : null, // 2 years
          disciplinaryActions: false,
        },
      });

      await createAuditLog(userId, 'LICENSE', 'SUBMITTED', null, initialStatus, userId);

      if (shouldAutoApprove()) {
        console.log(`[DEV MODE] Auto-approved license verification for user ${userId}`);
      }

      return licenseVerification;
    },

    updateVerificationStatus: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          verificationId: string;
          verificationType: string;
          status: string;
          reason?: string;
        };
      },
      context: Context
    ) => {
      requireAdmin(context);
      const adminId = context.userId!;

      let previousStatus: string | null = null;
      let userId: string = '';

      switch (input.verificationType) {
        case 'IDENTITY': {
          const verification = await prisma.identityVerification.findUnique({
            where: { id: input.verificationId },
          });
          if (!verification) {
            throw new GraphQLError('Identity verification not found');
          }
          previousStatus = verification.status;
          userId = verification.userId;

          await prisma.identityVerification.update({
            where: { id: input.verificationId },
            data: {
              status: input.status,
              verifiedAt: input.status === 'VERIFIED' ? new Date() : null,
              failureReason: input.status === 'FAILED' ? input.reason : null,
            },
          });
          break;
        }
        case 'BACKGROUND': {
          const verification = await prisma.backgroundCheck.findUnique({
            where: { id: input.verificationId },
          });
          if (!verification) {
            throw new GraphQLError('Background check not found');
          }
          previousStatus = verification.status;
          userId = verification.userId;

          await prisma.backgroundCheck.update({
            where: { id: input.verificationId },
            data: {
              status: input.status,
              completedAt: input.status === 'VERIFIED' ? new Date() : null,
              failureReason: input.status === 'FAILED' ? input.reason : null,
            },
          });
          break;
        }
        case 'VISA': {
          const verification = await prisma.visaVerification.findUnique({
            where: { id: input.verificationId },
          });
          if (!verification) {
            throw new GraphQLError('Visa verification not found');
          }
          previousStatus = verification.status;
          userId = verification.userId;

          await prisma.visaVerification.update({
            where: { id: input.verificationId },
            data: {
              status: input.status,
              verifiedAt: input.status === 'VERIFIED' ? new Date() : null,
              failureReason: input.status === 'FAILED' ? input.reason : null,
            },
          });
          break;
        }
        case 'LICENSE': {
          const verification = await prisma.licenseVerification.findUnique({
            where: { id: input.verificationId },
          });
          if (!verification) {
            throw new GraphQLError('License verification not found');
          }
          previousStatus = verification.status;
          userId = verification.userId;

          await prisma.licenseVerification.update({
            where: { id: input.verificationId },
            data: {
              status: input.status,
              verifiedAt: input.status === 'VERIFIED' ? new Date() : null,
              failureReason: input.status === 'FAILED' ? input.reason : null,
            },
          });
          break;
        }
        default:
          throw new GraphQLError('Invalid verification type');
      }

      const action = input.status === 'VERIFIED' ? 'APPROVED' : input.status === 'FAILED' ? 'REJECTED' : 'UPDATED';

      await createAuditLog(
        userId,
        input.verificationType,
        action,
        previousStatus,
        input.status,
        adminId,
        input.reason
      );

      return true;
    },

    handlePersonaWebhook: async (
      _: unknown,
      { inquiryId, status }: { inquiryId: string; status: string }
    ) => {
      const verification = await prisma.identityVerification.findUnique({
        where: { personaInquiryId: inquiryId },
      });

      if (!verification) {
        console.error(`Identity verification not found for inquiry ${inquiryId}`);
        return false;
      }

      const statusMapping: Record<string, string> = {
        completed: 'VERIFIED',
        approved: 'VERIFIED',
        declined: 'FAILED',
        needs_review: 'IN_REVIEW',
      };

      const newStatus = statusMapping[status] || 'PENDING';
      const previousStatus = verification.status;

      await prisma.identityVerification.update({
        where: { id: verification.id },
        data: {
          status: newStatus,
          verifiedAt: newStatus === 'VERIFIED' ? new Date() : null,
        },
      });

      await createAuditLog(
        verification.userId,
        'IDENTITY',
        'UPDATED',
        previousStatus,
        newStatus,
        undefined,
        `Persona webhook: ${status}`
      );

      return true;
    },

    handleCheckrWebhook: async (
      _: unknown,
      { reportId, status, result }: { reportId: string; status: string; result?: string }
    ) => {
      const backgroundCheck = await prisma.backgroundCheck.findUnique({
        where: { checkrReportId: reportId },
      });

      if (!backgroundCheck) {
        console.error(`Background check not found for report ${reportId}`);
        return false;
      }

      const statusMapping: Record<string, string> = {
        complete: 'VERIFIED',
        clear: 'VERIFIED',
        consider: 'VERIFIED',
        suspended: 'FAILED',
        pending: 'PENDING',
      };

      const newStatus = statusMapping[status] || 'PENDING';
      const previousStatus = backgroundCheck.status;

      await prisma.backgroundCheck.update({
        where: { id: backgroundCheck.id },
        data: {
          status: newStatus,
          result: result || null,
          completedAt: newStatus === 'VERIFIED' ? new Date() : null,
        },
      });

      await createAuditLog(
        backgroundCheck.userId,
        'BACKGROUND',
        'UPDATED',
        previousStatus,
        newStatus,
        undefined,
        `Checkr webhook: ${status}`
      );

      return true;
    },

    refreshVerification: async (
      _: unknown,
      {
        verificationId,
        verificationType,
      }: { verificationId: string; verificationType: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      switch (verificationType) {
        case 'IDENTITY':
          await prisma.identityVerification.update({
            where: { id: verificationId, userId },
            data: { status: 'PENDING' },
          });
          break;
        case 'BACKGROUND':
          await prisma.backgroundCheck.update({
            where: { id: verificationId, userId },
            data: { status: 'PENDING' },
          });
          break;
        case 'VISA':
          await prisma.visaVerification.update({
            where: { id: verificationId, userId },
            data: { status: 'PENDING' },
          });
          break;
        case 'LICENSE':
          await prisma.licenseVerification.update({
            where: { id: verificationId, userId },
            data: { status: 'PENDING' },
          });
          break;
        default:
          throw new GraphQLError('Invalid verification type');
      }

      return true;
    },
  },

  // Type resolvers
  IdentityVerification: {
    user: (verification: { userId: string }) => ({ id: verification.userId }),
  },

  BackgroundCheck: {
    user: (check: { userId: string }) => ({ id: check.userId }),
  },

  VisaVerification: {
    user: (verification: { userId: string }) => ({ id: verification.userId }),
    documentUrls: (verification: { documentUrls: string | null }) => {
      if (!verification.documentUrls) return [];
      try {
        return JSON.parse(verification.documentUrls);
      } catch {
        return [];
      }
    },
  },

  LicenseVerification: {
    user: (verification: { userId: string }) => ({ id: verification.userId }),
  },

  // Custom scalar for DateTime
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
