'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import SearchBar from '@/components/explore/SearchBar';
import ListingCard from '@/components/explore/ListingCard';
import ExploreMap from '@/components/explore/ExploreMap';
import FiltersPanel from '@/components/explore/FiltersPanel';
import SignupPromptModal from '@/components/explore/SignupPromptModal';
import ListingPreviewOverlay from '@/components/explore/ListingPreviewOverlay';
import { MOCK_LISTINGS } from '@/lib/listings-data';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const router = useRouter();

    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const handleListingClick = (id: string) => {
        setSelectedListingId(id);
    };

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSignupModalOpen(true);
    };

    return (
        <div className={styles.exploreWrapper}>
            <SearchBar onFilterClick={() => setIsFiltersOpen(true)} />

            <div className={styles.mainContent}>
                {/* Listings Panel */}
                <div className={styles.listPanel}>
                    <div className={styles.listHeader}>
                        <h1>Over 300 places in Jersey City & Manhattan</h1>
                        <p>Select a listing to see internal household norms and details.</p>
                    </div>

                    <div className={styles.listingGrid}>
                        {MOCK_LISTINGS.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                isSelected={selectedListingId === listing.id}
                                onHover={setHoveredId}
                                onClick={handleListingClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Map Panel */}
                <div className={styles.mapPanel}>
                    <ExploreMap
                        listings={MOCK_LISTINGS}
                        hoveredListingId={hoveredId}
                        selectedListingId={selectedListingId}
                        onPinClick={handleListingClick}
                    />
                    {selectedListingId && (
                        <ListingPreviewOverlay
                            listing={MOCK_LISTINGS.find(l => l.id === selectedListingId)!}
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
