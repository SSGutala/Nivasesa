/**
 * Message CRUD Operations
 * Manages messages within conversations
 */

import type { Message, SendMessageInput, GetMessagesOptions } from './types';
import { getConversation, updateConversationActivity } from './conversations';

// In-memory storage for messages (replace with database in production)
const messages = new Map<string, Message>();
let messageIdCounter = 1;

/**
 * Sends a message to a conversation
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  // Validate conversation exists
  const conversation = await getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Validate sender is a participant
  const isParticipant = conversation.participants.some(
    (p) => p.userId === senderId && !p.leftAt
  );
  if (!isParticipant) {
    throw new Error('Sender is not a participant in this conversation');
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    throw new Error('Message content cannot be empty');
  }

  const id = `msg_${messageIdCounter++}`;
  const now = new Date();

  const message: Message = {
    id,
    conversationId,
    senderId,
    content: content.trim(),
    readBy: [senderId], // Sender automatically reads their own message
    createdAt: now,
    updatedAt: now,
  };

  messages.set(id, message);

  // Update conversation activity
  await updateConversationActivity(conversationId);

  return message;
}

/**
 * Gets messages for a conversation with pagination
 */
export async function getMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  // Validate conversation exists
  const conversation = await getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Get all messages for this conversation
  const conversationMessages = Array.from(messages.values()).filter(
    (msg) => msg.conversationId === conversationId
  );

  // Sort by creation time (newest first)
  conversationMessages.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Apply pagination
  return conversationMessages.slice(offset, offset + limit);
}

/**
 * Gets a specific message by ID
 */
export async function getMessage(messageId: string): Promise<Message | null> {
  return messages.get(messageId) || null;
}

/**
 * Marks all messages in a conversation as read by a user
 */
export async function markAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  // Validate conversation exists
  const conversation = await getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // Validate user is a participant
  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId && !p.leftAt
  );
  if (!isParticipant) {
    throw new Error('User is not a participant in this conversation');
  }

  // Mark all messages as read
  const conversationMessages = Array.from(messages.values()).filter(
    (msg) => msg.conversationId === conversationId
  );

  for (const message of conversationMessages) {
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      message.updatedAt = new Date();
    }
  }
}

/**
 * Gets the count of unread messages for a user in a conversation
 */
export async function getUnreadCount(
  conversationId: string,
  userId: string
): Promise<number> {
  const conversationMessages = Array.from(messages.values()).filter(
    (msg) => msg.conversationId === conversationId && !msg.readBy.includes(userId)
  );

  return conversationMessages.length;
}

/**
 * Gets the total unread message count across all conversations for a user
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
  const allMessages = Array.from(messages.values()).filter(
    (msg) => !msg.readBy.includes(userId) && msg.senderId !== userId
  );

  return allMessages.length;
}

/**
 * Deletes a message (soft delete - marks as deleted but keeps in database)
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const message = messages.get(messageId);
  if (!message) {
    throw new Error('Message not found');
  }

  messages.delete(messageId);
}

/**
 * Updates a message content
 */
export async function updateMessage(
  messageId: string,
  content: string
): Promise<Message> {
  const message = messages.get(messageId);
  if (!message) {
    throw new Error('Message not found');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('Message content cannot be empty');
  }

  message.content = content.trim();
  message.updatedAt = new Date();

  return message;
}
