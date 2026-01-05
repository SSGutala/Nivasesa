import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  """
  User entity reference from user-service
  """
  type User @key(fields: "id", resolvable: false) {
    id: ID!
  }

  """
  Identity verification via Persona or similar providers
  """
  type IdentityVerification {
    id: ID!
    userId: String!
    user: User!
    status: VerificationStatus!
    provider: String!
    personaInquiryId: String
    documentType: String
    documentNumber: String
    verifiedAt: DateTime
    expiresAt: DateTime
    failureReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Background check via Checkr or similar providers
  """
  type BackgroundCheck {
    id: ID!
    userId: String!
    user: User!
    status: VerificationStatus!
    provider: String!
    checkrReportId: String
    package: BackgroundCheckPackage
    result: BackgroundCheckResult
    completedAt: DateTime
    expiresAt: DateTime
    consentGivenAt: DateTime
    criminalRecords: Boolean
    sexOffenderRegistry: Boolean
    globalWatchlist: Boolean
    ssnTrace: Boolean
    failureReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Visa verification for work authorization
  """
  type VisaVerification {
    id: ID!
    userId: String!
    user: User!
    visaType: VisaType!
    status: VerificationStatus!
    verifiedAt: DateTime
    expiresAt: DateTime
    eVerifyCase: String
    eVerifyStatus: String
    documentUrls: [String!]
    i94Number: String
    sevisId: String
    failureReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  License verification for realtors and property managers
  """
  type LicenseVerification {
    id: ID!
    userId: String!
    user: User!
    licenseType: LicenseType!
    licenseNumber: String!
    state: String!
    status: VerificationStatus!
    verifiedAt: DateTime
    expiresAt: DateTime
    issueDate: DateTime
    boardName: String
    disciplinaryActions: Boolean!
    failureReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Audit log for verification actions
  """
  type VerificationAuditLog {
    id: ID!
    userId: String!
    verificationType: VerificationType!
    action: VerificationAction!
    performedBy: String
    previousStatus: VerificationStatus
    newStatus: VerificationStatus!
    reason: String
    createdAt: DateTime!
  }

  """
  Complete verification status for a user
  """
  type VerificationStatusSummary {
    userId: String!
    identity: IdentityVerification
    background: BackgroundCheck
    visa: VisaVerification
    license: LicenseVerification
    overallStatus: VerificationStatus!
    trustScore: Int!
    lastUpdated: DateTime!
  }

  """
  Verification statuses across all types
  """
  enum VerificationStatus {
    NOT_STARTED
    PENDING
    IN_REVIEW
    VERIFIED
    FAILED
    EXPIRED
  }

  """
  Background check packages
  """
  enum BackgroundCheckPackage {
    BASIC
    STANDARD
    PREMIUM
  }

  """
  Background check result categories
  """
  enum BackgroundCheckResult {
    CLEAR
    CONSIDER
    SUSPENDED
  }

  """
  Visa types for work authorization
  """
  enum VisaType {
    H1B
    H2B
    F1
    L1
    O1
    E2
    TN
    GREEN_CARD
    CITIZEN
    EAD
  }

  """
  License types for professionals
  """
  enum LicenseType {
    REALTOR
    BROKER
    PROPERTY_MANAGER
    LANDLORD_CERTIFICATION
  }

  """
  Verification type for audit logs
  """
  enum VerificationType {
    IDENTITY
    BACKGROUND
    VISA
    LICENSE
  }

  """
  Verification actions for audit logs
  """
  enum VerificationAction {
    INITIATED
    SUBMITTED
    APPROVED
    REJECTED
    EXPIRED
    UPDATED
  }

  # Input types
  input InitIdentityVerificationInput {
    provider: String
    documentType: String
  }

  input SubmitBackgroundCheckInput {
    package: BackgroundCheckPackage!
    consentGiven: Boolean!
  }

  input SubmitVisaVerificationInput {
    visaType: VisaType!
    i94Number: String
    sevisId: String
    documentUrls: [String!]
  }

  input SubmitLicenseVerificationInput {
    licenseType: LicenseType!
    licenseNumber: String!
    state: String!
    issueDate: DateTime
  }

  input UpdateVerificationStatusInput {
    verificationId: ID!
    verificationType: VerificationType!
    status: VerificationStatus!
    reason: String
  }

  # Queries
  type Query {
    """
    Get complete verification status for a user
    """
    verificationStatus(userId: String!): VerificationStatusSummary!

    """
    Get the current user's verification status
    """
    myVerifications: VerificationStatusSummary!

    """
    Get identity verification by ID
    """
    identityVerification(id: ID!): IdentityVerification

    """
    Get background check by ID
    """
    backgroundCheck(id: ID!): BackgroundCheck

    """
    Get visa verification by ID
    """
    visaVerification(id: ID!): VisaVerification

    """
    Get license verification by ID
    """
    licenseVerification(id: ID!): LicenseVerification

    """
    Get all identity verifications for a user
    """
    identityVerifications(userId: String!): [IdentityVerification!]!

    """
    Get all background checks for a user
    """
    backgroundChecks(userId: String!): [BackgroundCheck!]!

    """
    Get all visa verifications for a user
    """
    visaVerifications(userId: String!): [VisaVerification!]!

    """
    Get all license verifications for a user
    """
    licenseVerifications(userId: String!): [LicenseVerification!]!

    """
    Get audit logs for a user's verifications
    """
    verificationAuditLogs(userId: String!, limit: Int, offset: Int): [VerificationAuditLog!]!

    """
    Get pending verifications (admin only)
    """
    pendingVerifications(
      verificationType: VerificationType
      limit: Int
      offset: Int
    ): PendingVerificationsConnection!
  }

  """
  Paginated pending verifications
  """
  type PendingVerificationsConnection {
    identityVerifications: [IdentityVerification!]!
    backgroundChecks: [BackgroundCheck!]!
    visaVerifications: [VisaVerification!]!
    licenseVerifications: [LicenseVerification!]!
    totalCount: Int!
  }

  # Mutations
  type Mutation {
    """
    Initiate identity verification process
    """
    initIdentityVerification(input: InitIdentityVerificationInput): IdentityVerification!

    """
    Submit background check request
    """
    submitBackgroundCheck(input: SubmitBackgroundCheckInput!): BackgroundCheck!

    """
    Submit visa verification
    """
    submitVisaVerification(input: SubmitVisaVerificationInput!): VisaVerification!

    """
    Submit license verification
    """
    submitLicenseVerification(input: SubmitLicenseVerificationInput!): LicenseVerification!

    """
    Update verification status (admin only)
    """
    updateVerificationStatus(input: UpdateVerificationStatusInput!): Boolean!

    """
    Webhook handler for Persona callbacks
    """
    handlePersonaWebhook(inquiryId: String!, status: String!): Boolean!

    """
    Webhook handler for Checkr callbacks
    """
    handleCheckrWebhook(reportId: String!, status: String!, result: String): Boolean!

    """
    Refresh expired verifications
    """
    refreshVerification(verificationId: ID!, verificationType: VerificationType!): Boolean!
  }

  # Custom scalars
  scalar DateTime
`;
