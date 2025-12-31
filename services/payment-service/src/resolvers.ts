import { GraphQLError } from 'graphql';
import { GraphQLScalarType, Kind } from 'graphql';
import { prisma } from './prisma.js';
import Stripe from 'stripe';

// Initialize Stripe (placeholder mode if no key)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

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

// Helper to check if Stripe is configured
function requireStripe(): Stripe {
  if (!stripe) {
    throw new GraphQLError('Stripe not configured. Set STRIPE_SECRET_KEY in .env', {
      extensions: { code: 'SERVICE_UNAVAILABLE' },
    });
  }
  return stripe;
}

// Placeholder Stripe simulation for dev mode
async function simulateStripeCharge(amount: number): Promise<string> {
  // Return a fake charge ID in dev mode
  return `ch_dev_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

async function simulateStripePayout(amount: number): Promise<string> {
  // Return a fake payout ID in dev mode
  return `po_dev_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export const resolvers = {
  Query: {
    payment: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return prisma.payment.findUnique({ where: { id } });
    },

    paymentForBooking: async (_: unknown, { bookingId }: { bookingId: string }, context: Context) => {
      requireAuth(context);
      return prisma.payment.findFirst({
        where: { bookingId },
        orderBy: { createdAt: 'desc' },
      });
    },

    myPayments: async (
      _: unknown,
      { status, limit = 20, offset = 0 }: { status?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = { payerId: userId };
      if (status) {
        where.status = status;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.payment.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.payment.count({ where }),
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

    myPaymentMethods: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);
      return prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
    },

    paymentMethod: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return prisma.paymentMethod.findUnique({ where: { id } });
    },

    myPayouts: async (
      _: unknown,
      { status, limit = 20, offset = 0 }: { status?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = { userId };
      if (status) {
        where.status = status;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.payout.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.payout.count({ where }),
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

    payout: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      return prisma.payout.findUnique({ where: { id } });
    },

    myTransactions: async (
      _: unknown,
      { type, limit = 20, offset = 0 }: { type?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = { userId };
      if (type) {
        where.type = type;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.transaction.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.transaction.count({ where }),
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

    myBalance: async (_: unknown, __: unknown, context: Context) => {
      const userId = requireAuth(context);

      // Calculate balance from transactions
      const transactions = await prisma.transaction.findMany({
        where: { userId },
      });

      const available = transactions
        .filter((t) => t.type === 'PAYMENT' || t.type === 'REFUND')
        .reduce((sum, t) => sum + t.amount, 0);

      const pending = await prisma.payment
        .aggregate({
          where: { payerId: userId, status: 'PENDING' },
          _sum: { amount: true },
        })
        .then((result) => result._sum.amount || 0);

      return {
        available,
        pending,
        currency: 'USD',
      };
    },
  },

  Mutation: {
    createPayment: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      context: Context
    ) => {
      requireAuth(context);

      const payment = await prisma.payment.create({
        data: {
          bookingId: input.bookingId as string,
          payerId: input.payerId as string,
          recipientId: input.recipientId as string | undefined,
          amount: input.amount as number,
          currency: (input.currency as string) || 'USD',
          description: input.description as string | undefined,
          metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          status: 'PENDING',
        },
      });

      return payment;
    },

    processPayment: async (
      _: unknown,
      { input }: { input: { paymentId: string; paymentMethodId?: string } },
      context: Context
    ) => {
      requireAuth(context);

      const payment = await prisma.payment.findUnique({
        where: { id: input.paymentId },
      });

      if (!payment) {
        throw new GraphQLError('Payment not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (payment.status !== 'PENDING') {
        throw new GraphQLError('Payment already processed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let stripeChargeId: string;

      try {
        // Update status to processing
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'PROCESSING' },
        });

        if (stripe) {
          // Real Stripe charge
          const charge = await stripe.charges.create({
            amount: payment.amount,
            currency: payment.currency.toLowerCase(),
            source: input.paymentMethodId || 'tok_visa', // Use test token if no method provided
            description: payment.description || `Payment for booking ${payment.bookingId}`,
          });
          stripeChargeId = charge.id;
        } else {
          // Simulate charge in dev mode
          stripeChargeId = await simulateStripeCharge(payment.amount);
        }

        // Update payment as completed
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            stripeChargeId,
            completedAt: new Date(),
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: payment.payerId,
            type: 'PAYMENT',
            amount: -payment.amount, // Negative for debit
            currency: payment.currency,
            paymentId: payment.id,
            description: `Payment for booking ${payment.bookingId}`,
          },
        });

        // If there's a recipient, create credit transaction
        if (payment.recipientId) {
          await prisma.transaction.create({
            data: {
              userId: payment.recipientId,
              type: 'PAYMENT',
              amount: payment.amount, // Positive for credit
              currency: payment.currency,
              paymentId: payment.id,
              description: `Received payment for booking ${payment.bookingId}`,
            },
          });
        }

        return updatedPayment;
      } catch (error) {
        // Update payment as failed
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
          },
        });

        throw new GraphQLError('Payment processing failed', {
          extensions: {
            code: 'PAYMENT_FAILED',
            originalError: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    },

    refundPayment: async (
      _: unknown,
      { input }: { input: { paymentId: string; amount?: number; reason?: string } },
      context: Context
    ) => {
      requireAuth(context);

      const payment = await prisma.payment.findUnique({
        where: { id: input.paymentId },
      });

      if (!payment) {
        throw new GraphQLError('Payment not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (payment.status !== 'COMPLETED') {
        throw new GraphQLError('Can only refund completed payments', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const refundAmount = input.amount || payment.amount;

      if (refundAmount > payment.amount) {
        throw new GraphQLError('Refund amount exceeds payment amount', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      try {
        if (stripe && payment.stripeChargeId) {
          // Real Stripe refund
          await stripe.refunds.create({
            charge: payment.stripeChargeId,
            amount: refundAmount,
            reason: input.reason === 'duplicate' ? 'duplicate' : 'requested_by_customer',
          });
        }

        // Update payment record
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            refundedAt: new Date(),
            refundAmount,
            refundReason: input.reason,
          },
        });

        // Create refund transaction
        await prisma.transaction.create({
          data: {
            userId: payment.payerId,
            type: 'REFUND',
            amount: refundAmount, // Positive for credit back
            currency: payment.currency,
            paymentId: payment.id,
            description: `Refund for booking ${payment.bookingId}`,
          },
        });

        return updatedPayment;
      } catch (error) {
        throw new GraphQLError('Refund processing failed', {
          extensions: {
            code: 'REFUND_FAILED',
            originalError: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    },

    addPaymentMethod: async (
      _: unknown,
      { input }: { input: { userId: string; stripePaymentMethodId: string; isDefault?: boolean } },
      context: Context
    ) => {
      requireAuth(context);

      let type = 'CARD';
      let brand: string | null = null;
      let last4 = '0000';
      let expiryMonth: number | null = null;
      let expiryYear: number | null = null;

      if (stripe) {
        // Fetch payment method details from Stripe
        const paymentMethod = await stripe.paymentMethods.retrieve(input.stripePaymentMethodId);

        if (paymentMethod.card) {
          type = 'CARD';
          brand = paymentMethod.card.brand;
          last4 = paymentMethod.card.last4;
          expiryMonth = paymentMethod.card.exp_month;
          expiryYear = paymentMethod.card.exp_year;
        } else if (paymentMethod.type === 'us_bank_account') {
          type = 'BANK_ACCOUNT';
          last4 = (paymentMethod.us_bank_account as { last4: string })?.last4 || '0000';
        }
      }

      // If setting as default, unset other defaults
      if (input.isDefault) {
        await prisma.paymentMethod.updateMany({
          where: { userId: input.userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId: input.userId,
          type,
          brand,
          last4,
          expiryMonth,
          expiryYear,
          stripePaymentMethodId: input.stripePaymentMethodId,
          isDefault: input.isDefault || false,
          isVerified: true,
        },
      });

      return paymentMethod;
    },

    removePaymentMethod: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });

      if (!paymentMethod) {
        throw new GraphQLError('Payment method not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Detach from Stripe if configured
      if (stripe) {
        try {
          await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);
        } catch (error) {
          // Continue even if Stripe fails (might already be detached)
          console.error('Failed to detach from Stripe:', error);
        }
      }

      await prisma.paymentMethod.delete({ where: { id } });

      return true;
    },

    setDefaultPaymentMethod: async (_: unknown, { id }: { id: string }, context: Context) => {
      const userId = requireAuth(context);

      const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });

      if (!paymentMethod) {
        throw new GraphQLError('Payment method not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Unset other defaults
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // Set this one as default
      return prisma.paymentMethod.update({
        where: { id },
        data: { isDefault: true },
      });
    },

    createPayout: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      context: Context
    ) => {
      requireAuth(context);

      const payout = await prisma.payout.create({
        data: {
          userId: input.userId as string,
          amount: input.amount as number,
          currency: (input.currency as string) || 'USD',
          description: input.description as string | undefined,
          metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          status: 'PENDING',
        },
      });

      return payout;
    },

    processPayout: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const payout = await prisma.payout.findUnique({ where: { id } });

      if (!payout) {
        throw new GraphQLError('Payout not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (payout.status !== 'PENDING') {
        throw new GraphQLError('Payout already processed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let stripePayoutId: string;

      try {
        // Update status to processing
        await prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'PROCESSING' },
        });

        if (stripe) {
          // Real Stripe payout
          const stripePayout = await stripe.payouts.create({
            amount: payout.amount,
            currency: payout.currency.toLowerCase(),
            description: payout.description || `Payout to user ${payout.userId}`,
          });
          stripePayoutId = stripePayout.id;
        } else {
          // Simulate payout in dev mode
          stripePayoutId = await simulateStripePayout(payout.amount);
        }

        // Update payout as completed
        const updatedPayout = await prisma.payout.update({
          where: { id: payout.id },
          data: {
            status: 'COMPLETED',
            stripePayoutId,
            completedAt: new Date(),
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: payout.userId,
            type: 'PAYOUT',
            amount: -payout.amount, // Negative for debit
            currency: payout.currency,
            payoutId: payout.id,
            description: payout.description || 'Payout',
          },
        });

        return updatedPayout;
      } catch (error) {
        // Update payout as failed
        await prisma.payout.update({
          where: { id: payout.id },
          data: {
            status: 'FAILED',
            failureCode: 'PROCESSING_ERROR',
            failureMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        throw new GraphQLError('Payout processing failed', {
          extensions: {
            code: 'PAYOUT_FAILED',
            originalError: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    },
  },

  // Payment type resolvers for federation
  Payment: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.payment.findUnique({ where: { id: reference.id } });
    },
    metadata: (payment: { metadata?: string | null }) => {
      return payment.metadata ? JSON.parse(payment.metadata) : null;
    },
  },

  PaymentMethod: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.paymentMethod.findUnique({ where: { id: reference.id } });
    },
  },

  Payout: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.payout.findUnique({ where: { id: reference.id } });
    },
    metadata: (payout: { metadata?: string | null }) => {
      return payout.metadata ? JSON.parse(payout.metadata) : null;
    },
  },

  Transaction: {
    metadata: (transaction: { metadata?: string | null }) => {
      return transaction.metadata ? JSON.parse(transaction.metadata) : null;
    },
  },

  // Custom scalars
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },

  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      }
      return null;
    },
  }),
};
