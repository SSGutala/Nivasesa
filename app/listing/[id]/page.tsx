'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_LISTINGS } from '@/lib/listings-data';

import { ArrowLeft, MapPin, Users, Calendar, Heart, Share, Check, Leaf, Ban, Utensils, Globe, CheckCircle } from 'lucide-react';
import styles from './ListingDetail.module.css';

// ... imports

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
            router.push('/join/find?returnUrl=/explore');
        } else {
            // Logic for showing interest (e.g., open modal, send message)
            console.log('Interest expressed for listing:', id);
            alert('Interest expressed! (Mock action)');
        }
    };

    const handleContactHost = () => {
        if (!isLoggedIn) {
            router.push('/join/find?returnUrl=/explore');
        } else {
            console.log('Contacting host for listing:', id);
            alert('Opening message dialog...');
        }
    };

    // Helper to aggregate and prioritize content tags (Replicated from ListingCard)
    const getContentTags = () => {
        if (!listing) return [];
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

        return tags.sort((a, b) => a.priority - b.priority);
    };

    const contentTags = getContentTags();

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
                                Experience comfortable living in this {listing.spaceType.toLowerCase()} located in the heart of {listing.neighborhood}.
                                This space is perfect for someone looking for a {listing.lifestyle.join(', ')} environment.
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
                            <h2 className={styles.sectionTitle}>Highlights & Norms</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {contentTags.map((tag, index) => (
                                    <span key={index} className={styles.amenityItem} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '100px',
                                        fontSize: '14px',
                                        color: '#374151'
                                    }}>
                                        {tag.icon && <tag.icon size={14} />}
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
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

                            <button className={styles.secondaryBtn} onClick={handleContactHost}>
                                Contact Host
                            </button>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
