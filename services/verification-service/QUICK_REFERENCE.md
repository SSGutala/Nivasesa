# Verification Service - Quick Reference

## Service Info
- **Name**: @niv/verification-service
- **Port**: 4005
- **URL**: http://localhost:4005
- **Type**: GraphQL Federation Subgraph

## Quick Start
```bash
cd services/verification-service
pnpm install
pnpm db:generate
pnpm db:push
pnpm dev
```

## Common Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm typecheck    # Type checking
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
```

## Verification Types

| Type | Provider | Status Flow | Trust Score |
|------|----------|-------------|-------------|
| Identity | Persona | NOT_STARTED → PENDING → IN_REVIEW → VERIFIED/FAILED | +30 |
| Background | Checkr | NOT_STARTED → PENDING → IN_REVIEW → VERIFIED/FAILED | +30 |
| Visa | E-Verify | NOT_STARTED → PENDING → IN_REVIEW → VERIFIED/FAILED | +20 |
| License | State Boards | NOT_STARTED → PENDING → IN_REVIEW → VERIFIED/FAILED | +20 |

## GraphQL Examples

### Get User's Verification Status
```graphql
query {
  myVerifications {
    userId
    overallStatus
    trustScore
    identity { status verifiedAt }
    background { status result }
    visa { status visaType }
    license { status licenseNumber }
  }
}
```

### Start Identity Verification
```graphql
mutation {
  initIdentityVerification(input: {
    provider: "PERSONA"
    documentType: "DRIVERS_LICENSE"
  }) {
    id
    status
    personaInquiryId
  }
}
```

### Submit Background Check
```graphql
mutation {
  submitBackgroundCheck(input: {
    package: STANDARD
    consentGiven: true
  }) {
    id
    status
    checkrReportId
  }
}
```

### Submit Visa Verification
```graphql
mutation {
  submitVisaVerification(input: {
    visaType: H1B
    i94Number: "12345678901"
  }) {
    id
    status
    visaType
    expiresAt
  }
}
```

### Submit License Verification
```graphql
mutation {
  submitLicenseVerification(input: {
    licenseType: REALTOR
    licenseNumber: "123456"
    state: "TX"
  }) {
    id
    status
    verifiedAt
  }
}
```

## Visa Types
- H1B, H2B, F1, L1, O1, E2, TN
- GREEN_CARD, CITIZEN, EAD

## License Types
- REALTOR, BROKER, PROPERTY_MANAGER
- LANDLORD_CERTIFICATION

## Background Check Packages
- BASIC - Criminal records only
- STANDARD - Criminal + Sex offender
- PREMIUM - All checks + Global watchlist

## Background Check Results
- CLEAR - No issues found
- CONSIDER - Issues found, review needed
- SUSPENDED - Check suspended or failed

## DEV_MODE

**Enabled by default** in `.env`:
```bash
DEV_MODE=true
```

When enabled:
- All verifications auto-approved
- No external API calls
- Immediate VERIFIED status
- Perfect for development

To disable:
```bash
DEV_MODE=false
```

## Database Models

### IdentityVerification
```
id, userId, status, provider, personaInquiryId,
documentType, documentNumber, verifiedAt, expiresAt
```

### BackgroundCheck
```
id, userId, status, provider, checkrReportId, package,
result, completedAt, criminalRecords, sexOffenderRegistry,
globalWatchlist, ssnTrace, consentGivenAt
```

### VisaVerification
```
id, userId, visaType, status, verifiedAt, expiresAt,
eVerifyCase, eVerifyStatus, documentUrls, i94Number, sevisId
```

### LicenseVerification
```
id, userId, licenseType, licenseNumber, state, status,
verifiedAt, expiresAt, issueDate, boardName, disciplinaryActions
```

### VerificationAuditLog
```
id, userId, verificationType, action, performedBy,
previousStatus, newStatus, reason, createdAt
```

## Trust Score Calculation
```
Base: 0
+ Identity Verified: 30
+ Background Clear: 30
+ Visa Verified: 20
+ License Verified: 20
= Maximum: 100
```

## Federation Integration

This service extends the User type:
```graphql
type User @key(fields: "id", resolvable: false) {
  id: ID!
}
```

Reference from other services:
```graphql
type IdentityVerification {
  user: User!  # Federation reference
}
```

## Admin Operations

### Get Pending Verifications
```graphql
query {
  pendingVerifications(limit: 20) {
    identityVerifications { id userId status }
    backgroundChecks { id userId status }
    totalCount
  }
}
```

### Update Verification Status
```graphql
mutation {
  updateVerificationStatus(input: {
    verificationId: "clx123..."
    verificationType: IDENTITY
    status: VERIFIED
    reason: "Documents verified"
  })
}
```

## Webhook Handlers

### Persona Webhook
```graphql
mutation {
  handlePersonaWebhook(
    inquiryId: "inq_123..."
    status: "completed"
  )
}
```

### Checkr Webhook
```graphql
mutation {
  handleCheckrWebhook(
    reportId: "rep_123..."
    status: "complete"
    result: "clear"
  )
}
```

## File Structure
```
verification-service/
├── src/
│   ├── index.ts        # Server entry point
│   ├── schema.ts       # GraphQL schema
│   ├── resolvers.ts    # Resolver implementations
│   └── prisma.ts       # Database client
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── dev.db          # SQLite database
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── .env                # Environment variables
├── .env.example        # Example environment
├── .gitignore          # Git ignore rules
├── README.md           # Full documentation
├── SETUP.md            # Setup guide
└── QUICK_REFERENCE.md  # This file
```

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:4005 | xargs kill -9
```

### Database Issues
```bash
rm prisma/dev.db
pnpm db:push
```

### TypeScript Errors
```bash
pnpm db:generate
pnpm typecheck
```

### Missing Dependencies
```bash
pnpm install
```

## Production Checklist

- [ ] Set `DEV_MODE=false`
- [ ] Add `PERSONA_API_KEY`
- [ ] Add `CHECKR_API_KEY`
- [ ] Add `E_VERIFY_USERNAME` and `E_VERIFY_PASSWORD`
- [ ] Switch to PostgreSQL (`DATABASE_URL`)
- [ ] Set up webhook endpoints in gateway
- [ ] Configure JWT secret (shared with gateway)
- [ ] Add error tracking
- [ ] Add logging
- [ ] Set up monitoring

## Links

- Persona: https://withpersona.com
- Checkr: https://checkr.com
- E-Verify: https://www.e-verify.gov
- Apollo Federation: https://www.apollographql.com/docs/federation

---

**Version**: 0.1.0
**Created**: December 31, 2024
**Status**: Ready for Development
