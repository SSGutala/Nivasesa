# User Service - Example GraphQL Queries

## Queries

### Get Current User (me)
```graphql
query GetMe {
  me {
    id
    email
    name
    avatarUrl
    role
    phone
    phoneVerified
    emailVerified
    bio
    languages
    trustScore
    createdAt
    updatedAt
    profile {
      occupation
      company
      dietaryPreference
      location
      budget {
        min
        max
        currency
      }
    }
    verification {
      identity
      background
      visa
      license
      overallStatus
    }
  }
}
```

### Get User by ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    avatarUrl
    role
    bio
    languages
    emailVerified
    trustScore
  }
}
```

### Get User by Email
```graphql
query GetUserByEmail($email: String!) {
  userByEmail(email: $email) {
    id
    name
    role
    emailVerified
    bio
    languages
  }
}
```

### Search Users
```graphql
query SearchUsers($role: UserRole, $verified: Boolean, $limit: Int, $offset: Int) {
  users(role: $role, verified: $verified, limit: $limit, offset: $offset) {
    nodes {
      id
      name
      email
      role
      trustScore
      emailVerified
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Check Email Availability
```graphql
query CheckEmail($email: String!) {
  emailAvailable(email: $email)
}
```

## Mutations

### Register New User
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    expiresAt
    user {
      id
      email
      name
      role
    }
  }
}

# Variables:
{
  "input": {
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe",
    "role": "RENTER"
  }
}
```

### Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    expiresAt
    user {
      id
      email
      name
      role
      emailVerified
    }
  }
}

# Variables:
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### Update Profile
```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    avatarUrl
    phone
    bio
    languages
    profile {
      occupation
      company
      location
      dietaryPreference
      smokingAllowed
      petsAllowed
      partyFriendly
      moveInDate
      budget {
        min
        max
        currency
      }
    }
  }
}

# Variables:
{
  "input": {
    "name": "John Doe",
    "avatarUrl": "https://example.com/avatars/johndoe.jpg",
    "phone": "+1-555-0123",
    "bio": "Software engineer looking for a room in Dallas. Clean, quiet, and respectful.",
    "languages": ["English", "Hindi", "Tamil"],
    "occupation": "Software Engineer",
    "company": "Tech Corp",
    "location": "Dallas, TX",
    "dietaryPreference": "VEGETARIAN",
    "smokingAllowed": false,
    "petsAllowed": true,
    "partyFriendly": false,
    "moveInDate": "2026-02-01T00:00:00Z",
    "budgetMin": 800,
    "budgetMax": 1500
  }
}
```

### Verify Email
```graphql
mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token)
}

# Variables:
{
  "token": "email-verification-token-from-email"
}
```

### Update User Role (Admin Only)
```graphql
mutation UpdateRole($userId: ID!, $role: UserRole!) {
  updateUserRole(userId: $userId, role: $role) {
    id
    email
    role
  }
}

# Variables:
{
  "userId": "user-id-here",
  "role": "AGENT"
}
```

### Change Password
```graphql
mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input)
}

# Variables:
{
  "input": {
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword456!"
  }
}
```

### Request Password Reset
```graphql
mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}

# Variables:
{
  "email": "user@example.com"
}
```

### Logout
```graphql
mutation Logout {
  logout
}
```

### Delete Account
```graphql
mutation DeleteAccount {
  deleteAccount
}
```

## Federation Queries

### Resolve User Reference (Internal)
Used by other services via Federation to resolve User entities:

```graphql
query ResolveUserReference {
  _entities(representations: [
    { __typename: "User", id: "user-id-here" }
  ]) {
    ... on User {
      id
      email
      name
      role
      bio
      languages
    }
  }
}
```

## Common Query Patterns

### User Profile View
```graphql
query UserProfile($id: ID!) {
  user(id: $id) {
    id
    name
    avatarUrl
    bio
    role
    languages
    trustScore
    emailVerified
    phoneVerified
    createdAt
    profile {
      occupation
      location
      dietaryPreference
      smokingAllowed
      petsAllowed
      partyFriendly
    }
    verification {
      identity
      background
      overallStatus
    }
  }
}
```

### Search Verified Agents
```graphql
query VerifiedAgents {
  users(role: AGENT, verified: true, limit: 20) {
    nodes {
      id
      name
      email
      phone
      bio
      languages
      trustScore
      profile {
        company
        location
      }
      verification {
        license
        overallStatus
      }
    }
    totalCount
  }
}
```

### Roommate Search
```graphql
query SearchRoommates($limit: Int, $offset: Int) {
  users(role: RENTER, verified: true, limit: $limit, offset: $offset) {
    nodes {
      id
      name
      avatarUrl
      bio
      languages
      trustScore
      profile {
        occupation
        location
        dietaryPreference
        smokingAllowed
        petsAllowed
        partyFriendly
        budget {
          min
          max
          currency
        }
        moveInDate
      }
    }
    totalCount
    pageInfo {
      hasNextPage
    }
  }
}
```

## Error Handling

### Authentication Error
```graphql
# Query without auth context
query {
  me {
    id
  }
}

# Response:
{
  "errors": [
    {
      "message": "Not authenticated",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Authorization Error
```graphql
# Non-admin trying to update role
mutation {
  updateUserRole(userId: "some-id", role: ADMIN) {
    id
  }
}

# Response:
{
  "errors": [
    {
      "message": "Not authorized",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Validation Error
```graphql
mutation {
  register(input: {
    email: "existing@example.com",
    password: "pass123",
    role: RENTER
  }) {
    token
  }
}

# Response:
{
  "errors": [
    {
      "message": "Email already registered",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```
