# UI/UX Alpha Specification Document

**Project:** NVS-R01
**Product:** Nivaesa Rooms (Alpha Site / Temporary Pre-Launch)
**Document Type:** UI/UX Specification
**Owner:** Sri
**Date:** 12/29/2025
**Version:** 1.0

---

## 1. Purpose of This Document

This document defines the user interface and user experience specifications for the **temporary one-page alpha website** for Project NVS-R01.

### Goals of the Alpha Site

- Clearly communicate what the product is and who it is for
- Capture early supply (hosts) and demand (tenants / roommates)
- Segment users by role at signup
- Collect structured data in a filterable backend database
- Enable referral-driven early growth

> **Note:** This is not the full product UI. This is a pre-launch intake, validation, and waitlist experience.

---

## 2. Target Users

### 2.1 Tenants / Roommates
- Looking for temporary housing, short-term co-leases, or long-term stays
- Often relocating, starting a new job, internship, or school
- Care about compatibility, safety, and household expectations
- Prefer structured alternatives to WhatsApp and Facebook groups

### 2.2 Hosts / Landlords
- Offering rooms or shared living spaces
- May support temporary, short-term, or long-term stays
- Want fewer mismatches and more respectful inquiries
- Want to clearly communicate expectations up front

> **Note:** The platform is marketed toward South Asian communities but is open to all users.

---

## 3. One-Page Website Structure

### 3.1 Global Layout
- Single scrolling page
- Sticky header with primary call-to-action
- Mobile-first, fully responsive design
- Calm, clean, trust-oriented visual style

---

## 4. Page Sections (Top to Bottom)

### Section 1: Header / Navigation

**Elements:**
- Logo (left)
- Primary CTA button (right): `Join Network`

**Behavior:**
- Clicking CTA opens Join Network modal or full-screen overlay
- Header remains sticky on scroll

---

### Section 2: Hero Section

| Element | Content |
|---------|---------|
| **Headline** | Find rooms and roommates with shared expectations. |
| **Subheadline** | A trust-first housing platform designed around compatibility, clarity, and consent — built for South Asian communities and open to everyone. |
| **Primary CTA** | Join Network |
| **Secondary CTA** | Learn How It Works (scrolls to Section 5) |

---

### Section 3: What This Is

**Content (three bullets or cards):**
- Find rooms and shared rentals for temporary or long-term stays
- Discover roommates based on lifestyle, language, and household norms
- Connect only when both sides consent — no random messages

**Purpose:** Set expectations and clearly differentiate from generic housing platforms.

---

### Section 4: Who It's For

**Two side-by-side cards:**

| Card | Text | CTA |
|------|------|-----|
| **Tenants / Roommates** | Looking for a room, shared space, or roommate. Temporary stays, internships, or long-term housing. Want compatibility and safety. | Join as a Tenant / Roommate |
| **Hosts / Landlords** | Have a room or shared living space. Want better-fit tenants. Prefer structured, respectful inquiries. | Join as Host |

**Behavior:** Both CTAs open Join Network flow with the user type pre-selected.

---

### Section 5: How It Works

**Three-step visual:**
1. Browse and filter by location, timing, and preferences
2. Express interest (no contact shared yet)
3. Connect after mutual acceptance

---

### Section 6: Safety & Trust

**Bullet points:**
- Consent-based connections
- Structured profiles (not anonymous DMs)
- Clear household expectations
- Designed to replace unsafe informal groups

---

### Section 7: FAQ (Short)

- Is this only for South Asians?
- Is it free?
- What cities are supported?
- Is this for short-term or long-term stays?

---

### Section 8: Final CTA

| Element | Content |
|---------|---------|
| **Headline** | Join early and help shape the platform. |
| **Button** | Join Network |

---

## 5. Join Network Flow

### 5.1 Entry Triggers
- `Join Network` (header)
- `Join as Host`
- `Join as Tenant / Roommate`

### 5.2 User Type Selection Screen

**Layout:**
Two large selectable cards:
- I'm a Host / Landlord
- I'm looking for a Room / Roommates

**Behavior:**
- Selecting a card loads the corresponding survey
- Progress indicator visible (e.g., "Step 1 of 2")

---

## 6. Surveys (Alpha / Intake Only)

### 6.1 Host / Landlord Survey (Alpha)

#### Section A: Contact Information

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Email | Email | Yes |
| Phone Number | Phone | No |
| Preferred Contact Method | Single select (Email, Text, WhatsApp) | Yes |

#### Section B: Listing Context

| Field | Type | Required |
|-------|------|----------|
| City | Text | Yes |
| State | Dropdown (US states) | Yes |
| ZIP Code | Numeric / ZIP validation | Yes |
| Type of Space Offered | Single select (Private room, Entire apartment/home, Shared room) | Yes |
| Stay Duration(s) Offered | Multi-select (Temporary 1–4 weeks, Short-term 1–3 months, Long-term 6+ months) | Yes |
| Current Availability Status | Single select (Available now, Available soon, Not yet / just exploring) | Yes |
| Earliest Availability Date | Date picker | No |

#### Section C: Additional Context

| Field | Type | Required |
|-------|------|----------|
| Anything else you'd like to share | Long text | No |

#### Section D: Account Creation Confirmation

**Message:**
> Your account has been successfully created.
>
> Nivaesa is currently under development. You will receive an email with next steps and updates as the platform progresses. Once Nivaesa is fully launched, you will be able to complete your profile, upload photos and videos of your property, add detailed listing information, and publish your space to begin attracting interested renters.

**Referral Section:**
> Invite others to join Nivaesa using your personal referral link.
>
> If someone signs up using your link:
> - You'll receive a free profile boost for **14 days** at launch
> - They'll receive a free profile boost for **7 days** at launch

**Buttons:**
- Copy Referral Link
- Share via Email / WhatsApp

---

### 6.2 Tenant / Roommate Survey (Alpha)

#### Section A: Contact Information

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | Yes |
| Email | Email | Yes |
| Phone Number | Phone | No |
| Preferred Contact Method | Single select (Email, Text, WhatsApp) | Yes |

#### Section B: Search Context

| Field | Type | Required |
|-------|------|----------|
| Target City | Text | Yes |
| Target State | Dropdown (US states) | Yes |
| Target ZIP Code (if known) | Numeric | No |
| Move-In Timeframe | Single select (ASAP, 2–4 weeks, 1–3 months, Just browsing) | Yes |
| Intended Stay Duration | Single select (Temporary 1–4 weeks, Short-term 1–3 months, Long-term 6+ months) | Yes |
| What Are You Looking For? | Single select (A room, A roommate to co-lease, Either) | Yes |

#### Section C: Optional Context

| Field | Type | Required |
|-------|------|----------|
| Do you prefer living with people who share a similar cultural background? | Single select (Yes, No, Not sure) | No |
| Anything else you'd like to share | Long text | No |

#### Section D: Submission Confirmation

**Message:**
> Thank you for joining.
>
> Nivaesa is currently under development. We'll reach out as we launch in your area and share next steps when the platform is ready.

**Referral Section:**
> Invite others who may be looking for housing or roommates.
>
> If someone signs up using your personal referral link:
> - You'll receive a free profile boost for **14 days** at launch
> - They'll receive a free profile boost for **7 days** at launch

---

## 7. Submission Confirmation Screen (Global)

**Message:**
> Thank you for joining. We'll reach out as we launch in your area.

**Referral Section:**
- Share your personal referral link with friends or family
- Referrer reward: 14-day free profile boost
- Referred reward: 7-day free profile boost
- Boosts will activate when Nivaesa officially launches

**Button:** Copy Referral Link

---

## 8. Backend & Data Storage Requirements

### 8.1 Storage
- Firestore (recommended) or equivalent NoSQL / relational database
- No plain Excel as primary storage

### 8.2 Collections / Tables
- `host_intake_submissions`
- `renter_intake_submissions`
- `referrals`

### 8.3 Required Fields (All User Records)

| Field | Description |
|-------|-------------|
| `submission_id` | Unique identifier |
| `created_at` | Timestamp |
| `user_type` | `host` or `renter` |
| `email` | User email |
| `referral_code` | Generated on submission |
| `referred_by_code` | Nullable |
| + All submitted survey fields | |

### 8.4 Referral Table Schema

**Collection:** `referrals`

| Field | Type |
|-------|------|
| `referral_id` | String |
| `referrer_user_id` | String |
| `referrer_user_type` | String |
| `referrer_email` | String |
| `referral_code` | String |
| `referred_user_id` | String |
| `referred_user_email` | String |
| `created_at` | Timestamp |
| `reward_status` | `pending` or `applied` |
| `referrer_boost_days` | 14 |
| `referred_boost_days` | 7 |

### 8.5 Referral Logic

1. A unique referral link/code is generated for each user upon submission
2. If a new user signs up using a referral link:
   - `referred_by_code` is stored
   - A referral record is created
3. No boosts are applied before launch
4. All rewards remain pending until launch
5. At launch:
   - Boost credits are applied automatically
   - Both users receive email notifications

### 8.6 Admin Requirements

**Admins can:**
- View host and renter submissions
- Filter by city, state, ZIP, duration, availability
- View referral activity
- Export data as CSV

**Optional:**
- Admin email notification when a referral occurs

---

## 9. Acceptance Criteria

- [ ] Alpha site renders correctly on mobile and desktop
- [ ] Join Network flow works without page refresh
- [ ] Correct survey loads based on user type
- [ ] Required fields validate correctly
- [ ] Survey submissions stored correctly
- [ ] Referral codes generated and attributed
- [ ] Confirmation screens display correctly

---

## 10. Out of Scope (Alpha)

- Public profiles
- Listings
- Messaging
- Matching
- Payments
- Authentication beyond survey submission
