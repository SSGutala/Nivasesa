# Product Requirements Document — NVS-L01

**Project:** NVS-L01
**Company:** Nivaesa Inc.
**Division:** Marketplace & Platforms Division
**Product Type:** Real estate agent discovery & inbound lead marketplace
**Project Manager:** Sri
**Date of Creation:** 12/29/2025
**Version:** 1.0

---

## Introduction

The U.S. residential real estate market is highly fragmented, with agent discovery and lead generation dominated by generalized listing platforms, paid advertising, and informal referrals. Buyers and renters seeking South Asian real estate professionals often rely on word-of-mouth, WhatsApp groups, Facebook communities, or local networks to find agents who understand their language preferences, cultural context, and household expectations. These methods lack structure, verification, transparency, and scalability.

At the same time, South Asian real estate agents face increasing lead acquisition costs, inconsistent lead quality, and limited control over when and how they pay for leads. Traditional lead-generation platforms charge upfront subscriptions or sell low-intent leads, forcing agents to assume risk without clear buyer interest.

Observational research and early interviews indicate that buyers who intentionally select agents based on language or cultural alignment demonstrate higher trust and stronger intent. Agents, in turn, express willingness to pay for leads only after a buyer has explicitly expressed interest in working with them.

This product is a **curated agent discovery and inbound lead marketplace** designed and marketed for South Asian communities, while remaining open to all users seeking South Asian real estate professionals. The platform enables buyers to freely search and contact agents, while agents unlock high-intent inbound leads through a transparent, credit-based model. The platform operates strictly as a lead marketplace and does not engage in brokerage, representation, or commission-based transactions.

---

## Objectives

The objective of Project NVS-L01 is to design, build, and launch a trust-first real estate agent discovery platform with a sustainable inbound lead monetization model.

### Primary Objectives

- Establish a trusted, searchable directory of vetted South Asian real estate agents
- Enable buyers and renters to discover and contact agents aligned with their language, cultural context, and service needs
- Provide agents with high-intent inbound leads where payment occurs only after buyer interest is demonstrated
- Drive early adoption through a free tier that allows agents to unlock up to 10 leads at no cost
- Convert agents to paid usage through a credit-based lead unlocking system
- Maintain a legally compliant marketplace model that avoids brokerage or commission-based activity

### Secondary Objectives

- Validate lead quality thresholds and buyer intent signals
- Test pricing sensitivity and conversion behavior
- Establish a foundation for future premium placements, subscriptions, or analytics products

---

## Stakeholders

### Target Users (Buyers / Renters)
Individuals seeking to buy, rent, or invest in property who prefer working with South Asian real estate professionals due to language comfort, cultural familiarity, or trust considerations. No account is required for discovery or inquiry.

### Target Users (Agents)
Licensed South Asian real estate agents operating in the United States who seek predictable, high-intent inbound leads and transparent pricing.

### Product & Engineering
Responsible for platform architecture, agent onboarding, lead locking logic, credit accounting, dashboards, and access control.

### Design
Responsible for buyer-facing discovery flows and agent dashboards aligned with a calm, premium, trust-first aesthetic.

### Marketing & Growth
Responsible for agent acquisition, SEO-driven buyer discovery, and community partnerships.

### Compliance & Risk
Ensures that the platform operates solely as a lead marketplace and does not engage in brokerage, representation, or commission-based transactions unless all applicable licensing and regulatory requirements are met.

---

## Use Cases

### User Story #1: Aditi (Buyer)

Aditi is a 31-year-old professional relocating from Chennai to Dallas. She primarily speaks Tamil and prefers working with a South Asian real estate agent who understands her cultural context and family expectations.

**Flow:**
1. Visits the platform
2. Searches by ZIP code
3. Filters agents by language and specialization
4. Reviews an agent's profile, experience, and bio
5. Submits a short message expressing interest
6. Receives confirmation that the agent will reach out shortly
7. No account creation or payment required

### User Story #2: Gagan (Agent)

Gagan is a licensed real estate agent in New Jersey. He applies to join the platform, is vetted and approved, and completes his profile.

**Flow:**
1. Over the next week, multiple buyers express interest in working with him
2. His first ten leads unlock automatically as part of the free tier
3. After exhausting free unlocks, additional leads appear in a locked state
4. Gagan adds $90 in credits and unlocks three additional leads
5. He contacts each buyer directly outside the platform to continue the relationship

---

## Aspects

### 1. Platform Design

| ID | Requirement | Priority |
|----|-------------|----------|
| 1.1 | The platform shall present a curated directory of vetted South Asian real estate agents only | P10 |
| 1.2 | Buyer discovery and agent contact shall remain free and require no account creation | P9 |
| 1.3 | Agent profile pages shall clearly display qualifications, service areas, languages, and specialties | P9 |
| 1.4 | The overall design shall reflect a calm, premium, trust-first aesthetic | P8 |
| 1.5 | The platform shall be marketed toward South Asian communities while remaining open to all buyers | P10 |

### 2. Functionality

| ID | Requirement | Priority |
|----|-------------|----------|
| 2.1 | Buyers shall be able to search agents by city, ZIP code, or service area | P10 |
| 2.2 | Buyers shall be able to filter agents by language, specialization, and experience | P9 |
| 2.3 | Buyers shall be able to submit a contact form directly from an agent's profile | P10 |
| 2.4 | Each contact submission shall generate a lead associated with a specific agent | P10 |
| 2.5 | Leads shall default to a locked state, hiding buyer contact information | P10 |
| 2.6 | Agents shall unlock leads using free unlocks or paid credits | P10 |

### 3. Lead & Monetization System

| ID | Requirement | Priority |
|----|-------------|----------|
| 3.1 | Each approved agent account shall receive 10 free lead unlocks | P10 |
| 3.2 | After free unlocks are exhausted, agents must maintain a minimum credit balance of $30 | P9 |
| 3.3 | The default cost per lead unlock shall be $30 | P10 |
| 3.4 | The platform shall offer discounted credit packages | P8 |
| 3.5 | Credit balances and unlock history shall be visible in the agent dashboard | P9 |

### 4. Agent Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| 4.1 | Agents shall have access to a private dashboard displaying inbound leads | P10 |
| 4.2 | Locked leads shall display limited metadata (location, inquiry type, timestamp) | P10 |
| 4.3 | Unlocked leads shall reveal full buyer contact details | P10 |
| 4.4 | The dashboard shall provide billing, credit top-up, and transaction history | P9 |
| 4.5 | Agents shall be able to edit profile information and visibility settings | P9 |

### 5. Access Control & Security

| ID | Requirement | Priority |
|----|-------------|----------|
| 5.1 | Agents shall only be able to view leads associated with their account | P10 |
| 5.2 | Buyer contact information shall not be exposed prior to lead unlock | P10 |
| 5.3 | All access controls shall be enforced at the backend level | P10 |

### 6. Compliance & Legal Safeguards

| ID | Requirement | Priority |
|----|-------------|----------|
| 6.1 | The platform shall operate strictly as a lead marketplace | P10 |
| 6.2 | The platform shall not participate in brokerage activity, negotiations, showings, or commission-based transactions | P10 |
| 6.3 | The platform shall not collect a percentage of real estate commissions | P10 |
| 6.4 | Agents are solely responsible for compliance with licensing and real estate laws in their jurisdiction | P10 |

---

## Open Questions

- Should rental inquiries be priced differently from buy/sell leads?
- Should leads expire after a fixed time window?
- Should agents be notified when buyers open or revisit their profile?
- Should lead refunds be allowed in limited scenarios?

---

## Milestones

| Milestone | Date |
|-----------|------|
| Concept approval | 01/05/2026 |
| Design freeze | 01/20/2026 |
| Engineering beta | 02/10/2026 |
| Public beta launch | 02/25/2026 |

---

## Explanation of Terms

| Term | Definition |
|------|------------|
| **Lead (Locked)** | Buyer inquiry with hidden contact details |
| **Lead (Unlocked)** | Buyer inquiry with full contact details visible to the agent |
| **Credit** | Monetary balance used to unlock leads |
| **Free Unlock** | One of ten complimentary lead unlocks granted to agents |
| **Inbound Lead** | A buyer-initiated inquiry expressing interest in a specific agent |
