# Nivasesa System Architecture

## Overview

Nivasesa follows a **modular monolith** architecture designed to scale to microservices when needed. This approach balances development velocity with future scalability, learning from [Airbnb's evolution](https://medium.com/@techworldwithmilan/airbnb-microservice-architecture-bd1986c73719).

## Architecture Phases

### Current: Modular Monolith (Turborepo)
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│   Web (Next.js)  │  Mobile (Future)  │  Admin Dashboard         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│   Server Actions  │  API Routes  │  Webhooks                    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   AUTH PKG    │   │  PAYMENT PKG  │   │ MESSAGING PKG │
│   @niv/auth   │   │ @niv/payment  │   │ @niv/messaging│
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│   Auth DB (Users, Accounts, Sessions)                           │
│   Rent App DB (Listings, Applications, Messages, Reviews)       │
│   Lead Gen DB (Leads, Realtors, Analytics)                      │
└─────────────────────────────────────────────────────────────────┘
```

### Future: Service-Oriented Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (GraphQL)                       │
│                   Central Data Aggregator                        │
└─────────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  User    │   │ Listing  │   │ Booking  │   │ Payment  │
│ Service  │   │ Service  │   │ Service  │   │ Service  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Search  │   │ Calendar │   │ Messaging│   │ Review   │
│ Service  │   │ Service  │   │ Service  │   │ Service  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## Core Services & Packages

### 1. Authentication Service (`@niv/auth`)
**Responsibilities:**
- User registration & login (credentials + OAuth)
- Session management (JWT)
- 2FA (TOTP)
- Role-based access control (BUYER, REALTOR, ADMIN)

**Database:** `packages/auth-db/prisma/schema.prisma`
```prisma
User, Account, Session, VerificationToken
```

**Tech Stack:**
- NextAuth v5 (Auth.js)
- Prisma ORM
- bcrypt for password hashing
- TOTP for 2FA

### 2. Listing Service (rent-app core)
**Responsibilities:**
- CRUD for room listings
- Photo upload & management
- Freedom Score calculation
- Search & filtering
- Availability calendar

**Key Models:**
```prisma
Room, RoomPhoto, RoomAmenity, Availability
```

**Features:**
- Geolocation search
- Price filtering
- Lifestyle matching
- Map clustering (implemented)

### 3. Booking Service (to build)
**Responsibilities:**
- Application workflow
- Availability checking
- Booking state machine
- Calendar management

**Booking States:**
```
INQUIRY → PENDING → CONFIRMED → ACTIVE → COMPLETED
                  ↘ DECLINED
                  ↘ CANCELLED
                  ↘ EXPIRED
```

**Key Models:**
```prisma
Booking {
  id
  listingId
  guestId
  hostId
  checkIn
  checkOut
  status: BookingStatus
  totalPrice
  serviceFee
  depositAmount
  paymentIntentId
  createdAt
  updatedAt
}

Availability {
  id
  listingId
  date
  available: Boolean
  priceOverride: Decimal?
  minStay: Int?
}
```

### 4. Payment Service (`@niv/payment`)
**Responsibilities:**
- Stripe integration
- Payment processing
- Escrow management
- Refund handling
- Payout to hosts

**Key Flows:**
```
Guest Payment Flow:
1. Guest books → Create PaymentIntent (hold funds)
2. Host confirms → Capture payment
3. Check-in verified → Move to escrow
4. 24h after check-in → Release to host (minus service fee)

Refund Flow:
1. Cancellation request
2. Apply cancellation policy
3. Calculate refund amount
4. Process refund via Stripe
5. Update booking status
```

**Models:**
```prisma
Transaction, Wallet, Payout, RefundRequest
```

### 5. Messaging Service (`@niv/messaging`)
**Responsibilities:**
- Real-time chat
- Message threading
- Read receipts
- Notifications

**Tech Options:**
- Polling (current)
- WebSockets (future)
- Pusher/Ably (managed)

### 6. Review Service (to build)
**Responsibilities:**
- Bidirectional reviews (host ↔ guest)
- Rating calculation
- Review moderation
- Trust score updates

**Models:**
```prisma
Review {
  id
  bookingId
  reviewerId
  revieweeId
  rating: Int (1-5)
  comment: String
  type: HOST_TO_GUEST | GUEST_TO_HOST
  createdAt
}
```

### 7. Search Service
**Responsibilities:**
- Full-text search
- Geo-spatial queries
- Filtering & faceting
- Ranking & personalization

**Current:** Prisma queries with manual filtering
**Future:**
- Elasticsearch/Algolia for text search
- PostGIS for geo queries
- Redis for caching

### 8. Notification Service (to build)
**Responsibilities:**
- Email notifications
- Push notifications (future)
- SMS (future)
- In-app notifications

**Triggers:**
- New message
- Application received
- Application status change
- Booking confirmation
- Payment received
- Review received

---

## Database Architecture

### Current: SQLite (Development)
Simple, file-based, zero-config for local development.

### Production: PostgreSQL
```
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Primary)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  users   │  │ listings │  │ bookings │  │ messages │        │
│  │ accounts │  │  rooms   │  │ payments │  │  reviews │        │
│  │ sessions │  │  photos  │  │  escrow  │  │  threads │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Read Replicas (Future)                        │
│           For search-heavy queries and analytics                 │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Strategy
```
┌──────────────────────────────────────────┐
│              Redis Cache                  │
│  ┌────────────────────────────────────┐  │
│  │ Session cache (user sessions)      │  │
│  │ Listing cache (hot listings)       │  │
│  │ Search cache (query results)       │  │
│  │ Rate limiting                      │  │
│  │ Real-time features                 │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Infrastructure

### Development
```
Local Machine
├── pnpm (package manager)
├── Turborepo (monorepo)
├── SQLite (database)
├── Next.js dev server
└── Docker (optional isolation)
```

### Staging/Production
```
Vercel (or similar)
├── Next.js Apps (rent-app, lead-gen)
├── Serverless Functions (API routes)
├── Edge Functions (middleware)
└── CDN (static assets)

External Services
├── PostgreSQL (Supabase/Neon/PlanetScale)
├── Redis (Upstash)
├── Stripe (payments)
├── Resend/SendGrid (email)
├── Cloudinary/S3 (images)
├── Sentry (error tracking)
└── Analytics (PostHog/Mixpanel)
```

---

## Scaling Considerations

### Phase 1: 0-1000 Users (Current)
- Single database
- Serverless deployment
- Basic caching
- Manual operations

### Phase 2: 1K-10K Users
- Read replicas
- Redis caching
- Background job queue
- CDN for images
- Basic monitoring

### Phase 3: 10K-100K Users
- Database sharding
- Microservices extraction
- Elasticsearch for search
- Event-driven architecture
- Auto-scaling

### Phase 4: 100K+ Users
- Multi-region deployment
- GraphQL federation
- ML-based ranking
- Real-time infrastructure
- Dedicated SRE team

---

## Security Architecture

### Authentication Layers
```
1. Edge Middleware → Validate session token
2. API Layer → Check permissions
3. Database → Row-level security (future)
```

### Data Protection
- Encryption at rest (database)
- Encryption in transit (TLS)
- PII handling (GDPR compliance)
- Secrets in environment variables

### Payment Security
- PCI compliance via Stripe
- No card data stored locally
- Webhook signature verification
- Idempotency keys

---

## Observability

### Logging
- Structured JSON logs
- Request tracing
- Error aggregation (Sentry)

### Metrics
- Response times
- Error rates
- Business metrics (bookings, revenue)

### Alerting
- Uptime monitoring
- Error spike detection
- Payment failure alerts

---

## Sources

- [Airbnb Microservice Architecture](https://medium.com/@techworldwithmilan/airbnb-microservice-architecture-bd1986c73719)
- [Airbnb at Scale: Monolith to Microservices](https://www.infoq.com/presentations/airbnb-scalability-transition/)
- [Airbnb Tech Blog](https://airbnb.tech)
- [Data Infrastructure at Airbnb](https://medium.com/airbnb-engineering/data-infrastructure-at-airbnb-8adfb34f169c)
- [Embedding-Based Retrieval for Airbnb Search](https://airbnb.tech/uncategorized/embedding-based-retrieval-for-airbnb-search/)
