# User Service Implementation Summary

## Overview
GraphQL Federation subgraph for user management in Nivasesa platform.

## Location
`/Users/aditya/Documents/Projects/Nivasesa/services/user-service/`

## Implementation Details

### 1. GraphQL Schema (`src/schema.ts`)
Implemented complete federated schema with:

#### Core Types
- **User** (@key fields: "id")
  - Basic fields: id, email, name, role, phone
  - Profile fields: avatarUrl, bio, languages (flattened from profile)
  - Verification: emailVerified, phoneVerified, trustScore
  - Relations: profile, verification
  - Timestamps: createdAt, updatedAt

- **UserRole** enum: RENTER, HOST, LANDLORD, AGENT, ADMIN

- **Profile** - Extended user information
  - Personal: bio, occupation, company, languages
  - Preferences: dietaryPreference, smokingAllowed, petsAllowed, partyFriendly
  - Housing: location, moveInDate, budget (MoneyRange)

- **UserVerificationSummary** - Verification status overview
  - identity, background, visa, license status
  - overallStatus calculation

#### Queries
```graphql
me: User                           # Current authenticated user
user(id: ID!): User                # User by ID
userByEmail(email: String!): User  # User by email
users(filters): UserConnection!    # Paginated user search
emailAvailable(email: String!): Boolean!  # Email availability check
```

#### Mutations
```graphql
# Authentication
register(input: RegisterInput!): AuthPayload!
login(input: LoginInput!): AuthPayload!
loginWithOAuth(provider, accessToken): AuthPayload!
logout: Boolean!

# Profile Management
updateProfile(input: UpdateProfileInput!): User!
  # Supports: name, avatarUrl, phone, bio, languages, occupation,
  #           company, dietary preferences, lifestyle preferences,
  #           location, moveInDate, budget

# Email & Phone Verification
verifyEmail(token: String!): Boolean!
requestPhoneVerification(phone: String!): Boolean!
verifyPhone(code: String!): Boolean!

# Password Management
changePassword(input: ChangePasswordInput!): Boolean!
requestPasswordReset(email: String!): Boolean!
resetPassword(token, newPassword): Boolean!

# Admin Operations
updateUserRole(userId: ID!, role: UserRole!): User!
deleteAccount: Boolean!
```

### 2. Resolvers (`src/resolvers.ts`)

#### Authentication & Authorization
- JWT token generation (7-day expiry)
- `requireAuth()` - Ensures user is authenticated
- `requireAdmin()` - Ensures user has ADMIN role
- bcrypt password hashing (12 rounds)

#### Query Resolvers
- **me**: Returns current user from context.userId
- **user**: Find user by ID with profile and verification
- **userByEmail**: Find user by email (new - added for spec)
- **users**: Paginated search with role/verification filters
- **emailAvailable**: Check email uniqueness

#### Mutation Resolvers
- **register**: Create user with hashed password, profile, and verification records
- **login**: Validate credentials and generate JWT token
- **updateProfile**: Update user (name, avatarUrl, phone) and profile data
  - Languages stored as JSON string in database
  - Upserts profile if doesn't exist
- **verifyEmail**: Verify email using token from VerificationToken table
  - Validates token existence and expiration
  - Updates user.emailVerified timestamp
  - Deletes used token
- **updateUserRole**: Admin-only role assignment
- **changePassword**: Password update with current password verification

#### Field Resolvers
- **User.avatarUrl**: Alias for User.image field
- **User.bio**: Fetches from profile.bio
- **User.languages**: Parses JSON array from profile.languages
- **User.phoneVerified**: Boolean based on phone field presence
- **User.emailVerified**: Boolean based on emailVerified timestamp
- **User.trustScore**: Calculated from verification status
  - Identity verified: +30 points
  - Background clear: +30 points
- **User.verification**: Aggregates verification statuses with overall calculation

#### Federation
- **User.__resolveReference**: Resolves User entity by ID for federation

### 3. Server Setup (`src/index.ts`)
- Apollo Server with Federation v2 support
- Standalone server on port 4001 (configurable via PORT env)
- Context extraction from headers:
  - `x-user-id`: Current user ID (set by gateway)
  - `x-user-role`: Current user role (set by gateway)
- GraphQL introspection enabled

### 4. Database Integration (`src/prisma.ts`)
- Prisma Client from generated types
- Connection pooling with singleton pattern
- Development-friendly global instance caching

### 5. Database Schema (`prisma/schema.prisma`)
Models:
- **User**: Core user table with auth fields
- **Profile**: Extended user information (1-to-1)
- **Verification**: Identity/background verification status (1-to-1)
- **Account**: OAuth provider accounts (1-to-many)
- **Session**: Active user sessions (1-to-many)
- **VerificationToken**: Email/password reset tokens

## Key Features Implemented

### Required Features (from spec)
- [x] User type with all required fields (id, email, name, role, emailVerified, phone, avatarUrl, bio, languages)
- [x] UserRole enum (RENTER, HOST, LANDLORD, AGENT, ADMIN)
- [x] Query: user(id)
- [x] Query: me
- [x] Query: userByEmail (newly added)
- [x] Mutation: updateProfile
- [x] Mutation: updateUserRole
- [x] Mutation: verifyEmail (fully implemented with token validation)
- [x] Federation reference resolver

### Additional Features (beyond spec)
- [x] Complete authentication flow (register, login, logout)
- [x] OAuth support (placeholder for future implementation)
- [x] Password management (change, reset)
- [x] Phone verification (placeholder for future implementation)
- [x] Profile with cultural matching fields (dietary preferences, lifestyle)
- [x] Verification tracking (identity, background, visa, license)
- [x] Trust score calculation
- [x] Paginated user search
- [x] Email availability check
- [x] Account deletion

## Security Measures
1. **Password Security**: bcrypt hashing with 12 rounds
2. **JWT Tokens**: 7-day expiration, signed with secret
3. **Authorization**: Context-based auth checks via requireAuth/requireAdmin
4. **GraphQL Errors**: Proper error codes (UNAUTHENTICATED, FORBIDDEN, BAD_USER_INPUT)
5. **Token Validation**: Expiration checks for email verification tokens
6. **Credential Validation**: Safe error messages (don't reveal user existence)

## Database Design
- SQLite for development (configured via DATABASE_URL)
- PostgreSQL-ready for production
- Cascade deletes for data integrity
- Unique constraints on email, session tokens
- JSON storage for arrays (languages) to support SQLite

## Integration Points
- **Gateway**: Receives authenticated user context via headers
- **Other Services**: Provides User entity resolution via Federation
- **Email Service**: verifyEmail expects tokens from email service
- **SMS Service**: Phone verification ready for Twilio integration

## Environment Variables
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev-secret-change-in-production
PORT=4001
```

## Running the Service

### Development
```bash
cd services/user-service
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

### Database Operations
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
```

## Testing Queries

### Get Current User
```graphql
query Me {
  me {
    id
    email
    name
    avatarUrl
    bio
    languages
    role
    emailVerified
  }
}
```

### Get User by Email
```graphql
query UserByEmail {
  userByEmail(email: "user@example.com") {
    id
    name
    role
  }
}
```

### Update Profile
```graphql
mutation UpdateProfile {
  updateProfile(input: {
    name: "John Doe"
    bio: "Looking for a room in Dallas"
    languages: ["English", "Hindi"]
    avatarUrl: "https://example.com/avatar.jpg"
  }) {
    id
    name
    bio
    languages
    avatarUrl
  }
}
```

### Verify Email
```graphql
mutation VerifyEmail {
  verifyEmail(token: "verification-token-here")
}
```

### Update Role (Admin Only)
```graphql
mutation UpdateRole {
  updateUserRole(userId: "user-id", role: AGENT) {
    id
    role
  }
}
```

## Files Modified/Created
- `src/schema.ts` - Enhanced with userByEmail query, avatarUrl/bio/languages fields
- `src/resolvers.ts` - Added userByEmail resolver, avatarUrl/bio/languages field resolvers, implemented verifyEmail
- `src/index.ts` - Updated console output with new operations
- `IMPLEMENTATION_SUMMARY.md` - This file (new)

## Build Status
✅ Build successful - All TypeScript compiled without errors
✅ All required features implemented
✅ Federation support enabled
✅ Authentication and authorization in place
