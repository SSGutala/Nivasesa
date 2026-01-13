/**
 * User utilities for rent-app
 *
 * These utilities demonstrate how to use the cross-database user lookup
 * functions from @niv/auth-db to resolve user references in the rent-app database.
 *
 * EXAMPLE USAGE PATTERNS:
 */

import {
  getUserById,
  getUsersByIds,
  getSafeUserInfo,
  getSafeUserInfos,
} from '@niv/auth-db';
import { prisma } from './prisma';

/**
 * Get enriched room listings with owner information
 *
 * This demonstrates how to fetch listings and enrich them with user data
 * from the auth database.
 */
export async function getRoomListingsWithOwners(filters?: {
  city?: string;
  state?: string;
  maxRent?: number;
}) {
  // Fetch listings from rent-app database
  const listings = await prisma.roomListing.findMany({
    where: {
      ...(filters?.city && { city: filters.city }),
      ...(filters?.state && { state: filters.state }),
      ...(filters?.maxRent && { rent: { lte: filters.maxRent } }),
      status: 'AVAILABLE',
    },
    take: 20,
  });

  // Extract all unique owner IDs
  const ownerIds = [...new Set(listings.map((l) => l.ownerId))];

  // Batch fetch owner info from auth database (efficient!)
  const owners = await getSafeUserInfos(ownerIds);

  // Enrich listings with owner data
  return listings.map((listing) => ({
    ...listing,
    owner: owners.get(listing.ownerId) || null,
  }));
}

/**
 * Get conversation with participant details
 *
 * Demonstrates resolving multiple user references in a single query.
 */
export async function getConversationWithParticipants(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!conversation) return null;

  // Get participant info from auth database
  const [participant1, participant2] = await Promise.all([
    getSafeUserInfo(conversation.participant1Id),
    getSafeUserInfo(conversation.participant2Id),
  ]);

  // Get message sender info (batch lookup for efficiency)
  const senderIds = [
    ...new Set(conversation.messages.map((m) => m.senderId)),
  ];
  const senders = await getSafeUserInfos(senderIds);

  return {
    ...conversation,
    participant1,
    participant2,
    messages: conversation.messages.map((msg) => ({
      ...msg,
      sender: senders.get(msg.senderId) || null,
    })),
  };
}

/**
 * Validate booking participants before creating
 *
 * Demonstrates user validation before database operations.
 */
export async function createBookingWithValidation(data: {
  listingId: string;
  guestId: string;
  hostId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}) {
  // Verify both guest and host exist in auth database
  const [guest, host] = await Promise.all([
    getUserById(data.guestId),
    getUserById(data.hostId),
  ]);

  if (!guest) {
    throw new Error(`Guest user not found: ${data.guestId}`);
  }

  if (!host) {
    throw new Error(`Host user not found: ${data.hostId}`);
  }

  // Verify listing exists and belongs to host
  const listing = await prisma.roomListing.findUnique({
    where: { id: data.listingId },
  });

  if (!listing) {
    throw new Error(`Listing not found: ${data.listingId}`);
  }

  if (listing.ownerId !== data.hostId) {
    throw new Error('Host does not own this listing');
  }

  // Create booking
  return await prisma.booking.create({
    data: {
      listingId: data.listingId,
      guestId: data.guestId,
      hostId: data.hostId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      totalPrice: data.totalPrice,
      serviceFee: data.totalPrice * 0.1, // 10% service fee
      status: 'INQUIRY',
    },
  });
}

/**
 * Get user's roommate profile with auth info
 *
 * Demonstrates joining data from both databases.
 */
export async function getUserRoommateProfile(userId: string) {
  // Get profile from rent-app database
  const profile = await prisma.roommateProfile.findUnique({
    where: { userId },
  });

  if (!profile) return null;

  // Get user info from auth database
  const user = await getSafeUserInfo(userId);

  return {
    ...profile,
    user,
  };
}

/**
 * Get group members with user details
 *
 * Demonstrates efficient batch loading for lists.
 */
export async function getGroupWithMembers(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!group) return null;

  // Get creator info
  const creator = await getSafeUserInfo(group.createdById);

  // Get all member user info (batch)
  const memberUserIds = group.members.map((m) => m.profile.userId);
  const memberUsers = await getSafeUserInfos(memberUserIds);

  return {
    ...group,
    creator,
    members: group.members.map((member) => ({
      ...member,
      user: memberUsers.get(member.profile.userId) || null,
    })),
  };
}
