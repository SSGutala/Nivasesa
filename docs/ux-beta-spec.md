# UI/UX Beta Specification Document

**Project:** NVS-R01
**Product:** Nivaesa
**Document Type:** UI/UX Specification
**Owner:** Sri
**Date:** 12/30/2025
**Version:** 2.0 (Public Beta / Launch)

---

## 1. Purpose & Scope

This document defines the complete user interface and user experience for the **Public Beta (v2.0)** of Nivaesa, a peer-to-peer leasing and subleasing platform.

### Version 2.0 Includes

- Account creation and authentication
- Map-based housing discovery
- Lease and sublease listing types
- Tenant, subleaser, landlord, and agent roles
- Listing creation, verification, and lifecycle management
- Consent-based messaging and in-platform video calls
- **Mandatory virtual meet & greet prior to transaction**
- Platform-native chat, scheduling, and video
- Escrow-backed transactions
- Optional agent-assisted leasing (lease-only)

### Not Included in Version 2.0

- AI matching
- Subscriptions
- Identity verification

---

## 2. User Types & Roles

### 2.1 User Types

| Role | Description |
|------|-------------|
| **Tenant / Renter** | Users seeking leased or subleased housing |
| **Subleaser (Host)** | Users offering rooms or properties for sublease |
| **Landlord** | Property owners offering lease-based listings |
| **Agent (Lease-Only)** | Licensed agents who access tenant leads through a paid dashboard |
| **Admin (Internal)** | Platform administrators for moderation, support, and compliance |

> A single user may hold multiple roles (e.g., renter + subleaser).

---

## 3. Global UX Principles

- Trust-first, low-pressure design
- Consent-based communication
- Transparency over persuasion
- Compatibility before conversation
- Platform-native interactions (chat, video, transactions)
- Calm, editorial visual language
- Mobile-first, map-centric experience
- Culturally aware but inclusive

---

## 4. Information Architecture

### 4.1 Global Navigation (Logged Out)

- Home
- Explore
- How It Works
- Safety
- Log In
- Join

### 4.2 Global Navigation (Logged In – Tenant)

- Explore
- Saved
- Messages
- Trips / Applications
- Profile

### 4.3 Global Navigation (Logged In – Host / Landlord)

- Dashboard
- My Listings
- Messages
- Transactions
- Profile

### 4.4 Agent Navigation

- Lead Dashboard
- Locked Leads
- Unlocked Leads
- Billing
- Profile

---

## 5. Authentication & Onboarding

### 5.1 Sign-Up Flow

**Step 1: Choose Intent**
- I'm looking for a place
- I want to list a place

**Step 2: Account Creation**
- Full name
- Email
- Password
- Phone number
- Accept Terms & Privacy Policy

**Step 3: Role-Specific Onboarding**
- Lightweight guided setup based on role
- Can be skipped and completed later

---

## 6. Discovery Experience (Tenants)

### 6.1 Explore Screen (Primary Entry Point)

**Layout:**
- Full-screen interactive map
- Listings displayed as price-based pins
- Toggle: Lease / Sublease
- Toggle between map and list view

**Search Controls:**
- Location (auto-detect or manual)
- Move-in date
- Filters

### 6.2 Filters

| Category | Options |
|----------|---------|
| Budget | Min/Max price |
| Lease duration | Short-term, Long-term |
| Furnishing | Furnished, Unfurnished |
| Availability window | Date range |
| Household norms & routines | Various lifestyle options |
| Dietary preferences | Vegetarian, etc. |
| Language comfort | Language options |
| Amenities | Various amenity filters |

---

## 7. Listing Cards & States

### 7.1 Listing Card

**Displays:**
- Primary image
- Price
- Neighborhood
- Lease or sublease badge
- Availability state:
  - `Available`
  - `In Discussion`
  - `Unavailable`
- Interest count
- Featured badge (if applicable)

### 7.2 Listing Detail Page

**Sections:**
- Media gallery
- Overview (price, duration, availability)
- Household & space details
- Map preview
- Host profile preview
- Demand indicators

**Primary CTA:**
- `Express Interest` (if available)
- `Join Waitlist` (if in discussion)

---

## 8. Express Interest & Matching Flow

### 8.1 Express Interest

- Optional message input
- System confirmation:
  > "Your interest has been sent. You'll be notified if the host responds."

> **Note:** No contact details are shared at this stage.

### 8.2 Acceptance Flow

When a host accepts:
1. Chat thread is created
2. Listing enters `In Discussion` state
3. System message auto-posted:
   > "A virtual meet & greet is required before proceeding."

---

## 9. Messaging & Video Communication

### 9.1 Chat Behavior

- Messaging enabled only after acceptance
- Persistent system banner:
  > "Virtual meet & greet required before proceeding."

### 9.2 Virtual Meet & Greet

- Scheduled directly in chat
- Hosted inside Nivaesa
- **Supports:**
  - Face-to-face conversation
  - Optional virtual walkthrough

### 9.3 Post-Meet Behavior

After meet completion:
- Free messaging unlocked
- Additional video calls allowed
- In-person visits may be scheduled

---

## 10. Transactions & Escrow

### 10.1 Payment Flow

```
1. Tenant initiates payment from chat or listing
2. Funds held in escrow
3. Host confirms move-in
4. Escrow releases payment minus platform fee
```

### 10.2 Enforcement UX

- Persistent reminders to complete transaction in-platform
- Host dashboard blocks "completed" status until escrow clears
- Messaging nudges discourage off-platform settlement

---

## 11. Host / Landlord Experience

### 11.1 Host Dashboard

**Widgets:**
- Active listings
- New inquiries
- Listings in discussion
- Transactions
- Earnings

### 11.2 Create Listing

**Required Fields:**
- Address & map pin
- Lease or sublease selection
- Pricing
- Dates
- Photos
- Description
- Filters & norms

### 11.3 Listing Verification

- Backend review
- Status: `Pending` → `Approved` / `Rejected`
- Notification sent upon completion

---

## 12. Agent-Assisted Leasing

### 12.1 Tenant Opt-In

Lease listings display:
> "Work with an agent (optional)"

### 12.2 Agent Dashboard

- Accessed via `agent.nivaesa.com`
- Leads initially locked
- Lead unlock requires payment
- Full tenant profile revealed after unlock

---

## 13. Waitlists & Demand Signals

- Listings in discussion allow waitlist sign-ups
- Waitlisted users notified if availability changes
- Interest counts displayed publicly

---

## 14. Notifications

### Triggered by:
- Interest accepted
- Video scheduled
- Message received
- Transaction update
- Waitlist availability

### Delivery:
- In-app
- Email

---

## 15. Admin Experience (Internal)

**Admins can:**
- Moderate listings
- Review flagged chats
- Manage transactions
- Approve or revoke agents
- View platform analytics

---

## 16. Accessibility & Responsiveness

- Mobile-first layouts
- Touch-optimized map interactions
- High-contrast typography
- Keyboard-navigable flows

---

## 17. Out of Scope for Version 2.0

- AI-based matching
- Identity verification
- Subscriptions
- Long-term contract management

---

## 18. Acceptance Criteria

- [ ] Users can browse without accounts
- [ ] Listings render correctly on map & list
- [ ] Express-interest → acceptance → chat flow works end-to-end
- [ ] Video meet & greet cannot be bypassed
- [ ] Escrow transactions complete successfully
- [ ] Agent lead unlocks function correctly

---

## 19. Versioning Roadmap

| Version | Focus |
|---------|-------|
| **v2.0** | Public Beta / Transactions |
| **v2.1** | Identity & trust signals |
| **v2.2** | Advanced host tools |
| **v3.0** | Intelligent matching & recommendations |
