# Payment Database Schema

This package contains a separate payment database schema isolated from the main application database.

## Database Versions

### Development (SQLite)
- **File:** `schema.prisma`
- Uses Float for monetary amounts (stored as cents)
- Uses String for enum values
- Database file: `payment.db`

### Production (PostgreSQL)
- **File:** `schema.postgresql.prisma`
- Uses Decimal(10,2) for monetary amounts
- Uses native PostgreSQL enums
- Better precision and type safety

## Models

### Wallet
Stores user wallet balances.
- `userId` - References User in main database (unique)
- `balance` - Current balance (Float in dev, Decimal in prod)
- `currency` - Currency code (default: "USD")

### Transaction
All payment transactions.
- `walletId` - References Wallet
- `type` - Transaction type (DEPOSIT, WITHDRAWAL, LEAD_UNLOCK, REFUND, ESCROW_HOLD, ESCROW_RELEASE)
- `amount` - Transaction amount (Float in dev, Decimal in prod)
- `status` - Status (PENDING, COMPLETED, FAILED, CANCELLED)
- `description` - Optional description
- `metadata` - JSON string for Stripe IDs, etc (String in dev, Json in prod)

### EscrowHold
Holds funds in escrow for bookings.
- `payerId` - Tenant user ID (references User in main db)
- `payeeId` - Host user ID (references User in main db)
- `bookingId` - References Booking in main db
- `amount` - Amount held (Float in dev, Decimal in prod)
- `status` - Status (HELD, RELEASED, REFUNDED, DISPUTED)
- `heldAt` - When funds were held
- `releasedAt` - When funds were released (optional)

### RefundRequest
Refund requests for transactions.
- `transactionId` - References Transaction
- `requesterId` - User ID who requested refund
- `amount` - Refund amount (Float in dev, Decimal in prod)
- `reason` - Refund reason
- `status` - Status (PENDING, APPROVED, REJECTED)
- `adminNote` - Optional admin notes

## Usage

### Development (SQLite)
```bash
# Generate client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

### Production (PostgreSQL)
```bash
# Use PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Create migration
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Environment Variables

Create `.env` file with:
```env
# SQLite (development)
PAYMENT_DATABASE_URL="file:./payment.db"

# PostgreSQL (production)
# PAYMENT_DATABASE_URL="postgresql://user:password@localhost:5432/nivasesa_payment?schema=public"
```

## Important Notes

1. **Monetary Storage:**
   - SQLite: Store as cents (Float) - multiply by 100 when saving, divide by 100 when reading
   - PostgreSQL: Store as dollars (Decimal) - direct storage

2. **Cross-Database References:**
   - `userId`, `payerId`, `payeeId` reference User table in main database
   - `bookingId` references Booking table in main database
   - These are stored as strings and validated at application level

3. **Enums:**
   - SQLite: String values, validate in application code
   - PostgreSQL: Native database enums with type safety

4. **JSON Metadata:**
   - SQLite: JSON string, parse/stringify in application
   - PostgreSQL: Native JSON type
