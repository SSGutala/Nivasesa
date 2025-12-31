# Payment Service

GraphQL Federation subgraph for payment processing in the Nivasesa platform.

## Features

- Payment processing via Stripe
- Payment methods management (cards, bank accounts)
- Payouts to landlords/hosts
- Transaction history and accounting
- Refund processing
- Dev mode with simulated payments (no Stripe key required)

## Quick Start

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

The service will start on `http://localhost:4004`.

## Environment Variables

See `.env.example` for all available options.

### Development Mode (No Stripe Required)

By default, the service runs in dev mode with simulated payments:

```env
DATABASE_URL=file:./dev.db
STRIPE_SECRET_KEY=
```

In dev mode:
- Payments are simulated (no actual charges)
- Fake charge/payout IDs are generated
- All operations work without Stripe API

### Production Mode (Stripe Required)

For real payment processing, configure Stripe:

```env
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_...
```

## GraphQL API

### Queries

- `payment(id)` - Get payment by ID
- `paymentForBooking(bookingId)` - Get payment for a booking
- `myPayments(status, limit, offset)` - List user's payments
- `myPaymentMethods()` - List user's payment methods
- `paymentMethod(id)` - Get payment method by ID
- `myPayouts(status, limit, offset)` - List user's payouts
- `payout(id)` - Get payout by ID
- `myTransactions(type, limit, offset)` - List user's transactions
- `myBalance()` - Get user's account balance

### Mutations

- `createPayment(input)` - Create a payment intent
- `processPayment(input)` - Process/charge a payment
- `refundPayment(input)` - Refund a payment (full or partial)
- `addPaymentMethod(input)` - Add a payment method
- `removePaymentMethod(id)` - Remove a payment method
- `setDefaultPaymentMethod(id)` - Set default payment method
- `createPayout(input)` - Create a payout
- `processPayout(id)` - Process a payout

## Payment Flow

### 1. Create Payment

```graphql
mutation {
  createPayment(input: {
    bookingId: "booking_123"
    payerId: "user_456"
    recipientId: "user_789"
    amount: 150000  # $1500.00 in cents
    currency: "USD"
    description: "Booking deposit"
  }) {
    id
    status
  }
}
```

### 2. Process Payment

```graphql
mutation {
  processPayment(input: {
    paymentId: "payment_123"
    paymentMethodId: "pm_card_visa"
  }) {
    id
    status
    stripeChargeId
    completedAt
  }
}
```

### 3. Refund Payment

```graphql
mutation {
  refundPayment(input: {
    paymentId: "payment_123"
    amount: 150000  # Full refund, or partial amount
    reason: "Cancellation"
  }) {
    id
    status
    refundedAt
    refundAmount
  }
}
```

## Payment States

- `PENDING` - Payment created, not yet processed
- `PROCESSING` - Payment being charged
- `COMPLETED` - Payment successfully charged
- `FAILED` - Payment failed to process
- `REFUNDED` - Payment refunded

## Payout States

- `PENDING` - Payout created, not yet processed
- `PROCESSING` - Payout being transferred
- `COMPLETED` - Payout successfully transferred
- `FAILED` - Payout failed to process

## Transaction Types

- `PAYMENT` - Payment debit/credit
- `REFUND` - Refund credit
- `PAYOUT` - Payout debit
- `FEE` - Platform fee debit

## Database Schema

### Payment
- Core payment entity
- Links to booking and users
- Tracks Stripe charge ID
- Supports refunds

### PaymentMethod
- Stored payment methods (cards, bank accounts)
- Links to Stripe payment method ID
- Default payment method flag

### Payout
- Payouts to landlords/hosts
- Links to Stripe payout ID
- Failure tracking

### Transaction
- Accounting ledger for all money movements
- Links to payments and payouts
- Used for balance calculations

## Federation

This service is a GraphQL Federation subgraph. It extends the User entity:

```graphql
type User @key(fields: "id") {
  id: ID!
  # Extended by payment service:
  payments: [Payment!]!
  paymentMethods: [PaymentMethod!]!
  payouts: [Payout!]!
}
```

## Testing

Run the service with no Stripe configuration to test in dev mode:

```bash
# All operations will use simulated payments
pnpm dev
```

To test with real Stripe (test mode):

```bash
# Add to .env
STRIPE_SECRET_KEY=sk_test_...

# Use Stripe test cards
# https://stripe.com/docs/testing
```

## Security

- All mutations require authentication (userId in context)
- Payment methods store only last4 digits (PCI compliance)
- Stripe handles actual card data (never stored)
- Webhook signature verification (when configured)

## License

Private - Nivasesa Platform
