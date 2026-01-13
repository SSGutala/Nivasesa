# Agent Subscriptions - Quick Start Guide

## Overview
Real estate agents can subscribe to monthly plans that grant lead credits, with unused credits rolling over. Four tiers available: Free, Starter ($29), Pro ($79), Enterprise ($199).

## Quick Setup (5 minutes)

### 1. Create Stripe Products
```bash
# Login to Stripe Dashboard
open https://dashboard.stripe.com/test/products

# Create 3 products:
# - "Starter Plan" → $29/month recurring → Copy price ID
# - "Pro Plan" → $79/month recurring → Copy price ID
# - "Enterprise Plan" → $199/month recurring → Copy price ID
```

### 2. Update Environment Variables
Edit `/apps/lead-gen 2/.env`:
```bash
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

STRIPE_STARTER_PRICE_ID="price_YOUR_STARTER_ID"
STRIPE_PRO_PRICE_ID="price_YOUR_PRO_ID"
STRIPE_ENTERPRISE_PRICE_ID="price_YOUR_ENTERPRISE_ID"
```

### 3. Setup Webhook
```bash
# Install Stripe CLI (if not installed)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Copy the webhook signing secret (whsec_...) to .env
```

### 4. Run the App
```bash
cd "apps/lead-gen 2"
pnpm install
npm run dev
```

### 5. Test Subscription
```
1. Open: http://localhost:3001/pricing
2. Click "Subscribe" on Pro plan
3. Use test card: 4242 4242 4242 4242
4. Verify in Terminal: Webhook received
5. Check DB: SELECT * FROM AgentSubscription;
```

## Usage Examples

### Check Subscription Status
```typescript
import { getSubscriptionStatusAction } from '@/actions/subscriptions'

const result = await getSubscriptionStatusAction()
console.log(result.subscription.tier) // 'pro'
console.log(result.subscription.creditBalance) // 300
```

### Subscribe to Plan
```typescript
import { createSubscriptionAction } from '@/actions/subscriptions'

const result = await createSubscriptionAction('pro', '/dashboard/wallet')
if (result.success) {
  window.location.href = result.url // Redirect to Stripe Checkout
}
```

### Upgrade/Downgrade
```typescript
import { upgradeSubscriptionAction } from '@/actions/subscriptions'

const result = await upgradeSubscriptionAction('enterprise')
// Prorated billing automatically handled by Stripe
```

### Cancel Subscription
```typescript
import { cancelSubscriptionAction } from '@/actions/subscriptions'

const result = await cancelSubscriptionAction()
// Cancels at period end, credits remain available
```

### Access Billing Portal
```typescript
import { getBillingPortalAction } from '@/actions/subscriptions'

const result = await getBillingPortalAction()
window.location.href = result.url
// Agent can update payment method, view invoices
```

## How Credits Work

### Monthly Grant
- Starter: +$100 credits every month
- Pro: +$300 credits every month
- Enterprise: +$1,000 credits every month

### Rollover
- Unused credits accumulate (no expiration)
- Example: Pro plan, use $200/month → Month 3 balance = $500

### Lead Unlock
When unlocking a $30 lead:
1. First: Use subscription credits (`creditBalance`)
2. Then: Use free unlocks (`freeUnlocksRemaining`)
3. Last: Prompt to top-up or subscribe

### After Cancellation
- Credits remain in `creditBalance`
- Can still unlock leads using accumulated credits
- Pay-per-lead top-ups still available

## Stripe Test Cards

| Purpose | Card Number |
|---------|-------------|
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |
| 3D Secure | `4000 0025 0000 3155` |
| Insufficient Funds | `4000 0000 0000 9995` |

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)

## Webhook Events

| Event | What Happens |
|-------|--------------|
| `customer.subscription.created` | Create subscription in DB, grant initial credits |
| `customer.subscription.updated` | Update tier/status (upgrades, cancellations) |
| `customer.subscription.deleted` | Downgrade to free tier |
| `invoice.paid` | Grant monthly credits (recurring billing) |
| `invoice.payment_failed` | Mark subscription as `past_due` |

## Database Schema

```sql
-- Check subscription
SELECT * FROM AgentSubscription
WHERE agentId = 'YOUR_REALTOR_PROFILE_ID';

-- Check credits
SELECT creditBalance, freeUnlocksRemaining
FROM RealtorProfile
WHERE id = 'YOUR_REALTOR_PROFILE_ID';

-- Check credit history
SELECT * FROM CreditTransaction
WHERE agentId = 'YOUR_REALTOR_PROFILE_ID'
ORDER BY createdAt DESC;
```

## Troubleshooting

### "Stripe keys not set"
- Check `.env` has `STRIPE_SECRET_KEY`
- Restart dev server after updating `.env`

### "Webhook signature invalid"
- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe CLI output
- Check webhook endpoint is running on port 3001

### "Credits not granted"
- Check webhook received: Look for logs in terminal
- Check Stripe dashboard: Webhooks → Events
- Verify `invoice.paid` event fired

### "Subscription not found"
- Check `AgentSubscription` table has record
- Verify `stripeSubscriptionId` matches Stripe dashboard
- Check metadata has `realtorProfileId`

## Production Checklist

Before deploying to production:

- [ ] Switch Stripe to live mode
- [ ] Create live products and copy live price IDs
- [ ] Update production `.env` with live keys
- [ ] Add production webhook endpoint to Stripe
- [ ] Test full subscription flow in production
- [ ] Set up monitoring for webhook failures
- [ ] Configure email notifications for billing events
- [ ] Test failed payment scenarios
- [ ] Document cancellation/refund policies
- [ ] Train support team on subscription management

## Support

### View Stripe Logs
```bash
# Dashboard
open https://dashboard.stripe.com/test/logs

# CLI
stripe logs tail
```

### Debug Webhook
```bash
# Trigger test event
stripe trigger customer.subscription.created

# Check webhook history
open https://dashboard.stripe.com/test/webhooks
```

### Check Database
```bash
npx prisma studio
# Browse AgentSubscription and CreditTransaction tables
```

## Next Steps

1. Integrate subscription UI into agent dashboard
2. Add email notifications for billing events
3. Create admin panel for subscription management
4. Add usage analytics (credits used per month)
5. Implement annual billing with discount
6. Add trial periods for new signups

## Resources

- [Stripe Subscriptions Docs](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

---

**Questions?** See `/apps/lead-gen 2/SUBSCRIPTION_IMPLEMENTATION.md` for full technical details.
