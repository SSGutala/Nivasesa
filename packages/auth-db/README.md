# @niv/auth-db

Shared authentication database for all Nivasesa apps.

## Models

- **User** - Core user accounts with auth data
- **Account** - NextAuth OAuth provider accounts
- **Session** - NextAuth session storage
- **VerificationToken** - Email verification tokens
- **PasswordResetToken** - Password reset tokens

## Usage

### Direct Prisma Client

```typescript
import { authPrisma } from '@niv/auth-db';

// Query users
const user = await authPrisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

### Cross-Database User Lookup

Use these utilities when your app's database references users by ID but doesn't have the User model:

```typescript
import {
  getUserById,
  getUsersByIds,
  userExists,
  getSafeUserInfo
} from '@niv/auth-db';

// Single user lookup (cached)
const user = await getUserById('clx123abc');
if (user) {
  console.log(user.email, user.name);
}

// Batch user lookup (efficient)
const users = await getUsersByIds(['id1', 'id2', 'id3']);
users.forEach((user, id) => {
  console.log(id, user.name);
});

// Check if user exists
if (await userExists('clx123abc')) {
  // Proceed with operation
}

// Get safe user info (no sensitive fields)
const safeInfo = await getSafeUserInfo('clx123abc');
// Returns: { id, name, email, image, role }
```

All lookup functions include automatic caching (5-minute TTL) to reduce database queries.

## Environment Variables

```bash
# Development (SQLite)
AUTH_DATABASE_URL="file:./auth.db"

# Production (PostgreSQL)
AUTH_DATABASE_URL="postgresql://user:password@host:5432/nivasesa_auth"
```

## Scripts

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (dev)
npm run db:push

# Create migration
npm run db:migrate
```

## Database Provider

- **Development**: SQLite (file:./auth.db)
- **Production**: PostgreSQL (configurable via AUTH_DATABASE_URL)

To switch to PostgreSQL for production, update the `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.
