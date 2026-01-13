# Nivasesa API Documentation

This document describes the server actions available in the Nivasesa platform. All server actions are located in the `actions/` directory and use the `'use server'` directive.

## Table of Contents

- [Authentication](#authentication)
- [User Onboarding](#user-onboarding)
- [Realtor Profiles](#realtor-profiles)
- [Leads Management](#leads-management)
- [Payment & Billing](#payment--billing)
- [Groups](#groups)
- [Rooms](#rooms)
- [Messaging](#messaging)
- [Analytics](#analytics)
- [Search](#search)
- [Survey](#survey)

---

## Authentication

**File:** `actions/auth.ts`

### Actions

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `signInAction(email, password)` | Sign in with email/password | No |
| `signUpAction(data)` | Create new user account | No |
| `signOutAction()` | Sign out current user | Yes |
| `getCurrentUser()` | Get current authenticated user | Yes |

### Two-Factor Authentication

**File:** `actions/two-factor.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `enableTwoFactorAction()` | Generate 2FA setup (returns QR code) | Yes |
| `verifyAndEnableTwoFactorAction(code)` | Verify code and enable 2FA | Yes |
| `disableTwoFactorAction(code)` | Disable 2FA with verification | Yes |
| `verifyTwoFactorAction(code)` | Verify 2FA code during login | Yes |

### Email Verification

**File:** `actions/email-verification.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `sendVerificationEmailAction(email)` | Send verification email | No |
| `verifyEmailAction(token)` | Verify email with token | No |

### Password Reset

**File:** `actions/password-reset.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `requestPasswordResetAction(email)` | Request password reset email | No |
| `resetPasswordAction(token, password)` | Reset password with token | No |

---

## User Onboarding

**File:** `actions/onboarding.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `completeOnboardingAction(data)` | Complete user onboarding setup | Yes |
| `getOnboardingStatusAction()` | Check onboarding completion status | Yes |

---

## Realtor Profiles

**File:** `actions/realtor-profile.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getRealtorProfileAction()` | Get current realtor's profile | Yes (REALTOR) |
| `updateRealtorProfileAction(data)` | Update realtor profile | Yes (REALTOR) |
| `getPublicRealtorProfileAction(id)` | Get public realtor profile by ID | No |
| `getRealtorsByLocationAction(city, state)` | Search realtors by location | No |

### Realtor Verification

**File:** `actions/realtor-verification.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `submitVerificationAction(data)` | Submit realtor verification request | Yes (REALTOR) |
| `getVerificationStatusAction()` | Check verification status | Yes (REALTOR) |

---

## Leads Management

### Lead CRUD

**File:** `actions/leads.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getLeadsAction(filters?)` | Get leads with optional filters | Yes (REALTOR) |
| `getLeadByIdAction(id)` | Get single lead details | Yes (REALTOR) |
| `unlockLeadAction(leadId)` | Unlock a lead (deducts from wallet) | Yes (REALTOR) |
| `getUnlockedLeadsAction()` | Get all unlocked leads | Yes (REALTOR) |
| `getLeadAnalyticsAction(period?)` | Get lead analytics data | Yes (REALTOR) |

### Lead Creation

**File:** `actions/createLead.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `createLeadAction(data)` | Create new lead from buyer request | Yes |

### Lead Distribution

**File:** `actions/lead-distribution.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `distributeLeadAction(leadId, realtorIds)` | Distribute lead to realtors | Yes (ADMIN) |
| `getLeadDistributionAction(leadId)` | Get lead distribution history | Yes (ADMIN) |

### Lead Management (Admin)

**File:** `actions/lead-management.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getAllLeadsAdminAction(filters?)` | Get all leads (admin view) | Yes (ADMIN) |
| `updateLeadStatusAction(id, status)` | Update lead status | Yes (ADMIN) |
| `deleteLeadAction(id)` | Delete a lead | Yes (ADMIN) |

---

## Payment & Billing

**File:** `actions/payment.ts`

### Wallet Operations

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getWalletBalanceAction()` | Get current wallet balance | Yes |
| `createDepositSessionAction(amount)` | Create Stripe checkout for deposit | Yes |
| `getTransactionsAction(filters?)` | Get transaction history | Yes |
| `exportTransactionsAction(filters?)` | Export transactions to CSV | Yes |

### Refunds

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `requestRefundAction(transactionId, amount, reason)` | Submit refund request | Yes |
| `getRefundRequestsAction()` | Get user's refund requests | Yes |
| `cancelRefundRequestAction(id)` | Cancel pending refund request | Yes |
| `getAdminRefundRequestsAction()` | Get all refund requests | Yes (ADMIN) |
| `processRefundAction(id, action, note?)` | Approve/reject refund | Yes (ADMIN) |

---

## Groups

**File:** `actions/groups.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `createGroupAction(data)` | Create new housing group | Yes |
| `getGroupsAction(filters?)` | Get groups with filters | No |
| `getGroupByIdAction(id)` | Get single group details | No |
| `updateGroupAction(id, data)` | Update group details | Yes (group admin) |
| `deleteGroupAction(id)` | Delete a group | Yes (group admin) |
| `joinGroupAction(groupId)` | Request to join a group | Yes |
| `leaveGroupAction(groupId)` | Leave a group | Yes |
| `acceptMemberAction(groupId, profileId)` | Accept member request | Yes (group admin) |
| `rejectMemberAction(groupId, profileId)` | Reject member request | Yes (group admin) |
| `requestRealtorAction(groupId, realtorId, message?)` | Request realtor connection | Yes (group admin) |

---

## Rooms

**File:** `actions/rooms.ts`

### Room Listings

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getRoomListingsAction(filters?)` | Get room listings with filters | No |
| `getRoomListingByIdAction(id)` | Get single room listing | No |
| `createRoomListingAction(data)` | Create new room listing | Yes |
| `updateRoomListingAction(id, data)` | Update room listing | Yes (owner) |
| `deleteRoomListingAction(id)` | Delete room listing | Yes (owner) |

### Room Applications

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `applyToRoomAction(listingId, message?)` | Apply for a room | Yes |
| `withdrawApplicationAction(listingId)` | Withdraw application | Yes |
| `getMyApplicationsAction()` | Get user's applications | Yes |
| `getListingApplicationsAction(listingId)` | Get applications for listing | Yes (owner) |
| `updateApplicationStatusAction(applicationId, status)` | Accept/reject application | Yes (owner) |

### Freedom Score

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `calculateFreedomScore(listing)` | Calculate room's freedom score | Internal |

---

## Messaging

**File:** `actions/messaging.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getOrCreateConversationAction(userId, context?)` | Get or create conversation | Yes |
| `getConversationsAction()` | Get all conversations | Yes |
| `getMessagesAction(conversationId, cursor?)` | Get messages (paginated) | Yes |
| `sendMessageAction(conversationId, content)` | Send a message | Yes |
| `markMessagesReadAction(conversationId)` | Mark messages as read | Yes |
| `getUnreadCountAction()` | Get total unread count | Yes |
| `startRealtorConversationAction(realtorId, message?)` | Start conversation with realtor | Yes |

---

## Analytics

### Lead Analytics

**File:** `actions/leads.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getLeadAnalyticsAction(period?)` | Get lead analytics by period | Yes (REALTOR) |

### Realtor Analytics

**File:** `actions/realtor-analytics.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getRealtorAnalyticsAction()` | Get realtor performance analytics | Yes (REALTOR) |
| `getReferralFunnelAction()` | Get referral funnel data | Yes (REALTOR) |

### Dashboard

**File:** `actions/dashboard.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `getDashboardStatsAction()` | Get dashboard statistics | Yes |
| `getRecentActivityAction()` | Get recent activity | Yes |

---

## Search

**File:** `actions/search.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `searchRealtorsAction(query, filters?)` | Search realtors | No |
| `searchRoomsAction(query, filters?)` | Search room listings | No |
| `searchGroupsAction(query, filters?)` | Search groups | No |
| `searchRoommatesAction(query, filters?)` | Search roommate profiles | No |

---

## Survey

**File:** `actions/survey.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `submitSurveyAction(data)` | Submit pre-launch survey | No |
| `getSurveyResponsesAction(filters?)` | Get survey responses | Yes (ADMIN) |
| `updateSurveyStatusAction(id, status)` | Update survey response status | Yes (ADMIN) |

---

## Buyer Requests

**File:** `actions/buyer-request.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `createBuyerRequestAction(data)` | Create buyer request | No |
| `getBuyerRequestsAction()` | Get user's buyer requests | Yes |

---

## Realtor Applications

**File:** `actions/apply.ts`

| Action | Description | Auth Required |
|--------|-------------|---------------|
| `submitRealtorApplicationAction(data)` | Apply to become a realtor | No |
| `getApplicationStatusAction(email)` | Check application status | No |

---

## Common Types

### Pagination

Most list actions support pagination:

```typescript
interface PaginationParams {
  page?: number    // Page number (1-indexed)
  limit?: number   // Items per page (default: 20)
}
```

### Filters

Common filter patterns:

```typescript
interface CommonFilters {
  city?: string
  state?: string
  status?: string
  startDate?: Date
  endDate?: Date
}
```

### Response Format

All actions return a consistent format:

```typescript
interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

---

## Error Handling

All server actions handle errors consistently:

1. **Authentication errors**: Return `{ success: false, error: 'Not authenticated' }`
2. **Authorization errors**: Return `{ success: false, error: 'Not authorized' }`
3. **Validation errors**: Return `{ success: false, error: 'Validation error: [details]' }`
4. **Not found errors**: Return `{ success: false, error: 'Resource not found' }`
5. **Server errors**: Return `{ success: false, error: 'An error occurred' }`

---

## Rate Limiting

Server actions are subject to rate limiting in production:

- Authentication actions: 5 requests per minute
- Search actions: 30 requests per minute
- CRUD actions: 60 requests per minute
- Bulk operations: 10 requests per minute

---

## Security

All server actions:

1. Validate user authentication via session
2. Check role-based permissions
3. Sanitize input data
4. Use parameterized database queries
5. Log suspicious activity

See `CLAUDE.md` for security review checklist.
