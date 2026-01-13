'use client';

import React from 'react';
import styles from './ListingCard.module.css';
import Link from 'next/link';
import { Heart, MapPin, Users, Utensils, Globe, Moon, Ban, CheckCircle, Leaf, Flame, ShieldCheck, Sparkles, Zap, Star } from 'lucide-react';
import { Listing } from '@/lib/listings-data';

interface ListingCardProps {
    listing: Listing;
    isSelected?: boolean;
    onHover?: (id: string | null) => void;
    onClick?: (id: string) => void;
}

export default function ListingCard({ listing, isSelected, onHover, onClick }: ListingCardProps) {
    // Helper to aggregate and prioritize content tags
    const getContentTags = () => {
        const tags: { label: string; icon?: React.ElementType; priority: number }[] = [];

        // 1. Dietary & Cultural (Highest Priority for South Asians)
        if (listing.dietary.vegetarian) tags.push({ label: 'Vegetarian', icon: Leaf, priority: 1 });
        if (listing.dietary.jainFriendly) tags.push({ label: 'Jain Friendly', icon: Leaf, priority: 1 });
        if (listing.dietary.halalFriendly) tags.push({ label: 'Halal', icon: CheckCircle, priority: 1 });
        if (listing.lifestyle.includes('Shoes-Off Home')) tags.push({ label: 'Shoes-Off', priority: 1 });

        if (listing.dietary.kitchen === 'Separate Kitchen Access') tags.push({ label: 'Separate Kitchen', icon: Utensils, priority: 2 });
        if (listing.dietary.noBeef) tags.push({ label: 'No Beef', icon: Ban, priority: 2 });
        if (listing.dietary.noPork) tags.push({ label: 'No Pork', icon: Ban, priority: 2 });

        // 2. South Asian Languages (Medium Priority)
        const southAsianLangs = ['Hindi', 'Urdu', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi', 'Bengali', 'Marathi', 'Nepali', 'Sinhala'];
        listing.languages.forEach(lang => {
            if (southAsianLangs.includes(lang)) {
                tags.push({ label: lang, icon: Globe, priority: 3 });
            }
        });

        // 3. Compatibility / Gender
        if (listing.compatibility === 'Women-Only') tags.push({ label: 'Women Only', icon: Users, priority: 4 });
        if (listing.compatibility === 'Men-Only') tags.push({ label: 'Men Only', icon: Users, priority: 4 });

        // 4. Other Languages
        listing.languages.forEach(lang => {
            if (!southAsianLangs.includes(lang)) {
                tags.push({ label: lang, icon: Globe, priority: 5 });
            }
        });

        // 5. General Rules (Lower Priority)
        if (listing.rules.smoking === 'No Smoking') tags.push({ label: 'No Smoking', icon: Ban, priority: 6 });
        if (listing.lifestyle.includes('Quiet Home')) tags.push({ label: 'Quiet Home', priority: 6 });

        // Sort by priority (ascending) and take top 5-7
        return tags.sort((a, b) => a.priority - b.priority).slice(0, 7);
    };

    const contentTags = getContentTags();

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

                <div className={`${styles.statusBadge} ${styles[listing.availability?.toLowerCase().replace(' ', '_')]}`}>
                    {listing.availability}
                </div>

                <button className={styles.saveButton} onClick={(e) => { e.stopPropagation(); /* Intent gate later */ }}>
                    <Heart size={20} />
                </button>

                {listing.leaseType && (
                    <div className={styles.leaseTypeBadge}>
                        {listing.leaseType === 'lease' ? 'Lease' : 'Sublease'}
                    </div>
                )}
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
                    <span className={styles.metaItem}><MapPin size={14} /> {listing.spaceType}</span>
                    <span className={styles.metaItem}><Users size={14} /> {listing.roommates} roommates</span>
                </div>

                <div className={styles.badges}>
                    {contentTags.map((tag, index) => (
                        <span key={index} className={styles.badge}>
                            {tag.icon && <tag.icon size={11} strokeWidth={2.5} />}
                            {tag.label}
                        </span>
                    ))}
                    {listing.languages.length > 2 && (
                        <Link href={`/listing/${listing.id}`} onClick={(e) => e.stopPropagation()}>
                            <span className={styles.badge} style={{ opacity: 0.7, cursor: 'pointer' }}>+ more</span>
                        </Link>
                    )}
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
