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

// Calculate Freedom Score based on lifestyle preferences
function calculateFreedomScore(listing: {
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  partyFriendly?: boolean;
  instantBook?: boolean;
}): number {
  let score = 50; // Base score

  if (listing.smokingAllowed) score += 15;
  if (listing.petsAllowed) score += 15;
  if (listing.partyFriendly) score += 10;
  if (listing.instantBook) score += 10;

  return Math.min(100, score);
}

export const resolvers = {
  Query: {
    listing: async (_: unknown, { id }: { id: string }) => {
      return prisma.listing.findUnique({
        where: { id },
        include: { photos: true, roommates: true, availability: true },
      });
    },

    listings: async (
      _: unknown,
      {
        filter,
        sortBy = 'NEWEST',
        limit = 20,
        offset = 0,
      }: {
        filter?: Record<string, unknown>;
        sortBy?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      const where: Record<string, unknown> = { status: 'ACTIVE' };

      if (filter) {
        if (filter.city) where.city = filter.city;
        if (filter.state) where.state = filter.state;
        if (filter.type) where.type = filter.type;
        if (filter.priceMin || filter.priceMax) {
          where.price = {};
          if (filter.priceMin) (where.price as Record<string, unknown>).gte = filter.priceMin;
          if (filter.priceMax) (where.price as Record<string, unknown>).lte = filter.priceMax;
        }
        if (filter.bedroomsMin) where.bedrooms = { gte: filter.bedroomsMin };
        if (filter.freedomScoreMin) where.freedomScore = { gte: filter.freedomScoreMin };
        if (filter.smokingAllowed !== undefined) where.smokingAllowed = filter.smokingAllowed;
        if (filter.petsAllowed !== undefined) where.petsAllowed = filter.petsAllowed;
        if (filter.partyFriendly !== undefined) where.partyFriendly = filter.partyFriendly;
        if (filter.instantBook !== undefined) where.instantBook = filter.instantBook;
      }

      // Determine sort order
      let orderBy: Record<string, string> = { createdAt: 'desc' };
      switch (sortBy) {
        case 'PRICE_ASC':
          orderBy = { price: 'asc' };
          break;
        case 'PRICE_DESC':
          orderBy = { price: 'desc' };
          break;
        case 'FREEDOM_SCORE':
          orderBy = { freedomScore: 'desc' };
          break;
        case 'POPULARITY':
          orderBy = { viewCount: 'desc' };
          break;
      }

      const [nodes, totalCount] = await Promise.all([
        prisma.listing.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy,
          include: { photos: true, roommates: true },
        }),
        prisma.listing.count({ where }),
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

    searchListings: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      // For now, use basic filtering - will integrate Elasticsearch later
      const where: Record<string, unknown> = { status: 'ACTIVE' };

      if (input.location) {
        where.OR = [
          { city: { contains: input.location as string } },
          { state: { contains: input.location as string } },
          { neighborhood: { contains: input.location as string } },
        ];
      }

      if (input.filter) {
        const filter = input.filter as Record<string, unknown>;
        if (filter.priceMin) where.price = { gte: filter.priceMin };
        if (filter.priceMax) {
          where.price = { ...(where.price as object || {}), lte: filter.priceMax };
        }
      }

      const listings = await prisma.listing.findMany({
        where,
        take: (input.limit as number) || 20,
        skip: (input.offset as number) || 0,
        include: { photos: true, roommates: true },
      });

      const total = await prisma.listing.count({ where });

      return {
        listings,
        total,
        facets: {
          priceRanges: [],
          neighborhoods: [],
          types: [],
          amenities: [],
        },
      };
    },

    myListings: async (
      _: unknown,
      { status }: { status?: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const where: Record<string, unknown> = { hostId: userId };
      if (status) where.status = status;

      return prisma.listing.findMany({
        where,
        include: { photos: true, roommates: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    similarListings: async (
      _: unknown,
      { listingId, limit = 5 }: { listingId: string; limit?: number }
    ) => {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) return [];

      return prisma.listing.findMany({
        where: {
          id: { not: listingId },
          status: 'ACTIVE',
          city: listing.city,
          price: {
            gte: listing.price * 0.7,
            lte: listing.price * 1.3,
          },
        },
        take: limit,
        include: { photos: true },
      });
    },

    availability: async (
      _: unknown,
      {
        listingId,
        startDate,
        endDate,
      }: { listingId: string; startDate: string; endDate: string }
    ) => {
      return prisma.availability.findMany({
        where: {
          listingId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: { date: 'asc' },
      });
    },

    featuredListings: async (
      _: unknown,
      { city, limit = 10 }: { city?: string; limit?: number }
    ) => {
      const where: Record<string, unknown> = { status: 'ACTIVE' };
      if (city) where.city = city;

      return prisma.listing.findMany({
        where,
        take: limit,
        orderBy: [{ freedomScore: 'desc' }, { viewCount: 'desc' }],
        include: { photos: true },
      });
    },
  },

  Mutation: {
    createListing: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const freedomScore = calculateFreedomScore(input);

      const listing = await prisma.listing.create({
        data: {
          hostId: userId,
          title: input.title as string,
          description: input.description as string,
          type: input.type as string,
          status: 'DRAFT',
          city: input.city as string,
          state: input.state as string,
          address: input.address as string | undefined,
          zipCode: input.zipCode as string | undefined,
          neighborhood: input.neighborhood as string | undefined,
          lat: input.lat as number | undefined,
          lng: input.lng as number | undefined,
          price: input.price as number,
          currency: (input.currency as string) || 'USD',
          depositAmount: input.depositAmount as number | undefined,
          utilitiesIncluded: (input.utilitiesIncluded as boolean) || false,
          bedrooms: input.bedrooms as number,
          bathrooms: input.bathrooms as number,
          squareFeet: input.squareFeet as number | undefined,
          furnished: (input.furnished as boolean) || false,
          freedomScore,
          smokingAllowed: (input.smokingAllowed as boolean) || false,
          petsAllowed: (input.petsAllowed as boolean) || false,
          partyFriendly: (input.partyFriendly as boolean) || false,
          dietaryPreference: input.dietaryPreference as string | undefined,
          availableFrom: new Date(input.availableFrom as string),
          availableUntil: input.availableUntil ? new Date(input.availableUntil as string) : null,
          minStay: input.minStay as number | undefined,
          maxStay: input.maxStay as number | undefined,
          instantBook: (input.instantBook as boolean) || false,
          amenities: JSON.stringify(input.amenities || []),
          houseRules: JSON.stringify(input.houseRules || []),
        },
        include: { photos: true, roommates: true },
      });

      return listing;
    },

    updateListing: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Verify ownership
      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const updateData: Record<string, unknown> = {};

      // Map input fields to update data
      const fields = [
        'title', 'description', 'type', 'price', 'depositAmount',
        'utilitiesIncluded', 'bedrooms', 'bathrooms', 'squareFeet',
        'furnished', 'smokingAllowed', 'petsAllowed', 'partyFriendly',
        'dietaryPreference', 'minStay', 'maxStay', 'instantBook',
      ];

      for (const field of fields) {
        if (input[field] !== undefined) {
          updateData[field] = input[field];
        }
      }

      if (input.availableFrom) {
        updateData.availableFrom = new Date(input.availableFrom as string);
      }
      if (input.availableUntil) {
        updateData.availableUntil = new Date(input.availableUntil as string);
      }
      if (input.amenities) {
        updateData.amenities = JSON.stringify(input.amenities);
      }
      if (input.houseRules) {
        updateData.houseRules = JSON.stringify(input.houseRules);
      }

      // Recalculate freedom score if lifestyle fields changed
      if (
        input.smokingAllowed !== undefined ||
        input.petsAllowed !== undefined ||
        input.partyFriendly !== undefined ||
        input.instantBook !== undefined
      ) {
        updateData.freedomScore = calculateFreedomScore({
          smokingAllowed: (input.smokingAllowed as boolean) ?? listing.smokingAllowed,
          petsAllowed: (input.petsAllowed as boolean) ?? listing.petsAllowed,
          partyFriendly: (input.partyFriendly as boolean) ?? listing.partyFriendly,
          instantBook: (input.instantBook as boolean) ?? listing.instantBook,
        });
      }

      return prisma.listing.update({
        where: { id },
        data: updateData,
        include: { photos: true, roommates: true },
      });
    },

    publishListing: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.listing.update({
        where: { id },
        data: { status: 'ACTIVE' },
        include: { photos: true, roommates: true },
      });
    },

    pauseListing: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.listing.update({
        where: { id },
        data: { status: 'PAUSED' },
        include: { photos: true, roommates: true },
      });
    },

    resumeListing: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.listing.update({
        where: { id },
        data: { status: 'ACTIVE' },
        include: { photos: true, roommates: true },
      });
    },

    markAsRented: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.listing.update({
        where: { id },
        data: { status: 'RENTED' },
        include: { photos: true, roommates: true },
      });
    },

    deleteListing: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await prisma.listing.delete({ where: { id } });
      return true;
    },

    addPhotos: async (
      _: unknown,
      { listingId, urls }: { listingId: string; urls: string[] },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const existingPhotos = await prisma.photo.count({ where: { listingId } });

      const photos = await Promise.all(
        urls.map((url, index) =>
          prisma.photo.create({
            data: {
              listingId,
              url,
              order: existingPhotos + index,
              isPrimary: existingPhotos === 0 && index === 0,
            },
          })
        )
      );

      return photos;
    },

    removePhoto: async (
      _: unknown,
      { listingId, photoId }: { listingId: string; photoId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await prisma.photo.delete({ where: { id: photoId } });
      return true;
    },

    reorderPhotos: async (
      _: unknown,
      { listingId, photoIds }: { listingId: string; photoIds: string[] },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await Promise.all(
        photoIds.map((id, index) =>
          prisma.photo.update({
            where: { id },
            data: { order: index },
          })
        )
      );

      return prisma.photo.findMany({
        where: { listingId },
        orderBy: { order: 'asc' },
      });
    },

    setPrimaryPhoto: async (
      _: unknown,
      { listingId, photoId }: { listingId: string; photoId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Unset current primary
      await prisma.photo.updateMany({
        where: { listingId, isPrimary: true },
        data: { isPrimary: false },
      });

      // Set new primary
      return prisma.photo.update({
        where: { id: photoId },
        data: { isPrimary: true },
      });
    },

    updateAvailability: async (
      _: unknown,
      {
        listingId,
        entries,
      }: { listingId: string; entries: Array<{ date: string; available: boolean; priceOverride?: number; minStay?: number; note?: string }> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const results = await Promise.all(
        entries.map((entry) =>
          prisma.availability.upsert({
            where: {
              listingId_date: {
                listingId,
                date: new Date(entry.date),
              },
            },
            update: {
              available: entry.available,
              priceOverride: entry.priceOverride,
              minStay: entry.minStay,
              note: entry.note,
            },
            create: {
              listingId,
              date: new Date(entry.date),
              available: entry.available,
              priceOverride: entry.priceOverride,
              minStay: entry.minStay,
              note: entry.note,
            },
          })
        )
      );

      return results;
    },

    blockDates: async (
      _: unknown,
      { listingId, dates }: { listingId: string; dates: string[] },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const results = await Promise.all(
        dates.map((date) =>
          prisma.availability.upsert({
            where: {
              listingId_date: {
                listingId,
                date: new Date(date),
              },
            },
            update: { available: false },
            create: {
              listingId,
              date: new Date(date),
              available: false,
            },
          })
        )
      );

      return results;
    },

    unblockDates: async (
      _: unknown,
      { listingId, dates }: { listingId: string; dates: string[] },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const results = await Promise.all(
        dates.map((date) =>
          prisma.availability.upsert({
            where: {
              listingId_date: {
                listingId,
                date: new Date(date),
              },
            },
            update: { available: true },
            create: {
              listingId,
              date: new Date(date),
              available: true,
            },
          })
        )
      );

      return results;
    },

    addRoommate: async (
      _: unknown,
      { listingId, input }: { listingId: string; input: Record<string, unknown> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.roommate.create({
        data: {
          listingId,
          name: input.name as string,
          age: input.age as number | undefined,
          occupation: input.occupation as string | undefined,
          bio: input.bio as string | undefined,
          languages: JSON.stringify(input.languages || []),
          moveInDate: input.moveInDate ? new Date(input.moveInDate as string) : null,
        },
      });
    },

    updateRoommate: async (
      _: unknown,
      {
        listingId,
        roommateId,
        input,
      }: { listingId: string; roommateId: string; input: Record<string, unknown> },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.roommate.update({
        where: { id: roommateId },
        data: {
          name: input.name as string | undefined,
          age: input.age as number | undefined,
          occupation: input.occupation as string | undefined,
          bio: input.bio as string | undefined,
          languages: input.languages ? JSON.stringify(input.languages) : undefined,
          moveInDate: input.moveInDate ? new Date(input.moveInDate as string) : undefined,
        },
      });
    },

    removeRoommate: async (
      _: unknown,
      { listingId, roommateId }: { listingId: string; roommateId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.hostId !== userId) {
        throw new GraphQLError('Listing not found or not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await prisma.roommate.delete({ where: { id: roommateId } });
      return true;
    },

    recordView: async (_: unknown, { listingId }: { listingId: string }) => {
      await prisma.listing.update({
        where: { id: listingId },
        data: { viewCount: { increment: 1 } },
      });
      return true;
    },

    toggleFavorite: async (
      _: unknown,
      { listingId }: { listingId: string },
      context: Context
    ) => {
      requireAuth(context);
      // TODO: Implement favorites with user-listing junction table
      await prisma.listing.update({
        where: { id: listingId },
        data: { favoriteCount: { increment: 1 } },
      });
      return true;
    },
  },

  // Listing type resolvers
  Listing: {
    __resolveReference: async (reference: { id: string }) => {
      return prisma.listing.findUnique({
        where: { id: reference.id },
        include: { photos: true, roommates: true },
      });
    },

    host: (listing: { hostId: string }) => {
      return { __typename: 'User', id: listing.hostId };
    },

    location: (listing: { lat?: number; lng?: number }) => {
      if (listing.lat && listing.lng) {
        return { lat: listing.lat, lng: listing.lng };
      }
      return null;
    },

    amenities: (listing: { amenities: string }) => {
      try {
        return JSON.parse(listing.amenities);
      } catch {
        return [];
      }
    },

    houseRules: (listing: { houseRules: string }) => {
      try {
        return JSON.parse(listing.houseRules);
      } catch {
        return [];
      }
    },
  },

  Roommate: {
    languages: (roommate: { languages: string }) => {
      try {
        return JSON.parse(roommate.languages);
      } catch {
        return [];
      }
    },
  },

  // DateTime scalar
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
