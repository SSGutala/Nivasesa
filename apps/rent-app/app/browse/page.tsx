'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import SearchBar from '@/components/browse/SearchBar';
import ListingCard from '@/components/browse/ListingCard';
import ExploreMap from '@/components/browse/ExploreMap';
import FiltersPanel from '@/components/browse/FiltersPanel';
import SignupPromptModal from '@/components/browse/SignupPromptModal';
import { MOCK_LISTINGS, Listing } from '@/lib/listings-data';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
    const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchListings = async () => {
            // Dynamic import to avoid SSR issues with Firebase
            try {
                const { db } = await import('@/lib/firebase');
                const { collection, getDocs } = await import('firebase/firestore');

                const querySnapshot = await getDocs(collection(db, 'listings'));
                if (!querySnapshot.empty) {
                    const dbListings = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Listing[]; // Cast carefully in prod
                    setListings(dbListings);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };
        fetchListings();
    }, []);

    const handleListingClick = (id: string) => {
        router.push(`/listing/${id}`);
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
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onHover={setHoveredId}
                                onClick={handleListingClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Map Panel */}
                <div className={styles.mapPanel}>
                    <ExploreMap
                        listings={listings}
                        hoveredListingId={hoveredId}
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
