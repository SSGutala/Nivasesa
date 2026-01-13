# Post-Interaction Survey System

Complete implementation of the post-interaction survey system for Nivasesa as specified in `docs/prd-renters.md`.

## Overview

The survey system collects feedback from users after key interactions (video calls, bookings) and provides general platform feedback capabilities. It features automatic role inference, multiple question types, and comprehensive analytics.

## Database Schema

### Survey Model

Stores survey templates with questions:

```prisma
model Survey {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        String   // "video_call", "booking", "general"
  questions   String   // JSON array of question objects
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  responses   SurveyResponse[]
}
```

### SurveyResponse Model

Stores individual user responses:

```prisma
model SurveyResponse {
  id              String   @id @default(cuid())
  surveyId        String
  survey          Survey   @relation(...)
  userId          String   // References auth DB User.id
  userRole        String   // "renter", "host", "realtor"
  interactionId   String?  // video call or booking ID
  interactionType String?  // "video_call" or "booking"
  answers         String   // JSON array of {questionId, answer}
  rating          Int?     // Overall rating 1-5
  feedback        String?  // Open text feedback
  createdAt       DateTime @default(now())
}
```

## Question Types

The system supports multiple question types:

1. **Rating** - Star rating (1-5 or custom range)
2. **Yes/No** - Binary choice
3. **Multiple Choice** - Select from predefined options
4. **Text** - Open-ended text response

### Question Schema

```typescript
interface SurveyQuestion {
  id: string;
  type: "rating" | "text" | "multiple_choice" | "yes_no";
  question: string;
  required: boolean;
  options?: string[]; // For multiple_choice
  min?: number; // For rating
  max?: number; // For rating
}
```

## Server Actions

### Core Actions

Located in `/apps/rent-app/actions/surveys.ts`:

#### `getSurveyByIdAction(surveyId)`
Fetch a survey with parsed questions.

#### `getActiveSurveyByTypeAction(type)`
Get the active survey for a specific type (video_call, booking, general).

#### `submitSurveyResponseAction(surveyId, userId, userRole, answers, ...)`
Submit a user's survey response with validation.

#### `triggerSurveyAfterVideoCall(videoCallId, userId)`
Auto-infers user role and returns appropriate survey.

#### `triggerSurveyAfterBooking(bookingId, userId)`
Auto-infers user role and returns appropriate survey.

#### `getUserSurveyResponsesAction(userId)`
Get all survey responses for a user.

### Admin Actions

#### `createSurveyAction(title, description, type, questions)`
Create a new survey (admin only).

#### `getAllSurveysAction()`
Get all surveys (admin only).

#### `toggleSurveyActiveAction(surveyId)`
Toggle survey active status (admin only).

## User Flow

### After Video Call

1. Video call completes (status = "COMPLETED")
2. System calls `triggerSurveyAfterVideoCall(videoCallId, userId)`
3. System auto-infers role:
   - `hostId === userId` → user is "host"
   - `guestId === userId` → user is "renter"
4. User redirected to `/survey/{surveyId}?interactionId={videoCallId}&interactionType=video_call`
5. User completes survey with:
   - Overall star rating (required)
   - Question responses
   - Optional feedback
6. Response stored with interaction metadata

### After Booking

1. Booking completes (status = "COMPLETED")
2. System calls `triggerSurveyAfterBooking(bookingId, userId)`
3. System auto-infers role:
   - `hostId === userId` → user is "host"
   - `guestId === userId` → user is "renter"
4. User redirected to `/survey/{surveyId}?interactionId={bookingId}&interactionType=booking`
5. User completes survey
6. Response stored with interaction metadata

## UI Components

### StarRating Component

Location: `/apps/rent-app/components/ui/StarRating.tsx`

Interactive star rating with hover effects and accessibility.

```tsx
<StarRating
  value={rating}
  onChange={setRating}
  max={5}
  size="lg"
/>
```

### SurveyForm Component

Location: `/apps/rent-app/app/survey/[id]/SurveyForm.tsx`

Client component that:
- Renders questions dynamically based on type
- Validates required fields
- Handles submission with error handling
- Provides accessible form controls

## Routes

### Public Routes

- `/survey/[id]` - Survey form page
  - Query params: `interactionId`, `interactionType`

### Admin Routes

- `/dashboard/admin/surveys` - Survey management dashboard
  - View all surveys
  - Toggle active/inactive status
  - View survey questions

## Seeded Surveys

Three surveys are pre-seeded:

1. **Video Call Survey** (`video-call-survey`)
   - Video quality rating
   - Audio quality rating
   - Decision helpfulness
   - Call purpose
   - Suggestions

2. **Booking Survey** (`booking-survey`)
   - Overall experience rating
   - Listing accuracy
   - Recommendation likelihood
   - Check-in process
   - What worked well
   - Improvement suggestions

3. **General Platform Survey** (`general-survey`)
   - Ease of use
   - Finding matches
   - Most used feature
   - Desired improvements
   - One thing to improve

## Helper Utilities

Location: `/apps/rent-app/lib/survey-helpers.ts`

### Role Inference

```typescript
await inferRoleFromVideoCall(videoCallId, userId);
await inferRoleFromBooking(bookingId, userId);
```

### Duplicate Prevention

```typescript
await hasUserSubmittedSurvey(userId, interactionId, interactionType);
```

### URL Generation

```typescript
getVideoCallSurveyUrl(surveyId, videoCallId);
getBookingSurveyUrl(surveyId, bookingId);
getGeneralSurveyUrl(surveyId);
```

### Analytics

```typescript
const stats = await getSurveyStats(surveyId);
// Returns: totalResponses, avgRating, roleBreakdown
```

## Integration Points

### Video Call System

After a video call ends:

```typescript
import { triggerSurveyAfterVideoCall } from "@/actions/surveys";
import { getVideoCallSurveyUrl } from "@/lib/survey-helpers";

// When video call completes
const { surveyId, userRole } = await triggerSurveyAfterVideoCall(
  videoCallId,
  userId
);

if (surveyId) {
  const surveyUrl = getVideoCallSurveyUrl(surveyId, videoCallId);
  // Redirect or notify user
  router.push(surveyUrl);
}
```

### Booking System

After booking completes:

```typescript
import { triggerSurveyAfterBooking } from "@/actions/surveys";
import { getBookingSurveyUrl } from "@/lib/survey-helpers";

// When booking completes
const { surveyId, userRole } = await triggerSurveyAfterBooking(
  bookingId,
  userId
);

if (surveyId) {
  const surveyUrl = getBookingSurveyUrl(surveyId, bookingId);
  router.push(surveyUrl);
}
```

## Data Privacy

- Survey responses are linked to userId but stored separately
- Individual responses can be anonymized for analytics
- Users can view their own past survey responses
- Admins can view aggregated statistics

## Future Enhancements

Potential improvements:

1. **Survey Templates** - Pre-built templates for common use cases
2. **Conditional Questions** - Show/hide questions based on previous answers
3. **Response Analytics Dashboard** - Visual charts and trends
4. **Email Notifications** - Auto-send survey links via email
5. **Response Incentives** - Rewards for completing surveys
6. **Multi-language Support** - Translate surveys to multiple languages
7. **Survey Scheduling** - Time-delayed survey triggers
8. **A/B Testing** - Test different survey versions

## Testing

### Seed Surveys

```bash
cd apps/rent-app
npx tsx prisma/seed-surveys.ts
```

### Access Survey

1. Start dev server: `npm run dev`
2. Navigate to `/survey/video-call-survey`
3. Complete and submit survey
4. Check database: `npx prisma studio`

### Admin Dashboard

1. Navigate to `/dashboard/admin/surveys`
2. View all surveys
3. Toggle active/inactive
4. View questions

## Files Created

### Database
- `/apps/rent-app/prisma/schema.prisma` - Updated with Survey and SurveyResponse models

### Server Actions
- `/apps/rent-app/actions/surveys.ts` - All survey server actions

### UI Components
- `/apps/rent-app/components/ui/StarRating.tsx` - Star rating component
- `/apps/rent-app/components/ui/StarRating.module.css` - Star rating styles

### Pages
- `/apps/rent-app/app/survey/[id]/page.tsx` - Survey form page
- `/apps/rent-app/app/survey/[id]/SurveyForm.tsx` - Survey form component
- `/apps/rent-app/app/survey/[id]/SurveyForm.module.css` - Survey form styles

### Admin
- `/apps/rent-app/app/dashboard/admin/surveys/page.tsx` - Admin survey list page
- `/apps/rent-app/app/dashboard/admin/surveys/SurveyList.tsx` - Admin survey list component
- `/apps/rent-app/app/dashboard/admin/surveys/SurveyList.module.css` - Admin list styles

### Utilities
- `/apps/rent-app/lib/survey-helpers.ts` - Survey helper functions

### Seed Data
- `/apps/rent-app/prisma/seed-surveys.ts` - Survey seed script

## Next Steps

To complete the integration:

1. **Authentication Integration**
   - Replace `"temp-user-id"` in SurveyForm with actual session userId
   - Add auth checks to survey submission
   - Implement role-based access for admin routes

2. **Notification System**
   - Send in-app notifications when survey is available
   - Optional email reminders for incomplete surveys

3. **Analytics Dashboard**
   - Build admin analytics page with charts
   - Show response trends over time
   - Export survey data to CSV

4. **Testing**
   - Write unit tests for survey actions
   - Integration tests for survey flow
   - E2E tests for complete user journey
