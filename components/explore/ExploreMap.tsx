'use client';

import React, { useState } from 'react';
import styles from './ExploreMap.module.css';
import { Listing } from '@/lib/listings-data';
import { Plus, Minus } from 'lucide-react';

interface ExploreMapProps {
    listings: Listing[];
    hoveredListingId: string | null;
    onPinClick: (id: string) => void;
}

export default function ExploreMap({ listings, hoveredListingId, onPinClick }: ExploreMapProps) {
    const [zoom, setZoom] = useState(1);

    // Simple coordinate to percentage conversion for NYC area
    // This is a simplified projection - in production you'd use a proper map library
    const coordToPercent = (lat: number, lng: number) => {
        // NYC bounds approximately: lat 40.5-41.0, lng -74.3 to -73.7
        const latPercent = ((lat - 40.5) / 0.5) * 100;
        const lngPercent = ((lng + 74.3) / 0.6) * 100;
        return { top: `${100 - latPercent}%`, left: `${lngPercent}%` };
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.2, 2));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.2, 0.5));
    };

    return (
        <div className={styles.mapContainer}>
            <div
                className={styles.mapBackground}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
                {/* Simulated map with streets */}
                <div className={styles.mapOverlay}>
                    <div className={styles.waterArea} />
                    <div className={styles.landArea} />
                </div>
            </div>

            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
                {listings.map(listing => {
                    const position = coordToPercent(listing.lat, listing.lng);
                    return (
                        <button
                            key={listing.id}
                            className={`${styles.pin} ${hoveredListingId === listing.id ? styles.hovered : ''}`}
                            style={position}
                            onClick={() => onPinClick(listing.id)}
                        >
                            <span className={styles.pinPrice}>${listing.price.toLocaleString()}</span>
                        </button>
                    );
                })}
            </div>

            <div className={styles.controls}>
                <button className={styles.controlBtn} onClick={handleZoomIn} title="Zoom in">
                    <Plus size={20} />
                </button>
                <button className={styles.controlBtn} onClick={handleZoomOut} title="Zoom out">
                    <Minus size={20} />
                </button>
            </div>
        </div>
    );
}
