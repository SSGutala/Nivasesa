/**
 * Conversation CRUD Operations
 * Manages conversations between users
 */

import type {
  Conversation,
  CreateConversationInput,
  ConversationType,
} from './types';

// In-memory storage for conversations (replace with database in production)
const conversations = new Map<string, Conversation>();
let conversationIdCounter = 1;

/**
 * Creates a new conversation between participants
 */
export async function createConversation(
  participantIds: string[],
  type: ConversationType
): Promise<Conversation> {
  if (participantIds.length < 2) {
    throw new Error('A conversation requires at least 2 participants');
  }

  if (type === 'direct' && participantIds.length > 2) {
    throw new Error('Direct conversations can only have 2 participants');
  }

  // Check for existing direct conversation
  if (type === 'direct') {
    const existing = Array.from(conversations.values()).find((conv) => {
      if (conv.type !== 'direct') return false;
      const convParticipantIds = conv.participants.map((p) => p.userId).sort();
      const newParticipantIds = [...participantIds].sort();
      return (
        convParticipantIds.length === newParticipantIds.length &&
        convParticipantIds.every((id, i) => id === newParticipantIds[i])
      );
    });

    if (existing) {
      return existing;
    }
  }

  const id = `conv_${conversationIdCounter++}`;
  const now = new Date();

  const conversation: Conversation = {
    id,
    type,
    participants: participantIds.map((userId) => ({
      id: `part_${id}_${userId}`,
      userId,
      conversationId: id,
      joinedAt: now,
    })),
    createdAt: now,
    updatedAt: now,
  };

  conversations.set(id, conversation);
  return conversation;
}

/**
 * Gets all conversations for a user
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  const userConversations = Array.from(conversations.values()).filter((conv) =>
    conv.participants.some(
      (p) => p.userId === userId && !p.leftAt
    )
  );

  // Sort by most recent activity (updatedAt)
  return userConversations.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}

/**
 * Gets a specific conversation by ID
 */
export async function getConversation(
  conversationId: string
): Promise<Conversation | null> {
  return conversations.get(conversationId) || null;
}

/**
 * Adds a participant to a group conversation
 */
export async function addParticipant(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (conversation.type === 'direct') {
    throw new Error('Cannot add participants to direct conversations');
  }

  // Check if user is already a participant
  const existing = conversation.participants.find((p) => p.userId === userId);
  if (existing && !existing.leftAt) {
    return conversation;
  }

  const participant = {
    id: `part_${conversationId}_${userId}`,
    userId,
    conversationId,
    joinedAt: new Date(),
  };

  conversation.participants.push(participant);
  conversation.updatedAt = new Date();

  return conversation;
}

/**
 * Removes a participant from a group conversation
 */
export async function removeParticipant(
  conversationId: string,
  userId: string
): Promise<Conversation> {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (conversation.type === 'direct') {
    throw new Error('Cannot remove participants from direct conversations');
  }

  const participant = conversation.participants.find((p) => p.userId === userId);
  if (participant) {
    participant.leftAt = new Date();
    conversation.updatedAt = new Date();
  }

  return conversation;
}

/**
 * Deletes a conversation (soft delete by removing all participants)
 */
export async function deleteConversation(
  conversationId: string
): Promise<void> {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversations.delete(conversationId);
}

/**
 * Updates the last message timestamp for a conversation
 */
export async function updateConversationActivity(
  conversationId: string
): Promise<void> {
  const conversation = conversations.get(conversationId);
  if (conversation) {
    conversation.updatedAt = new Date();
  }
}
