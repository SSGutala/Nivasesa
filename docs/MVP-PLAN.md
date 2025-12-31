# Nivasesa MVP Implementation Plan

## Research Summary: Ohana Platform Analysis

### What is Ohana?
Ohana (liveohana.ai) is a mid-term rental marketplace targeting college students and interns. Founded in 2023, raised $4.15M with notable advisors including Zillow co-founder Spencer Rascoff and former Airbnb Director of Engineering.

**Target Market:** College students subleasing rooms + interns seeking temporary housing
**Coverage:** NYC, SF/Bay Area, Seattle, LA, DC, Pittsburgh (6 cities, 10 universities)
**Positioning:** Mid-term rentals (30 days - 12 months), between Airbnb and Zillow

### Ohana Core Features

| Feature | Description | Priority for Nivasesa |
|---------|-------------|----------------------|
| **Search & Filtering** | Location, neighborhood, move-in date, # rooms, roommate info | P0 - MVP |
| **Listing Creation** | Detailed property info, roommate intros, bedroom showcases | P0 - MVP |
| **Roommate Visibility** | Current roommates displayed, intro mechanism | P0 - MVP |
| **In-app Messaging** | Chat between listers and seekers | P0 - MVP |
| **ID Verification** | Team reviews listings, verifies IDs | P1 - Post-MVP |
| **Video Calls** | Introductory video calls between parties | P1 - Post-MVP |
| **Sublease Agreements** | Custom agreements drafted by platform | P2 - Future |
| **Security Deposit Escrow** | Platform holds deposits | P3 - Requires Payment |
| **Forum Aggregation** | 24/7 search across subleasing forums | P2 - Future |
| **Saved Searches** | Preferences + instant notifications | P1 - Post-MVP |
| **Multi-city Expansion** | Support multiple markets | P0 - MVP (TX, NJ, CA) |

---

## Nivasesa Current State

### Existing Features (Schema Ready)
1. **Room Listings** with Freedom Score (unique differentiator!)
2. **Roommate Profiles** with detailed lifestyle preferences
3. **Groups** for coordinated housing search
4. **Realtor Matching** by language and location
5. **Messaging System** (Conversation & Message models)
6. **Room Applications** workflow
7. **Lead Management** for realtors
8. **User Authentication** with 2FA

### Unique Nivasesa Advantages
- **Freedom Score** (0-100) - quantifies lifestyle freedom in housing
- **South Asian Cultural Focus** - dietary, language, lifestyle compatibility
- **Realtor Network** - connects to culturally-aligned agents
- **Group Housing Search** - coordinate with roommates before finding place

---

## MVP Feature Matrix

### Phase 1: Core MVP (Launch-Ready)

#### 1.1 Landing Page & Onboarding
- [ ] Hero section with value proposition
- [ ] City selector (Dallas, Austin, Houston, San Jose, Jersey City)
- [ ] User type selector (Looking for Room / Listing a Room / Finding Roommates)
- [ ] Simple onboarding flow by user type

#### 1.2 Room Listings (Core)
- [ ] List view with filters:
  - City/neighborhood
  - Price range (min/max)
  - Move-in date
  - Room type (Private/Shared/Master)
  - Freedom Score range
- [ ] Listing detail page:
  - Photo gallery
  - Freedom Score breakdown
  - Household preferences (diet, substances, etc.)
  - Current roommate profiles (if any)
  - Amenities & utilities
  - Apply button
- [ ] Create listing flow:
  - Step 1: Location & basics
  - Step 2: Room details & photos
  - Step 3: Freedom Score questions
  - Step 4: Household preferences
  - Step 5: Pricing & availability
  - Step 6: Review & publish

#### 1.3 Roommate Profiles
- [ ] Profile creation wizard
- [ ] Profile display with compatibility indicators
- [ ] Browse roommates in your target city
- [ ] Basic matching score

#### 1.4 Messaging System
- [ ] Conversation list view
- [ ] Chat interface (send/receive messages)
- [ ] Unread message indicators
- [ ] Message notifications (email fallback)

#### 1.5 Room Applications
- [ ] Apply to listing with intro message
- [ ] Application status tracking (pending/accepted/rejected)
- [ ] Lister dashboard to review applications
- [ ] Accept/reject workflow

#### 1.6 User Dashboard
- [ ] My listings (for hosts)
- [ ] My applications (for seekers)
- [ ] My conversations
- [ ] Profile settings

### Phase 2: Post-MVP Enhancements

#### 2.1 Trust & Safety
- [ ] ID verification badges
- [ ] Profile completeness score
- [ ] Report user/listing functionality
- [ ] Admin moderation queue

#### 2.2 Enhanced Discovery
- [ ] Saved searches with notifications
- [ ] "Similar listings" recommendations
- [ ] Map view of listings
- [ ] Roommate compatibility quiz

#### 2.3 Communication
- [ ] Video call scheduling integration (Calendly/Cal.com)
- [ ] Virtual tour links
- [ ] Group chat for roommate groups

#### 2.4 Groups Enhancement
- [ ] Public group discovery
- [ ] Group compatibility scoring
- [ ] Joint room applications

### Phase 3: Advanced Features (Future)

#### 3.1 Agreements & Documents
- [ ] Sublease agreement templates
- [ ] E-signature integration
- [ ] Document storage

#### 3.2 External Integrations
- [ ] Import listings from Facebook Marketplace
- [ ] Zillow/Apartments.com data enrichment

### Phase 4: Monetization (Last Priority)

#### 4.1 Payments
- [ ] Stripe integration for deposits
- [ ] Escrow service
- [ ] Premium listings
- [ ] Subscription plans

---

## Technical Implementation Order

### Sprint 1: Foundation
1. Fix existing room listing pages (rooms/page.tsx, rooms/[id]/page.tsx, rooms/post/page.tsx)
2. Implement room search with filters
3. Complete listing detail page with Freedom Score display

### Sprint 2: Roommates
1. Fix roommate profile pages
2. Implement roommate browse/search
3. Add basic compatibility indicators

### Sprint 3: Communication
1. Implement messaging UI (app/messages/page.tsx exists)
2. Add conversation list
3. Real-time or polling message updates
4. Email notifications for new messages

### Sprint 4: Applications
1. Room application flow
2. Lister application management
3. Status tracking

### Sprint 5: Dashboard
1. User dashboard consolidation
2. My listings management
3. My applications tracking

### Sprint 6: Polish
1. Loading states (loading.tsx files exist)
2. Error handling
3. Empty states
4. Mobile responsiveness

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Listings created | 50+ |
| User signups | 200+ |
| Messages sent | 500+ |
| Applications submitted | 100+ |
| Successful matches | 10+ |

---

## Competitive Differentiation

| Feature | Ohana | Nivasesa |
|---------|-------|----------|
| Target audience | College students | South Asian community |
| Cultural fit | Generic | Language, diet, lifestyle |
| Freedom Score | N/A | 0-100 scoring system |
| Realtor network | No | Yes |
| Group housing | No | Yes |
| Verification | ID check | Community trust |
| Pricing | Transaction fees | TBD |

---

## Sources

- [Ohana Homepage](https://liveohana.ai/)
- [Ohana - How it Works](https://liveohana.ai/how-it-works)
- [Ohana Crunchbase](https://www.crunchbase.com/organization/ohana-c753)
- [Ohana Trustpilot Reviews](https://www.trustpilot.com/review/liveohana.ai)
- [The Santa Clara - Ohana Article](https://www.thesantaclara.org/blog/ohana-aims-to-ease-summer-subleasing)
- [Skift - Ohana NYC Growth](https://skift.com/2024/06/17/former-airbnb-execs-back-subletting-startup-in-nyc/)
