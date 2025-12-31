# Product Requirements Document
**Project:** NVS-R01
**Company:** Nivaesa Inc.
**Division:** Community & Housing Platforms Division
**Product Type:** Peer-to-peer housing & roommate discovery platform (Ohana-type)
**Project Manager:** Sri
**Date of Creation:** 12/30/2025
**Version:** 1.0

## Introduction
Finding roommates or rental housing—whether for temporary stays, short-term co-leases, or long-term leases—is challenging for many people, especially when trust, lifestyle compatibility, and household expectations significantly affect living arrangements.

Within South Asian communities, housing decisions are often shaped by factors such as language comfort, dietary practices, cultural norms, household structure, and shared expectations around daily living. While existing co-leasing and housing platforms serve a broad audience, they frequently lack the contextual signals required to evaluate compatibility along these dimensions. As a result, users rely heavily on informal channels such as WhatsApp groups, Facebook groups, and personal referrals. These channels may provide cultural familiarity but lack safety, verification, structure, and accountability.

At the same time, many hosts—regardless of their own background—are open to renting to culturally aligned groups but lack a safe, structured way to communicate household norms and expectations. Existing platforms do not adequately support transparent disclosure of lifestyle compatibility, leading to mismatches, friction, or unsafe experiences, particularly for users making remote decisions.

In addition, users increasingly expect modern housing discovery experiences similar to established real estate platforms, including map-based search, location-aware listings, transparent availability states, ranking signals, and waitlists for high-demand listings.

This product is a peer-to-peer housing discovery platform designed and marketed for South Asian communities, while remaining open and accessible to all users. Any host or renter may participate. Matching occurs through transparency, preferences, and mutual consent rather than enforced demographic restrictions. The platform supports temporary stays, short-term co-leases (e.g., internships or transitional housing), and long-term leases for students, families, couples, singles, and groups. Users discover rooms, rentals, and compatible roommates through verified profiles, culturally relevant filters, map-based search, and direct communication—including in-platform video calls—without reliance on informal networks.

## Objectives
The objective of Project NVS-R01 is to design, build, and launch a trust-first, peer-to-peer housing discovery platform tailored to South Asian communities while remaining inclusive and legally compliant.

### Primary Objectives
- Enable renters and room-seekers to discover rooms, rentals, and compatible roommates for temporary stays, short-term co-leases, and long-term leases.
- Support housing use cases including internships, transitional housing, students, families, couples, singles, and groups.
- Enable hosts and landlords of any background to list rooms or rental spaces and clearly communicate household norms, expectations, and preferences.
- Introduce cultural, language, dietary, and lifestyle compatibility as first-class discovery dimensions without enforcing demographic restrictions.
- Reduce reliance on informal and unsafe housing channels.
- Support remote decision-making through rich listings and in-platform video calls.
- Provide map-based discovery with transparent availability states, ranking signals, and waitlists.
- Maintain free discovery and communication while offering optional paid visibility enhancements.

### Secondary Objectives
- Validate demand for culture- and lifestyle-aware matching.
- Measure trust, perceived safety, and match quality relative to general-purpose platforms.
- Test willingness to pay for boosted listings and featured placement.
- Establish continuous feedback loops through post-interaction surveys.

## Stakeholders
**Target Users (Renters / Room-Seekers):**
Individuals seeking temporary housing, short-term co-leases, or long-term rental arrangements who value trust, lifestyle compatibility, and cultural familiarity. While the platform is marketed toward South Asian communities, participation is open to all users.

**Target Users (Hosts / Landlords):**
Individuals offering rooms or rental spaces—of any background—who want a safer, more transparent way to connect with renters and communicate household norms and expectations.

**Product & Engineering:**
Responsible for platform architecture, peer-to-peer connection logic, map-based search, listing state management, account management, messaging, video, and survey systems.

**Design:**
Responsible for discovery flows, listing presentation, map interactions, availability indicators, and communication UX aligned with trust and clarity.

**Marketing & Growth:**
Responsible for community acquisition, university partnerships, diaspora outreach, and user growth.

**Compliance & Risk:**
Ensures the platform operates strictly as a discovery and communication platform and does not act as a broker, agent, or property manager.

## Use Cases

### User Story #1: Maya (Room-Seeker)
Maya is a graduate student seeking housing near her university. She is open to both short-term and long-term arrangements and prefers living in a household aligned with her lifestyle and cultural expectations. She is uncomfortable using informal group chats or general-purpose platforms due to safety concerns.
Maya uses the platform to search via map and list view, filtering by budget, lease duration, language, and lifestyle preferences. She reviews detailed listings, sees how many others have expressed interest, and checks availability status. After expressing interest and receiving acceptance, she connects with the host via an in-platform video call before committing.

### User Story #2: Arjun (Host)
Arjun has a spare room available for either a short-term co-lease or a longer lease. He creates a listing, specifies availability, lease duration, household norms, and preferences.
He receives multiple interest requests, manages conversations, and sees demand indicators. When the listing enters discussion with one renter, others may join a waitlist. If the arrangement falls through, waitlisted users are notified.

## Aspects

### 1. Platform Design
- **1.1** The platform shall present verified room, rental, and roommate listings only. (P10)
- **1.2** Browsing, searching, and viewing listings shall be free and accessible without account creation. (P9)
- **1.3** Listings and profiles shall emphasize lifestyle, language, dietary practices, and household norms rather than protected characteristics. (P10)
- **1.4** The design shall emphasize trust, clarity, and calm, avoiding high-pressure or transactional UX. (P8)
- **1.5** The platform shall support map-based discovery as a primary navigation mode. (P10)
- **1.6** Listings shall visually surface availability status, interest count, ranking signals, and featured placement where applicable. (P9)
- **1.7** The platform shall be inclusive and open to all users while being designed and marketed to serve South Asian communities. (P10)

### 2. Functionality
- **2.1** Users shall be able to search rooms, rentals, and roommate listings by city, ZIP code, or interactive map. (P10)
- **2.2** Listings shall dynamically update based on current location or searched location. (P10)
- **2.3** Users shall be able to toggle between map view and list view. (P9)
- **2.4** Filters shall include budget, lease duration (temporary, short-term, long-term), language, dietary preferences, cultural background context, and lifestyle attributes. (P9)
- **2.5** Users shall be able to express interest through a consent-based request system. (P10)
- **2.6** Contact details shall only be shared after mutual acceptance. (P10)
- **2.7** In-platform messaging shall be enabled after acceptance. (P10)
- **2.8** In-platform video calls shall be available after acceptance. (P10)

### 3. Listing States, Ranking & Waitlists
- **3.1** Each listing shall have a clearly defined availability state:
    - Available
    - In Discussion
    - Unavailable / Leased (P10)
- **3.2** Listings marked “In Discussion” shall remain visible but restrict new acceptances. (P9)
- **3.3** Users may join a waitlist for listings in discussion. (P10)
- **3.4** Waitlisted users shall be notified if a listing becomes available again. (P9)
- **3.5** Listings shall display demand signals, including number of users who have expressed interest. (P8)
- **3.6** Listings shall be ranked based on relevance signals such as location match, filters, availability, and user preferences. (P9)

### 4. Accounts & Persistence
- **4.1** Users may browse without creating an account. (P9)
- **4.2** Account creation shall be required to save searches, join waitlists, message, participate in video calls, or view history. (P10)
- **4.3** Supported account types:
    - Renter / Room-Seeker
    - Host / Landlord
- **4.4** Account type shall be selected at signup and may be expanded later. (P8)

### 5. Monetization
- **5.1** Core discovery, messaging, and video communication shall remain free. (P10)
- **5.2** Optional paid enhancements shall include:
    - Boosted listings
    - Featured placement
    - Enhanced listing presentation
- **5.3** Featured listings shall be clearly labeled and shall not override availability or suppress organic results entirely. (P9)

### 6. Surveys & Feedback
- **6.1** The platform shall trigger short surveys after key interactions, including accepted connections and completed video calls. (P9)
- **6.2** Survey context shall infer user role automatically where possible. (P10)
- **6.3** Survey data shall be stored with interaction metadata for product insights. (P8)

### 7. Access Control & Security
- **7.1** Users shall only access conversations and data associated with their own account. (P10)
- **7.2** Contact details shall never be exposed prior to mutual acceptance. (P10)
- **7.3** Availability changes, waitlists, and ranking updates shall be reflected in real time. (P9)
- **7.4** All permissions shall be enforced at the backend level. (P10)

## Open Questions
- Should identity verification be mandatory or optional in V1?
- Should video calls be time-limited?
- Should boosts be time-based or impression-based?
- What moderation or safety signals should trigger review?

## Milestones
- **Concept approval:** 01/05/2026
- **Design freeze:** 01/20/2026
- **Engineering beta:** 02/05/2026
- **Public beta launch:** 02/20/2026

## Explanation of Terms
- **Consent-Based Connection:** A peer-to-peer interaction enabled only after mutual acceptance.
- **Short-Term Co-Lease:** Temporary housing arrangement, often for internships or transitional periods.
- **Long-Term Lease:** Extended housing arrangement for students, families, couples, singles, or groups.
- **Availability State:** The current status of a listing (Available, In Discussion, Unavailable).
- **Waitlist:** A queue of interested users notified if a listing becomes available.
- **Featured Listing:** A paid enhancement that increases visibility while preserving transparency.
- **Interest Count:** A visible signal indicating how many users have expressed interest.
