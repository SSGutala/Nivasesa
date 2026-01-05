
'use client';

import React from 'react';
import styles from './ExploreMap.module.css';
import { Listing } from '@/lib/listings-data';
import dynamic from 'next/dynamic';

// Dynamically import the MapClient component to avoid server-side rendering issues with Leaflet
const MapClient = dynamic(() => import('./MapClient'), {
    ssr: false,
    loading: () => (
        <div className={styles.mapLoading}>
            <div className={styles.spinner}></div>
            <p>Loading Map...</p>
        </div>
    ),
});

interface ExploreMapProps {
    listings: Listing[];
    hoveredListingId: string | null;
    selectedListingId?: string | null;
    onPinClick: (id: string | null) => void;
}

export default function ExploreMap(props: ExploreMapProps) {
    return (
        <div className={styles.mapWrapper}>
            <MapClient {...props} />
        </div>
    );
}
