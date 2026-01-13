'use client';

import React from 'react';
import styles from './ListingCard.module.css';
import { Heart, MapPin, Users, Calendar } from 'lucide-react';
import { Listing } from '@/lib/listings-data';

interface ListingCardProps {
    listing: Listing;
    isSelected?: boolean;
    onHover?: (id: string | null) => void;
    onClick?: (id: string) => void;
}

export default function ListingCard({ listing, isSelected, onHover, onClick }: ListingCardProps) {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            onMouseEnter={() => onHover?.(listing.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(listing.id)}
            ref={(el) => {
                if (isSelected && el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }}
        >
            <div className={styles.imageContainer}>
                <img src={listing.images[0]} alt={listing.title} className={styles.image} />
                <button className={styles.saveButton} onClick={(e) => { e.stopPropagation(); /* Intent gate later */ }}>
                    <Heart size={20} />
                </button>
                <div className={`${styles.statusBadge} ${styles[listing.availability]}`}>
                    {listing.availability.replace('_', ' ')}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.priceContainer}>
                        <span className={styles.price}>${listing.price}</span>
                        <span className={styles.period}>/ month</span>
                    </div>
                </div>

                <h3 className={styles.title}>{listing.neighborhood}, {listing.city}</h3>

                <div className={styles.meta}>
                    <span className={styles.metaItem}><MapPin size={14} /> {listing.type}</span>
                    <span className={styles.metaItem}><Users size={14} /> {listing.roommates} roommates</span>
                </div>

                <div className={styles.badges}>
                    {listing.badges.map(badge => (
                        <span key={badge} className={styles.badge}>{badge}</span>
                    ))}
                </div>

                <div className={styles.footer}>
                    <button className={styles.viewDetails}>
                        View details
                    </button>
                </div>
            </div>
        </div>
    );
}
