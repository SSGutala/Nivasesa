# Notification System Implementation

## Overview

A comprehensive notification system has been implemented for Nivasesa (issue Nivasesa-8b8), providing both in-app notifications and email notifications for key user events.

## What Was Implemented

### 1. Database Models (`apps/rent-app/prisma/schema.prisma`)

#### Notification Model
```prisma
model Notification {
  id     String @id @default(cuid())
  userId String // References auth DB User.id

  type  String // "booking", "message", "review", "system", "waitlist", "connection"
  title String
  body  String
  link  String? // URL to navigate to

  read Boolean @default(false)

  createdAt DateTime @default(now())

  @@index([userId, read])
  @@index([userId, createdAt])
  @@index([createdAt])
}
```

#### NotificationPreference Model
```prisma
model NotificationPreference {
  id     String @id @default(cuid())
  userId String @unique // References auth DB User.id

  // Email notification preferences
  emailBookings  Boolean @default(true)
  emailMessages  Boolean @default(true)
  emailReviews   Boolean @default(true)
  emailMarketing Boolean @default(false)

  // In-app notification preferences
  inAppBookings Boolean @default(true)
  inAppMessages Boolean @default(true)
  inAppReviews  Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Server Actions (`apps/rent-app/actions/notifications.ts`)

All notification actions with proper authentication, validation, and error handling:

- **getNotificationsAction(limit, offset)** - Get paginated user notifications
- **getUnreadNotificationCountAction()** - Get count of unread notifications
- **markNotificationReadAction(id)** - Mark single notification as read
- **markAllNotificationsReadAction()** - Mark all user notifications as read
- **createNotificationAction(userId, type, title, body, link)** - Create new notification (respects user preferences)
- **getNotificationPreferencesAction()** - Get user's notification preferences
- **updateNotificationPreferencesAction(prefs)** - Update notification preferences
- **deleteNotificationAction(id)** - Delete single notification
- **deleteReadNotificationsAction()** - Delete all read notifications

### 3. Email Notifications (`apps/rent-app/lib/email.ts`)

Added three notification email functions with HTML templates:

- **sendBookingConfirmationEmail(booking)** - Booking confirmation with details
- **sendNewMessageEmail(message)** - New message notification with preview
- **sendReviewReceivedEmail(review)** - Review notification with star rating

All emails:
- Use responsive HTML templates
- Include call-to-action buttons
- Support development mode (console logging when no API key)
- Use Resend API for delivery

### 4. Notification Helper Utilities (`apps/rent-app/lib/notifications.ts`)

High-level helper functions for creating notifications across the system:

- **notifyBookingConfirmed(bookingId, guestId, hostId)** - Complete booking notification flow
- **notifyBookingStatusChange(bookingId, userId, status, message)** - Status update notifications
- **notifyNewMessage(conversationId, senderId, recipientId, content)** - Message notifications with rate limiting
- **notifyNewReview(reviewId, reviewerId, revieweeId)** - Review notifications
- **notifyWaitlistAvailable(listingId, userIds)** - Waitlist availability notifications
- **notifyConnectionRequest(requestId, senderId, ownerId, status)** - Connection request notifications
- **notifySystem(userId, title, body, link)** - General system notifications

All helpers:
- Check user notification preferences
- Create in-app notifications
- Send emails if enabled
- Handle errors gracefully

### 5. UI Components

#### NotificationDropdown (`components/ui/NotificationDropdown.tsx`)
Real-time notification dropdown for app header with:
- Unread count badge
- Live notification list
- Mark as read functionality
- Delete notifications
- Mark all as read
- Auto-refresh every 30 seconds
- Links to full notification page
- Responsive design

#### NotificationPreferences (`components/ui/NotificationPreferences.tsx`)
User notification settings page with:
- Email notification toggles (bookings, messages, reviews, marketing)
- In-app notification toggles (bookings, messages, reviews)
- Clean toggle UI
- Auto-save functionality
- Responsive layout

## Usage Examples

### Creating Notifications in Your Code

```typescript
import { notifyBookingConfirmed, notifyNewMessage } from '@/lib/notifications'

// After confirming a booking
await notifyBookingConfirmed(booking.id, booking.guestId, booking.hostId)

// After sending a message
await notifyNewMessage(conversationId, senderId, recipientId, messageContent)
```

### Using the Dropdown in Your Header

```tsx
import { NotificationDropdown } from '@/components/ui'

function Header() {
  return (
    <header>
      {/* ... other header content ... */}
      <NotificationDropdown />
    </header>
  )
}
```

### Adding Preferences Page

```tsx
import { NotificationPreferences } from '@/components/ui'

export default function SettingsPage() {
  return (
    <div>
      <h1>Notification Settings</h1>
      <NotificationPreferences />
    </div>
  )
}
```

## Notification Types

| Type | Description | Default Email | Default In-App |
|------|-------------|---------------|----------------|
| `booking` | Booking confirmations, updates, cancellations | Yes | Yes |
| `message` | New messages in conversations | Yes | Yes |
| `review` | New reviews received | Yes | Yes |
| `system` | System announcements and updates | No | Yes |
| `waitlist` | Waitlisted listing availability | Yes | Yes |
| `connection` | Connection request updates | Yes | Yes |

## Database Migration

To apply the schema changes:

```bash
cd apps/rent-app
npx prisma format
npx prisma generate
npx prisma db push  # or migrate dev for production
```

## Integration Points

The notification system is designed to integrate with:

1. **Booking System** - Automatically notify on booking events
2. **Messaging System** - Notify on new messages (with rate limiting)
3. **Review System** - Notify when users receive reviews
4. **Waitlist System** - Notify when listings become available
5. **Connection Requests** - Notify on request status changes

## Features

### Rate Limiting
- Message notifications are rate-limited (1 email per conversation per 5 minutes)
- Prevents email spam from active conversations

### User Preferences
- All notifications respect user preferences
- Users can disable email/in-app notifications per category
- Marketing emails are opt-in by default

### Responsive Design
- Dropdown works on mobile and desktop
- Preferences page adapts to screen size
- Touch-friendly controls

### Performance
- Unread count auto-refreshes every 30 seconds
- Notifications paginated for performance
- Efficient database queries with proper indexes

## Files Created/Modified

### Created
- `/apps/rent-app/actions/notifications.ts` - Notification server actions
- `/apps/rent-app/lib/notifications.ts` - Notification helper utilities
- `/apps/rent-app/components/ui/NotificationDropdown.tsx` - Dropdown component
- `/apps/rent-app/components/ui/NotificationDropdown.module.css` - Dropdown styles
- `/apps/rent-app/components/ui/NotificationPreferences.tsx` - Preferences component
- `/apps/rent-app/components/ui/NotificationPreferences.module.css` - Preferences styles

### Modified
- `/apps/rent-app/prisma/schema.prisma` - Added Notification and NotificationPreference models
- `/apps/rent-app/lib/email.ts` - Added notification email functions
- `/apps/rent-app/components/ui/index.ts` - Exported new components

## Next Steps

To complete the integration:

1. Add `<NotificationDropdown />` to your app header/navbar
2. Create notification settings page using `<NotificationPreferences />`
3. Integrate notification helpers in booking/messaging/review flows:
   - Call `notifyBookingConfirmed()` after booking confirmation
   - Call `notifyNewMessage()` after sending messages
   - Call `notifyNewReview()` after review creation
4. Run database migration: `npx prisma db push`
5. Test notification flow end-to-end

## Environment Variables Required

```env
# For email notifications (optional, falls back to console logging)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@nivasesa.com
NEXT_PUBLIC_APP_URL=https://nivasesa.com
```

## Security Considerations

- All actions validate user authentication
- Users can only access their own notifications
- Notification preferences are per-user and isolated
- Email content is sanitized
- Links are validated before rendering

## Testing Recommendations

1. Test notification creation for each type
2. Verify email delivery (or console logging in dev)
3. Test notification preferences toggling
4. Verify mark as read/delete functionality
5. Test unread count accuracy
6. Test rate limiting for message notifications
7. Test responsive UI on mobile devices
