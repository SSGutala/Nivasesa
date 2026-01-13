# Lead-Gen Database Schema

This database contains realtor and lead management models only, separated from the auth database.

## Database Separation

- **Auth DB**: User accounts, sessions, OAuth (managed by @niv/auth)
- **Lead-Gen DB**: Realtor profiles, leads, referrals, transactions

## Models

### Realtor Management
- `RealtorProfile` - Realtor profiles (userId references auth DB)
- `RealtorApplication` - Realtor applications to join platform

### Lead Management
- `Lead` - Leads from contact forms, SEO pages
- `BuyerRequest` - Buyer requests from forms
- `Referral` - Referrals sent to realtors
- `UnlockedLead` - Tracks which realtors unlocked which leads

### Financial
- `Transaction` - Credits, debits, refunds (userId references auth DB)
- `RefundRequest` - Refund requests from realtors

### Phase 2: Groups
- `Group` - Housing search groups
- `GroupRealtorRequest` - Groups requesting realtor assignment

### Pre-Launch
- `SurveyResponse` - Realtor survey responses

## Key Points

1. **userId is String**: References User.id in auth database (no direct relation)
2. **SQLite for dev**: Uses `file:./leadgen.db`
3. **PostgreSQL for prod**: Set LEADGEN_DATABASE_URL to PostgreSQL connection string

## Usage

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Environment Variables

Required in `.env`:
```
LEADGEN_DATABASE_URL="file:./leadgen.db"
```

For production:
```
LEADGEN_DATABASE_URL="postgresql://user:password@localhost:5432/leadgen"
```

## Importing the Client

```typescript
import { prisma } from '@/lib/prisma';

// Query realtor profiles
const realtors = await prisma.realtorProfile.findMany();
```

## Database Migration Notes

When deploying to production:
1. Update LEADGEN_DATABASE_URL to PostgreSQL
2. Run `npx prisma db push` to create tables
3. Consider using Prisma Migrate for production migrations
