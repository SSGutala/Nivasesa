'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_LISTINGS } from '@/lib/listings-data';
import { ArrowLeft, MapPin, Users, Calendar, Heart, Share, Check, Info } from 'lucide-react';
import styles from './ListingDetail.module.css';

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    // Find the listing
    const listing = MOCK_LISTINGS.find(l => l.id === id);

    // Mock authentication state (replace with actual auth hook later)
    // For now, we'll assume logged out to demonstrate the gating
    // You can toggle this to test both states or hook up next-auth
    const isLoggedIn = false;

    if (!listing) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h1>Listing not found</h1>
                    <Link href="/explore" className={styles.backLink}>
                        <ArrowLeft size={16} /> Return to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const handleExpressInterest = () => {
        if (!isLoggedIn) {
            // Redirect to login with callback URL
            router.push(`/login?callbackUrl=/listing/${id}`);
        } else {
            // Logic for showing interest (e.g., open modal, send message)
            console.log('Interest expressed for listing:', id);
            alert('Interest expressed! (Mock action)');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <Link href="/explore" className={styles.backNav}>
                    <ArrowLeft size={16} /> Back to Search
                </Link>

                <div className={styles.grid}>
                    {/* Left Column: Images & Details */}
                    <div className={styles.mainContent}>
                        <div className={styles.imageGallery}>
                            <img src={listing.images[0]} alt={listing.title} className={styles.mainImage} />
                            <div className={styles.subImages}>
                                {listing.images.slice(1).map((img, i) => (
                                    <img key={i} src={img} alt={`${listing.title} ${i + 2}`} className={styles.subImage} />
                                ))}
                            </div>
                        </div>

                        <div className={styles.headerMobile}>
                            <h1 className={styles.title}>{listing.neighborhood}, {listing.city}</h1>
                            <div className={styles.priceMobile}>${listing.price}<span>/mo</span></div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>About this space</h2>
                            <p className={styles.description}>
                                Experience comfortable living in this {listing.type.toLowerCase()} located in the heart of {listing.neighborhood}.
                                This space is perfect for someone looking for a {listing.badges.join(', ')} environment.
                                The apartment features modern amenities and a welcoming atmosphere.
                            </p>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <Users className={styles.icon} />
                                    <div>
                                        <span className={styles.label}>Roommates</span>
                                        <span className={styles.value}>{listing.roommates} people</span>
                                    </div>
                                </div>
                                <div className={styles.metaItem}>
                                    <MapPin className={styles.icon} />
                                    <div>
                                        <span className={styles.label}>Location</span>
                                        <span className={styles.value}>{listing.neighborhood}</span>
                                    </div>
                                </div>
                                <div className={styles.metaItem}>
                                    <Calendar className={styles.icon} />
                                    <div>
                                        <span className={styles.label}>Availability</span>
                                        <span className={styles.value}>{listing.availability.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Household Norms</h2>
                            <ul className={styles.amenities}>
                                {listing.badges.map(badge => (
                                    <li key={badge} className={styles.amenityItem}>
                                        <Check size={16} className={styles.checkIcon} />
                                        {badge}
                                    </li>
                                ))}
                                <li className={styles.amenityItem}><Check size={16} className={styles.checkIcon} /> No smoking</li>
                                <li className={styles.amenityItem}><Check size={16} className={styles.checkIcon} /> Clean & Tidy</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Sticky Action Card */}
                    <div className={styles.sidebar}>
                        <div className={styles.actionCard}>
                            <div className={styles.priceHeader}>
                                <span className={styles.price}>${listing.price}</span>
                                <span className={styles.period}>/ month</span>
                            </div>

                            <div className={styles.statusRow}>
                                <div className={`${styles.statusBadge} ${styles[listing.availability]}`}>
                                    {listing.availability.replace('_', ' ')}
                                </div>
                            </div>

                            <button onClick={handleExpressInterest} className={styles.primaryBtn}>
                                Express Interest
                            </button>

                            <button className={styles.secondaryBtn} onClick={() => alert('Opening message dialog...')}>
                                Contact Host
                            </button>

                            <div className={styles.disclaimer}>
                                <Info size={14} />
                                <span>You won't be charged yet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
