'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface ConversationWithDetails {
  id: string
  participant1Id: string
  participant2Id: string
  contextType: string | null
  contextId: string | null
  lastMessageAt: Date
  createdAt: Date
  otherParticipant: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
  }
  lastMessage: {
    content: string
    createdAt: Date
    senderId: string
  } | null
  unreadCount: number
}

export interface MessageWithSender {
  id: string
  content: string
  senderId: string
  createdAt: Date
  readAt: Date | null
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

// Get or create a conversation between two users
export async function getOrCreateConversationAction(
  otherUserId: string,
  contextType?: string,
  contextId?: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    if (userId === otherUserId) {
      return { success: false, error: 'Cannot message yourself' }
    }

    // Check if conversation exists (order doesn't matter)
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: otherUserId },
          { participant1Id: otherUserId, participant2Id: userId },
        ],
      },
    })

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: otherUserId,
          contextType,
          contextId,
        },
      })
    }

    return { success: true, conversationId: conversation.id }
  } catch (error) {
    console.error('Error getting/creating conversation:', error)
    return { success: false, error: 'Failed to get conversation' }
  }
}

// Get all conversations for the current user
export async function getConversationsAction(): Promise<{
  success: boolean
  conversations?: ConversationWithDetails[]
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    })

    // Fetch participant details and unread counts
    const conversationsWithDetails: ConversationWithDetails[] = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId =
          conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, name: true, email: true, image: true, role: true },
        })

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            readAt: null,
          },
        })

        return {
          id: conv.id,
          participant1Id: conv.participant1Id,
          participant2Id: conv.participant2Id,
          contextType: conv.contextType,
          contextId: conv.contextId,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
          otherParticipant: otherUser || {
            id: otherUserId,
            name: 'Unknown User',
            email: '',
            image: null,
            role: 'BUYER',
          },
          lastMessage: conv.messages[0]
            ? {
                content: conv.messages[0].content,
                createdAt: conv.messages[0].createdAt,
                senderId: conv.messages[0].senderId,
              }
            : null,
          unreadCount,
        }
      })
    )

    return { success: true, conversations: conversationsWithDetails }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return { success: false, error: 'Failed to fetch conversations' }
  }
}

// Get messages in a conversation
export async function getMessagesAction(
  conversationId: string,
  cursor?: string,
  limit: number = 50
): Promise<{
  success: boolean
  messages?: MessageWithSender[]
  nextCursor?: string
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
    })

    if (!conversation) {
      return { success: false, error: 'Conversation not found' }
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    let nextCursor: string | undefined
    if (messages.length > limit) {
      const nextItem = messages.pop()
      nextCursor = nextItem?.id
    }

    // Fetch sender details
    const userIds = [...new Set(messages.map((m) => m.senderId))]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u]))

    const messagesWithSenders: MessageWithSender[] = messages
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt,
        readAt: msg.readAt,
        sender: userMap.get(msg.senderId) || {
          id: msg.senderId,
          name: 'Unknown',
          image: null,
        },
      }))
      .reverse() // Reverse to show oldest first

    return { success: true, messages: messagesWithSenders, nextCursor }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { success: false, error: 'Failed to fetch messages' }
  }
}

// Send a message
export async function sendMessageAction(
  conversationId: string,
  content: string
): Promise<{ success: boolean; message?: MessageWithSender; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      return { success: false, error: 'Message cannot be empty' }
    }

    if (trimmedContent.length > 5000) {
      return { success: false, error: 'Message too long (max 5000 characters)' }
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
    })

    if (!conversation) {
      return { success: false, error: 'Conversation not found' }
    }

    // Create message and update conversation timestamp
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: trimmedContent,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ])

    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true },
    })

    const messageWithSender: MessageWithSender = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      readAt: message.readAt,
      sender: sender || { id: userId, name: 'You', image: null },
    }

    revalidatePath('/messages')
    return { success: true, message: messageWithSender }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Failed to send message' }
  }
}

// Mark messages as read
export async function markMessagesReadAction(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    // Mark all messages from other user as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking messages read:', error)
    return { success: false, error: 'Failed to mark messages read' }
  }
}

// Get total unread message count
export async function getUnreadCountAction(): Promise<{
  success: boolean
  count?: number
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id

    // Get all conversations the user is part of
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      select: { id: true },
    })

    const conversationIds = conversations.map((c) => c.id)

    const count = await prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: userId },
        readAt: null,
      },
    })

    return { success: true, count }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return { success: false, error: 'Failed to get unread count' }
  }
}

// Start a conversation with a realtor from their profile
export async function startRealtorConversationAction(
  realtorUserId: string,
  initialMessage?: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get or create conversation
    const result = await getOrCreateConversationAction(realtorUserId, 'realtor_inquiry')

    if (!result.success || !result.conversationId) {
      return result
    }

    // Send initial message if provided
    if (initialMessage?.trim()) {
      await sendMessageAction(result.conversationId, initialMessage)
    }

    return { success: true, conversationId: result.conversationId }
  } catch (error) {
    console.error('Error starting realtor conversation:', error)
    return { success: false, error: 'Failed to start conversation' }
  }
}
