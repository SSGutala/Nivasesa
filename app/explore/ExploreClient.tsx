'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import SearchBar from '@/components/explore/SearchBar';
import ListingCard from '@/components/explore/ListingCard';
import ExploreMap from '@/components/explore/ExploreMap';
import FiltersPanel from '@/components/explore/FiltersPanel';
import SignupPromptModal from '@/components/explore/SignupPromptModal';
import ListingPreviewOverlay from '@/components/explore/ListingPreviewOverlay';
import type { Listing } from '@/lib/listings-data';

interface ExploreClientProps {
    initialListings: Listing[];
    title: string;
}

export default function ExploreClient({ initialListings, title }: ExploreClientProps) {
    const [listings] = useState<Listing[]>(initialListings);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const handleListingClick = (id: string) => {
        setSelectedListingId(id);
    };

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSignupModalOpen(true);
    };

    const selectedListing = listings.find(l => l.id === selectedListingId);

    return (
        <div className={styles.exploreWrapper}>
            <SearchBar onFilterClick={() => setIsFiltersOpen(true)} />

            <div className={styles.mainContent}>
                {/* Listings Panel */}
                <div className={styles.listPanel}>
                    <div className={styles.listHeader}>
                        <h1>{title}</h1>
                        <p>Select a listing to see internal household norms and details.</p>
                    </div>

                    <div className={styles.listingGrid}>
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                isSelected={selectedListingId === listing.id}
                                onHover={setHoveredId}
                                onClick={handleListingClick}
                            />
                        ))}
                    </div>

                    {listings.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No listings match your filters.</p>
                            <button onClick={() => setIsFiltersOpen(true)}>
                                Adjust filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Map Panel */}
                <div className={styles.mapPanel}>
                    <ExploreMap
                        listings={listings}
                        hoveredListingId={hoveredId}
                        selectedListingId={selectedListingId}
                        onPinClick={handleListingClick}
                    />
                    {selectedListing && (
                        <ListingPreviewOverlay
                            listing={selectedListing}
                            onClose={() => setSelectedListingId(null)}
                        />
                    )}
                </div>
            </div>

            {/* Mobile Map Toggle */}
            <div className={styles.mobileToggle}>
                <button className={styles.toggleBtn}>
                    Map View
                </button>
            </div>

            <FiltersPanel
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
            />

            <SignupPromptModal
                isOpen={isSignupModalOpen}
                onClose={() => setIsSignupModalOpen(false)}
            />
        </div>
    );
}
