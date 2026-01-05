import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable"])

  """
  User entity reference from user-service
  """
  type User @key(fields: "id", resolvable: false) {
    id: ID!
  }

  """
  Conversation entity - a thread of messages between participants
  """
  type Conversation {
    id: ID!
    participants: [User!]!
    participantIds: [ID!]!
    listingId: ID
    lastMessageAt: DateTime!
    archived: Boolean!
    messages: [Message!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Message entity - individual message in a conversation
  """
  type Message {
    id: ID!
    conversationId: ID!
    conversation: Conversation!
    sender: User!
    senderId: ID!
    content: String!
    type: MessageType!
    readAt: DateTime
    createdAt: DateTime!
  }

  """
  Message types supported in the system
  """
  enum MessageType {
    TEXT
    IMAGE
    SYSTEM
  }

  """
  Paginated conversation list
  """
  type ConversationConnection {
    nodes: [Conversation!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  """
  Paginated message list
  """
  type MessageConnection {
    nodes: [Message!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Input types
  input CreateConversationInput {
    participantIds: [ID!]!
    listingId: ID
    initialMessage: String
  }

  input SendMessageInput {
    conversationId: ID!
    content: String!
    type: MessageType
  }

  # Queries
  type Query {
    """
    Get all conversations for the authenticated user
    """
    myConversations(
      limit: Int
      offset: Int
      archived: Boolean
    ): ConversationConnection!

    """
    Get a specific conversation by ID
    """
    conversation(id: ID!): Conversation

    """
    Get messages for a specific conversation
    """
    messages(
      conversationId: ID!
      limit: Int
      offset: Int
    ): MessageConnection!
  }

  # Mutations
  type Mutation {
    """
    Create a new conversation
    """
    createConversation(input: CreateConversationInput!): Conversation!

    """
    Send a message in a conversation
    """
    sendMessage(input: SendMessageInput!): Message!

    """
    Mark a message as read
    """
    markAsRead(messageId: ID!): Message!

    """
    Mark all messages in a conversation as read
    """
    markConversationAsRead(conversationId: ID!): Boolean!

    """
    Archive a conversation
    """
    archiveConversation(conversationId: ID!): Conversation!

    """
    Unarchive a conversation
    """
    unarchiveConversation(conversationId: ID!): Conversation!
  }

  # Subscriptions (schema only, no implementation)
  type Subscription {
    """
    Subscribe to new messages in a conversation
    """
    messageReceived(conversationId: ID!): Message!

    """
    Subscribe to conversation updates for the authenticated user
    """
    conversationUpdated: Conversation!
  }

  # Custom scalars
  scalar DateTime
`;
