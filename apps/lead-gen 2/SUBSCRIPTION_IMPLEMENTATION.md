# Agent Lead Monetization - Subscription System

## Overview

This implementation adds a comprehensive subscription system with four tiers (Free, Starter, Pro, Enterprise) that work alongside the existing pay-per-lead credit system. Agents can subscribe to monthly plans that grant lead credits, with unused credits rolling over between billing periods.

## Architecture

### Database Schema

**AgentSubscription Model** (`prisma/schema.prisma`)
```prisma
model AgentSubscription {
  id                   String    @id @default(cuid())
  agentId              String    @unique
  tier                 String    @default("free")
  stripeSubscriptionId String?   @unique
  stripeCustomerId     String?
  status               String    @default("active")
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  monthlyLeadCredits   Int       @default(0)
  cancelAtPeriodEnd    Boolean   @default(false)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  agent RealtorProfile @relation(...)
}
```

### Subscription Tiers

| Tier | Price | Monthly Credits | Key Features |
|------|-------|-----------------|--------------|
| **Free** | $0 | $0 | 10 free unlocks, pay-per-lead at $30 |
| **Starter** | $29/mo | $100 | Credits roll over, priority placement |
| **Pro** | $79/mo | $300 | Advanced analytics, priority support |
| **Enterprise** | $199/mo | $1,000 | Dedicated manager, custom integrations |

### Files Created/Modified

#### 1. Database Schema
- `/apps/lead-gen 2/prisma/schema.prisma`
  - Added `AgentSubscription` model
  - Added `subscription` relation to `RealtorProfile`

#### 2. Stripe Configuration
- `/apps/lead-gen 2/lib/stripe.ts`
  - Stripe client initialization
  - Subscription tier definitions with prices and features
  - Price ID mappings

#### 3. Server Actions
- `/apps/lead-gen 2/actions/subscriptions.ts`
  - `getSubscriptionStatusAction()` - Get current subscription
  - `createSubscriptionAction(tier, returnUrl)` - Create new subscription
  - `upgradeSubscriptionAction(newTier)` - Upgrade/downgrade tier
  - `cancelSubscriptionAction()` - Cancel at period end
  - `reactivateSubscriptionAction()` - Reactivate cancelled subscription
  - `getBillingPortalAction()` - Get Stripe billing portal URL

#### 4. Webhook Handler
- `/apps/lead-gen 2/app/api/webhooks/stripe/route.ts`
  - `customer.subscription.created` - Create subscription in DB
  - `customer.subscription.updated` - Update tier/status
  - `customer.subscription.deleted` - Handle cancellation
  - `invoice.paid` - Grant monthly credits
  - `invoice.payment_failed` - Mark subscription past_due

#### 5. Pricing Page
- `/apps/lead-gen 2/app/pricing/page.tsx` - Main pricing page
- `/apps/lead-gen 2/app/pricing/PricingCard.tsx` - Pricing card component

#### 6. Package Configuration
- `/apps/lead-gen 2/package.json` - Added `stripe` dependency
- `/apps/lead-gen 2/.env` - Added Stripe environment variables

## Setup Instructions

### 1. Install Dependencies
```bash
cd "apps/lead-gen 2"
pnpm install
```

### 2. Configure Stripe

#### Create Products & Prices in Stripe Dashboard
1. Go to https://dashboard.stripe.com/products
2. Create 3 products:
   - **Starter Plan** - $29/month recurring
   - **Pro Plan** - $79/month recurring
   - **Enterprise Plan** - $199/month recurring
3. Copy the Price IDs (starts with `price_...`)

#### Update Environment Variables
Edit `/apps/lead-gen 2/.env`:
```bash
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

STRIPE_STARTER_PRICE_ID="price_your_starter_id"
STRIPE_PRO_PRICE_ID="price_your_pro_id"
STRIPE_ENTERPRISE_PRICE_ID="price_your_enterprise_id"
```

#### Configure Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `http://localhost:3001/api/webhooks/stripe` (or your production URL)
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Database Migration
```bash
npx prisma db push
npx prisma generate
```

### 4. Test Locally
```bash
# Terminal 1: Run the app
npm run dev

# Terminal 2: Forward webhooks (requires Stripe CLI)
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

## Usage Examples

### Subscribe to a Plan
```typescript
// From pricing page or dashboard
const result = await createSubscriptionAction('pro')
if (result.success) {
  window.location.href = result.url // Redirect to Stripe Checkout
}
```

### Check Subscription Status
```typescript
const { subscription } = await getSubscriptionStatusAction()
console.log(subscription.tier) // 'pro'
console.log(subscription.monthlyLeadCredits) // 300
console.log(subscription.creditBalance) // Current balance
```

### Upgrade/Downgrade
```typescript
const result = await upgradeSubscriptionAction('enterprise')
// Prorated automatically by Stripe
```

### Cancel Subscription
```typescript
const result = await cancelSubscriptionAction()
// Cancels at end of billing period
// Credits remain available
```

### Access Billing Portal
```typescript
const { url } = await getBillingPortalAction()
window.location.href = url // Stripe manages payment methods, invoices, etc.
```

## Credit System Integration

### How Credits Work

1. **Monthly Grant**: On each billing cycle, credits are automatically added
   - Starter: +$100
   - Pro: +$300
   - Enterprise: +$1,000

2. **Rollover**: Unused credits carry forward to next month

3. **Lead Unlock**: When unlocking a lead ($30):
   ```
   Priority:
   1. Use subscription credits (creditBalance)
   2. Use free unlocks (freeUnlocksRemaining)
   3. Prompt to top-up or subscribe
   ```

4. **Pay-Per-Lead**: Free tier agents can purchase credit top-ups anytime

### Database Tracking

All credit movements are tracked in `CreditTransaction`:
```typescript
{
  agentId: "...",
  amount: 300, // positive = add, negative = spend
  type: "purchase", // "purchase" | "unlock" | "refund"
  description: "Monthly subscription credits - Pro plan",
  createdAt: "..."
}
```

## Webhook Event Flow

### New Subscription
```
1. User clicks "Subscribe" on pricing page
2. createSubscriptionAction() creates Stripe Checkout
3. User completes payment
4. Stripe fires: customer.subscription.created
5. Webhook creates AgentSubscription in DB
6. Webhook grants initial monthly credits
```

### Monthly Renewal
```
1. Stripe auto-charges subscription
2. Stripe fires: invoice.paid
3. Webhook grants monthly credits to agent
4. CreditTransaction created for audit trail
```

### Cancellation
```
1. User clicks "Cancel" in dashboard
2. cancelSubscriptionAction() sets cancel_at_period_end=true
3. Stripe fires: customer.subscription.updated
4. Subscription remains active until period end
5. At period end: customer.subscription.deleted
6. Webhook changes tier to "free", credits remain
```

## Security Considerations

1. **Webhook Verification**: All webhook events verify signature
2. **Authentication**: All actions check session.user.id
3. **Authorization**: Agents can only modify their own subscriptions
4. **Idempotency**: Webhook handlers use upsert to handle retries
5. **Metadata**: User IDs stored in Stripe metadata for reconciliation

## Testing

### Test Cards (Stripe Test Mode)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Subscription Flow
```bash
# 1. Go to pricing page
open http://localhost:3001/pricing

# 2. Click "Subscribe" on Pro plan
# 3. Use test card: 4242 4242 4242 4242
# 4. Check webhook received:
#    - Subscription created in DB
#    - Credits granted

# 5. Verify in dashboard
open http://localhost:3001/dashboard/wallet

# 6. Test cancellation
# 7. Test upgrade/downgrade
```

## Production Deployment

### Before Launch

1. **Create Production Stripe Products**
   - Switch to live mode in Stripe
   - Create products with live price IDs
   - Update production environment variables

2. **Configure Production Webhook**
   - Add webhook endpoint with production URL
   - Copy production webhook secret

3. **Database Migration**
   ```bash
   # Production database
   npx prisma db push
   ```

4. **Environment Variables**
   - Set all `STRIPE_*` variables in production
   - Use live keys (`sk_live_...`, `price_...`, `whsec_...`)

### Monitoring

1. **Stripe Dashboard**: Monitor subscriptions, failed payments
2. **Application Logs**: Track webhook processing
3. **Database**: Monitor `AgentSubscription` and `CreditTransaction` tables

## Future Enhancements

- [ ] Annual billing discount (save 20%)
- [ ] Add-on purchases (extra lead packs)
- [ ] Usage-based pricing tiers
- [ ] Team/agency subscriptions
- [ ] Affiliate/referral program
- [ ] Trial periods for paid plans
- [ ] Email notifications for billing events

## Support

For issues or questions:
- Check Stripe logs: https://dashboard.stripe.com/logs
- Check application logs for webhook errors
- Verify environment variables are set correctly
- Test webhook endpoint with Stripe CLI
