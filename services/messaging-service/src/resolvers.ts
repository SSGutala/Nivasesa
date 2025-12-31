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

// Helper to parse participant IDs from JSON string
function parseParticipants(participantsJson: string): string[] {
  try {
    return JSON.parse(participantsJson);
  } catch {
    return [];
  }
}

// Helper to verify user is part of conversation
async function verifyConversationAccess(
  conversationId: string,
  userId: string
): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new GraphQLError('Conversation not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  const participants = parseParticipants(conversation.participants);
  if (!participants.includes(userId)) {
    throw new GraphQLError('Not authorized to access this conversation', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

export const resolvers = {
  Query: {
    myConversations: async (
      _: unknown,
      {
        limit = 20,
        offset = 0,
        archived = false,
      }: { limit?: number; offset?: number; archived?: boolean },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Find conversations where user is a participant
      const allConversations = await prisma.conversation.findMany({
        where: { archived },
        orderBy: { lastMessageAt: 'desc' },
      });

      // Filter by participant in application code (SQLite JSON limitation)
      const nodes = allConversations
        .filter((conv) => {
          const participants = parseParticipants(conv.participants);
          return participants.includes(userId);
        })
        .slice(offset, offset + limit);

      const totalCount = allConversations.filter((conv) => {
        const participants = parseParticipants(conv.participants);
        return participants.includes(userId);
      }).length;

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

    conversation: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(id, userId);

      return prisma.conversation.findUnique({
        where: { id },
      });
    },

    messages: async (
      _: unknown,
      {
        conversationId,
        limit = 50,
        offset = 0,
      }: { conversationId: string; limit?: number; offset?: number },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(conversationId, userId);

      const [nodes, totalCount] = await Promise.all([
        prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'asc' },
          take: limit,
          skip: offset,
        }),
        prisma.message.count({ where: { conversationId } }),
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
  },

  Mutation: {
    createConversation: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          participantIds: string[];
          listingId?: string;
          initialMessage?: string;
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Ensure current user is in participants
      if (!input.participantIds.includes(userId)) {
        input.participantIds.push(userId);
      }

      // Deduplicate participants
      const uniqueParticipants = Array.from(new Set(input.participantIds));

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          participants: JSON.stringify(uniqueParticipants),
          listingId: input.listingId,
          lastMessageAt: new Date(),
        },
      });

      // Create initial message if provided
      if (input.initialMessage) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: input.initialMessage,
            type: 'TEXT',
          },
        });
      }

      return conversation;
    },

    sendMessage: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          conversationId: string;
          content: string;
          type?: string;
        };
      },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(input.conversationId, userId);

      // Create message
      const message = await prisma.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: userId,
          content: input.content,
          type: input.type || 'TEXT',
        },
      });

      // Update conversation lastMessageAt
      await prisma.conversation.update({
        where: { id: input.conversationId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    },

    markAsRead: async (
      _: unknown,
      { messageId }: { messageId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);

      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new GraphQLError('Message not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await verifyConversationAccess(message.conversationId, userId);

      // Only mark as read if not the sender
      if (message.senderId === userId) {
        return message;
      }

      return prisma.message.update({
        where: { id: messageId },
        data: { readAt: new Date() },
      });
    },

    markConversationAsRead: async (
      _: unknown,
      { conversationId }: { conversationId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(conversationId, userId);

      // Mark all unread messages as read (except user's own messages)
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: userId },
          readAt: null,
        },
        data: { readAt: new Date() },
      });

      return true;
    },

    archiveConversation: async (
      _: unknown,
      { conversationId }: { conversationId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(conversationId, userId);

      return prisma.conversation.update({
        where: { id: conversationId },
        data: { archived: true },
      });
    },

    unarchiveConversation: async (
      _: unknown,
      { conversationId }: { conversationId: string },
      context: Context
    ) => {
      const userId = requireAuth(context);
      await verifyConversationAccess(conversationId, userId);

      return prisma.conversation.update({
        where: { id: conversationId },
        data: { archived: false },
      });
    },
  },

  // Type resolvers
  Conversation: {
    participantIds: (conversation: { participants: string }) => {
      return parseParticipants(conversation.participants);
    },

    participants: (conversation: { participants: string }) => {
      const participantIds = parseParticipants(conversation.participants);
      return participantIds.map((id) => ({ __typename: 'User', id }));
    },

    messages: async (conversation: { id: string }) => {
      return prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
      });
    },
  },

  Message: {
    conversation: async (message: { conversationId: string }) => {
      return prisma.conversation.findUnique({
        where: { id: message.conversationId },
      });
    },

    sender: (message: { senderId: string }) => {
      return { __typename: 'User', id: message.senderId };
    },
  },

  // Subscription resolvers (placeholders)
  Subscription: {
    messageReceived: {
      subscribe: () => {
        throw new GraphQLError('Subscriptions not yet implemented', {
          extensions: { code: 'NOT_IMPLEMENTED' },
        });
      },
    },

    conversationUpdated: {
      subscribe: () => {
        throw new GraphQLError('Subscriptions not yet implemented', {
          extensions: { code: 'NOT_IMPLEMENTED' },
        });
      },
    },
  },

  // Custom scalar for DateTime
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
  },
};
