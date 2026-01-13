# Product Requirements Document — NVS-R01

**Project:** NVS-R01
**Company:** Nivaesa Inc.
**Division:** Community & Housing Platforms Division
**Product Type:** Peer-to-peer leasing & subleasing platform
**Project Manager:** Sri
**Date of Creation:** 12/30/2025
**Version:** 1.1

---

## Introduction

Finding housing—whether through leasing or subleasing—is a high-friction process that requires trust, transparency, and alignment of expectations. While many platforms facilitate listing discovery, few provide structured mechanisms to align household norms, lifestyle compatibility, and communication expectations before commitment.

Within South Asian communities, housing decisions are often shaped by language comfort, dietary practices, household routines, family involvement, and expectations around daily living. Existing platforms either ignore these factors or push users toward informal channels such as WhatsApp groups and Facebook communities. These channels provide cultural familiarity but lack verification, accountability, safety, and structured workflows.

At the same time, landlords and subleasers of all backgrounds increasingly seek renters who align with household expectations but lack tools to communicate those norms clearly and safely. This often results in mismatches, deal fall-throughs, or off-platform negotiations that reduce trust and platform accountability.

**Nivaesa** is a peer-to-peer leasing and subleasing platform designed to surface compatibility signals upfront while remaining inclusive and legally compliant. The platform supports both leases (landlords) and subleases (individual hosts), clearly differentiated within discovery. Users may browse freely, but structured communication, video calls, and transactions occur only within the platform.

Nivaesa also introduces optional agent-assisted leasing for landlord listings, allowing licensed agents to access qualified leads through a paid lead-unlock model—without positioning Nivaesa as a broker or property manager.

---

## Objectives

### Primary Objectives

- Enable users to discover lease and sublease opportunities through a unified platform
- Support housing use cases including:
  - Temporary stays
  - Short-term co-leases
  - Long-term leases
- Enable landlords and subleasers to clearly communicate household norms, expectations, and logistics
- Introduce lifestyle, language, dietary, and routine compatibility as first-class discovery dimensions
- Reduce reliance on informal, unsafe, or off-platform housing channels
- Support remote decision-making through in-platform messaging and video calls
- Enforce platform-native transactions to enable escrow protection and monetization
- Provide map-based discovery with availability states, demand signals, ranking, and waitlists

### Secondary Objectives

- Validate demand for culture- and lifestyle-aware matching
- Measure trust, perceived safety, and match quality
- Test willingness to pay for featured placement and agent assistance
- Evaluate transaction completion rates and escrow adoption
- Establish feedback loops via post-interaction surveys

---

## Stakeholders

### Target Users (Tenants / Renters)
Individuals seeking leased or subleased housing who value trust, clarity, and compatibility. While marketed toward South Asian communities, participation is open to all users.

### Target Users (Hosts / Subleasers)
Individuals offering rooms or properties for sublease who want a structured, transparent way to manage inquiries and screen renters.

### Target Users (Landlords)
Property owners offering lease-based listings, with optional access to agent assistance.

### Agents (Lease-Only)
Licensed agents who access qualified leads through a paid lead-unlock system.

### Product & Engineering
Responsible for discovery, listing lifecycle, chat, video, escrow, agent systems, and dashboards.

### Design
Responsible for trust-centered UX, map/list views, communication flows, and transaction clarity.

### Compliance & Risk
Ensures the platform operates strictly as a marketplace and escrow facilitator—not a broker.

---

## Use Cases

### User Story #1: Maya (Tenant / Renter)

Maya is a graduate student seeking a short-term sublease near her university. She wants clarity on household norms and prefers meeting the host before committing.

**Flow:**
1. Browses listings freely
2. Filters by location, dates, and lifestyle attributes
3. Expresses interest
4. After acceptance, joins a platform-hosted video call
5. Completes payment through escrow

### User Story #2: Arjun (Subleaser)

Arjun has a spare room available for a three-month sublease.

**Flow:**
1. Lists the room and defines expectations
2. Receives multiple inquiries
3. Reviews interest requests
4. Conducts video calls
5. Completes the agreement through the platform dashboard

### User Story #3: Priya (Landlord)

Priya owns an apartment building and lists a unit for lease. She opts into agent assistance.

**Flow:**
1. Her listing generates interest
2. Qualified leads are routed to agents who unlock them through a paid dashboard
3. Final transactions are completed via Nivaesa escrow

---

## Aspects

### 1. Platform Design

| ID | Requirement | Priority |
|----|-------------|----------|
| 1.1 | The platform shall support both lease and sublease listings, clearly differentiated in discovery | P10 |
| 1.2 | Browsing and viewing listings shall be accessible without account creation | P9 |
| 1.3 | Listings shall emphasize lifestyle compatibility, household norms, and expectations | P10 |
| 1.4 | The design shall prioritize trust, calm, and transparency over urgency or pressure | P9 |
| 1.5 | Map-based discovery shall be a primary navigation mode | P10 |
| 1.6 | Listings shall visually surface availability state, interest count, and ranking signals | P9 |
| 1.7 | The platform shall remain inclusive and legally compliant while being culturally intentional | P10 |

### 2. Discovery & Search

| ID | Requirement | Priority |
|----|-------------|----------|
| 2.1 | Users shall search listings by city, ZIP code, or interactive map | P10 |
| 2.2 | Users shall toggle between lease and sublease listings | P10 |
| 2.3 | Filters shall include: Budget, Lease duration, Move-in date, Language comfort, Dietary preferences, Household routines, Amenities and facilities | P9 |
| 2.4 | Search results shall update dynamically by location | P9 |

### 3. Accounts & Roles

| ID | Requirement | Priority |
|----|-------------|----------|
| 3.1 | Users may browse without accounts | P9 |
| 3.2 | Account creation shall be required to: Contact hosts, Message, Video call, Transact, List properties | P10 |
| 3.3 | Supported account roles: Tenant/Renter, Subleaser, Landlord, Agent (lease-only) | P10 |

### 4. Listings & Verification

| ID | Requirement | Priority |
|----|-------------|----------|
| 4.1 | Hosts must create an account to list | P10 |
| 4.2 | Listings shall require: Photos, Description, Dates, Location, Pricing, Required and optional filters | P10 |
| 4.3 | Listings shall undergo backend verification prior to publishing | P9 |
| 4.4 | Hosts shall receive notifications upon approval | P9 |

### 5. Communication & Matching

| ID | Requirement | Priority |
|----|-------------|----------|
| 5.1 | Expressing interest shall create a platform-native chat thread | P10 |
| 5.2 | System-generated messages shall: Confirm interest, Prompt video call scheduling | P10 |
| 5.3 | Video calls shall occur within the platform | P10 |
| 5.4 | After the initial call, users may: Continue messaging, Initiate additional video calls, Schedule in-person visits | P9 |

### 6. Listing States, Ranking & Waitlists

| ID | Requirement | Priority |
|----|-------------|----------|
| 6.1 | Listings shall have availability states: Available, In Discussion, Unavailable/Leased | P10 |
| 6.2 | Listings in discussion may accept waitlist signups | P9 |
| 6.3 | Waitlisted users shall be notified if availability changes | P9 |
| 6.4 | Demand indicators shall display interest count | P8 |

### 7. Transactions & Escrow

| ID | Requirement | Priority |
|----|-------------|----------|
| 7.1 | All lease and sublease payments shall occur through the platform | P10 |
| 7.2 | Payments shall be held in escrow until move-in confirmation | P10 |
| 7.3 | Platform fees shall be deducted upon escrow release | P10 |
| 7.4 | Transaction enforcement mechanisms shall discourage off-platform completion | P9 |

### 8. Agent Assistance (Lease-Only)

| ID | Requirement | Priority |
|----|-------------|----------|
| 8.1 | Agent assistance shall be optional and available only for lease listings | P10 |
| 8.2 | Interested user data shall be routed to agents upon opt-in | P9 |
| 8.3 | Agents shall access leads via a dedicated subdomain dashboard | P9 |
| 8.4 | Agents must pay a lead-unlock fee to access full details | P10 |

### 9. Surveys & Feedback

| ID | Requirement | Priority |
|----|-------------|----------|
| 9.1 | Post-interaction surveys shall be triggered after: Video calls, Completed transactions | P9 |
| 9.2 | Survey context shall infer user role automatically | P10 |

### 10. Security & Access Control

| ID | Requirement | Priority |
|----|-------------|----------|
| 10.1 | Users may only access data tied to their account | P10 |
| 10.2 | Contact details shall not be shared prior to acceptance and payment intent | P10 |
| 10.3 | Permissions shall be enforced at the backend level | P10 |

---

## Open Questions

- Should ID verification be mandatory in V1?
- Should escrow be required for all subleases?
- How aggressively should off-platform behavior be discouraged?
- Should agent pricing be flat or dynamic?

---

## Explanation of Terms

| Term | Definition |
|------|------------|
| **Consent-Based Connection** | Communication enabled only after mutual acceptance |
| **Sublease** | Temporary rental from a non-owner host |
| **Lease** | Rental directly from a landlord |
| **Escrow** | Funds held until move-in confirmation |
| **Agent Assistance** | Optional paid lead routing for lease listings |
