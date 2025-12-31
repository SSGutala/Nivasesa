import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  """
  User entity - the core identity in the system
  """
  type User @key(fields: "id") {
    id: ID!
    email: String!
    name: String
    image: String
    role: UserRole!
    phone: String
    phoneVerified: Boolean!
    emailVerified: Boolean!
    profile: Profile
    verification: VerificationStatus
    trustScore: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  User roles in the system
  """
  enum UserRole {
    RENTER
    LANDLORD
    AGENT
    ADMIN
  }

  """
  User profile with extended information
  """
  type Profile {
    id: ID!
    userId: String!
    bio: String
    occupation: String
    company: String
    languages: [String!]!
    dietaryPreference: DietaryPreference
    smokingAllowed: Boolean
    petsAllowed: Boolean
    partyFriendly: Boolean
    location: String
    moveInDate: DateTime
    budget: MoneyRange
  }

  """
  Dietary preferences for cultural matching
  """
  enum DietaryPreference {
    VEGETARIAN
    VEGAN
    NON_VEGETARIAN
    EGGETARIAN
    PESCATARIAN
    NO_PREFERENCE
  }

  """
  Money range for budget preferences
  """
  type MoneyRange {
    min: Int
    max: Int
    currency: String!
  }

  """
  Verification status summary
  """
  type VerificationStatus {
    identity: VerificationState!
    background: VerificationState!
    visa: VerificationState
    license: VerificationState
    overallStatus: VerificationState!
  }

  enum VerificationState {
    NOT_STARTED
    PENDING
    IN_REVIEW
    VERIFIED
    FAILED
    EXPIRED
  }

  """
  Authentication payload returned after login/register
  """
  type AuthPayload {
    token: String!
    user: User!
    expiresAt: DateTime!
  }

  """
  Session information
  """
  type Session {
    id: ID!
    userId: String!
    expiresAt: DateTime!
    createdAt: DateTime!
  }

  # Input types
  input RegisterInput {
    email: String!
    password: String!
    name: String
    role: UserRole!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    bio: String
    occupation: String
    company: String
    languages: [String!]
    dietaryPreference: DietaryPreference
    smokingAllowed: Boolean
    petsAllowed: Boolean
    partyFriendly: Boolean
    location: String
    moveInDate: DateTime
    budgetMin: Int
    budgetMax: Int
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  # Queries
  type Query {
    """
    Get the currently authenticated user
    """
    me: User

    """
    Get a user by ID
    """
    user(id: ID!): User

    """
    Search users with filters
    """
    users(
      role: UserRole
      verified: Boolean
      limit: Int
      offset: Int
    ): UserConnection!

    """
    Check if an email is available
    """
    emailAvailable(email: String!): Boolean!
  }

  """
  Paginated user list
  """
  type UserConnection {
    nodes: [User!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Mutations
  type Mutation {
    """
    Register a new user
    """
    register(input: RegisterInput!): AuthPayload!

    """
    Login with email and password
    """
    login(input: LoginInput!): AuthPayload!

    """
    Login with OAuth provider
    """
    loginWithOAuth(
      provider: String!
      accessToken: String!
    ): AuthPayload!

    """
    Logout and invalidate session
    """
    logout: Boolean!

    """
    Update user profile
    """
    updateProfile(input: UpdateProfileInput!): User!

    """
    Change password
    """
    changePassword(input: ChangePasswordInput!): Boolean!

    """
    Request password reset email
    """
    requestPasswordReset(email: String!): Boolean!

    """
    Reset password with token
    """
    resetPassword(token: String!, newPassword: String!): Boolean!

    """
    Verify email with token
    """
    verifyEmail(token: String!): Boolean!

    """
    Request phone verification
    """
    requestPhoneVerification(phone: String!): Boolean!

    """
    Verify phone with code
    """
    verifyPhone(code: String!): Boolean!

    """
    Update user role (admin only)
    """
    updateUserRole(userId: ID!, role: UserRole!): User!

    """
    Delete user account
    """
    deleteAccount: Boolean!
  }

  # Custom scalars
  scalar DateTime
`;
