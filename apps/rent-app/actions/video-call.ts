'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createRoom, createMeetingToken, deleteRoom, generateRoomName, getRoomUrl, isDailyConfigured } from '@/lib/daily';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

/**
 * Schedule a video call with another user
 */
export async function scheduleVideoCallAction(params: {
  conversationId: string;
  scheduledAt: Date;
  duration?: number;
}): Promise<ActionResult<{ callId: string; roomUrl: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  if (!isDailyConfigured()) {
    return { success: false, error: 'Video calls are not configured' };
  }

  const { conversationId, scheduledAt, duration = 30 } = params;

  // Get the conversation to find the other participant
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return { success: false, error: 'Conversation not found' };
  }

  // Verify user is a participant
  const isParticipant =
    conversation.participant1Id === session.user.id || conversation.participant2Id === session.user.id;

  if (!isParticipant) {
    return { success: false, error: 'Not authorized to schedule calls in this conversation' };
  }

  // Determine guest (the other participant)
  const guestId =
    conversation.participant1Id === session.user.id ? conversation.participant2Id : conversation.participant1Id;

  // Validate scheduled time is in the future
  const now = new Date();
  if (scheduledAt <= now) {
    return { success: false, error: 'Scheduled time must be in the future' };
  }

  // Check for existing overlapping calls
  const scheduledEnd = new Date(scheduledAt.getTime() + duration * 60 * 1000);
  const existingCall = await prisma.videoCall.findFirst({
    where: {
      conversationId,
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      OR: [
        {
          scheduledAt: { lte: scheduledEnd },
          AND: {
            scheduledAt: { gte: new Date(scheduledAt.getTime() - duration * 60 * 1000) },
          },
        },
      ],
    },
  });

  if (existingCall) {
    return { success: false, error: 'A call is already scheduled around this time' };
  }

  try {
    // Create Daily.co room (expires 1 hour after scheduled time + duration)
    const expirySeconds = Math.floor((scheduledEnd.getTime() - now.getTime()) / 1000) + 3600;
    const roomName = generateRoomName('call', conversationId);

    const room = await createRoom({
      name: roomName,
      expirySeconds,
      maxParticipants: 2,
      enableChat: true,
      enableScreenshare: true,
    });

    // Create video call record
    const videoCall = await prisma.videoCall.create({
      data: {
        conversationId,
        hostId: session.user.id,
        guestId,
        roomName: room.name,
        roomUrl: room.url,
        scheduledAt,
        duration,
      },
    });

    // Send system message about scheduled call
    await prisma.message.create({
      data: {
        conversationId,
        senderId: 'system',
        content: `📅 Video call scheduled for ${scheduledAt.toLocaleString()}. Duration: ${duration} minutes.`,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    revalidatePath('/messages');
    revalidatePath(`/messages/${conversationId}`);

    return { success: true, data: { callId: videoCall.id, roomUrl: room.url } };
  } catch (error) {
    console.error('Failed to schedule video call:', error);
    return { success: false, error: 'Failed to schedule video call' };
  }
}

/**
 * Get a meeting token for joining a video call
 */
export async function getVideoCallTokenAction(
  callId: string
): Promise<ActionResult<{ token: string; roomUrl: string }>> {
  const session = await auth();
  if (!session?.user?.id || !session.user.name) {
    return { success: false, error: 'Not authenticated' };
  }

  const videoCall = await prisma.videoCall.findUnique({
    where: { id: callId },
  });

  if (!videoCall) {
    return { success: false, error: 'Video call not found' };
  }

  // Verify user is a participant
  const isHost = videoCall.hostId === session.user.id;
  const isGuest = videoCall.guestId === session.user.id;

  if (!isHost && !isGuest) {
    return { success: false, error: 'Not authorized to join this call' };
  }

  // Check call status
  if (videoCall.status === 'CANCELLED') {
    return { success: false, error: 'This call has been cancelled' };
  }

  if (videoCall.status === 'COMPLETED') {
    return { success: false, error: 'This call has ended' };
  }

  try {
    const token = await createMeetingToken({
      roomName: videoCall.roomName,
      userId: session.user.id,
      userName: session.user.name,
      expirySeconds: 7200, // 2 hours
      isOwner: isHost,
    });

    return { success: true, data: { token, roomUrl: videoCall.roomUrl } };
  } catch (error) {
    console.error('Failed to create meeting token:', error);
    return { success: false, error: 'Failed to join video call' };
  }
}

/**
 * Start a video call (mark as in progress)
 */
export async function startVideoCallAction(callId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const videoCall = await prisma.videoCall.findUnique({
    where: { id: callId },
  });

  if (!videoCall) {
    return { success: false, error: 'Video call not found' };
  }

  // Only host can officially start the call
  if (videoCall.hostId !== session.user.id) {
    return { success: false, error: 'Only the host can start the call' };
  }

  if (videoCall.status !== 'SCHEDULED') {
    return { success: false, error: 'Call cannot be started in its current state' };
  }

  await prisma.videoCall.update({
    where: { id: callId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    },
  });

  return { success: true };
}

/**
 * End a video call
 */
export async function endVideoCallAction(callId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const videoCall = await prisma.videoCall.findUnique({
    where: { id: callId },
  });

  if (!videoCall) {
    return { success: false, error: 'Video call not found' };
  }

  // Either participant can end the call
  const isParticipant = videoCall.hostId === session.user.id || videoCall.guestId === session.user.id;
  if (!isParticipant) {
    return { success: false, error: 'Not authorized to end this call' };
  }

  if (videoCall.status !== 'IN_PROGRESS') {
    return { success: false, error: 'Call is not in progress' };
  }

  await prisma.videoCall.update({
    where: { id: callId },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
    },
  });

  // Send completion message
  await prisma.message.create({
    data: {
      conversationId: videoCall.conversationId,
      senderId: 'system',
      content: '✅ Video call completed. You can now continue your conversation.',
    },
  });

  // Clean up Daily.co room
  try {
    await deleteRoom(videoCall.roomName);
  } catch (error) {
    console.error('Failed to delete Daily room:', error);
    // Don't fail the action if room deletion fails
  }

  revalidatePath('/messages');
  revalidatePath(`/messages/${videoCall.conversationId}`);

  return { success: true };
}

/**
 * Cancel a scheduled video call
 */
export async function cancelVideoCallAction(callId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const videoCall = await prisma.videoCall.findUnique({
    where: { id: callId },
  });

  if (!videoCall) {
    return { success: false, error: 'Video call not found' };
  }

  // Either participant can cancel
  const isParticipant = videoCall.hostId === session.user.id || videoCall.guestId === session.user.id;
  if (!isParticipant) {
    return { success: false, error: 'Not authorized to cancel this call' };
  }

  if (videoCall.status !== 'SCHEDULED') {
    return { success: false, error: 'Only scheduled calls can be cancelled' };
  }

  await prisma.videoCall.update({
    where: { id: callId },
    data: { status: 'CANCELLED' },
  });

  // Send cancellation message
  await prisma.message.create({
    data: {
      conversationId: videoCall.conversationId,
      senderId: session.user.id,
      content: '❌ Video call cancelled.',
    },
  });

  // Clean up Daily.co room
  try {
    await deleteRoom(videoCall.roomName);
  } catch (error) {
    console.error('Failed to delete Daily room:', error);
  }

  revalidatePath('/messages');
  revalidatePath(`/messages/${videoCall.conversationId}`);

  return { success: true };
}

/**
 * Get upcoming video calls for the current user
 */
export async function getUpcomingCallsAction(): Promise<
  ActionResult<
    Array<{
      id: string;
      scheduledAt: Date;
      duration: number;
      roomUrl: string;
      isHost: boolean;
      conversationId: string;
    }>
  >
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const calls = await prisma.videoCall.findMany({
    where: {
      OR: [{ hostId: session.user.id }, { guestId: session.user.id }],
      status: 'SCHEDULED',
      scheduledAt: { gte: new Date() },
    },
    orderBy: { scheduledAt: 'asc' },
    take: 10,
  });

  return {
    success: true,
    data: calls.map((call) => ({
      id: call.id,
      scheduledAt: call.scheduledAt,
      duration: call.duration,
      roomUrl: call.roomUrl,
      isHost: call.hostId === session.user.id,
      conversationId: call.conversationId,
    })),
  };
}

/**
 * Get video call details
 */
export async function getVideoCallAction(callId: string): Promise<
  ActionResult<{
    id: string;
    scheduledAt: Date;
    duration: number;
    status: string;
    roomUrl: string;
    isHost: boolean;
    conversationId: string;
  }>
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const call = await prisma.videoCall.findUnique({
    where: { id: callId },
  });

  if (!call) {
    return { success: false, error: 'Video call not found' };
  }

  const isParticipant = call.hostId === session.user.id || call.guestId === session.user.id;
  if (!isParticipant) {
    return { success: false, error: 'Not authorized to view this call' };
  }

  return {
    success: true,
    data: {
      id: call.id,
      scheduledAt: call.scheduledAt,
      duration: call.duration,
      status: call.status,
      roomUrl: call.roomUrl,
      isHost: call.hostId === session.user.id,
      conversationId: call.conversationId,
    },
  };
}
