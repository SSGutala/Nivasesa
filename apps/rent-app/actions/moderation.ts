'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Report content (user, listing, or message)
 */
export async function reportContentAction(
  targetType: 'user' | 'listing' | 'message',
  targetId: string,
  reason: 'spam' | 'harassment' | 'fraud' | 'inappropriate',
  description?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!targetType || !targetId || !reason) {
    return { success: false, error: 'Missing required fields' };
  }

  // Validate targetType
  if (!['user', 'listing', 'message'].includes(targetType)) {
    return { success: false, error: 'Invalid target type' };
  }

  // Validate reason
  if (!['spam', 'harassment', 'fraud', 'inappropriate'].includes(reason)) {
    return { success: false, error: 'Invalid reason' };
  }

  try {
    // Check if user has already reported this content
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        targetType,
        targetId,
      },
    });

    if (existingReport) {
      return { success: false, error: 'You have already reported this content' };
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetType,
        targetId,
        reason,
        description,
        status: 'pending',
      },
    });

    // TODO: Notify admins/moderators of new report
    // TODO: Auto-flag content if multiple reports received
    // TODO: Trigger automated content moderation if applicable

    return {
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.',
      data: report,
    };
  } catch (error) {
    console.error('Error reporting content:', error);
    return { success: false, error: 'Failed to submit report' };
  }
}

/**
 * Block a user
 */
export async function blockUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  // Prevent self-blocking
  if (userId === session.user.id) {
    return { success: false, error: 'Cannot block yourself' };
  }

  try {
    // Check if already blocked
    const existingBlock = await prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: session.user.id,
          blockedId: userId,
        },
      },
    });

    if (existingBlock) {
      return { success: false, error: 'User is already blocked' };
    }

    // Create block
    const block = await prisma.userBlock.create({
      data: {
        blockerId: session.user.id,
        blockedId: userId,
      },
    });

    // TODO: Hide all messages from blocked user
    // TODO: Remove any active connections/requests
    // TODO: Hide blocked user's content from search results

    return {
      success: true,
      message: 'User blocked successfully',
      data: block,
    };
  } catch (error) {
    console.error('Error blocking user:', error);
    return { success: false, error: 'Failed to block user' };
  }
}

/**
 * Unblock a user
 */
export async function unblockUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  try {
    // Find and delete the block
    const deleted = await prisma.userBlock.deleteMany({
      where: {
        blockerId: session.user.id,
        blockedId: userId,
      },
    });

    if (deleted.count === 0) {
      return { success: false, error: 'User is not blocked' };
    }

    return {
      success: true,
      message: 'User unblocked successfully',
    };
  } catch (error) {
    console.error('Error unblocking user:', error);
    return { success: false, error: 'Failed to unblock user' };
  }
}

/**
 * Get list of blocked users
 */
export async function getBlockedUsersAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const blocks = await prisma.userBlock.findMany({
      where: {
        blockerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: blocks,
    };
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    return { success: false, error: 'Failed to fetch blocked users' };
  }
}

/**
 * Check if a specific user is blocked
 */
export async function isUserBlockedAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  try {
    // Check both directions - if current user blocked them OR if they blocked current user
    const [blockedByMe, blockedMe] = await Promise.all([
      prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: session.user.id,
            blockedId: userId,
          },
        },
      }),
      prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: userId,
            blockedId: session.user.id,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        isBlocked: !!blockedByMe || !!blockedMe,
        blockedByMe: !!blockedByMe,
        blockedMe: !!blockedMe,
      },
    };
  } catch (error) {
    console.error('Error checking block status:', error);
    return { success: false, error: 'Failed to check block status' };
  }
}

/**
 * Get reports submitted by the current user
 */
export async function getMyReportsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const reports = await prisma.report.findMany({
      where: {
        reporterId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: reports,
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { success: false, error: 'Failed to fetch reports' };
  }
}
