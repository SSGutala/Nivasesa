'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

/**
 * Express interest in a listing (for renters/seekers)
 */
export async function expressInterestAction(listingId: string, message?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check if user already has a request for this listing
  const existing = await prisma.connectionRequest.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  if (existing) {
    return { success: false, error: 'You have already expressed interest in this listing' };
  }

  // Check listing exists and is available
  const listing = await prisma.roomListing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, ownerId: true },
  });

  if (!listing) {
    return { success: false, error: 'Listing not found' };
  }

  if (listing.ownerId === session.user.id) {
    return { success: false, error: 'Cannot express interest in your own listing' };
  }

  // Determine initial status based on listing status
  let requestStatus: 'PENDING' | 'WAITLISTED' = 'PENDING';
  if (listing.status === 'IN_DISCUSSION') {
    requestStatus = 'WAITLISTED';
  } else if (listing.status === 'UNAVAILABLE') {
    return { success: false, error: 'This listing is no longer available' };
  }

  // Create the connection request
  const request = await prisma.connectionRequest.create({
    data: {
      userId: session.user.id,
      listingId,
      message,
      status: requestStatus,
    },
  });

  // TODO: Send notification to host

  revalidatePath(`/listing/${listingId}`);

  return {
    success: true,
    data: request,
    message: requestStatus === 'WAITLISTED'
      ? 'You have been added to the waitlist'
      : 'Your interest has been sent to the host'
  };
}

/**
 * Accept a connection request (for hosts/owners)
 * Creates a conversation thread and updates listing status
 */
export async function acceptInterestAction(requestId: string): Promise<ActionResult<{ conversationId: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get the connection request
  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
    include: {
      listing: {
        select: { id: true, ownerId: true, title: true, status: true },
      },
    },
  });

  if (!request) {
    return { success: false, error: 'Request not found' };
  }

  // Verify the current user is the listing owner
  if (request.listing.ownerId !== session.user.id) {
    return { success: false, error: 'Not authorized to accept this request' };
  }

  // Check request is in a state that can be accepted
  if (request.status !== 'PENDING' && request.status !== 'WAITLISTED') {
    return { success: false, error: `Cannot accept a request with status: ${request.status}` };
  }

  // Create conversation and update statuses in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update connection request status
    await tx.connectionRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    // Update listing status to IN_DISCUSSION if it was AVAILABLE
    if (request.listing.status === 'AVAILABLE') {
      await tx.roomListing.update({
        where: { id: request.listing.id },
        data: { status: 'IN_DISCUSSION' },
      });
    }

    // Create or find existing conversation
    // Sort participant IDs to ensure consistent unique constraint handling
    const [participant1Id, participant2Id] = [request.userId, session.user!.id].sort();

    let conversation = await tx.conversation.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id,
          participant2Id,
        },
      },
    });

    if (!conversation) {
      conversation = await tx.conversation.create({
        data: {
          participant1Id,
          participant2Id,
          contextType: 'room_application',
          contextId: request.listing.id,
        },
      });
    }

    // Create system message indicating connection was accepted
    await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: 'system',
        content: `🎉 Connection accepted! You can now message about "${request.listing.title}". A virtual meet & greet is required before proceeding with any transaction.`,
      },
    });

    return conversation;
  });

  revalidatePath(`/listing/${request.listing.id}`);
  revalidatePath('/dashboard/applications');
  revalidatePath('/messages');

  return { success: true, data: { conversationId: result.id } };
}

/**
 * Decline a connection request (for hosts/owners)
 */
export async function declineInterestAction(requestId: string, reason?: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get the connection request
  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
    include: {
      listing: {
        select: { id: true, ownerId: true },
      },
    },
  });

  if (!request) {
    return { success: false, error: 'Request not found' };
  }

  // Verify the current user is the listing owner
  if (request.listing.ownerId !== session.user.id) {
    return { success: false, error: 'Not authorized to decline this request' };
  }

  // Check request is in a state that can be declined
  if (request.status !== 'PENDING' && request.status !== 'WAITLISTED') {
    return { success: false, error: `Cannot decline a request with status: ${request.status}` };
  }

  // Update request status
  await prisma.connectionRequest.update({
    where: { id: requestId },
    data: {
      status: 'DECLINED',
      // Store decline reason in message field if provided
      message: reason ? `[DECLINED] ${reason}` : request.message,
    },
  });

  // TODO: Send notification to requester

  revalidatePath(`/listing/${request.listing.id}`);
  revalidatePath('/dashboard/applications');

  return { success: true };
}

/**
 * Withdraw a connection request (for renters/seekers)
 */
export async function withdrawInterestAction(requestId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get the connection request
  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
    include: {
      listing: {
        select: { id: true },
      },
    },
  });

  if (!request) {
    return { success: false, error: 'Request not found' };
  }

  // Verify the current user is the requester
  if (request.userId !== session.user.id) {
    return { success: false, error: 'Not authorized to withdraw this request' };
  }

  // Check request is in a state that can be withdrawn
  if (request.status === 'DECLINED' || request.status === 'WITHDRAWN') {
    return { success: false, error: `Cannot withdraw a request with status: ${request.status}` };
  }

  // Update request status
  await prisma.connectionRequest.update({
    where: { id: requestId },
    data: { status: 'WITHDRAWN' },
  });

  revalidatePath(`/listing/${request.listing.id}`);
  revalidatePath('/dashboard/applications');

  return { success: true };
}

/**
 * Get connection requests for a listing (for hosts)
 */
export async function getListingRequestsAction(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify user owns the listing
  const listing = await prisma.roomListing.findUnique({
    where: { id: listingId },
    select: { ownerId: true },
  });

  if (!listing || listing.ownerId !== session.user.id) {
    return { success: false, error: 'Not authorized' };
  }

  const requests = await prisma.connectionRequest.findMany({
    where: { listingId },
    orderBy: { createdAt: 'desc' },
  });

  return { success: true, data: requests };
}

/**
 * Get user's own connection requests (for renters)
 */
export async function getMyRequestsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const requests = await prisma.connectionRequest.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          state: true,
          status: true,
          photos: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { success: true, data: requests };
}

/**
 * Join the waitlist for a listing
 */
export async function joinWaitlistAction(
  listingId: string,
  options?: { notifyByEmail?: boolean; notifyInApp?: boolean }
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check listing exists
  const listing = await prisma.roomListing.findUnique({
    where: { id: listingId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!listing) {
    return { success: false, error: 'Listing not found' };
  }

  if (listing.ownerId === session.user.id) {
    return { success: false, error: 'Cannot join waitlist for your own listing' };
  }

  // Check if already on waitlist
  const existing = await prisma.waitlistEntry.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  if (existing) {
    return { success: false, error: 'Already on waitlist for this listing' };
  }

  // Create waitlist entry
  await prisma.waitlistEntry.create({
    data: {
      userId: session.user.id,
      listingId,
      notifyByEmail: options?.notifyByEmail ?? true,
      notifyInApp: options?.notifyInApp ?? true,
    },
  });

  revalidatePath(`/listing/${listingId}`);

  return { success: true };
}

/**
 * Leave the waitlist for a listing
 */
export async function leaveWaitlistAction(listingId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const entry = await prisma.waitlistEntry.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  if (!entry) {
    return { success: false, error: 'Not on waitlist for this listing' };
  }

  await prisma.waitlistEntry.delete({
    where: { id: entry.id },
  });

  revalidatePath(`/listing/${listingId}`);

  return { success: true };
}

/**
 * Notify waitlist when listing becomes available again
 * (Called by listing owner when status changes to AVAILABLE)
 */
export async function notifyWaitlistAction(listingId: string): Promise<ActionResult<{ notifiedCount: number }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify user owns the listing
  const listing = await prisma.roomListing.findUnique({
    where: { id: listingId },
    select: { id: true, ownerId: true, title: true, status: true },
  });

  if (!listing || listing.ownerId !== session.user.id) {
    return { success: false, error: 'Not authorized' };
  }

  // Get all active waitlist entries
  const waitlistEntries = await prisma.waitlistEntry.findMany({
    where: {
      listingId,
      status: 'ACTIVE',
    },
  });

  if (waitlistEntries.length === 0) {
    return { success: true, data: { notifiedCount: 0 } };
  }

  // Mark all entries as notified
  await prisma.waitlistEntry.updateMany({
    where: {
      listingId,
      status: 'ACTIVE',
    },
    data: {
      status: 'NOTIFIED',
      notifiedAt: new Date(),
    },
  });

  // TODO: Send actual email/in-app notifications to waitlisted users
  // This would typically trigger a notification service

  return { success: true, data: { notifiedCount: waitlistEntries.length } };
}

/**
 * Check if user is on waitlist for a listing
 */
export async function getWaitlistStatusAction(
  listingId: string
): Promise<ActionResult<{ onWaitlist: boolean; position?: number }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const entry = await prisma.waitlistEntry.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  if (!entry) {
    return { success: true, data: { onWaitlist: false } };
  }

  // Get position in waitlist
  const position = await prisma.waitlistEntry.count({
    where: {
      listingId,
      status: 'ACTIVE',
      createdAt: { lte: entry.createdAt },
    },
  });

  return { success: true, data: { onWaitlist: true, position } };
}
