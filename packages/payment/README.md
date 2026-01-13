# @niv/payment

Payment service package for Nivasesa platform. Provides Stripe integration, wallet management, transaction tracking, and refund handling.

## Installation

This is a workspace package and is automatically available to other packages in the monorepo:

```json
{
  "dependencies": {
    "@niv/payment": "workspace:*"
  }
}
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For webhook signature verification
```

## Usage

### Payment Intents

```typescript
import { createPaymentIntent } from '@niv/payment';

// Create a payment intent for wallet top-up
const result = await createPaymentIntent(50.00, {
  userId: 'user123',
  type: 'TOP_UP',
  reason: 'Wallet top-up'
});

// Use clientSecret on frontend for Stripe Elements
console.log(result.clientSecret);
```

### Wallet Operations

```typescript
import {
  getWalletBalance,
  processTopUp,
  deductFromWallet,
  hasSufficientBalance
} from '@niv/payment';

// Get user's wallet balance
const balance = await getWalletBalance('user123');
console.log(`Balance: $${balance.balance}`);

// Process top-up after successful payment
const topUp = await processTopUp('user123', 50.00, 'pi_abc123');
console.log(`New balance: $${topUp.newBalance}`);

// Deduct from wallet
const deduction = await deductFromWallet(
  'user123',
  10.00,
  'Purchased premium listing'
);

// Check sufficient balance
const hasFunds = await hasSufficientBalance('user123', 25.00);
```

### Transaction History

```typescript
import { getTransactionHistory, getTransactionStats } from '@niv/payment';

// Get user's transaction history
const transactions = await getTransactionHistory({
  userId: 'user123',
  limit: 20,
  offset: 0
});

// Get transaction statistics
const stats = await getTransactionStats('user123');
console.log(`Total top-ups: $${stats.totalTopUps}`);
console.log(`Total deductions: $${stats.totalDeductions}`);
```

### Refund Management

```typescript
import {
  requestRefund,
  approveRefund,
  rejectRefund,
  getUserRefundRequests
} from '@niv/payment';

// User requests a refund
const refundRequest = await requestRefund(
  'user123',
  'txn_abc123',
  'Service not as expected'
);

// Admin approves refund
await approveRefund(refundRequest.id, 'Approved per policy');

// Admin rejects refund
await rejectRefund(refundRequest.id, 'Does not meet refund criteria');

// Get user's refund requests
const refunds = await getUserRefundRequests('user123');
```

### Stripe Webhooks

```typescript
import { verifyWebhookSignature } from '@niv/payment';

// In your webhook handler
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  const event = verifyWebhookSignature(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'charge.refunded':
      // Handle refund
      break;
  }

  return new Response('OK', { status: 200 });
}
```

## Key Functions

### Stripe Operations
- `createPaymentIntent(amount, metadata)` - Create Stripe payment intent
- `getPaymentIntent(paymentIntentId)` - Retrieve payment intent
- `createRefund(paymentIntentId, amount?, reason?)` - Create Stripe refund
- `verifyWebhookSignature(payload, signature, secret)` - Verify webhook
- `createOrGetCustomer(email, metadata?)` - Get or create Stripe customer

### Wallet Operations
- `getWalletBalance(userId)` - Get current wallet balance
- `processTopUp(userId, amount, paymentIntentId)` - Process wallet top-up
- `deductFromWallet(userId, amount, reason)` - Deduct from wallet
- `creditWallet(userId, amount, reason)` - Add credit to wallet
- `hasSufficientBalance(userId, amount)` - Check balance sufficiency
- `transferBetweenWallets(fromId, toId, amount, reason)` - Transfer between users

### Transaction Operations
- `getTransaction(transactionId)` - Get transaction by ID
- `getTransactionHistory(filters)` - Get filtered transaction history
- `getTransactionCount(filters)` - Count transactions
- `getTransactionStats(userId, startDate?, endDate?)` - Get statistics
- `getRecentTransactionsAdmin(limit, offset)` - Admin view of all transactions

### Refund Operations
- `requestRefund(userId, transactionId, reason)` - User requests refund
- `getRefundRequest(refundRequestId)` - Get refund request
- `getUserRefundRequests(userId, status?)` - Get user's refund requests
- `getPendingRefundRequests(limit, offset)` - Admin view of pending refunds
- `approveRefund(refundRequestId, adminNotes?)` - Approve and process refund
- `rejectRefund(refundRequestId, adminNotes)` - Reject refund request
- `cancelRefundRequest(refundRequestId, userId)` - User cancels request
- `getRefundStats(startDate?, endDate?)` - Get refund statistics

## Types

```typescript
// Transaction types
enum TransactionType {
  TOP_UP = 'TOP_UP',
  DEDUCTION = 'DEDUCTION',
  REFUND = 'REFUND',
}

// Transaction status
enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Refund status
enum RefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
```

## Architecture

The payment package is organized into four main modules:

1. **stripe.ts** - Stripe API integration
2. **wallet.ts** - Wallet balance management
3. **transactions.ts** - Transaction recording and history
4. **refunds.ts** - Refund request handling

All database operations use the `@niv/auth-db` Prisma client to ensure consistency with the rest of the platform.

## Security Considerations

- All monetary amounts are validated using Zod schemas
- Wallet deductions check for sufficient balance atomically
- Stripe webhook signatures are verified before processing
- Transaction operations use database transactions for atomicity
- User ownership is verified for all sensitive operations

## Error Handling

The package throws descriptive errors for common failure cases:

- `User not found`
- `Insufficient balance`
- `Transaction not found`
- `Refund request already exists`
- `Webhook signature verification failed`

Wrap calls in try-catch blocks and handle errors appropriately.
