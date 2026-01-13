# @niv/messaging

Shared messaging service for real-time chat functionality across Nivasesa apps.

## Features

- Direct and group conversations
- Message sending and retrieval with pagination
- Read receipts and unread counts
- Participant management for group chats
- TypeScript support with full type definitions

## Installation

This is a workspace package. Install dependencies from the monorepo root:

```bash
pnpm install
```

## Usage

### Creating Conversations

```typescript
import { createConversation } from '@niv/messaging';

// Create a direct conversation
const directChat = await createConversation(
  ['user1', 'user2'],
  'direct'
);

// Create a group conversation
const groupChat = await createConversation(
  ['user1', 'user2', 'user3'],
  'group'
);
```

### Sending Messages

```typescript
import { sendMessage } from '@niv/messaging';

const message = await sendMessage(
  'conv_123',
  'user1',
  'Hello, world!'
);
```

### Retrieving Messages

```typescript
import { getMessages } from '@niv/messaging';

// Get latest 50 messages
const messages = await getMessages('conv_123');

// With pagination
const olderMessages = await getMessages('conv_123', 20, 50);
```

### Getting Conversations

```typescript
import { getConversations } from '@niv/messaging';

const conversations = await getConversations('user1');
```

### Marking Messages as Read

```typescript
import { markAsRead, getUnreadCount } from '@niv/messaging';

// Mark all messages as read
await markAsRead('conv_123', 'user1');

// Get unread count
const unreadCount = await getUnreadCount('conv_123', 'user1');
```

### Managing Group Participants

```typescript
import { addParticipant, removeParticipant } from '@niv/messaging';

// Add a participant
await addParticipant('conv_123', 'user4');

// Remove a participant
await removeParticipant('conv_123', 'user4');
```

## API Reference

### Conversations

- `createConversation(participantIds: string[], type: ConversationType): Promise<Conversation>`
- `getConversations(userId: string): Promise<Conversation[]>`
- `getConversation(conversationId: string): Promise<Conversation | null>`
- `addParticipant(conversationId: string, userId: string): Promise<Conversation>`
- `removeParticipant(conversationId: string, userId: string): Promise<Conversation>`
- `deleteConversation(conversationId: string): Promise<void>`

### Messages

- `sendMessage(conversationId: string, senderId: string, content: string): Promise<Message>`
- `getMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>`
- `getMessage(messageId: string): Promise<Message | null>`
- `markAsRead(conversationId: string, userId: string): Promise<void>`
- `getUnreadCount(conversationId: string, userId: string): Promise<number>`
- `getTotalUnreadCount(userId: string): Promise<number>`
- `deleteMessage(messageId: string): Promise<void>`
- `updateMessage(messageId: string, content: string): Promise<Message>`

## Types

```typescript
type ConversationType = 'direct' | 'group';

interface Conversation {
  id: string;
  type: ConversationType;
  participants: Participant[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  joinedAt: Date;
  leftAt?: Date;
}
```

## Notes

- Currently uses in-memory storage. Replace with Prisma database in production.
- Direct conversations are automatically deduplicated.
- Senders automatically mark their own messages as read.
- Messages are sorted by newest first.
- Participants who have left a conversation (`leftAt` is set) are excluded from active participants.

## Development

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## License

Private - Part of the Nivasesa monorepo
