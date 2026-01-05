'use client';

import React, { useState } from 'react';
import styles from './ListingPreviewOverlay.module.css';
import { Listing } from '@/lib/listings-data';
import { X, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ListingPreviewOverlayProps {
    listing: Listing;
    onClose: () => void;
}

export default function ListingPreviewOverlay({ listing, onClose }: ListingPreviewOverlayProps) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!listing) return null;

    const handleCardClick = () => {
        router.push(`/listing/${listing.id}`);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (listing.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
        }
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (listing.images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    // Derived Labels
    const hostLabel = listing.leaseType === 'lease' ? 'Landlord' : 'Subleaser';
    const availabilityLabel = listing.availability || 'Available';

    // Key Facts Logic
    let keyFacts = '';
    if (listing.spaceType === 'Private Room' || listing.spaceType === 'Shared Room') {
        keyFacts = `${listing.spaceType} • ${listing.roommates} Roommates`;
    } else {
        keyFacts = `${listing.spaceType} • Entire Place`;
    }

    return (
        <div className={styles.overlay} onClick={handleCardClick} role="button" tabIndex={0}>
            {/* Image Carousel */}
            <div className={styles.imageContainer}>
                {listing.images.length > 0 ? (
                    <img
                        src={listing.images[currentImageIndex]}
                        alt={listing.title}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.image} style={{ backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className={styles.badge}>
                    {availabilityLabel}
                </div>

                {/* Save Button (Mock) */}
                <button className={styles.heartBtn} onClick={(e) => e.stopPropagation()}>
                    <Heart size={14} color="#1a1a1a" />
                </button>

                {/* Controls */}
                {listing.images.length > 1 && (
                    <>
                        <button className={`${styles.carouselBtn} ${styles.prevBtn}`} onClick={handlePrevImage}>
                            <ChevronLeft size={14} />
                        </button>
                        <button className={`${styles.carouselBtn} ${styles.nextBtn}`} onClick={handleNextImage}>
                            <ChevronRight size={14} />
                        </button>
                        <div className={styles.dots}>
                            {listing.images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.dot} ${idx === currentImageIndex ? styles.activeDot : ''}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content Body */}
            <div className={styles.content}>
                <div className={styles.headerRow}>
                    <div className={styles.price}>${listing.price.toLocaleString()}/mo</div>
                    <button className={styles.closeBtn} onClick={handleClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.keyFacts}>
                    <span>{keyFacts}</span>
                </div>

                <div className={styles.address}>
                    {listing.neighborhood}, {listing.city}
                </div>

                <div className={styles.hostType}>
                    {hostLabel}
                </div>
            </div>
        </div>
    );
}
