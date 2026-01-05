import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable"])

  """
  Payment entity for processing transactions
  """
  type Payment @key(fields: "id") {
    id: ID!
    bookingId: String!
    payerId: String!
    recipientId: String
    amount: Int!
    currency: String!
    status: PaymentStatus!
    stripePaymentId: String
    stripeChargeId: String
    description: String
    metadata: JSON
    refundedAt: DateTime
    refundAmount: Int
    refundReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
    completedAt: DateTime
  }

  """
  Payment status states
  """
  enum PaymentStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
    REFUNDED
  }

  """
  Payment method (card, bank account, etc.)
  """
  type PaymentMethod @key(fields: "id") {
    id: ID!
    userId: String!
    type: PaymentMethodType!
    brand: String
    last4: String!
    expiryMonth: Int
    expiryYear: Int
    stripePaymentMethodId: String!
    isDefault: Boolean!
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Payment method types
  """
  enum PaymentMethodType {
    CARD
    BANK_ACCOUNT
    UPI
  }

  """
  Payout entity for disbursing funds to users
  """
  type Payout @key(fields: "id") {
    id: ID!
    userId: String!
    amount: Int!
    currency: String!
    status: PayoutStatus!
    stripePayoutId: String
    stripeAccountId: String
    description: String
    metadata: JSON
    failureCode: String
    failureMessage: String
    createdAt: DateTime!
    updatedAt: DateTime!
    completedAt: DateTime
  }

  """
  Payout status states
  """
  enum PayoutStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  """
  Transaction record for accounting
  """
  type Transaction {
    id: ID!
    userId: String!
    type: TransactionType!
    amount: Int!
    currency: String!
    paymentId: String
    payoutId: String
    description: String
    metadata: JSON
    createdAt: DateTime!
  }

  """
  Transaction types
  """
  enum TransactionType {
    PAYMENT
    REFUND
    PAYOUT
    FEE
  }

  # Input types
  input CreatePaymentInput {
    bookingId: String!
    payerId: String!
    recipientId: String
    amount: Int!
    currency: String
    description: String
    paymentMethodId: String
    metadata: JSON
  }

  input ProcessPaymentInput {
    paymentId: ID!
    paymentMethodId: String
  }

  input RefundPaymentInput {
    paymentId: ID!
    amount: Int
    reason: String
  }

  input AddPaymentMethodInput {
    userId: String!
    stripePaymentMethodId: String!
    isDefault: Boolean
  }

  input CreatePayoutInput {
    userId: String!
    amount: Int!
    currency: String
    description: String
    metadata: JSON
  }

  # Queries
  type Query {
    """
    Get a payment by ID
    """
    payment(id: ID!): Payment

    """
    Get payment for a specific booking
    """
    paymentForBooking(bookingId: String!): Payment

    """
    Get all payments for the current user
    """
    myPayments(status: PaymentStatus, limit: Int, offset: Int): PaymentConnection!

    """
    Get payment methods for the current user
    """
    myPaymentMethods: [PaymentMethod!]!

    """
    Get a specific payment method
    """
    paymentMethod(id: ID!): PaymentMethod

    """
    Get all payouts for the current user
    """
    myPayouts(status: PayoutStatus, limit: Int, offset: Int): PayoutConnection!

    """
    Get a specific payout
    """
    payout(id: ID!): Payout

    """
    Get transaction history for the current user
    """
    myTransactions(type: TransactionType, limit: Int, offset: Int): TransactionConnection!

    """
    Get account balance for the current user
    """
    myBalance: Balance!
  }

  """
  Paginated payment list
  """
  type PaymentConnection {
    nodes: [Payment!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  """
  Paginated payout list
  """
  type PayoutConnection {
    nodes: [Payout!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  """
  Paginated transaction list
  """
  type TransactionConnection {
    nodes: [Transaction!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  """
  User balance information
  """
  type Balance {
    available: Int!
    pending: Int!
    currency: String!
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Mutations
  type Mutation {
    """
    Create a payment intent
    """
    createPayment(input: CreatePaymentInput!): Payment!

    """
    Process a payment (charge the payment method)
    """
    processPayment(input: ProcessPaymentInput!): Payment!

    """
    Refund a payment (full or partial)
    """
    refundPayment(input: RefundPaymentInput!): Payment!

    """
    Add a payment method for a user
    """
    addPaymentMethod(input: AddPaymentMethodInput!): PaymentMethod!

    """
    Remove a payment method
    """
    removePaymentMethod(id: ID!): Boolean!

    """
    Set a payment method as default
    """
    setDefaultPaymentMethod(id: ID!): PaymentMethod!

    """
    Create a payout to a user
    """
    createPayout(input: CreatePayoutInput!): Payout!

    """
    Process a payout (initiate transfer)
    """
    processPayout(id: ID!): Payout!
  }

  # Custom scalars
  scalar DateTime
  scalar JSON
`;
