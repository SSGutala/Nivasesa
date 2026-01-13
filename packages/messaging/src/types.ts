/**
 * Messaging Types
 * Core type definitions for conversations and messages
 */

export type ConversationType = 'direct' | 'group';

export interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  joinedAt: Date;
  leftAt?: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: Participant[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationInput {
  participantIds: string[];
  type: ConversationType;
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  content: string;
}

export interface GetMessagesOptions {
  conversationId: string;
  limit?: number;
  offset?: number;
}

export interface MarkAsReadInput {
  conversationId: string;
  userId: string;
}
