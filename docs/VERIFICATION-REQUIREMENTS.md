# Nivasesa Verification Requirements

## Overview

Comprehensive verification system for all user types to ensure trust and safety on the platform.

---

## User Types & Verification Matrix

| Verification | Renter | Landlord | Agent | Notes |
|--------------|--------|----------|-------|-------|
| **Email** | Required | Required | Required | Via NextAuth |
| **Phone** | Required | Required | Required | Via Twilio |
| **Identity (ID)** | Required | Required | Required | Persona or Stripe Identity |
| **Background Check** | Optional | Required | Required | Checkr |
| **Visa/Work Auth** | Optional | N/A | N/A | For non-citizens |
| **License** | N/A | N/A | Required | State real estate license |

---

## Epic: E-VERIFY (Nivasesa-a50)

### Phase 1: Identity Verification (P0)

| Feature | Status | Provider | Cost |
|---------|--------|----------|------|
| **V-ID-01**: Persona integration | 🔑 Blocked | Persona | $2-5/verify |
| **V-ID-02**: Stripe Identity fallback | 🔑 Blocked | Stripe | $1.50/verify |
| **V-ID-03**: Document upload UI | ✅ Ready | - | - |
| **V-ID-04**: Verification status display | ✅ Ready | - | - |
| **V-ID-05**: Admin review queue | ✅ Ready | - | - |
| **V-ID-06**: Webhook handlers | ✅ Ready | - | - |

**Supported Documents:**
- Driver's License (US)
- State ID (US)
- Passport (Any country)
- Permanent Resident Card (Green Card)

**Flow:**
```
User clicks "Verify Identity"
    → Persona SDK opens
    → User takes selfie + uploads ID
    → Liveness check + document verification
    → Webhook received
    → Status updated in database
    → Badge displayed on profile
```

### Phase 2: Background Checks (P1)

| Feature | Status | Provider | Cost |
|---------|--------|----------|------|
| **V-BG-01**: Checkr integration | 🔑 Blocked | Checkr | $30-80/check |
| **V-BG-02**: Consent flow UI | ✅ Ready | - | - |
| **V-BG-03**: FCRA compliance | ✅ Ready | Legal | - |
| **V-BG-04**: Adverse action flow | ✅ Ready | - | - |
| **V-BG-05**: Report storage | ✅ Ready | - | - |

**Check Packages:**

| Package | Checks Included | Use Case | Cost |
|---------|-----------------|----------|------|
| **Basic** | SSN Trace, National Sex Offender | Renters (optional) | ~$30 |
| **Standard** | + County Criminal (7 yr) | Landlords | ~$50 |
| **Comprehensive** | + Federal, Civil, Employment | Agents | ~$80 |

**FCRA Requirements:**
1. Clear disclosure before check
2. Written consent from user
3. Pre-adverse action notice if issues found
4. 5 business days to dispute
5. Final adverse action notice

### Phase 3: Visa Verification (P1)

| Feature | Status | Provider | Cost |
|---------|--------|----------|------|
| **V-VISA-01**: Visa type selection | ✅ Ready | - | - |
| **V-VISA-02**: Document upload | ✅ Ready | - | - |
| **V-VISA-03**: E-Verify integration | 🔑 Blocked | E-Verify | Free |
| **V-VISA-04**: Manual review queue | ✅ Ready | - | - |
| **V-VISA-05**: Expiration tracking | ✅ Ready | - | - |
| **V-VISA-06**: Renewal reminders | ✅ Ready | - | - |

**Supported Visa Types:**

| Visa | Documents Required | Work Auth | Notes |
|------|-------------------|-----------|-------|
| **H1B** | I-797, I-94 | Yes | Employment-based |
| **F1 OPT** | I-20, EAD, I-94 | Yes (limited) | Student post-grad |
| **F1 CPT** | I-20 w/ CPT auth | Yes (limited) | Student internship |
| **L1** | I-797, I-94 | Yes | Intra-company transfer |
| **O1** | I-797, I-94 | Yes | Extraordinary ability |
| **H4 EAD** | H4, EAD | Yes | H1B spouse |
| **Green Card** | PR Card (front/back) | Yes | Permanent resident |
| **Citizen** | Passport or Birth Cert | Yes | US Citizen |

**Why Visa Verification?**
- South Asian community focus = many H1B, F1, L1 visa holders
- Landlords may require proof of legal status
- Builds trust between parties
- Optional but increases trust score

### Phase 4: Agent License Verification (P2)

| Feature | Status | Provider | Cost |
|---------|--------|----------|------|
| **V-LIC-01**: License number input | ✅ Ready | - | - |
| **V-LIC-02**: State lookup integration | 📋 Planned | State APIs | Varies |
| **V-LIC-03**: License validation | 📋 Planned | ARELLO | TBD |
| **V-LIC-04**: Expiration tracking | ✅ Ready | - | - |

**State License Databases:**
- Texas: TREC (trec.texas.gov)
- California: DRE (dre.ca.gov)
- New Jersey: NJREC (state.nj.us/dobi/division_rec)

---

## Trust Score System

### Score Breakdown (0-100)

| Component | Max Points | How to Earn |
|-----------|------------|-------------|
| **Identity Verified** | 30 | Complete Persona/Stripe verification |
| **Background Clear** | 30 | Pass background check |
| **Reviews** | 25 | Average rating × 5 |
| **Platform Tenure** | 10 | 2 points per month (max 10) |
| **Response Rate** | 5 | >90% response rate |

### Score Display

```
┌────────────────────────────────────┐
│  Trust Score: 85/100               │
│  ████████████████████░░░░          │
│                                    │
│  ✓ Identity Verified    +30       │
│  ✓ Background Clear     +30       │
│  ★ 4.8 Rating (12)      +24       │
│  ⏱ Member 6 months      +6        │
│  💬 95% Response        +5        │
└────────────────────────────────────┘
```

### Trust Badges

| Badge | Requirement | Display |
|-------|-------------|---------|
| **ID Verified** | Identity check passed | ✓ ID Verified |
| **Background Checked** | Background clear | ✓ Background Checked |
| **Visa Verified** | Visa docs verified | ✓ Work Authorized |
| **Licensed Agent** | State license valid | ✓ Licensed Agent |
| **Superhost** | 90+ trust, 10+ bookings | ⭐ Superhost |

---

## Data Model

```prisma
model Verification {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])

  // Identity
  identityStatus      VerificationStatus @default(NOT_STARTED)
  identityProvider    String?            // "persona" | "stripe_identity"
  identityVerifiedAt  DateTime?
  identityDocType     String?            // "drivers_license" | "passport"
  identityExternalId  String?            // Persona inquiry ID

  // Background
  backgroundStatus      VerificationStatus @default(NOT_STARTED)
  backgroundProvider    String?            // "checkr"
  backgroundCompletedAt DateTime?
  backgroundResult      BackgroundResult?
  backgroundReportId    String?            // Checkr report ID
  backgroundPackage     String?            // "basic" | "standard" | "comprehensive"

  // Visa
  visaStatus          VerificationStatus @default(NOT_STARTED)
  visaType            VisaType?
  visaVerifiedAt      DateTime?
  visaExpiresAt       DateTime?
  visaDocuments       Json?              // Array of document URLs
  visaEVerifyCase     String?

  // Agent License
  licenseStatus       VerificationStatus @default(NOT_STARTED)
  licenseNumber       String?
  licenseState        String?
  licenseVerifiedAt   DateTime?
  licenseExpiresAt    DateTime?

  // Trust Score
  trustScore          Int      @default(0)
  trustScoreUpdatedAt DateTime @default(now())

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

enum VerificationStatus {
  NOT_STARTED
  PENDING
  IN_REVIEW
  VERIFIED
  FAILED
  EXPIRED
}

enum BackgroundResult {
  CLEAR
  REVIEW_REQUIRED
  ADVERSE_ACTION
}

enum VisaType {
  H1B
  F1_OPT
  F1_CPT
  L1
  O1
  H4_EAD
  GREEN_CARD
  CITIZEN
  OTHER
}
```

---

## API Endpoints

### REST (Webhook Receivers)
```
POST /api/webhooks/persona      # Identity verification updates
POST /api/webhooks/checkr       # Background check updates
POST /api/webhooks/stripe       # Stripe Identity updates
```

### GraphQL (User Actions)
```graphql
type Mutation {
  # Identity
  startIdentityVerification(provider: String): VerificationSession!

  # Background
  startBackgroundCheck(package: BackgroundPackage!): BackgroundSession!
  signBackgroundConsent(sessionId: ID!): BackgroundCheck!

  # Visa
  startVisaVerification(visaType: VisaType!): VisaSession!
  uploadVisaDocument(sessionId: ID!, file: Upload!): VisaDocument!
  submitVisaVerification(sessionId: ID!): VisaVerification!

  # License (Agents)
  submitLicenseNumber(number: String!, state: String!): LicenseVerification!
}

type Query {
  myVerification: Verification!
  verificationRequirements(role: UserRole!): [VerificationRequirement!]!
}
```

---

## Implementation Order

### Sprint 1: Foundation (No Blockers)
1. Verification data model (Prisma schema)
2. Verification status UI components
3. Trust score calculation logic
4. Admin review queue UI
5. Badge display components

### Sprint 2: Identity (🔑 Needs API Keys)
1. Persona SDK integration
2. Persona webhook handler
3. Stripe Identity fallback
4. Document upload flow
5. Status tracking

### Sprint 3: Background (🔑 Needs API Keys)
1. Checkr API integration
2. Consent flow with FCRA compliance
3. Report retrieval
4. Adverse action flow
5. Webhook handlers

### Sprint 4: Visa (Partial Blockers)
1. Visa type selection UI
2. Document upload (S3/Cloudinary)
3. Manual review queue
4. E-Verify integration (🔑 blocked)
5. Expiration tracking

### Sprint 5: Agent License
1. License number input
2. State API lookups (per state)
3. ARELLO integration
4. Verification display

---

## Required API Keys

| Service | Environment Variable | Purpose |
|---------|---------------------|---------|
| Persona | `PERSONA_API_KEY`, `PERSONA_TEMPLATE_ID` | Identity verification |
| Checkr | `CHECKR_API_KEY` | Background checks |
| Stripe Identity | `STRIPE_SECRET_KEY` | Fallback identity |
| E-Verify | `EVERIFY_USERNAME`, `EVERIFY_PASSWORD` | Work authorization |
| Cloudinary | `CLOUDINARY_URL` | Document storage |

---

## Cost Estimates

| Verification | Cost/User | Who Pays | When |
|--------------|-----------|----------|------|
| Identity | $2-5 | Platform | On verify |
| Background (Renter) | $30 | User (optional) | On request |
| Background (Landlord) | $50 | Platform | Required |
| Background (Agent) | $80 | Agent | Required |
| Visa | Free | - | Documents only |
| License | Free | - | Database lookup |

**Monthly Estimate (1000 users):**
- Identity: 1000 × $3 = $3,000
- Background (20% landlords): 200 × $50 = $10,000
- Background (5% agents): 50 × $80 = $4,000
- **Total: ~$17,000/month**
