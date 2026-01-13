'use client';

import React from 'react';
import styles from './ListingPreviewOverlay.module.css';
import { Listing } from '@/lib/listings-data';
import { X, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

interface ListingPreviewOverlayProps {
    listing: Listing;
    onClose: () => void;
}

export default function ListingPreviewOverlay({ listing, onClose }: ListingPreviewOverlayProps) {
    if (!listing) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <div className={styles.price}>${listing.price}/mo</div>
                    <div className={styles.title}>{listing.neighborhood}, {listing.city}</div>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <img src={listing.images[0]} alt={listing.title} className={styles.image} />

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <MapPin size={16} />
                    <span>{listing.type}</span>
                </div>
                <div className={styles.metaItem}>
                    <Users size={16} />
                    <span>{listing.roommates} roommates</span>
                </div>
            </div>

            <div className={styles.tags}>
                {listing.badges.map(badge => (
                    <span key={badge} className={styles.tag}>{badge}</span>
                ))}
            </div>

            <div className={styles.actions}>
                <Link href={`/listing/${listing.id}`} style={{ textDecoration: 'none' }}>
                    <button className={styles.viewBtn}>
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    );
}
