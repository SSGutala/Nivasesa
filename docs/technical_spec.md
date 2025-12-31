# Technical Specification Document - Nivaesa
**Version:** 1.0
**Reference:** [PRD NVS-R01](./prd.md)
**Target**: Engineering & AI Agents

---

## 1. Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via CSS Modules for complex components) + `lucide-react` icons.
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth (Auth.js) v5
- **Maps:** Leaflet (Client-side)
- **State:** React Server Components (RSC) + Server Actions for mutations.

---

## 2. Directory Structure
```text
/app
  /auth           # Login/Signup routes
  /explore        # Search & Discovery (Main Engine)
  /listing/[id]   # Detail Pages
  /onboarding     # Host/Renter Wizards
  /dashboard      # User specific management
/components
  /ui             # Primitives (Button, Input, Modal)
  /explore        # Explorer specific (Map, Filters)
  /listing        # Listing specific (Gallery, ActionCard)
/lib
  db.ts           # Prisma Client singleton
  auth.ts         # NextAuth config
  actions.ts      # Server Actions
  geo.ts          # Geocoding helpers
```

---

## 3. Database Schema (Prisma)

```prisma
// This is the source of truth for the data model.
// Run `npx prisma push` to sync.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          UserRole  @default(RENTER)
  createdAt     DateTime  @default(now())
  
  // Relations
  listings      Listing[] // As Host
  requests      ConnectionRequest[] // As Renter
  waitlists     WaitlistEntry[]
}

enum UserRole {
  RENTER
  HOST
  ADMIN
}

model Listing {
  id          String        @id @default(cuid())
  title       String
  description String
  price       Float
  
  // Location
  address     String
  city        String
  lat         Float
  lng         Float
  
  // Details
  images      String[]
  amenities   String[]
  norms       String[]      // e.g. "Vegetarian", "No Smoking"
  
  // State Management (NVS-R01)
  status      ListingStatus @default(AVAILABLE)
  
  // Relations
  hostId      String
  host        User          @relation(fields: [hostId], references: [id])
  requests    ConnectionRequest[]
  waitlist    WaitlistEntry[]
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum ListingStatus {
  AVAILABLE
  IN_DISCUSSION // Hides from general search, allows waitlist
  UNAVAILABLE   // Rented or paused
}

model ConnectionRequest {
  id        String        @id @default(cuid())
  status    RequestStatus @default(PENDING)
  message   String?       // Initial intro note
  
  // Relations
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  listingId String
  listing   Listing       @relation(fields: [listingId], references: [id])
  
  createdAt DateTime      @default(now())
}

enum RequestStatus {
  PENDING
  ACCEPTED  // Triggers contact details sharing
  DECLINED
  WAITLISTED
}

model WaitlistEntry {
  id        String   @id @default(cuid())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  listingId String
  listing   Listing  @relation(fields: [listingId], references: [id])
  
  createdAt DateTime @default(now())

  @@unique([userId, listingId]) // Prevent duplicate entries
}
```

---

## 4. Key Functional Implementations

### A. Listing State Logic
**Requirement:** Listings "In Discussion" are visible but gated.
- **Logic:**
  - IF `status` == `AVAILABLE`: Show "Express Interest" button.
  - IF `status` == `IN_DISCUSSION`: Show "Join Waitlist" button.
  - IF `status` == `UNAVAILABLE`: Show "Leased" badge, disable actions.

### B. Connection Request Flow (Consent-Based)
1. **Renter** clicks "Express Interest".
2. **System** creates `ConnectionRequest` (Status: PENDING).
3. **Host** sees request in Dashboard.
4. **Host** clicks "Accept".
   - `ConnectionRequest` status updates to ACCEPTED.
   - UI unlocks for both parties: "View Contact Info" & "Start Video Call".

### C. Video Call Integration
- **Vendor:** Daily.co (recommended) or Twilio Video.
- **Trigger:** Only available when `ConnectionRequest.status === ACCEPTED`.
- **Implementation:**
  - Create `/app/call/[roomId]/page.tsx`.
  - Gate access via middleware ensuring `session.user.id` matches the connection.

---

## 5. Security & RBAC
- **Middleware (`middleware.ts`):** 
  - Whitelist public routes (`/explore`, `/listing/*`).
  - Protect `/dashboard/*`, `/onboarding/*`.
- **Row Level Security (Simulated):**
  - In Server Actions, always verify `session.user.id` owns the record before mutation.
