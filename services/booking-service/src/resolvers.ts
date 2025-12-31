import { GraphQLError } from 'graphql';
import { prisma } from './prisma.js';

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

// Helper to calculate total price
function calculateTotalPrice(checkIn: Date, checkOut: Date, pricePerNight: number): number {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  return nights * pricePerNight;
}

export const resolvers = {
  Query: {
    booking: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);

      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new GraphQLError('Booking not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Verify user has access to this booking
      if (booking.renterId !== context.userId && booking.hostId !== context.userId) {
        throw new GraphQLError('Not authorized to view this booking', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return booking;
    },

    myBookings: async (
      _: unknown,
      { status, limit = 20, offset = 0 }: { status?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = {
        renterId: userId,
      };

      if (status) {
        where.status = status;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.booking.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.booking.count({ where }),
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

    hostBookings: async (
      _: unknown,
      { status, limit = 20, offset = 0 }: { status?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = {
        hostId: userId,
      };

      if (status) {
        where.status = status;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.booking.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.booking.count({ where }),
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

    bookingsForListing: async (
      _: unknown,
      {
        listingId,
        status,
        limit = 20,
        offset = 0,
      }: { listingId: string; status?: string; limit?: number; offset?: number },
      context: Context
    ) => {
      requireAuth(context);

      const where: Record<string, unknown> = {
        listingId,
      };

      if (status) {
        where.status = status;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.booking.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { checkIn: 'asc' },
        }),
        prisma.booking.count({ where }),
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

    checkAvailability: async (
      _: unknown,
      {
        listingId,
        checkIn,
        checkOut,
      }: { listingId: string; checkIn: string; checkOut: string }
    ) => {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Check for overlapping bookings that are not cancelled
      const overlapping = await prisma.booking.findFirst({
        where: {
          listingId,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          OR: [
            // New booking starts during existing booking
            {
              checkIn: {
                lte: checkInDate,
              },
              checkOut: {
                gt: checkInDate,
              },
            },
            // New booking ends during existing booking
            {
              checkIn: {
                lt: checkOutDate,
              },
              checkOut: {
                gte: checkOutDate,
              },
            },
            // New booking completely contains existing booking
            {
              checkIn: {
                gte: checkInDate,
              },
              checkOut: {
                lte: checkOutDate,
              },
            },
          ],
        },
      });

      return !overlapping;
    },
  },

  Mutation: {
    createBooking: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          listingId: string;
          checkIn: string;
          checkOut: string;
          guestCount?: number;
          message?: string;
        };
      },
      context: Context
    ) => {
      const renterId = requireAuth(context);

      const checkInDate = new Date(input.checkIn);
      const checkOutDate = new Date(input.checkOut);

      // Validate dates
      if (checkInDate >= checkOutDate) {
        throw new GraphQLError('Check-out date must be after check-in date', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (checkInDate < new Date()) {
        throw new GraphQLError('Check-in date must be in the future', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Check availability
      const available = await resolvers.Query.checkAvailability(
        _,
        {
          listingId: input.listingId,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
        }
      );

      if (!available) {
        throw new GraphQLError('Listing is not available for selected dates', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // TODO: Fetch listing details from listing-service via federation
      // For now, using a placeholder price
      const pricePerNight = 100; // This should come from listing service
      const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, pricePerNight);

      // TODO: Get hostId from listing service
      // For now, using a placeholder
      const hostId = 'placeholder-host-id';

      const booking = await prisma.booking.create({
        data: {
          listingId: input.listingId,
          renterId,
          hostId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice,
          guestCount: input.guestCount || 1,
          message: input.message,
          status: 'PENDING',
        },
      });

      return booking;
    },

    confirmBooking: async (
      _: unknown,
      { input }: { input: { bookingId: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new GraphQLError('Booking not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only host can confirm
      if (booking.hostId !== userId) {
        throw new GraphQLError('Only the host can confirm this booking', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      if (booking.status !== 'PENDING') {
        throw new GraphQLError('Only pending bookings can be confirmed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const updated = await prisma.booking.update({
        where: { id: input.bookingId },
        data: { status: 'CONFIRMED' },
      });

      return updated;
    },

    cancelBooking: async (
      _: unknown,
      { input }: { input: { bookingId: string; reason?: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new GraphQLError('Booking not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only renter or host can cancel
      if (booking.renterId !== userId && booking.hostId !== userId) {
        throw new GraphQLError('Not authorized to cancel this booking', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
        throw new GraphQLError('This booking cannot be cancelled', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const updated = await prisma.booking.update({
        where: { id: input.bookingId },
        data: {
          status: 'CANCELLED',
          cancelledBy: userId,
          cancelledAt: new Date(),
          cancellationReason: input.reason,
        },
      });

      return updated;
    },

    completeBooking: async (
      _: unknown,
      { input }: { input: { bookingId: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new GraphQLError('Booking not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only host can mark as completed
      if (booking.hostId !== userId) {
        throw new GraphQLError('Only the host can complete this booking', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      if (booking.status !== 'CONFIRMED') {
        throw new GraphQLError('Only confirmed bookings can be completed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Verify checkout date has passed
      if (new Date() < booking.checkOut) {
        throw new GraphQLError('Cannot complete booking before checkout date', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const updated = await prisma.booking.update({
        where: { id: input.bookingId },
        data: { status: 'COMPLETED' },
      });

      return updated;
    },
  },

  // Booking type resolvers for federation
  Booking: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.booking.findUnique({
        where: { id: reference.id },
      });
    },

    listing: (booking: { listingId: string }) => {
      // Return a stub that will be resolved by listing-service
      return { __typename: 'Listing', id: booking.listingId };
    },

    renter: (booking: { renterId: string }) => {
      // Return a stub that will be resolved by user-service
      return { __typename: 'User', id: booking.renterId };
    },

    host: (booking: { hostId: string }) => {
      // Return a stub that will be resolved by user-service
      return { __typename: 'User', id: booking.hostId };
    },
  },

  // Custom scalar for DateTime
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
