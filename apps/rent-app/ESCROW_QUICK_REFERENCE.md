# Escrow System - Quick Reference Card

## Import Statements

```typescript
// Server Actions
import {
  createEscrowHoldAction,
  releaseEscrowAction,
  cancelEscrowAction,
  refundEscrowAction,
  getEscrowStatusAction,
  getUserEscrowsAction,
} from '@/actions/escrow'

// UI Component
import EscrowNudge from '@/components/ui/EscrowNudge'

// Stripe Utils (if needed)
import { calculateEscrowAmounts } from '@/lib/stripe'
```

## Common Operations

### 1. Create Escrow Hold (Renter Pays)

```typescript
const totalCents = 50000 // $500.00
const result = await createEscrowHoldAction(bookingId, totalCents)

if ('success' in result) {
  // Use result.clientSecret with Stripe Elements
  const { clientSecret, paymentIntentId } = result
} else {
  console.error(result.error)
}
```

### 2. Release Escrow (Host Confirms Move-In)

```typescript
const result = await releaseEscrowAction(bookingId)

if ('success' in result) {
  // Payment captured, host receives 90%, platform keeps 10%
  console.log('Escrow released!')
}
```

### 3. Cancel Escrow (Cancel Booking)

```typescript
const result = await cancelEscrowAction(bookingId, 'Renter found another place')

if ('success' in result) {
  // Authorization cancelled, no charge to renter
  console.log('Escrow cancelled')
}
```

### 4. Check Escrow Status

```typescript
const result = await getEscrowStatusAction(bookingId)

if ('escrow' in result) {
  console.log('Status:', result.escrow.status)
  console.log('Amount:', result.escrow.amount / 100) // Convert to dollars
  console.log('Host gets:', result.escrow.hostAmount / 100)
}
```

### 5. Display Escrow Nudge (UI)

```tsx
<EscrowNudge
  bookingId={booking.id}
  escrowStatus={escrow.status}
  userRole={isRenter ? 'renter' : 'host'}
  amount={escrow.amount}
  platformFeeAmount={escrow.platformFeeAmount}
  hostAmount={escrow.hostAmount}
  onStatusChange={() => router.refresh()}
/>
```

## Status Values

| Status | Description | Can Transition To |
|--------|-------------|-------------------|
| `authorized` | Funds held, not charged | `captured`, `cancelled` |
| `captured` | Funds charged, released | `refunded` |
| `cancelled` | Authorization released | (terminal) |
| `refunded` | Funds returned | (terminal) |

## Money Breakdown

```typescript
// Example: $500 booking
Total Amount:      50000 cents ($500.00)
Platform Fee (10%):  5000 cents ($50.00)
Host Receives:     45000 cents ($450.00)

// Calculate automatically
const { totalAmount, platformFeeAmount, hostAmount } =
  calculateEscrowAmounts(50000)
```

## Error Handling

```typescript
const result = await createEscrowHoldAction(bookingId, amount)

if ('error' in result) {
  switch (result.error) {
    case 'Not authenticated':
      // Redirect to login
      break
    case 'Escrow payment already exists':
      // Load existing escrow
      break
    case 'Booking not found':
      // Show 404
      break
    default:
      // Generic error message
      alert(result.error)
  }
}
```

## User Role Detection

```typescript
const session = await auth()
const userRole = booking.guestId === session.user.id ? 'renter' : 'host'
```

## Database Query

```typescript
// Server component - fetch booking with escrow
const booking = await prisma.booking.findUnique({
  where: { id: bookingId },
  include: {
    escrowPayment: true,
    listing: true,
  },
})

if (booking.escrowPayment) {
  // Escrow exists
  console.log('Escrow status:', booking.escrowPayment.status)
}
```

## Environment Variables

```bash
# Required
STRIPE_SECRET_KEY=sk_test_...

# For production webhooks
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Testing Cards (Stripe Test Mode)

```
Success:  4242 4242 4242 4242
Decline:  4000 0000 0000 9995
3D Auth:  4000 0025 0000 3155
```

## Common Workflows

### Happy Path
```
1. createEscrowHoldAction(bookingId, 50000)
   → Status: authorized
2. [Renter completes payment via Stripe]
   → Funds held on card
3. [Move-in day]
4. releaseEscrowAction(bookingId)
   → Status: captured
   → Host gets $450, platform gets $50
```

### Cancellation Path
```
1. createEscrowHoldAction(bookingId, 50000)
   → Status: authorized
2. cancelEscrowAction(bookingId, reason)
   → Status: cancelled
   → No charge to renter
```

### Dispute Path
```
1. createEscrowHoldAction(bookingId, 50000)
   → Status: authorized
2. releaseEscrowAction(bookingId)
   → Status: captured
3. [Issue discovered]
4. refundEscrowAction(bookingId, undefined, reason)
   → Status: refunded
   → Full refund to renter
```

## Quick Tips

1. **Always check status before actions**
   ```typescript
   const { escrow } = await getEscrowStatusAction(bookingId)
   if (escrow.status === 'authorized') {
     // Can release or cancel
   }
   ```

2. **Use revalidatePath after mutations**
   ```typescript
   await releaseEscrowAction(bookingId)
   revalidatePath('/dashboard/bookings')
   ```

3. **Show loading states**
   ```typescript
   const [loading, setLoading] = useState(false)

   async function handleRelease() {
     setLoading(true)
     await releaseEscrowAction(bookingId)
     setLoading(false)
   }
   ```

4. **Confirm destructive actions**
   ```typescript
   if (!confirm('Release escrow to host?')) return
   await releaseEscrowAction(bookingId)
   ```

## File Locations

| File | Purpose |
|------|---------|
| `/actions/escrow.ts` | Server actions |
| `/lib/stripe.ts` | Stripe utilities |
| `/components/ui/EscrowNudge.tsx` | UI component |
| `/prisma/schema.prisma` | Database schema |
| `/ESCROW_SYSTEM.md` | Complete documentation |
| `/ESCROW_USAGE_EXAMPLE.tsx` | Integration examples |

## Support

- Full docs: `/apps/rent-app/ESCROW_SYSTEM.md`
- Examples: `/apps/rent-app/ESCROW_USAGE_EXAMPLE.tsx`
- Stripe docs: https://stripe.com/docs/payments/capture-later
