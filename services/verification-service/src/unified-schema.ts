import gql from 'graphql-tag';

/**
 * Unified Verification Schema
 *
 * This is a simplified unified verification model that handles
 * EMAIL, PHONE, IDENTITY, BACKGROUND, and VISA verifications
 * through a single Verification type.
 */
export const unifiedTypeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  """
  User entity reference from user-service
  """
  type User @key(fields: "id", resolvable: false) {
    id: ID!
  }

  """
  Unified verification record for all verification types
  """
  type Verification @key(fields: "id") {
    id: ID!
    userId: String!
    user: User!
    type: VerificationType!
    status: VerificationStatus!
    provider: String
    providerRef: String
    verifiedAt: DateTime
    expiresAt: DateTime
    metadata: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Types of verification
  """
  enum VerificationType {
    EMAIL
    PHONE
    IDENTITY
    BACKGROUND
    VISA
  }

  """
  Verification status
  """
  enum VerificationStatus {
    PENDING
    IN_PROGRESS
    VERIFIED
    FAILED
    EXPIRED
  }

  """
  Result data for completing a verification
  """
  input VerificationResult {
    status: VerificationStatus!
    providerRef: String
    metadata: JSON
    expiresAt: DateTime
  }

  """
  Input for initiating verification
  """
  input InitiateVerificationInput {
    type: VerificationType!
    metadata: JSON
  }

  """
  Input for completing verification
  """
  input CompleteVerificationInput {
    id: ID!
    result: VerificationResult!
  }

  # Queries
  type Query {
    """
    Get a verification by ID
    """
    verification(id: ID!): Verification

    """
    Get all verifications for a user
    """
    userVerifications(userId: ID!): [Verification!]!

    """
    Get verification status for a specific type
    """
    verificationStatus(userId: ID!, type: VerificationType!): VerificationStatus!

    """
    Get current user's verifications
    """
    myVerifications: [Verification!]!
  }

  # Mutations
  type Mutation {
    """
    Initiate a new verification process
    """
    initiateVerification(input: InitiateVerificationInput!): Verification!

    """
    Complete a verification with results
    """
    completeVerification(input: CompleteVerificationInput!): Verification!

    """
    Expire a verification
    """
    expireVerification(id: ID!): Boolean!

    """
    Send email verification
    """
    sendEmailVerification: Verification!

    """
    Verify email with token
    """
    verifyEmail(token: String!): Verification!

    """
    Send phone verification OTP
    """
    sendPhoneVerification(phoneNumber: String!): Verification!

    """
    Verify phone with OTP
    """
    verifyPhone(verificationId: ID!, otp: String!): Verification!
  }

  # Custom scalars
  scalar DateTime
  scalar JSON
`;
