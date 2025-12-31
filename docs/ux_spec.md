# UX Specification Document - Nivaesa
**Version:** 3.0
**Date:** 2025-12-30
**Scope:** End-to-End User Experience for implemented features.

## 1. Information Architecture (Sitemap)

- **Home (/)**
    - Hero Section (Value Prop + CTA)
    - Search Bar (Quick entry to Explore)
    - Featured Listings
    - Why Choose Nivaesa
    - Footer Links
- **Explore (/explore)**
    - Split View (List + Map)
    - Filters Panel
    - Listing Preview Overlay
- **Listing Detail (/listing/[id])**
    - Image Gallery
    - Property Info & Amenities
    - Household Norms ("Vibe Check")
    - Action Card (Rent, Availability, Contact)
- **Host Onboarding (/onboarding/host)**
    - Step 1: Account (Login/Signup - mocked)
    - Step 2: Property Basic Info
    - Step 3: Location Details
    - Step 4: Amenities & Features
    - Step 5: Household Rules (Norms)
- **Renter Onboarding (/onboarding/renter)**
    - *Planned placeholder*

---

## 2. Global UX Elements

### **Design System**
- **Theme:** "Premium Sapphire" (Deep Blues, Clean Whites, Slate Accents).
- **Typography:** Modern Sans-Serif (Inter/Geist) for readability.
- **Glassmorphism:** Used for overlays, sticky headers, and map controls to maintain context.
- **Micro-interactions:** 
    - Hover states on cards (Shadow lift).
    - Button clicks (Scale down).
    - Shimmer loading states (Skeletons).

### **Navigation**
- **Header:**
    - Sticky on scroll.
    - Branding: "NIVAESA".
    - Links: Find a Home, Offer a Place, Stories (Community).
    - Auth: "Join Node" (Sign Up) / Login.
    - *Behavior:* Hides on Onboarding pages to reduce distraction.
- **Footer:**
    - Standard site links.
    - Hides on Onboarding pages.

---

## 3. Page-Level Scenarios & Flows

### **A. Home Page (The "Hook")**
**Goal:** Immediately orient the user and drive them to "Explore" or "Host".

1.  **Hero Section:**
    - **Visual:** Full-width immersive background image with dark overlay.
    - **Content:** Headline "Find a place to belong", Subhead focusing on community.
    - **Primary Action:** "Find a Home" -> Navigates to `/explore`.
    - **Secondary Action:** "List Your Space" -> Navigates to `/onboarding/host`.

### **B. Explore Page (The "Hunt")**
**Goal:** Allow users to browse inventory efficiently and find matches based on lifestyle.

1.  **Layout:**
    - **Desktop:** Split screen. Left = Scrollable list (60%), Right = Fixed Map (40%).
    - **Mobile:** Tabbed view or Toggle button floating bottom-center to switch Map/List.
2.  **Listing Card (List View):**
    - **Thumbnail:** High-res image.
    - **Badges:** "Vegetarian", "Pet Friendly" (Quick vibe check).
    - **Info:** Price, Neighborhood, Roommate count.
    - **Interaction:** Hovering highlights the corresponding pin on the map.
3.  **Map Interaction:**
    - **Pins:** Custom markers showing price.
    - **Selection:** Clicking a pin opens the **Listing Preview Overlay**.
    - **Overlay:** Mini-card floating over the map. Contains Image, Price, Address, "View Details" button.
4.  **Filters:**
    - "Filters" button opens a side/modal panel.
    - Options: Price Range, Room Type, Move-in Date.

### **C. Listing Detail Page (The "Vibe Check")**
**Goal:** Provide deep details to help the user decide if they *fit* the household.

1.  **Visual Hierarchy:**
    - **Gallery:** Grid layout (1 Main + 2 Sub images).
    - **Title Area:** Address, Price (Large/Bold).
    - **The "Vibe":** Prominent "Household Norms" section (e.g., "Quiet after 10pm", "No pork cooked").
2.  **Action Card (Sticky):**
    - **Desktop:** Sticky right sidebar.
    - **Mobile:** Fixed bottom bar.
    - **Buttons:**
        - "Express Interest" -> Triggers Auth modal if not logged in.
        - "Contact Host" -> Opens message dialog.

### **D. Host Onboarding (The "Setup")**
**Goal:** High-conversion flow to get inventory on the platform.

1.  **Stepper Pattern:**
    - Visible progress indicator (Step 1 of 5).
    - "Back" and "Next" navigation.
2.  **Form interactions:**
    - **Validation:** Instant feedback on required fields.
    - **Input Types:**
        - Text: Address, Description.
        - Radio/Select: Property Type.
        - Tags: Amenities (Click to toggle).
3.  **Completion:**
    - Final step submits data.
    - Success state redirects to Dashboard or Home with success toast.

---

## 4. Accessibility (A11y) Standards
- **Contrast:** All text meets WCAG AA standards (White text on dark buttons, Dark text on white cards).
- **Keyboard Nav:** All interactive elements (Buttons, Inputs, Cards) are focusable and usable via Tab/Enter.
- **Alt Text:** All listing images require `alt` descriptions.
- **Semantic HTML:** Correct use of `<header>`, `<main>`, `<section>`, `<h1>`-`<h6>`.
