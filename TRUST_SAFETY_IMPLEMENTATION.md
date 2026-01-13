# Trust & Safety System Implementation

This document details the implementation of the Trust & Safety system for Nivasesa (Nivasesa-0dk).

## Overview

The Trust & Safety system provides user verification, content moderation, and user blocking functionality to ensure a safe and trustworthy platform.

## Database Schema

### Models Added to `/apps/rent-app/prisma/schema.prisma`

#### 1. UserVerification
Tracks verification status for users across multiple verification methods:
- `emailVerified` - Email verification status
- `phoneVerified` - Phone number verification status
- `idVerified` - Government ID verification status
- `idDocumentUrl` - Stored document URL for review
- `verifiedAt` - Timestamp of first verification

#### 2. Report
Content reporting system for moderation:
- `targetType` - Type of content being reported (user, listing, message)
- `targetId` - ID of the reported content
- `reason` - Reason for report (spam, harassment, fraud, inappropriate)
- `status` - Review status (pending, reviewed, resolved)
- `reviewedBy` - Admin who reviewed the report

#### 3. UserBlock
User blocking for privacy and safety:
- `blockerId` - User who initiated the block
- `blockedId` - User being blocked
- Enforces unique constraint to prevent duplicate blocks
- Indexed for fast lookup

## Server Actions

### Trust Actions (`/apps/rent-app/actions/trust.ts`)

#### getVerificationStatusAction()
- Retrieves current user's verification status
- Returns email, phone, and ID verification flags

#### requestPhoneVerificationAction(phone)
- Sends verification code to phone number
- Validates phone format
- Returns code in development mode for testing
- **TODO**: Integrate with Twilio/SNS for production

#### verifyPhoneAction(code)
- Verifies phone with 6-digit code
- Updates UserVerification record
- Marks phoneVerified as true

#### submitIdVerificationAction(documentUrl)
- Accepts government ID document URL
- Stores for manual review
- **TODO**: Integrate with Stripe Identity or Onfido for automated verification

#### markEmailVerifiedAction(userId)
- Internal action to mark email as verified
- Called by email verification flow

### Moderation Actions (`/apps/rent-app/actions/moderation.ts`)

#### reportContentAction(targetType, targetId, reason, description)
- Creates report for user, listing, or message
- Validates input and prevents duplicate reports
- Stores for admin review
- **TODO**: Auto-flag content with multiple reports
- **TODO**: Trigger automated content moderation

#### blockUserAction(userId)
- Blocks a user (prevents self-blocking)
- Creates UserBlock record
- **TODO**: Hide messages from blocked user
- **TODO**: Remove active connections
- **TODO**: Filter blocked users from search

#### unblockUserAction(userId)
- Removes block on a user
- Deletes UserBlock record

#### getBlockedUsersAction()
- Returns list of users blocked by current user
- Ordered by block creation date

#### isUserBlockedAction(userId)
- Checks if user is blocked in either direction
- Returns `blockedByMe` and `blockedMe` flags

#### getMyReportsAction()
- Returns reports submitted by current user
- Ordered by creation date

## UI Components

### VerificationBadges (`/apps/rent-app/components/ui/VerificationBadges.tsx`)

Display verification status with colored badges:
- Email (blue), Phone (green), ID (purple)
- Configurable sizes: small, medium, large
- Optional labels
- Only shows verified badges (hides unverified)

**Usage:**
```tsx
<VerificationBadges
  emailVerified={true}
  phoneVerified={true}
  idVerified={false}
  showLabels
  size="medium"
/>
```

### ReportModal (`/apps/rent-app/components/ui/ReportModal.tsx`)

Modal for reporting content:
- Select report reason from predefined list
- Optional description field
- Shows success message on submission
- Prevents duplicate reports
- Fully accessible with keyboard navigation

**Usage:**
```tsx
const [isOpen, setIsOpen] = useState(false);

<ReportModal
  targetType="user"
  targetId="user123"
  targetName="John Doe"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### BlockButton (`/apps/rent-app/components/ui/BlockButton.tsx`)

Button for blocking/unblocking users:
- Auto-detects current block status
- Confirmation modal before blocking
- Shows unblock option if already blocked
- Three variants: primary, secondary, icon
- Three sizes: small, medium, large
- Optional callback on status change

**Usage:**
```tsx
// Standard button
<BlockButton
  userId="user123"
  userName="John Doe"
  variant="secondary"
  size="medium"
/>

// Icon-only button
<BlockButton
  userId="user123"
  variant="icon"
  onBlockStatusChange={(isBlocked) => console.log(isBlocked)}
/>
```

## Example Page

### Verification Dashboard (`/apps/rent-app/app/dashboard/verification/`)

Complete verification management page with:
- Current verification status display
- Email verification info
- Phone verification with SMS code flow
- ID document submission
- Clear UI feedback for all states
- Server-side auth check

## Security Features

1. **Input Validation**: All actions validate inputs server-side
2. **Auth Checks**: All actions verify user authentication
3. **Unique Constraints**: Prevent duplicate reports and blocks
4. **Rate Limiting**: Ready for integration (TODO)
5. **Audit Trail**: All reports and blocks are timestamped

## Integration Points

### Current Integrations
- NextAuth for authentication
- Prisma for database access
- React hooks for state management

### Future Integrations (TODO)
1. **SMS Service**: Twilio or AWS SNS for phone verification
2. **ID Verification**: Stripe Identity or Onfido
3. **Email Service**: SendGrid for verification emails
4. **Admin Dashboard**: For reviewing reports and ID submissions
5. **Automated Moderation**: AI-based content scanning
6. **Rate Limiting**: Redis-based rate limiting for verification attempts

## Usage Guidelines

### For Developers

1. **Adding Verification Badges to Profiles**:
```tsx
import VerificationBadges from '@/components/ui/VerificationBadges';

// In your profile component
<VerificationBadges
  emailVerified={user.emailVerified}
  phoneVerified={user.phoneVerified}
  idVerified={user.idVerified}
  showLabels
/>
```

2. **Adding Report Functionality**:
```tsx
import { useState } from 'react';
import ReportModal from '@/components/ui/ReportModal';

const [reportOpen, setReportOpen] = useState(false);

<button onClick={() => setReportOpen(true)}>Report</button>
<ReportModal
  targetType="listing"
  targetId={listing.id}
  targetName={listing.title}
  isOpen={reportOpen}
  onClose={() => setReportOpen(false)}
/>
```

3. **Adding Block Functionality**:
```tsx
import BlockButton from '@/components/ui/BlockButton';

<BlockButton userId={otherUser.id} userName={otherUser.name} />
```

### For Admins

**Review Reports**:
```ts
// Query pending reports
const reports = await prisma.report.findMany({
  where: { status: 'pending' },
  orderBy: { createdAt: 'desc' }
});

// Mark as reviewed
await prisma.report.update({
  where: { id: reportId },
  data: {
    status: 'reviewed',
    reviewedAt: new Date(),
    reviewedBy: adminId
  }
});
```

**Approve ID Verification**:
```ts
await prisma.userVerification.update({
  where: { userId },
  data: {
    idVerified: true,
    verifiedAt: new Date()
  }
});
```

## Testing

### Manual Testing Checklist

- [ ] Email verification displays correctly
- [ ] Phone verification sends code (check logs in dev)
- [ ] Phone verification accepts valid 6-digit code
- [ ] ID submission stores document URL
- [ ] Reports can be submitted for users, listings, messages
- [ ] Duplicate reports are prevented
- [ ] Users can block other users
- [ ] Users cannot block themselves
- [ ] Blocked users can be unblocked
- [ ] Block status is checked correctly
- [ ] Verification badges display correctly
- [ ] All modals close properly
- [ ] Error states display helpful messages

### Database Migration

After pulling these changes:

```bash
cd apps/rent-app
npx prisma generate
npx prisma db push  # For development
```

For production:
```bash
npx prisma migrate dev --name add_trust_safety
```

## Files Created/Modified

### Created Files
1. `/apps/rent-app/actions/trust.ts` - Trust & verification actions
2. `/apps/rent-app/actions/moderation.ts` - Moderation & blocking actions
3. `/apps/rent-app/components/ui/VerificationBadges.tsx` - Verification badge component
4. `/apps/rent-app/components/ui/VerificationBadges.module.css` - Badge styles
5. `/apps/rent-app/components/ui/ReportModal.tsx` - Report modal component
6. `/apps/rent-app/components/ui/ReportModal.module.css` - Modal styles
7. `/apps/rent-app/components/ui/BlockButton.tsx` - Block/unblock button
8. `/apps/rent-app/components/ui/BlockButton.module.css` - Button styles
9. `/apps/rent-app/app/dashboard/verification/page.tsx` - Verification page
10. `/apps/rent-app/app/dashboard/verification/VerificationPage.tsx` - Client component
11. `/apps/rent-app/app/dashboard/verification/VerificationPage.module.css` - Page styles

### Modified Files
1. `/apps/rent-app/prisma/schema.prisma` - Added UserVerification, Report, UserBlock models

## Next Steps

1. **Integrate SMS Provider**: Set up Twilio/SNS for phone verification
2. **Add Email Verification**: Implement email verification flow with NextAuth
3. **ID Verification Service**: Integrate Stripe Identity or Onfido
4. **Admin Dashboard**: Build interface for reviewing reports and IDs
5. **Automated Moderation**: Add AI content scanning for reports
6. **Search Filtering**: Filter blocked users from search results
7. **Message Filtering**: Hide messages from blocked users
8. **Rate Limiting**: Implement rate limits on verification attempts
9. **Notifications**: Notify users of verification status changes
10. **Analytics**: Track verification rates and report metrics

## Support

For questions or issues with the Trust & Safety system, contact the development team.
