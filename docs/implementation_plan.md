# Plan: Listing Interactions & Details

Implement interactive map/listing behavior and detail view gating as per user request.

## User Review Required

> [!NOTE]
> This plan focuses on adding interactions to the existing Explore page without changing its layout.

## Proposed Changes

### Interactions & State Management
Implement `selectedListingId` state in `ExplorePage` to synchronize Listings and Map.

#### [MODIFY] [app/explore/page.tsx](file:///Users/saigutala/.gemini/antigravity/scratch/apnahome/app/explore/page.tsx)
- Add `selectedListingId` state.
- Update `handleListingClick` to set state instead of routing.
- Pass state to `ListingCard`, `ExploreMap`, and new `ListingPreviewOverlay`.

#### [MODIFY] [components/explore/ListingCard.tsx](file:///Users/saigutala/.gemini/antigravity/scratch/apnahome/components/explore/ListingCard.tsx)
- Accept `isSelected` prop.
- Add visual highlight style for selected state.

#### [MODIFY] [components/explore/ExploreMap.tsx](file:///Users/saigutala/.gemini/antigravity/scratch/apnahome/components/explore/ExploreMap.tsx)
- Accept `selectedListingId`.
- Implement `useEffect` to pan/zoom to selected listing.
- Highlight selected pin.

#### [NEW] [components/explore/ListingPreviewOverlay.tsx](file:///Users/saigutala/.gemini/antigravity/scratch/apnahome/components/explore/ListingPreviewOverlay.tsx)
- Create overlay component for map.
- Display listing preview details.
- "View Details" button linking to full detail page.

### Detail Page & Gating

#### [NEW] [app/listing/[id]/page.tsx](file:///Users/saigutala/.gemini/antigravity/scratch/apnahome/app/listing/[id]/page.tsx)
- Create full detail view.
- Re-use `MOCK_LISTINGS` to find data.
- "Express Interest" button with auth check.

## Verification Plan

### Manual Verification
1.  **Selection**: Click listing in left panel -> Card highlights, Map pans/zooms, Preview appears.
2.  **Map Interaction**: Click pin on map -> Card highlights, Preview appears.
3.  **Preview**: Verify content matches selected listing.
4.  **Details**: Click "View Details" -> Navigates to `/listing/[id]`.
5.  **Gating**: Click "Express Interest" -> 
    - If logged out: Redirects to Login.
    - If logged in: Console log success (or existing flow).
