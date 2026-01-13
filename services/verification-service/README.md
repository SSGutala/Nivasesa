# Nivasesa Verification Service

GraphQL Federation subgraph for trust and verification in the Nivasesa platform.

## Features

- **Email Verification**: Token-based email verification
- **Phone Verification**: OTP-based phone verification (SMS)
- **Identity Verification**: Persona integration for government ID verification
- **Background Checks**: Checkr integration for criminal records, sex offender registry, SSN trace
- **Visa Verification**: E-Verify integration for work authorization (H1B, F1, L1, etc.)
- **License Verification**: State board verification for realtor licenses
- **Trust Score**: Calculated score based on completed verifications
- **Audit Logs**: Complete history of all verification actions
- **Dual API**: Unified simple API + detailed specialized API

## Verification Types

### 0. Email Verification
- Token-based verification
- 24-hour token expiration
- Mock email sending in dev mode
- Statuses: PENDING → VERIFIED/FAILED/EXPIRED

### 0.1. Phone Verification
- OTP-based verification (6-digit code)
- 10-minute OTP expiration
- Mock SMS sending in dev mode
- Statuses: PENDING → VERIFIED/FAILED/EXPIRED

### 1. Identity Verification (Persona)
- Government-issued ID verification
- Selfie + liveness check
- Document types: Passport, Driver's License, State ID
- Statuses: NOT_STARTED → PENDING → IN_REVIEW → VERIFIED/FAILED

### 2. Background Check (Checkr)
- Criminal records search
- Sex offender registry check
- Global watchlist screening
- SSN trace
- Packages: BASIC, STANDARD, PREMIUM
- Results: CLEAR, CONSIDER, SUSPENDED

### 3. Visa Verification (E-Verify)
- Work authorization verification
- Visa types: H1B, F1, L1, O1, E2, TN, GREEN_CARD, CITIZEN, EAD
- I-94 number tracking
- SEVIS ID for F1 students
- Expiration tracking

### 4. License Verification
- Realtor license validation
- State board verification (TX, NJ, CA)
- License types: REALTOR, BROKER, PROPERTY_MANAGER
- Disciplinary action checks
- License expiration tracking

## Development Mode

Set `DEV_MODE=true` in `.env` to automatically approve all verifications:

```bash
DEV_MODE=true
```

This is useful for development and testing without real API calls to verification providers.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Initialize database:
```bash
pnpm db:generate
pnpm db:push
```

4. Start the service:
```bash
pnpm dev
```

The service will be available at `http://localhost:4005`.

## GraphQL Operations

### Unified Verification API (Simple)

#### Queries

```graphql
# Get a specific verification
query GetVerification($id: ID!) {
  verification(id: $id) {
    id
    userId
    type
    status
    verifiedAt
    expiresAt
  }
}

# Get all verifications for a user
query UserVerifications($userId: ID!) {
  userVerifications(userId: $userId) {
    id
    type
    status
    verifiedAt
  }
}

# Check status of specific verification type
query CheckVerificationStatus($userId: ID!, $type: VerificationType!) {
  verificationStatus(userId: $userId, type: $type)
}

# Get current user's verifications
query MyVerifications {
  myVerifications {
    id
    type
    status
    verifiedAt
  }
}
```

#### Mutations

```graphql
# Send email verification
mutation SendEmailVerification {
  sendEmailVerification {
    id
    status
  }
}

# Verify email with token
mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    id
    status
    verifiedAt
  }
}

# Send phone verification
mutation SendPhoneVerification($phoneNumber: String!) {
  sendPhoneVerification(phoneNumber: $phoneNumber) {
    id
    status
  }
}

# Verify phone with OTP
mutation VerifyPhone($verificationId: ID!, $otp: String!) {
  verifyPhone(verificationId: $verificationId, otp: $otp) {
    id
    status
    verifiedAt
  }
}

# Initiate any verification type
mutation InitiateVerification($input: InitiateVerificationInput!) {
  initiateVerification(input: $input) {
    id
    type
    status
  }
}

# Complete verification with result
mutation CompleteVerification($input: CompleteVerificationInput!) {
  completeVerification(input: $input) {
    id
    status
    verifiedAt
  }
}
```

### Detailed Verification API (Specialized)

#### Queries

```graphql
# Get verification status for a user
query VerificationStatus($userId: String!) {
  verificationStatus(userId: $userId) {
    userId
    identity {
      id
      status
      verifiedAt
    }
    background {
      id
      status
      result
      completedAt
    }
    visa {
      id
      visaType
      status
      expiresAt
    }
    license {
      id
      licenseType
      licenseNumber
      state
      status
    }
    overallStatus
    trustScore
  }
}

# Get current user's verifications
query MyVerifications {
  myVerifications {
    userId
    overallStatus
    trustScore
    identity { status }
    background { status, result }
    visa { status, visaType }
    license { status, licenseType }
  }
}

# Get pending verifications (admin only)
query PendingVerifications {
  pendingVerifications(limit: 20) {
    identityVerifications {
      id
      userId
      status
      createdAt
    }
    backgroundChecks {
      id
      userId
      status
      package
      createdAt
    }
    totalCount
  }
}
```

#### Mutations

```graphql
# Start identity verification
mutation InitIdentityVerification {
  initIdentityVerification(input: {
    provider: "PERSONA"
    documentType: "DRIVERS_LICENSE"
  }) {
    id
    status
    personaInquiryId
  }
}

# Submit background check
mutation SubmitBackgroundCheck {
  submitBackgroundCheck(input: {
    package: STANDARD
    consentGiven: true
  }) {
    id
    status
    checkrReportId
  }
}

# Submit visa verification
mutation SubmitVisaVerification {
  submitVisaVerification(input: {
    visaType: H1B
    i94Number: "12345678901"
    documentUrls: ["https://example.com/visa.pdf"]
  }) {
    id
    status
    visaType
  }
}

# Submit license verification
mutation SubmitLicenseVerification {
  submitLicenseVerification(input: {
    licenseType: REALTOR
    licenseNumber: "123456"
    state: "TX"
    issueDate: "2020-01-01T00:00:00Z"
  }) {
    id
    status
    licenseNumber
  }
}

# Update verification status (admin only)
mutation UpdateVerificationStatus {
  updateVerificationStatus(input: {
    verificationId: "clx123..."
    verificationType: IDENTITY
    status: VERIFIED
    reason: "All documents verified"
  })
}
```

## Trust Score Calculation

The trust score is calculated based on completed verifications:

- Identity Verified: +30 points
- Background Check (CLEAR): +30 points
- Visa Verified: +20 points
- License Verified: +20 points

**Maximum Score**: 100 points

## Webhook Integration

### Persona Webhook

POST `/webhooks/persona` (to be implemented in gateway)

```json
{
  "inquiryId": "inq_123...",
  "status": "completed"
}
```

### Checkr Webhook

POST `/webhooks/checkr` (to be implemented in gateway)

```json
{
  "reportId": "rep_123...",
  "status": "complete",
  "result": "clear"
}
```

## Database Schema

The service uses SQLite for development and PostgreSQL for production.

Models:
- `IdentityVerification`
- `BackgroundCheck`
- `VisaVerification`
- `LicenseVerification`
- `VerificationAuditLog`

See `prisma/schema.prisma` for complete schema.

## Federation Integration

This service is a GraphQL Federation subgraph. It extends the `User` type from the user-service:

```graphql
type User @key(fields: "id", resolvable: false) {
  id: ID!
}
```

All verification entities reference the User entity via federation.

## Production Setup

1. Set up production environment variables:
```bash
DATABASE_URL="postgresql://..."
DEV_MODE=false
PERSONA_API_KEY="live_..."
CHECKR_API_KEY="live_..."
```

2. Run database migrations:
```bash
pnpm db:push
```

3. Start the service:
```bash
pnpm build
pnpm start
```

## API Keys

### Persona (Identity Verification)
Sign up at: https://withpersona.com
- Free tier: 100 verifications/month
- Pricing: $2-5 per verification

### Checkr (Background Checks)
Sign up at: https://checkr.com
- Free tier: Available for startups
- Pricing: $29-99 per check

### E-Verify (Visa Verification)
Sign up at: https://www.e-verify.gov/
- Free government service
- Requires employer enrollment

## Security

- All mutations require authentication
- Admin mutations require ADMIN role
- Sensitive data (SSN, document numbers) should be encrypted at rest
- Audit logs track all verification actions
- Webhooks should validate signatures (to be implemented)

## License

Private - Nivasesa Platform
