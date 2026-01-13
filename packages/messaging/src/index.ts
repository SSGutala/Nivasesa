/**
 * Messaging Service Package
 * Shared messaging functionality for Nivasesa apps
 */

// Export types
export type {
  ConversationType,
  Participant,
  Conversation,
  Message,
  CreateConversationInput,
  SendMessageInput,
  GetMessagesOptions,
  MarkAsReadInput,
} from './types';

// Export conversation functions
export {
  createConversation,
  getConversations,
  getConversation,
  addParticipant,
  removeParticipant,
  deleteConversation,
  updateConversationActivity,
} from './conversations';

// Export message functions
export {
  sendMessage,
  getMessages,
  getMessage,
  markAsRead,
  getUnreadCount,
  getTotalUnreadCount,
  deleteMessage,
  updateMessage,
} from './messages';
