# Required Prisma Schema

The payment package requires the following additions to your Prisma schema:

## User Model Updates

Add the `walletBalance` field to your User model:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  // ... other fields

  // Payment fields
  walletBalance Float     @default(0)

  // Relations
  transactions  Transaction[]
  refundRequests RefundRequest[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## Transaction Model

Add this new model for tracking all wallet transactions:

```prisma
model Transaction {
  id              String            @id @default(cuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  type            TransactionType
  amount          Float
  currency        String            @default("usd")
  status          TransactionStatus @default(PENDING)
  reason          String?

  // Stripe payment intent ID (for top-ups)
  paymentIntentId String?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  refundRequests  RefundRequest[]

  @@index([userId])
  @@index([paymentIntentId])
  @@index([createdAt])
}

enum TransactionType {
  TOP_UP
  DEDUCTION
  REFUND
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

## RefundRequest Model

Add this new model for handling refund requests:

```prisma
model RefundRequest {
  id            String       @id @default(cuid())
  transactionId String
  transaction   Transaction  @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  amount        Float
  reason        String
  status        RefundStatus @default(PENDING)
  adminNotes    String?

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([userId])
  @@index([transactionId])
  @@index([status])
}

enum RefundStatus {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}
```

## Migration Steps

After adding these models to your schema:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes (development)
npx prisma db push

# Or create a migration (production)
npx prisma migrate dev --name add_payment_models
```

## Database Indexes

The schema includes indexes on:
- `Transaction.userId` - Fast lookup of user transactions
- `Transaction.paymentIntentId` - Link Stripe webhooks to transactions
- `Transaction.createdAt` - Efficient time-based queries
- `RefundRequest.userId` - Fast lookup of user refund requests
- `RefundRequest.transactionId` - Link refunds to transactions
- `RefundRequest.status` - Efficient admin queries for pending refunds

## Notes

- The `walletBalance` field stores the current balance in USD
- All monetary amounts are stored as Float (precision sufficient for USD)
- Transaction types: `TOP_UP` (add funds), `DEDUCTION` (spend funds), `REFUND` (return funds)
- Cascade deletes ensure data integrity when users are deleted
- The `paymentIntentId` links transactions to Stripe payment intents
