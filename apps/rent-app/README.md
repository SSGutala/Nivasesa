# Rent App (NVS-R01)

Peer-to-peer housing platform for finding roommates, rooms, and coordinating group housing searches.

## Features

- **Roommate Matching**: Find compatible roommates based on lifestyle preferences
- **Room Listings**: Browse and post room listings with Freedom Score system
- **Group Housing**: Coordinate housing searches with groups
- **Messaging**: In-app messaging for roommates and room seekers
- **Onboarding**: Host and renter onboarding flows

## Directory Structure

```
app/
  about/              - About page
  auth/               - Auth pages
  browse/             - Browse listings
  explore/            - Explore page
  groups/             - Group housing coordination
  join/               - Join pages
  login/              - Login page
  messages/           - Messaging interface
  onboarding/         - Host and renter onboarding
  roommates/          - Roommate matching
  rooms/              - Room listings
  find-roommates/     - Find roommates page
  listing/            - Individual listing pages
  forgot-password/    - Password reset request
  reset-password/     - Password reset confirmation
  verify-email/       - Email verification

components/
  accessibility/      - Accessibility components
  browse/             - Browse page components
  explore/            - Explore page components
  join/               - Join page components
  ui/                 - Shared UI components
  Header.tsx          - Site header
  Footer.tsx          - Site footer
  ErrorProvider.tsx   - Error handling provider

actions/
  apply.ts            - Room application actions
  groups.ts           - Group housing actions
  rooms.ts            - Room listing actions
  messaging.ts        - Messaging actions
  onboarding.ts       - Onboarding actions
  search.ts           - Search actions
  auth.ts             - Authentication actions
  email-verification.ts - Email verification
  password-reset.ts   - Password reset
  two-factor.ts       - Two-factor auth

lib/
  freedom-score.ts    - Freedom Score calculation
  roommate-matching.ts - Roommate compatibility matching
  listings-data.ts    - Listing data utilities
  matching.ts         - General matching utilities
  geo.ts              - Geolocation utilities
  cities.ts           - City data
  prisma.ts           - Database client
  email.ts            - Email utilities
  permissions.ts      - Permission checks
  stripe.ts           - Payment integration
  firebase.ts         - Firebase integration
  totp.ts             - TOTP utilities
  monitoring.ts       - Monitoring utilities
  error-tracking.ts   - Error tracking

prisma/
  schema.prisma       - Database schema
  migrations/         - Database migrations
  seed.js             - Database seeding
  dev.db              - SQLite development database
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build
pnpm build

# Run tests
pnpm test

# Generate Prisma client
pnpm db:generate

# Push database changes
pnpm db:push
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
FIREBASE_API_KEY=
# ... etc
```

## Related Apps

- **Lead Gen** (`apps/lead-gen`) - Realtor lead generation and dashboard
