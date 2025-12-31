# Messaging Service

GraphQL Federation subgraph for messaging functionality in Nivasesa.

## Features

- **Conversations**: Create and manage conversations between users
- **Messages**: Send text, image, and system messages
- **Read Receipts**: Track message read status
- **Archive**: Archive/unarchive conversations
- **Federation**: References User entity from user-service
- **Real-time**: Subscription schema ready for WebSocket implementation

## Tech Stack

- Apollo Server (GraphQL Federation)
- Prisma (SQLite for development)
- TypeScript
- GraphQL Subscriptions (schema only)

## Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

The service will run on port 4006 by default.

## Database Schema

### Conversation
- `id`: Unique identifier
- `participants`: JSON array of user IDs
- `listingId`: Optional listing context
- `lastMessageAt`: Timestamp of last message
- `archived`: Archive status
- `createdAt`, `updatedAt`: Timestamps

### Message
- `id`: Unique identifier
- `conversationId`: Reference to conversation
- `senderId`: User who sent the message
- `content`: Message content
- `type`: TEXT | IMAGE | SYSTEM
- `readAt`: Read timestamp (nullable)
- `createdAt`: Creation timestamp

## GraphQL API

### Queries

```graphql
# Get user's conversations
myConversations(limit: Int, offset: Int, archived: Boolean): ConversationConnection!

# Get specific conversation
conversation(id: ID!): Conversation

# Get messages in a conversation
messages(conversationId: ID!, limit: Int, offset: Int): MessageConnection!
```

### Mutations

```graphql
# Create new conversation
createConversation(input: CreateConversationInput!): Conversation!

# Send message
sendMessage(input: SendMessageInput!): Message!

# Mark message as read
markAsRead(messageId: ID!): Message!

# Mark all messages in conversation as read
markConversationAsRead(conversationId: ID!): Boolean!

# Archive conversation
archiveConversation(conversationId: ID!): Conversation!

# Unarchive conversation
unarchiveConversation(conversationId: ID!): Conversation!
```

### Subscriptions (Schema Only)

```graphql
# Subscribe to new messages
messageReceived(conversationId: ID!): Message!

# Subscribe to conversation updates
conversationUpdated: Conversation!
```

## Federation

The service references the `User` entity from the user-service:

```graphql
type User @key(fields: "id", resolvable: false) {
  id: ID!
}
```

This allows conversations and messages to resolve user information through the federated gateway.

## Environment Variables

```bash
NODE_ENV=development
PORT=4006
DATABASE_URL=file:./dev.db
```

## Development

```bash
# Type checking
pnpm typecheck

# Build
pnpm build

# Start production
pnpm start
```

## Integration with Gateway

To use this service with the Apollo Gateway:

1. Ensure the service is running on port 4006
2. Add the service to the gateway's subgraph list
3. The gateway will automatically compose the schema with other subgraphs

## Future Enhancements

- WebSocket implementation for real-time subscriptions
- Message attachments and media handling
- Typing indicators
- Message reactions
- Thread support
- Message search
- Conversation pinning
- Push notifications integration
