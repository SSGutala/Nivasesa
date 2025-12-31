# Nivasesa

A Next.js platform connecting South Asian home seekers with culturally-aligned realtors, roommates, and room listings across Texas, New Jersey, and California.

## Features

- **Realtor Matching** - Find realtors who speak your language and serve your area
- **Roommate Profiles** - Match with compatible roommates based on lifestyle preferences
- **Room Listings** - Browse rooms with our unique Freedom Score system
- **Groups** - Coordinate housing search with friends and family
- **Lead Management** - Realtors can browse and unlock leads

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Prisma (SQLite for dev, PostgreSQL for prod)
- **Auth**: NextAuth.js
- **Styling**: CSS Modules with responsive design system
- **Icons**: Lucide React
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nivasesa.git
cd nivasesa

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
npx prisma db push

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env` file with the following:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
LAUNCHED="true"
```

## Project Structure

```
app/                    # Next.js App Router pages
  dashboard/            # Realtor dashboard
  roommates/            # Roommate matching
  rooms/                # Room listings
  groups/               # Group housing
  survey/               # Pre-launch surveys
actions/                # Server actions
components/             # React components
lib/                    # Utilities
prisma/                 # Database schema
styles/                 # CSS files
types/                  # TypeScript types
```

## Key Pages

| Page | Description |
|------|-------------|
| `/` | Landing page |
| `/rooms` | Browse room listings |
| `/rooms/post` | Post a room listing |
| `/rooms/[id]` | Room detail page |
| `/roommates` | Browse roommates |
| `/dashboard` | Realtor dashboard |
| `/dashboard/wallet` | Wallet & payments |
| `/dashboard/analytics/leads` | Lead analytics |
| `/dashboard/analytics/realtor` | Realtor analytics |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests (Vitest)
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
```

## Database

### Development (SQLite)

The default configuration uses SQLite for local development:

```
DATABASE_URL="file:./prisma/dev.db"
```

### Production (PostgreSQL)

For production, switch to PostgreSQL:

```bash
# Start PostgreSQL with Docker
docker-compose -f docker/docker-compose.postgres.yml up -d

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://nivasesa:nivasesa@localhost:5432/nivasesa"

# Push schema
npx prisma db push
```

## Testing

Tests are written with Vitest:

```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:ui      # UI mode
```

## Demo Accounts

For development, use any password with these demo accounts:

- `raj.patel@example.com` - Realtor (Frisco, TX)
- `priya.sharma@example.com` - Realtor (Dallas, TX)
- `suresh.reddy@example.com` - Realtor (Irving, TX)
- `anita.desai@example.com` - Realtor (Jersey City, NJ)

## Freedom Score

Our unique Freedom Score (0-100) indicates how flexible a listing is:

- **90+** Ultra Flexible
- **75-89** Very Flexible
- **60-74** Flexible
- **40-59** Moderate
- **0-39** Traditional

Factors include: guest policies, partner visits, parties, curfews, smoking/cannabis/alcohol policies, cooking restrictions, and landlord presence.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.
