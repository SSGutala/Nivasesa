# Environment Variables Reference

Complete reference for all environment variables used in Nivasesa production deployment.

## Overview

Nivasesa uses environment variables for:
- Database connections
- API credentials
- Feature flags
- AWS service configuration
- Third-party integrations

## Variable Categories

### 🔴 Critical (Required for deployment)
Variables without which the application will not start.

### 🟡 Important (Recommended)
Variables for key features that should be configured.

### 🟢 Optional (Enhancement)
Variables for optional features or monitoring.

---

## Rent App Environment Variables

### Database

#### `DATABASE_URL` 🔴
**Description**: PostgreSQL connection string for main database
**Format**: `postgresql://username:password@host:port/database`
**Example**: `postgresql://nivasesaadmin:SecurePass123@prod-db.us-east-1.rds.amazonaws.com:5432/rentapp`
**Where to get**: CloudFormation outputs or RDS Console
**Security**: Store in Secrets Manager, reference in Amplify

---

### Authentication (NextAuth)

#### `AUTH_SECRET` 🔴
**Description**: Secret key for encrypting session tokens
**Format**: Base64 string (minimum 32 characters)
**Generate**: `openssl rand -base64 32`
**Example**: `ZXhhbXBsZS1zZWNyZXQta2V5LWZvci1uZXh0YXV0aA==`
**Security**: Never reuse across environments, rotate quarterly

#### `NEXTAUTH_URL` 🔴
**Description**: Canonical URL of the application
**Production**: `https://nivasesa.com`
**Staging**: `https://staging.nivasesa.com`
**Development**: `http://localhost:3000`
**Note**: Must match OAuth redirect URIs

---

### OAuth Providers

#### `GOOGLE_CLIENT_ID` 🟡
**Description**: Google OAuth 2.0 Client ID
**Format**: `xxxxx.apps.googleusercontent.com`
**Where to get**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
**Setup**:
1. Create OAuth 2.0 Client ID
2. Add authorized redirect: `https://nivasesa.com/api/auth/callback/google`
3. Add authorized origin: `https://nivasesa.com`

#### `GOOGLE_CLIENT_SECRET` 🟡
**Description**: Google OAuth 2.0 Client Secret
**Format**: `GOCSPX-xxxxx`
**Security**: Keep secret, never commit to git

#### `GITHUB_ID` 🟡
**Description**: GitHub OAuth App Client ID
**Format**: `Iv1.xxxxx`
**Where to get**: [GitHub Developer Settings](https://github.com/settings/developers)
**Setup**:
1. Create new OAuth App
2. Homepage URL: `https://nivasesa.com`
3. Callback URL: `https://nivasesa.com/api/auth/callback/github`

#### `GITHUB_SECRET` 🟡
**Description**: GitHub OAuth App Client Secret
**Format**: 40-character hex string
**Security**: Regenerate if exposed

---

### Payment (Stripe)

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 🔴
**Description**: Stripe publishable key (client-side)
**Format**: `pk_live_xxxxx` (production) or `pk_test_xxxxx` (development)
**Where to get**: [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
**Note**: Safe to expose in client-side code

#### `STRIPE_SECRET_KEY` 🔴
**Description**: Stripe secret key (server-side)
**Format**: `sk_live_xxxxx` (production) or `sk_test_xxxxx` (development)
**Security**: Never expose to client, store securely

#### `STRIPE_WEBHOOK_SECRET` 🔴
**Description**: Stripe webhook signing secret
**Format**: `whsec_xxxxx`
**Where to get**: Stripe Dashboard > Webhooks
**Setup**:
1. Create webhook endpoint: `https://nivasesa.com/api/webhooks/stripe`
2. Select events: `payment_intent.succeeded`, `payment_intent.failed`, etc.
3. Copy signing secret

**Events to subscribe**:
```
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded
customer.subscription.created
customer.subscription.deleted
```

---

### Firebase

#### `NEXT_PUBLIC_FIREBASE_API_KEY` 🟡
**Description**: Firebase Web API Key
**Format**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX`
**Where to get**: [Firebase Console](https://console.firebase.google.com/) > Project Settings
**Note**: Safe to expose (restricted by domain)

#### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` 🟡
**Description**: Firebase Auth domain
**Format**: `project-id.firebaseapp.com`
**Example**: `nivasesa-prod.firebaseapp.com`

#### `NEXT_PUBLIC_FIREBASE_PROJECT_ID` 🟡
**Description**: Firebase Project ID
**Format**: String (lowercase, hyphens)
**Example**: `nivasesa-prod`

#### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` 🟡
**Description**: Firebase Storage bucket
**Format**: `project-id.appspot.com`
**Example**: `nivasesa-prod.appspot.com`

#### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` 🟡
**Description**: Firebase Cloud Messaging sender ID
**Format**: Numeric string
**Example**: `123456789012`

#### `NEXT_PUBLIC_FIREBASE_APP_ID` 🟡
**Description**: Firebase App ID
**Format**: `1:123456789012:web:xxxxx`
**Example**: `1:123456789012:web:abc123def456`

#### `FIREBASE_ADMIN_PRIVATE_KEY` 🟡
**Description**: Firebase Admin SDK private key
**Format**: PEM-formatted private key with newlines as `\n`
**Where to get**: Firebase Console > Project Settings > Service Accounts > Generate new private key
**Security**: Store in Secrets Manager
**Example**:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n
```

#### `FIREBASE_ADMIN_CLIENT_EMAIL` 🟡
**Description**: Firebase Admin SDK service account email
**Format**: `firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com`
**Example**: `firebase-adminsdk-abc123@nivasesa-prod.iam.gserviceaccount.com`

---

### AWS Services

#### `AWS_REGION` 🔴
**Description**: AWS region for services
**Format**: Region identifier
**Production**: `us-east-1`
**Note**: Should match RDS, S3, SES region

#### `AWS_S3_BUCKET` 🔴
**Description**: S3 bucket name for asset storage
**Format**: Bucket name
**Production**: `production-nivasesa-rent-app-assets`
**Usage**: Photo uploads, document storage

#### `AWS_SES_REGION` 🔴
**Description**: AWS SES region
**Format**: Region identifier
**Production**: `us-east-1`
**Note**: Can differ from main AWS_REGION if needed

#### `AWS_SES_FROM_EMAIL` 🔴
**Description**: Default "from" email address
**Format**: Email address
**Production**: `noreply@nivasesa.com`
**Requirements**: Must be verified in SES

#### `AWS_SES_CONFIGURATION_SET` 🟡
**Description**: SES configuration set name
**Format**: String
**Production**: `production-nivasesa-rent-app`
**Usage**: Tracking bounces, complaints, delivery

#### `AWS_ACCESS_KEY_ID` 🟢
**Description**: AWS access key for programmatic access
**Format**: `AKIAXXXXXXXXXXXXXXXX`
**Note**: Prefer IAM roles in Amplify; only needed for local development
**Security**: Never commit to git

#### `AWS_SECRET_ACCESS_KEY` 🟢
**Description**: AWS secret access key
**Format**: 40-character string
**Security**: Treat as password, rotate regularly

---

### Application Settings

#### `LAUNCHED` 🔴
**Description**: Feature flag for launch mode
**Values**: `true` | `false`
**Production**: `true`
**Pre-launch**: `false`
**Effect**:
- `true`: Full platform features enabled
- `false`: Survey/waitlist mode only

#### `NODE_ENV` 🔴
**Description**: Node.js environment
**Values**: `production` | `development` | `test`
**Production**: `production`
**Effect**: Enables optimizations, disables debug logs

#### `NEXT_TELEMETRY_DISABLED` 🟢
**Description**: Disable Next.js telemetry
**Values**: `1` | `0`
**Production**: `1`
**Note**: Opt out of anonymous telemetry

---

### Monitoring & Analytics (Optional)

#### `NEXT_PUBLIC_SENTRY_DSN` 🟢
**Description**: Sentry error tracking DSN
**Format**: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
**Where to get**: [Sentry Dashboard](https://sentry.io/)
**Usage**: Real-time error tracking

#### `SENTRY_AUTH_TOKEN` 🟢
**Description**: Sentry auth token for source maps
**Format**: Hex string
**Usage**: Upload source maps for better error traces

#### `NEXT_PUBLIC_GA_MEASUREMENT_ID` 🟢
**Description**: Google Analytics measurement ID
**Format**: `G-XXXXXXXXXX`
**Where to get**: [Google Analytics](https://analytics.google.com/)
**Usage**: User analytics

---

## Lead Gen App Environment Variables

### Database

#### `DATABASE_URL` 🔴
**Description**: PostgreSQL connection string
**Production**: `postgresql://nivasesaadmin:password@prod-leadgen-db.us-east-1.rds.amazonaws.com:5432/leadgen`

---

### Authentication

#### `AUTH_SECRET` 🔴
**Description**: NextAuth secret (different from rent-app)
**Generate**: `openssl rand -base64 32`
**Note**: Must be unique per application

#### `NEXTAUTH_URL` 🔴
**Description**: Lead Gen app URL
**Production**: `https://leads.nivasesa.com`

---

### Payment

Same Stripe account can be shared:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 🔴
- `STRIPE_SECRET_KEY` 🔴
- `STRIPE_WEBHOOK_SECRET` 🔴 (different endpoint!)

**Webhook endpoint**: `https://leads.nivasesa.com/api/webhooks/stripe`

---

### AWS Services

#### `AWS_REGION` 🔴
**Production**: `us-east-1`

#### `AWS_S3_BUCKET` 🔴
**Production**: `production-nivasesa-lead-gen-assets`

#### `AWS_SES_FROM_EMAIL` 🔴
**Production**: `noreply@leads.nivasesa.com`

#### `AWS_SES_CONFIGURATION_SET` 🟡
**Production**: `production-nivasesa-lead-gen`

---

### Application Settings

- `LAUNCHED` 🔴: `true`
- `NODE_ENV` 🔴: `production`
- `NEXT_TELEMETRY_DISABLED` 🟢: `1`

---

## Security Best Practices

### 1. Secret Management

**DO**:
- Use AWS Secrets Manager for sensitive values
- Rotate secrets regularly (quarterly)
- Use different secrets per environment
- Generate strong random values

**DON'T**:
- Commit secrets to git
- Share secrets via email/Slack
- Reuse secrets across applications
- Use weak or predictable values

### 2. Access Control

```bash
# Store in Secrets Manager
aws secretsmanager create-secret \
  --name production/nivasesa/rent-app/stripe \
  --secret-string '{"secret_key":"sk_live_xxx","webhook_secret":"whsec_xxx"}'

# Reference in Amplify
STRIPE_SECRET_KEY=$(aws secretsmanager get-secret-value \
  --secret-id production/nivasesa/rent-app/stripe \
  --query 'SecretString' --output text | jq -r '.secret_key')
```

### 3. Environment Separation

| Environment | Database | Stripe | OAuth | S3 Bucket |
|-------------|----------|--------|-------|-----------|
| Development | SQLite local | Test mode | Dev apps | Local/MinIO |
| Staging | RDS staging | Test mode | Staging apps | staging-* |
| Production | RDS prod | Live mode | Prod apps | production-* |

### 4. Validation

Add runtime validation in code:

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  LAUNCHED: z.enum(['true', 'false']),
});

export const env = envSchema.parse(process.env);
```

---

## Retrieving Values

### From CloudFormation

```bash
# Database URL
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-database \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppDBConnectionString'].OutputValue" \
  --output text

# S3 Bucket
aws cloudformation describe-stacks \
  --stack-name production-nivasesa-storage \
  --query "Stacks[0].Outputs[?OutputKey=='RentAppAssetsBucketName'].OutputValue" \
  --output text
```

### From Secrets Manager

```bash
# Get entire secret
aws secretsmanager get-secret-value \
  --secret-id production/nivasesa/rent-app/database \
  --query SecretString --output text | jq

# Get specific value
aws secretsmanager get-secret-value \
  --secret-id production/nivasesa/rent-app/database \
  --query SecretString --output text | jq -r '.password'
```

### From RDS

```bash
# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier production-nivasesa-rent-app-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

---

## Setting Variables in Amplify

### Via Console

1. Open [Amplify Console](https://console.aws.amazon.com/amplify)
2. Select app
3. Environment variables (left sidebar)
4. Manage variables
5. Add/edit variables
6. Save

### Via CLI

```bash
# Update multiple variables
aws amplify update-app \
  --app-id $APP_ID \
  --environment-variables \
    DATABASE_URL="postgresql://..." \
    AUTH_SECRET="$(openssl rand -base64 32)" \
    NEXTAUTH_URL="https://nivasesa.com"

# Update single variable
aws amplify update-app \
  --app-id $APP_ID \
  --environment-variables DATABASE_URL="postgresql://..."
```

---

## Checklist

Use this before deploying:

### Rent App
- [ ] `DATABASE_URL` - from RDS
- [ ] `AUTH_SECRET` - generated
- [ ] `NEXTAUTH_URL` - correct domain
- [ ] `GOOGLE_CLIENT_ID` - from Google Console
- [ ] `GOOGLE_CLIENT_SECRET` - from Google Console
- [ ] `GITHUB_ID` - from GitHub
- [ ] `GITHUB_SECRET` - from GitHub
- [ ] `STRIPE_SECRET_KEY` - from Stripe
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - from Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` - from Stripe webhook
- [ ] All Firebase variables (7 total)
- [ ] `AWS_REGION` - us-east-1
- [ ] `AWS_S3_BUCKET` - from CloudFormation
- [ ] `AWS_SES_FROM_EMAIL` - verified in SES
- [ ] `LAUNCHED` - true for production

### Lead Gen App
- [ ] `DATABASE_URL` - from RDS (leadgen)
- [ ] `AUTH_SECRET` - different from rent-app
- [ ] `NEXTAUTH_URL` - leads.nivasesa.com
- [ ] `STRIPE_SECRET_KEY` - same as rent-app
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - same as rent-app
- [ ] `STRIPE_WEBHOOK_SECRET` - different endpoint!
- [ ] `AWS_REGION` - us-east-1
- [ ] `AWS_S3_BUCKET` - lead-gen bucket
- [ ] `AWS_SES_FROM_EMAIL` - noreply@leads.nivasesa.com
- [ ] `LAUNCHED` - true for production

---

## Troubleshooting

### Variable not loading

1. Check spelling (case-sensitive)
2. Rebuild app in Amplify
3. Verify variable saved in Amplify Console
4. Check for quotes/spaces in value

### Database connection fails

1. Verify `DATABASE_URL` format
2. Check URL encoding for special characters in password
3. Test connection from local with same URL
4. Verify security group allows Amplify access

### OAuth redirect mismatch

1. Check `NEXTAUTH_URL` matches OAuth settings
2. Verify redirect URIs in OAuth provider
3. Ensure no trailing slashes
4. Check HTTP vs HTTPS

---

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [Stripe API Keys](https://stripe.com/docs/keys)
