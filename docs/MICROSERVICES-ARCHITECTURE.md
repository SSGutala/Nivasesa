# Nivasesa Microservices Architecture

## Overview

Nivasesa uses a **GraphQL Federation** architecture from day one, following patterns from [Netflix](https://www.apollographql.com/blog/9-lessons-from-a-year-of-apollo-federation), [Airbnb](https://medium.com/airbnb-engineering), and [Expedia](https://www.apollographql.com/docs/graphos/schema-design/federated-schemas/federation).

This provides:
- **Independent deployment** of each service
- **Team autonomy** with clear ownership
- **Unified API** for all clients
- **Scalability** per service based on load

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│     Web App (Next.js)  │  Mobile App (React Native)  │  Admin Dashboard     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Apollo Router)                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Apollo Federation Gateway                        │    │
│  │  • Query planning & execution                                       │    │
│  │  • Schema composition                                               │    │
│  │  • Rate limiting & caching                                          │    │
│  │  • Authentication middleware                                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
         │              │              │              │              │
         ▼              ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    USER      │ │   LISTING    │ │   BOOKING    │ │   PAYMENT    │ │  MESSAGING   │
│   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │
│              │ │              │ │              │ │              │ │              │
│ • Auth       │ │ • CRUD       │ │ • Requests   │ │ • Stripe     │ │ • Real-time  │
│ • Profiles   │ │ • Search     │ │ • Calendar   │ │ • Escrow     │ │ • Threads    │
│ • Roles      │ │ • Photos     │ │ • State      │ │ • Payouts    │ │ • Notifs     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │
       ▼                ▼                ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  VERIFY      │ │   REVIEW     │ │   SEARCH     │ │ NOTIFICATION │ │   ANALYTICS  │
│  SERVICE     │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │ │   SERVICE    │
│              │ │              │ │              │ │              │ │              │
│ • Identity   │ │ • Ratings    │ │ • Elastic    │ │ • Email      │ │ • Events     │
│ • Background │ │ • Comments   │ │ • Geo        │ │ • Push       │ │ • Metrics    │
│ • Visa       │ │ • Trust      │ │ • Ranking    │ │ • SMS        │ │ • Reports    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
         │              │              │              │              │
         └──────────────┴──────────────┴──────────────┴──────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │  PostgreSQL   │  │    Redis      │  │ Elasticsearch │  │     S3        │ │
│  │  (Primary DB) │  │   (Cache)     │  │   (Search)    │  │   (Files)     │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘ │
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐                                       │
│  │    Kafka      │  │  TimescaleDB  │                                       │
│  │  (Events)     │  │  (Analytics)  │                                       │
│  └───────────────┘  └───────────────┘                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Definitions

### 1. User Service
**Owner:** Auth Team
**Tech:** Node.js, Prisma, PostgreSQL

```graphql
type User @key(fields: "id") {
  id: ID!
  email: String!
  name: String
  role: UserRole!
  profile: Profile
  verification: VerificationStatus
  createdAt: DateTime!
}

enum UserRole {
  RENTER      # Looking for housing
  LANDLORD    # Property owner
  AGENT       # Real estate agent
  ADMIN       # Platform admin
}

type Query {
  me: User
  user(id: ID!): User
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  updateProfile(input: ProfileInput!): User!
}
```

### 2. Listing Service
**Owner:** Marketplace Team
**Tech:** Node.js, Prisma, PostgreSQL

```graphql
type Listing @key(fields: "id") {
  id: ID!
  host: User!
  title: String!
  description: String!
  location: Location!
  price: Money!
  freedomScore: Int!
  photos: [Photo!]!
  amenities: [Amenity!]!
  availability: [Availability!]!
  reviews: [Review!]!
  status: ListingStatus!
}

type Query {
  listing(id: ID!): Listing
  listings(filter: ListingFilter!): ListingConnection!
  searchListings(query: SearchInput!): SearchResult!
}

type Mutation {
  createListing(input: ListingInput!): Listing!
  updateListing(id: ID!, input: ListingInput!): Listing!
  publishListing(id: ID!): Listing!
}
```

### 3. Booking Service
**Owner:** Transactions Team
**Tech:** Node.js, Prisma, PostgreSQL

```graphql
type Booking @key(fields: "id") {
  id: ID!
  listing: Listing!
  guest: User!
  host: User!
  checkIn: Date!
  checkOut: Date!
  status: BookingStatus!
  totalPrice: Money!
  serviceFee: Money!
  payment: Payment
  createdAt: DateTime!
}

enum BookingStatus {
  INQUIRY
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
  DECLINED
}

type Mutation {
  requestBooking(input: BookingRequest!): Booking!
  confirmBooking(id: ID!): Booking!
  declineBooking(id: ID!, reason: String): Booking!
  cancelBooking(id: ID!, reason: String!): Booking!
}
```

### 4. Payment Service
**Owner:** Fintech Team
**Tech:** Node.js, Stripe SDK, PostgreSQL

```graphql
type Payment @key(fields: "id") {
  id: ID!
  booking: Booking!
  amount: Money!
  status: PaymentStatus!
  stripePaymentIntentId: String
  escrowReleasedAt: DateTime
  payoutId: String
}

type Wallet @key(fields: "userId") {
  userId: ID!
  balance: Money!
  pendingBalance: Money!
  transactions: [Transaction!]!
}

type Mutation {
  createPaymentIntent(bookingId: ID!): PaymentIntent!
  capturePayment(paymentIntentId: ID!): Payment!
  releaseEscrow(paymentId: ID!): Payment!
  requestPayout(amount: Money!): Payout!
}
```

### 5. Verification Service (NEW)
**Owner:** Trust & Safety Team
**Tech:** Node.js, External APIs (Persona, Checkr, E-Verify)

```graphql
type Verification @key(fields: "userId") {
  userId: ID!
  identity: IdentityVerification
  background: BackgroundCheck
  visa: VisaVerification
  overallStatus: VerificationStatus!
  trustScore: Int!
}

type IdentityVerification {
  status: VerificationStatus!
  provider: String!           # "persona" | "stripe_identity"
  verifiedAt: DateTime
  documentType: String        # "drivers_license" | "passport" | "state_id"
  expiresAt: DateTime
}

type BackgroundCheck {
  status: VerificationStatus!
  provider: String!           # "checkr" | "persona_yardstik"
  completedAt: DateTime
  result: BackgroundResult!
  reportUrl: String           # Secure link to full report
}

enum BackgroundResult {
  CLEAR
  REVIEW_REQUIRED
  ADVERSE_ACTION
  PENDING
}

type VisaVerification {
  status: VerificationStatus!
  visaType: VisaType
  workAuthorized: Boolean
  expiresAt: DateTime
  eVerifyCase: String         # E-Verify case number
}

enum VisaType {
  H1B
  F1_OPT
  F1_CPT
  L1
  O1
  GREEN_CARD
  CITIZEN
  OTHER
}

enum VerificationStatus {
  NOT_STARTED
  PENDING
  IN_REVIEW
  VERIFIED
  FAILED
  EXPIRED
}

type Query {
  verification(userId: ID!): Verification
  verificationRequirements(role: UserRole!): [VerificationRequirement!]!
}

type Mutation {
  startIdentityVerification: VerificationSession!
  startBackgroundCheck: BackgroundCheckSession!
  startVisaVerification(visaType: VisaType!): VisaVerificationSession!
  submitVisaDocuments(input: VisaDocumentInput!): VisaVerification!
}
```

### 6. Messaging Service
**Owner:** Communications Team
**Tech:** Node.js, WebSockets, Redis

```graphql
type Conversation @key(fields: "id") {
  id: ID!
  participants: [User!]!
  listing: Listing
  booking: Booking
  messages: [Message!]!
  lastMessage: Message
  unreadCount: Int!
}

type Message {
  id: ID!
  sender: User!
  content: String!
  attachments: [Attachment!]!
  readAt: DateTime
  createdAt: DateTime!
}

type Subscription {
  messageReceived(conversationId: ID!): Message!
  conversationUpdated: Conversation!
}
```

### 7. Review Service
**Owner:** Trust Team
**Tech:** Node.js, Prisma, PostgreSQL

```graphql
type Review @key(fields: "id") {
  id: ID!
  booking: Booking!
  reviewer: User!
  reviewee: User!
  rating: Int!              # 1-5
  comment: String!
  categories: ReviewCategories!
  response: String
  createdAt: DateTime!
}

type ReviewCategories {
  cleanliness: Int
  communication: Int
  accuracy: Int
  value: Int
  location: Int
}

type UserReviewSummary {
  averageRating: Float!
  totalReviews: Int!
  ratingDistribution: [Int!]!  # [1-star count, 2-star, ...]
}
```

### 8. Search Service
**Owner:** Discovery Team
**Tech:** Node.js, Elasticsearch, Redis

```graphql
type SearchResult {
  listings: [Listing!]!
  total: Int!
  facets: SearchFacets!
  suggestions: [String!]!
}

type SearchFacets {
  priceRanges: [FacetBucket!]!
  neighborhoods: [FacetBucket!]!
  amenities: [FacetBucket!]!
  freedomScoreRanges: [FacetBucket!]!
}

type Query {
  search(input: SearchInput!): SearchResult!
  autocomplete(query: String!, location: Location): [Suggestion!]!
  similarListings(listingId: ID!): [Listing!]!
}
```

### 9. Notification Service
**Owner:** Communications Team
**Tech:** Node.js, Redis, External (Resend, Twilio)

```graphql
type Notification {
  id: ID!
  user: User!
  type: NotificationType!
  title: String!
  body: String!
  data: JSON
  read: Boolean!
  createdAt: DateTime!
}

enum NotificationType {
  MESSAGE
  BOOKING_REQUEST
  BOOKING_CONFIRMED
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  VERIFICATION_COMPLETE
}

type NotificationPreferences {
  email: Boolean!
  push: Boolean!
  sms: Boolean!
  types: [NotificationType!]!
}
```

---

## Verification Flow Details

### User Types & Requirements

| User Type | Identity | Background | Visa (Optional) | Trust Score Impact |
|-----------|----------|------------|-----------------|-------------------|
| **Renter** | Required | Optional | Optional | +30 identity, +20 background |
| **Landlord** | Required | Required | N/A | +30 identity, +30 background |
| **Agent** | Required | Required | N/A | +30 identity, +30 background, +license |

### Identity Verification Flow (Persona/Stripe Identity)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │  Nivasesa   │     │   Persona   │     │  Database   │
│   Client    │     │   Backend   │     │     API     │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │── Start verify ──▶│                   │                   │
       │                   │── Create session ▶│                   │
       │                   │◀── Session URL ───│                   │
       │◀── Redirect ──────│                   │                   │
       │                   │                   │                   │
       │═══════════════════│═══ User completes verification ═══════│
       │                   │                   │                   │
       │                   │◀── Webhook ───────│                   │
       │                   │   (verification   │                   │
       │                   │    complete)      │                   │
       │                   │                   │                   │
       │                   │── Update status ──────────────────────▶│
       │                   │                   │                   │
       │◀── Notify ────────│                   │                   │
```

**Persona Integration:**
```typescript
// POST /api/verification/identity/start
const session = await persona.createInquiry({
  templateId: process.env.PERSONA_TEMPLATE_ID,
  referenceId: userId,
  fields: {
    nameFirst: user.firstName,
    nameLast: user.lastName,
    emailAddress: user.email,
  },
});

return { sessionUrl: session.redirectUrl };
```

### Background Check Flow (Checkr)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │  Nivasesa   │     │   Checkr    │     │  Database   │
│   Client    │     │   Backend   │     │     API     │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │── Request check ─▶│                   │                   │
       │                   │                   │                   │
       │                   │── Create candidate▶│                   │
       │                   │◀── Candidate ID ──│                   │
       │                   │                   │                   │
       │                   │── Create report ──▶│                   │
       │                   │◀── Report ID ─────│                   │
       │                   │                   │                   │
       │◀── Consent form ──│                   │                   │
       │                   │                   │                   │
       │── Sign consent ──▶│                   │                   │
       │                   │── Submit consent ▶│                   │
       │                   │                   │                   │
       │                   │    ... 1-5 days ...                   │
       │                   │                   │                   │
       │                   │◀── Webhook ───────│                   │
       │                   │   (report.completed)                  │
       │                   │                   │                   │
       │                   │── Store result ────────────────────────▶│
       │◀── Notify ────────│                   │                   │
```

**Background Check Packages:**
```typescript
enum BackgroundPackage {
  BASIC = 'basic',           // SSN trace, sex offender
  STANDARD = 'standard',     // + County criminal (7 years)
  COMPREHENSIVE = 'comprehensive', // + Federal, civil
}

// Required for Landlords/Agents
const landlordPackage = BackgroundPackage.STANDARD;

// Optional for Renters
const renterPackage = BackgroundPackage.BASIC;
```

### Visa Verification Flow (E-Verify + Documents)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │  Nivasesa   │     │  E-Verify   │     │  Database   │
│   Client    │     │   Backend   │     │     API     │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │── Select visa ───▶│                   │                   │
       │   type            │                   │                   │
       │                   │                   │                   │
       │◀── Document list ─│                   │                   │
       │                   │                   │                   │
       │── Upload docs ───▶│                   │                   │
       │   (I-797, EAD,    │                   │                   │
       │    I-20, etc.)    │                   │                   │
       │                   │                   │                   │
       │                   │── Verify case ───▶│ (optional)       │
       │                   │◀── Status ────────│                   │
       │                   │                   │                   │
       │                   │── Manual review ──────────────────────▶│
       │                   │   by Trust team   │                   │
       │                   │                   │                   │
       │◀── Status update ─│                   │                   │
```

**Visa Types & Required Documents:**

| Visa Type | Required Documents | Work Auth Check |
|-----------|-------------------|-----------------|
| H1B | I-797, I-94 | E-Verify eligible |
| F1 OPT | I-20, EAD, I-94 | E-Verify eligible |
| F1 CPT | I-20 with CPT auth | E-Verify eligible |
| L1 | I-797, I-94 | E-Verify eligible |
| O1 | I-797, I-94 | E-Verify eligible |
| Green Card | Green Card (both sides) | E-Verify eligible |
| Citizen | Passport or Birth Cert | N/A |

**Optional for Renters:** Visa verification is optional but adds trust score and may be required by some landlords.

---

## Trust Score Calculation

```typescript
interface TrustScore {
  total: number;        // 0-100
  breakdown: {
    identity: number;   // 0-30
    background: number; // 0-30
    reviews: number;    // 0-25
    tenure: number;     // 0-10
    activity: number;   // 0-5
  };
}

function calculateTrustScore(user: User): TrustScore {
  return {
    identity: user.verification.identity?.status === 'VERIFIED' ? 30 : 0,
    background: getBackgroundScore(user.verification.background),
    reviews: Math.min(25, user.reviewSummary.averageRating * 5),
    tenure: Math.min(10, monthsSinceJoined(user) * 2),
    activity: user.responseRate > 0.9 ? 5 : user.responseRate * 5,
  };
}

function getBackgroundScore(bg: BackgroundCheck): number {
  if (!bg || bg.status !== 'VERIFIED') return 0;
  if (bg.result === 'CLEAR') return 30;
  if (bg.result === 'REVIEW_REQUIRED') return 15;
  return 0;
}
```

---

## External Service Integration

### Required API Keys

| Service | Purpose | Pricing | Setup |
|---------|---------|---------|-------|
| **Persona** | Identity verification | $2-5/verification | [withpersona.com](https://withpersona.com) |
| **Checkr** | Background checks | $30-80/check | [checkr.com](https://checkr.com) |
| **Stripe Identity** | Alt identity verify | $1.50/verification | [stripe.com/identity](https://stripe.com/identity) |
| **E-Verify** | Work authorization | Free (gov) | [e-verify.gov](https://e-verify.gov) |
| **Stripe** | Payments | 2.9% + $0.30 | [stripe.com](https://stripe.com) |
| **Resend** | Email | Free tier available | [resend.com](https://resend.com) |
| **Twilio** | SMS | $0.0075/SMS | [twilio.com](https://twilio.com) |

### Webhook Endpoints

```
POST /api/webhooks/persona      # Identity verification updates
POST /api/webhooks/checkr       # Background check updates
POST /api/webhooks/stripe       # Payment events
POST /api/webhooks/twilio       # SMS delivery status
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              KUBERNETES CLUSTER                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        INGRESS (Nginx/Traefik)                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     APOLLO ROUTER (Gateway)                          │    │
│  │                     Replicas: 3, Auto-scaling                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │          │          │          │          │          │            │
│  ┌──────┴───┐ ┌────┴────┐ ┌───┴────┐ ┌───┴────┐ ┌───┴────┐ ┌───┴────┐     │
│  │  User    │ │ Listing │ │ Booking│ │ Payment│ │ Verify │ │  Msg   │     │
│  │ Service  │ │ Service │ │ Service│ │ Service│ │ Service│ │ Service│     │
│  │ (3 pods) │ │ (3 pods)│ │ (2 pods│ │ (2 pods│ │ (2 pods│ │ (3 pods│     │
│  └──────────┘ └─────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        DATABASES & CACHES                            │    │
│  │  PostgreSQL (Primary + Replicas) │ Redis Cluster │ Elasticsearch    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Sources

- [Apollo Federation Documentation](https://www.apollographql.com/docs/graphos/schema-design/federated-schemas/federation)
- [GraphQL Federation Overview](https://graphql.org/learn/federation/)
- [9 Lessons From a Year of Apollo Federation](https://www.apollographql.com/blog/9-lessons-from-a-year-of-apollo-federation)
- [Persona Identity Verification](https://withpersona.com/)
- [Checkr Background Check API](https://docs.checkr.com/)
- [E-Verify Government Portal](https://www.e-verify.gov/)
- [Stripe Identity](https://stripe.com/identity)
