# Nivasesa Feature Roadmap

## Feature Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Ready | Can be built now, no blockers |
| 🔑 Blocked | Requires API keys/credentials |
| 📋 Planned | Designed, waiting for prioritization |
| 🔮 Future | Long-term roadmap |

---

## Epic 1: Booking System (E-BOOK)

### Core Booking Flow

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-BOOK-01**: Booking data model | ✅ Ready | Prisma schema | P0 |
| **E-BOOK-02**: Availability calendar UI | ✅ Ready | React calendar component | P0 |
| **E-BOOK-03**: Availability management (host) | ✅ Ready | Calendar + API | P0 |
| **E-BOOK-04**: Date selection (guest) | ✅ Ready | Calendar component | P0 |
| **E-BOOK-05**: Booking request flow | ✅ Ready | State machine | P0 |
| **E-BOOK-06**: Instant book toggle | ✅ Ready | Listing settings | P1 |
| **E-BOOK-07**: Booking confirmation emails | 🔑 Blocked | Resend/SendGrid API key | P1 |
| **E-BOOK-08**: Booking dashboard (host) | ✅ Ready | UI components | P0 |
| **E-BOOK-09**: My bookings (guest) | ✅ Ready | UI components | P0 |
| **E-BOOK-10**: Cancellation policies | ✅ Ready | Business logic | P1 |

### Booking State Machine
```
                    ┌─────────────┐
                    │   INQUIRY   │
                    └──────┬──────┘
                           │ Guest requests
                           ▼
                    ┌─────────────┐
          ┌─────────│   PENDING   │─────────┐
          │         └──────┬──────┘         │
          │                │                │
    Host declines    Host confirms    48h timeout
          │                │                │
          ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │  DECLINED   │  │  CONFIRMED  │  │   EXPIRED   │
   └─────────────┘  └──────┬──────┘  └─────────────┘
                           │
                    Payment captured
                           │
                           ▼
                    ┌─────────────┐
          ┌─────────│   ACTIVE    │─────────┐
          │         └──────┬──────┘         │
          │                │                │
    Cancellation      Check-out        Dispute
          │                │                │
          ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │  CANCELLED  │  │  COMPLETED  │  │  DISPUTED   │
   └─────────────┘  └─────────────┘  └─────────────┘
```

---

## Epic 2: Payment System (E-PAY)

### Stripe Integration

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-PAY-01**: Stripe account setup | 🔑 Blocked | Stripe keys | P0 |
| **E-PAY-02**: Payment intent creation | 🔑 Blocked | Stripe SDK | P0 |
| **E-PAY-03**: Checkout UI (Stripe Elements) | 🔑 Blocked | Stripe.js | P0 |
| **E-PAY-04**: Payment webhook handler | 🔑 Blocked | Stripe webhooks | P0 |
| **E-PAY-05**: Escrow logic (hold funds) | ✅ Ready | Business logic | P0 |
| **E-PAY-06**: Payout to hosts | 🔑 Blocked | Stripe Connect | P1 |
| **E-PAY-07**: Service fee calculation | ✅ Ready | Business logic | P0 |
| **E-PAY-08**: Refund processing | 🔑 Blocked | Stripe refunds | P1 |
| **E-PAY-09**: Transaction history | ✅ Ready | UI + queries | P1 |
| **E-PAY-10**: Payment receipts | 🔑 Blocked | Email + PDF | P2 |

### Payment Architecture
```
Guest                    Nivasesa                    Stripe
  │                         │                          │
  │──── Book request ──────▶│                          │
  │                         │                          │
  │                         │─── Create PaymentIntent ─▶│
  │                         │◀── Return client_secret ──│
  │                         │                          │
  │◀─── Checkout form ──────│                          │
  │                         │                          │
  │──── Card details ──────▶│─── Confirm payment ─────▶│
  │                         │                          │
  │                         │◀── payment_intent.succeeded
  │                         │                          │
  │◀─── Booking confirmed ──│                          │
  │                         │                          │
  │        ... 24h after check-in ...                  │
  │                         │                          │
  │                         │─── Transfer to host ────▶│
  │                         │    (minus service fee)   │
```

### Escrow Timeline
```
Day 0: Guest books
       └── Payment captured, held in Nivasesa Stripe account

Day 1: Check-in
       └── 24-hour hold begins

Day 2: Release
       └── Funds transferred to host (minus 10% service fee)
```

---

## Epic 3: Review System (E-REV)

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-REV-01**: Review data model | ✅ Ready | Prisma schema | P1 |
| **E-REV-02**: Review submission form | ✅ Ready | UI components | P1 |
| **E-REV-03**: Dual-blind reviews | ✅ Ready | Business logic | P1 |
| **E-REV-04**: Review display on listings | ✅ Ready | UI components | P1 |
| **E-REV-05**: Review display on profiles | ✅ Ready | UI components | P1 |
| **E-REV-06**: Average rating calculation | ✅ Ready | Aggregation query | P1 |
| **E-REV-07**: Review moderation | ✅ Ready | Admin UI | P2 |
| **E-REV-08**: Review response (host) | ✅ Ready | UI + API | P2 |
| **E-REV-09**: Review reminders | 🔑 Blocked | Email service | P2 |
| **E-REV-10**: Trust score update | ✅ Ready | Algorithm | P2 |

### Review Flow
```
Booking completes
        │
        ▼
┌───────────────────────────────────────┐
│  Both parties have 14 days to review  │
│  Reviews are hidden until both submit │
│  OR 14 days pass                      │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  Reviews revealed simultaneously      │
│  Ratings update on profiles           │
│  Trust scores recalculated            │
└───────────────────────────────────────┘
```

---

## Epic 4: Calendar & Availability (E-CAL)

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-CAL-01**: Availability schema | ✅ Ready | Prisma | P0 |
| **E-CAL-02**: Calendar component | ✅ Ready | React datepicker | P0 |
| **E-CAL-03**: Block dates UI | ✅ Ready | Calendar + API | P0 |
| **E-CAL-04**: Price override per date | ✅ Ready | Calendar + API | P1 |
| **E-CAL-05**: Minimum stay rules | ✅ Ready | Validation | P1 |
| **E-CAL-06**: Sync with external (iCal) | ✅ Ready | iCal parsing | P2 |
| **E-CAL-07**: Smart pricing suggestions | 🔮 Future | ML model | P3 |

### Calendar Data Model
```prisma
model Availability {
  id            String   @id @default(cuid())
  listingId     String
  date          DateTime
  available     Boolean  @default(true)
  priceOverride Decimal?
  minStay       Int?
  note          String?

  listing       Room     @relation(fields: [listingId], references: [id])

  @@unique([listingId, date])
  @@index([listingId, date])
}
```

---

## Epic 5: Notifications (E-NOTIF)

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-NOTIF-01**: Notification preferences | ✅ Ready | User settings | P1 |
| **E-NOTIF-02**: In-app notifications | ✅ Ready | UI + polling | P1 |
| **E-NOTIF-03**: Email notifications | 🔑 Blocked | Resend API key | P1 |
| **E-NOTIF-04**: Email templates | ✅ Ready | React Email | P1 |
| **E-NOTIF-05**: Push notifications | 🔮 Future | Service worker | P3 |
| **E-NOTIF-06**: SMS notifications | 🔑 Blocked | Twilio API | P3 |

### Notification Events
```
- New message received
- Application received (host)
- Application status changed (guest)
- Booking confirmed
- Booking cancelled
- Payment received
- Payout sent
- Review received
- Review reminder (7 days after checkout)
```

---

## Epic 6: Search & Discovery (E-SEARCH)

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-SEARCH-01**: Basic filters | ✅ Done | Prisma queries | P0 |
| **E-SEARCH-02**: Map view | ✅ Done | Custom map | P0 |
| **E-SEARCH-03**: Map clustering | ✅ Done | Clustering algorithm | P0 |
| **E-SEARCH-04**: Saved searches | ✅ Ready | User preferences | P1 |
| **E-SEARCH-05**: Search alerts | 🔑 Blocked | Email service | P2 |
| **E-SEARCH-06**: Full-text search | 📋 Planned | Elasticsearch/Algolia | P2 |
| **E-SEARCH-07**: ML-based ranking | 🔮 Future | ML pipeline | P3 |

---

## Epic 7: Trust & Safety (E-TRUST)

| Feature | Status | Dependencies | Priority |
|---------|--------|--------------|----------|
| **E-TRUST-01**: Email verification | ✅ Done | NextAuth | P0 |
| **E-TRUST-02**: Phone verification | 🔑 Blocked | Twilio | P1 |
| **E-TRUST-03**: ID verification | 🔑 Blocked | Stripe Identity | P2 |
| **E-TRUST-04**: Report user/listing | ✅ Ready | Admin queue | P1 |
| **E-TRUST-05**: Admin moderation queue | ✅ Ready | Admin UI | P1 |
| **E-TRUST-06**: Fraud detection | 🔮 Future | ML model | P3 |
| **E-TRUST-07**: Background checks | 🔑 Blocked | Checkr API | P3 |

---

## Implementation Order

### Sprint 1: Booking Foundation (No Blockers)
1. E-BOOK-01: Booking data model
2. E-CAL-01: Availability schema
3. E-CAL-02: Calendar component
4. E-CAL-03: Block dates UI
5. E-BOOK-02: Availability calendar UI

### Sprint 2: Booking Flow (No Blockers)
1. E-BOOK-05: Booking request flow
2. E-BOOK-08: Booking dashboard (host)
3. E-BOOK-09: My bookings (guest)
4. E-PAY-05: Escrow logic
5. E-PAY-07: Service fee calculation

### Sprint 3: Reviews (No Blockers)
1. E-REV-01: Review data model
2. E-REV-02: Review submission form
3. E-REV-03: Dual-blind reviews
4. E-REV-04: Review display on listings
5. E-REV-06: Average rating calculation

### Sprint 4: Search & Notifications (Partial Blockers)
1. E-SEARCH-04: Saved searches
2. E-NOTIF-01: Notification preferences
3. E-NOTIF-02: In-app notifications
4. E-NOTIF-04: Email templates (ready, blocked on send)

### Sprint 5: Payments (🔑 BLOCKED - Needs Stripe Keys)
1. E-PAY-01: Stripe account setup
2. E-PAY-02: Payment intent creation
3. E-PAY-03: Checkout UI
4. E-PAY-04: Webhook handler
5. E-PAY-06: Payouts

### Sprint 6: Trust & Verification (🔑 BLOCKED - Needs API Keys)
1. E-TRUST-02: Phone verification (Twilio)
2. E-TRUST-03: ID verification (Stripe Identity)
3. E-NOTIF-03: Email notifications (Resend)

---

## Required API Keys

| Service | Purpose | Features Blocked | Setup URL |
|---------|---------|------------------|-----------|
| **Stripe** | Payments | E-PAY-01 to E-PAY-10 | https://dashboard.stripe.com |
| **Resend** | Email | E-NOTIF-03, E-BOOK-07 | https://resend.com |
| **Twilio** | SMS/Phone | E-TRUST-02, E-NOTIF-06 | https://twilio.com |
| **Cloudinary** | Images | Photo optimization | https://cloudinary.com |
| **Google Maps** | Geocoding | Address autocomplete | https://console.cloud.google.com |

---

## Metrics to Track

### Business Metrics
- Listings created per week
- Booking requests per week
- Booking conversion rate
- Average booking value
- Revenue (service fees)

### Product Metrics
- Search to booking rate
- Message response time
- Review completion rate
- User activation rate (signup → first action)

### Technical Metrics
- API response times
- Error rates
- Database query performance
- Page load times
