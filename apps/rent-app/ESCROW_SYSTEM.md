# Escrow Transaction System

This document describes the complete Escrow Transaction System implementation for Nivasesa's peer-to-peer housing platform.

## Overview

The escrow system implements platform-native payments that are held securely until move-in confirmation, discouraging off-platform settlements and ensuring both renters and hosts are protected.

## Architecture

### Database Schema

**EscrowPayment Model** (`apps/rent-app/prisma/schema.prisma`)

```prisma
model EscrowPayment {
  id                    String   @id @default(cuid())
  bookingId             String   @unique
  booking               Booking  @relation(fields: [bookingId], references: [id])

  // Parties
  renterId              String   // Payer
  hostId                String   // Recipient

  // Amounts (in cents)
  amount                Int      // Total amount held
  platformFeeAmount     Int      // Platform fee (10%)
  hostAmount            Int      // Host receives after fee

  // Stripe reference
  stripePaymentIntentId String   @unique

  // Status: authorized, captured, cancelled, refunded
  status                String   @default("authorized")

  // Timestamps
  authorizedAt          DateTime @default(now())
  capturedAt            DateTime?
  cancelledAt           DateTime?
  refundedAt            DateTime?
}
```

### Stripe Integration

The system uses Stripe's **manual capture** pattern:

1. **Authorization**: `capture_method: 'manual'` creates a payment hold without charging
2. **Capture**: When host confirms move-in, payment is captured with platform fee deducted
3. **Cancellation**: If booking is cancelled, the authorization is released (no charge)
4. **Refund**: If needed after capture, payment can be refunded (full or partial)

### Platform Fee

- **Default**: 10% of total booking amount
- **Configurable**: Set via `PLATFORM_FEE_PERCENTAGE` in `lib/stripe.ts`
- **Deducted on capture**: Using Stripe's `application_fee_amount` parameter

## API

### Server Actions

All actions are in `/apps/rent-app/actions/escrow.ts`:

#### 1. `createEscrowHoldAction(bookingId, amount)`

Creates an escrow authorization for a booking.

**Parameters:**
- `bookingId: string` - The booking ID
- `amount: number` - Total amount in cents

**Returns:**
```typescript
{ success: true, paymentIntentId: string, clientSecret: string }
// OR
{ error: string }
```

**Usage:**
```typescript
const result = await createEscrowHoldAction('booking_123', 50000) // $500.00

if ('success' in result) {
  // Use result.clientSecret with Stripe Elements for payment
  console.log('Payment Intent:', result.paymentIntentId)
}
```

**What it does:**
- Verifies user is the booking renter
- Calculates platform fee (10%) and host amount (90%)
- Creates Stripe PaymentIntent with `capture_method: 'manual'`
- Creates EscrowPayment record with status `authorized`
- Updates booking status to `PENDING`

---

#### 2. `releaseEscrowAction(bookingId)`

Captures the authorized payment when host confirms move-in.

**Parameters:**
- `bookingId: string` - The booking ID

**Returns:**
```typescript
{ success: true }
// OR
{ error: string }
```

**Usage:**
```typescript
// Host confirms renter has moved in
const result = await releaseEscrowAction('booking_123')

if ('success' in result) {
  // Payment captured, funds released to host
  // Platform fee automatically deducted
}
```

**What it does:**
- Verifies user is the host
- Captures payment in Stripe with platform fee deduction
- Updates escrow status to `captured`
- Updates booking status to `CONFIRMED`
- Sets `capturedAt` timestamp

---

#### 3. `cancelEscrowAction(bookingId, reason?)`

Cancels the authorization before capture (releases the hold).

**Parameters:**
- `bookingId: string` - The booking ID
- `reason?: string` - Optional cancellation reason

**Returns:**
```typescript
{ success: true }
// OR
{ error: string }
```

**Usage:**
```typescript
// Either party can cancel before move-in
const result = await cancelEscrowAction('booking_123', 'Guest changed plans')

if ('success' in result) {
  // Authorization released, no charge to renter
}
```

**What it does:**
- Verifies user is renter or host
- Cancels PaymentIntent in Stripe (releases hold)
- Updates escrow status to `cancelled`
- Updates booking status to `CANCELLED`
- Records cancellation reason and timestamp

---

#### 4. `refundEscrowAction(bookingId, amount?, reason?)`

Refunds a captured payment (for disputes after move-in).

**Parameters:**
- `bookingId: string` - The booking ID
- `amount?: number` - Partial refund in cents (omit for full refund)
- `reason?: string` - Refund reason

**Returns:**
```typescript
{ success: true }
// OR
{ error: string }
```

**Usage:**
```typescript
// Full refund
await refundEscrowAction('booking_123', undefined, 'Property not as described')

// Partial refund ($100 of $500)
await refundEscrowAction('booking_123', 10000, 'Partial refund for damages')
```

**What it does:**
- Verifies user is renter or host
- Processes refund in Stripe
- Updates escrow status to `refunded`
- Records refund amount, reason, and timestamp

---

#### 5. `getEscrowStatusAction(bookingId)`

Gets current escrow status and Stripe payment state.

**Parameters:**
- `bookingId: string` - The booking ID

**Returns:**
```typescript
{
  escrow: {
    id: string
    amount: number
    platformFeeAmount: number
    hostAmount: number
    status: string
    authorizedAt: Date
    capturedAt: Date | null
    cancelledAt: Date | null
    refundedAt: Date | null
  }
  stripeStatus: string
}
// OR
{ error: string }
```

**Usage:**
```typescript
const result = await getEscrowStatusAction('booking_123')

if ('escrow' in result) {
  console.log('Status:', result.escrow.status)
  console.log('Stripe Status:', result.stripeStatus)
  console.log('Host will receive:', result.escrow.hostAmount / 100)
}
```

---

#### 6. `getUserEscrowsAction()`

Gets all escrow payments for the current user.

**Returns:**
```typescript
{
  asRenter: Array<{ id, bookingId, amount, status, authorizedAt }>
  asHost: Array<{ id, bookingId, amount, hostAmount, status, authorizedAt }>
}
// OR
{ error: string }
```

**Usage:**
```typescript
const result = await getUserEscrowsAction()

if ('asRenter' in result) {
  console.log('Payments I made:', result.asRenter.length)
  console.log('Payments I received:', result.asHost.length)
}
```

## UI Components

### EscrowNudge Component

Location: `/apps/rent-app/components/ui/EscrowNudge.tsx`

A persistent banner that displays escrow status and available actions.

**Props:**
```typescript
interface EscrowNudgeProps {
  bookingId: string
  escrowStatus: 'authorized' | 'captured' | 'cancelled' | 'refunded'
  userRole: 'renter' | 'host'
  amount: number              // Total amount in cents
  platformFeeAmount?: number  // Platform fee in cents
  hostAmount?: number         // Host receives in cents
  onStatusChange?: () => void // Callback when status changes
}
```

**Usage:**
```tsx
import EscrowNudge from '@/components/ui/EscrowNudge'

export default function BookingPage({ booking, escrow, userRole }) {
  return (
    <div>
      <EscrowNudge
        bookingId={booking.id}
        escrowStatus={escrow.status}
        userRole={userRole}
        amount={escrow.amount}
        platformFeeAmount={escrow.platformFeeAmount}
        hostAmount={escrow.hostAmount}
        onStatusChange={() => router.refresh()}
      />

      {/* Rest of booking details */}
    </div>
  )
}
```

**Features:**
- **For Renters**: Shows payment hold status, option to cancel
- **For Hosts**: Shows confirm move-in action, expected payout amount
- **Color-coded**: Different styles for each status (authorized, captured, etc.)
- **Responsive**: Stacks on mobile
- **Accessible**: Proper ARIA labels and semantic HTML

## Workflow Examples

### Happy Path: Successful Booking

```typescript
// 1. Renter creates escrow hold
const createResult = await createEscrowHoldAction('booking_123', 50000)
// Status: authorized, $500 held on renter's card

// 2. Renter completes payment via Stripe (use clientSecret)
// Payment authorized but not yet charged

// 3. Move-in day arrives
// 4. Host confirms move-in
const releaseResult = await releaseEscrowAction('booking_123')
// Status: captured
// Host receives: $450 (90%)
// Platform keeps: $50 (10%)
```

### Cancellation Before Move-In

```typescript
// 1. Escrow created and authorized
await createEscrowHoldAction('booking_123', 50000)

// 2. Plans change, renter cancels
await cancelEscrowAction('booking_123', 'Found another place')
// Status: cancelled
// Renter charged: $0 (authorization released)
```

### Dispute After Move-In

```typescript
// 1. Escrow captured after move-in
await releaseEscrowAction('booking_123')
// Status: captured, $450 to host

// 2. Issue discovered (e.g., property not as described)
// 3. Partial refund issued
await refundEscrowAction('booking_123', 10000, 'Refund for missing amenities')
// Status: refunded
// Renter refunded: $100
// Host keeps: $350
```

## Security Considerations

### Authorization Checks

All actions verify:
- User is authenticated
- User has permission (renter or host for the booking)
- Escrow is in valid state for the operation

### Status State Machine

```
authorized → captured (via releaseEscrow)
authorized → cancelled (via cancelEscrow)
captured → refunded (via refundEscrow)
```

Invalid transitions are rejected with error messages.

### Stripe Webhook Verification

For production, implement webhook handling to sync Stripe events:

```typescript
// apps/rent-app/app/api/webhooks/stripe/route.ts
import { verifyWebhookSignature } from '@/lib/stripe'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')
  const payload = await req.text()

  const event = verifyWebhookSignature(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  // Handle payment_intent.succeeded, payment_intent.canceled, etc.
}
```

## Configuration

### Environment Variables

Required in `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For production webhooks
```

### Platform Fee

Adjust in `/apps/rent-app/lib/stripe.ts`:
```typescript
export const PLATFORM_FEE_PERCENTAGE = 0.10 // 10%
```

## Testing

### Local Development

Use Stripe test mode:
```bash
# Test card numbers
4242 4242 4242 4242  # Successful payment
4000 0000 0000 9995  # Declined payment
```

### Test Scenarios

1. **Create and capture**:
   ```typescript
   const { paymentIntentId } = await createEscrowHoldAction('booking_123', 50000)
   await releaseEscrowAction('booking_123')
   ```

2. **Create and cancel**:
   ```typescript
   await createEscrowHoldAction('booking_123', 50000)
   await cancelEscrowAction('booking_123')
   ```

3. **Create, capture, refund**:
   ```typescript
   await createEscrowHoldAction('booking_123', 50000)
   await releaseEscrowAction('booking_123')
   await refundEscrowAction('booking_123')
   ```

## Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Escrow payment already exists" | Duplicate escrow creation | Check if escrow exists first |
| "Cannot release escrow with status: captured" | Already captured | Check status before action |
| "Unauthorized - only the host can release escrow" | Wrong user | Verify userRole |
| "Payment intent not found" | Invalid Stripe ID | Check Stripe dashboard |

### Debug Mode

Check Stripe PaymentIntent status:
```typescript
const status = await getEscrowStatusAction('booking_123')
console.log('DB Status:', status.escrow.status)
console.log('Stripe Status:', status.stripeStatus)
```

## Future Enhancements

- [ ] Automatic capture after X days
- [ ] Dispute resolution workflow
- [ ] Escrow for multi-month bookings (monthly releases)
- [ ] Admin dashboard for escrow management
- [ ] Email notifications for escrow events
- [ ] Webhooks for real-time status sync
- [ ] Analytics: escrow conversion rates, dispute rates

## Related Files

- Schema: `/apps/rent-app/prisma/schema.prisma`
- Stripe Utils: `/apps/rent-app/lib/stripe.ts`
- Actions: `/apps/rent-app/actions/escrow.ts`
- UI: `/apps/rent-app/components/ui/EscrowNudge.tsx`
- Styles: `/apps/rent-app/components/ui/EscrowNudge.module.css`

## Support

For issues or questions, contact the development team or refer to:
- [Stripe Manual Capture Docs](https://stripe.com/docs/payments/capture-later)
- [Stripe Application Fees](https://stripe.com/docs/connect/direct-charges)
- PRD: `/docs/prd-renters.md` (Section 7: Transactions & Escrow)
