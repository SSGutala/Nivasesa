'use client';

import React, { useState } from 'react';
import styles from '@/app/explore/page.module.css';
import SearchBar from '@/components/explore/SearchBar';
import ListingCard from '@/components/explore/ListingCard';
import ExploreMap from '@/components/explore/ExploreMap';
import FiltersPanel from '@/components/explore/FiltersPanel';
import SignupPromptModal from '@/components/explore/SignupPromptModal';

import { MOCK_LISTINGS } from '@/lib/listings-data';
import { useRouter } from 'next/navigation';

import ListingTypeToggle from '@/components/explore/ListingTypeToggle';

export default function ExploreView() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [listingType, setListingType] = useState<'lease' | 'sublease'>('sublease');
    const router = useRouter();

    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const handleListingClick = (id: string | null) => {
        setSelectedListingId(id);
    };

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSignupModalOpen(true);
    };

    // Filter listings based on the selected toggle type
    const filteredListings = MOCK_LISTINGS.filter(l => l.leaseType === listingType);

    return (
        <div className={styles.exploreWrapper}>
            <SearchBar onFilterClick={() => setIsFiltersOpen(true)} />

            <div className={styles.mainContent}>
                {/* Listings Panel */}
                <div className={styles.listPanel}>
                    <div className={styles.listHeader}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                            <ListingTypeToggle activeType={listingType} onChange={setListingType} />
                        </div>
                        <h1>{filteredListings.length} places in Jersey City & Manhattan</h1>
                        <p>Select a listing to see internal household norms and details.</p>
                    </div>

                    <div className={styles.listingGrid}>
                        {filteredListings.map(listing => (
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
                        listings={filteredListings}
                        hoveredListingId={hoveredId}
                        selectedListingId={selectedListingId}
                        onPinClick={handleListingClick}
                    />

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
