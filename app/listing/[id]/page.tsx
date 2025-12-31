'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_LISTINGS } from '@/lib/listings-data';
import styles from './page.module.css';
import { ChevronLeft, Share, Heart, MapPin, Users, Calendar, ShieldCheck, MessageSquare } from 'lucide-react';
import SignupPromptModal from '@/components/explore/SignupPromptModal';

export default function ListingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("Sign up to continue");

    const listing = MOCK_LISTINGS.find(l => l.id === id);

    if (!listing) {
        return <div className={styles.notFound}>Listing not found</div>;
    }

    const handleAction = (title: string) => {
        setModalTitle(title);
        setIsSignupModalOpen(true);
    };

    return (
        <div className={styles.wrapper}>
            {/* Top Nav */}
            <div className={styles.topNav}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    <ChevronLeft size={20} /> Back to Search
                </button>
                <div className={styles.topActions}>
                    <button className={styles.iconBtn} onClick={() => handleAction("Save this listing")}><Heart size={20} /></button>
                    <button className={styles.iconBtn}><Share size={20} /></button>
                </div>
            </div>

            <div className={styles.container}>
                {/* Image Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImage}>
                        <img src={listing.images[0]} alt={listing.title} />
                    </div>
                    <div className={styles.sideImages}>
                        <div className={styles.sideImagePlaceholder} />
                        <div className={styles.sideImagePlaceholder} />
                    </div>
                </div>

                <div className={styles.grid}>
                    {/* Content */}
                    <div className={styles.content}>
                        <section className={styles.intro}>
                            <h1 className={styles.title}>{listing.title}</h1>
                            <div className={styles.location}>
                                <MapPin size={18} /> {listing.neighborhood}, {listing.city}
                            </div>
                            <div className={styles.quickStats}>
                                <div className={styles.stat}><Users size={20} /><span>{listing.roommates} Roommates</span></div>
                                <div className={styles.stat}><ShieldCheck size={20} /><span>Background Verified</span></div>
                                <div className={styles.stat}><Calendar size={20} /><span>{listing.stayDuration}</span></div>
                            </div>
                        </section>

                        <hr className={styles.divider} />

                        <section className={styles.about}>
                            <h2>Overview</h2>
                            <div className={styles.badges}>
                                {listing.badges.map(b => <span key={b} className={styles.badge}>{b}</span>)}
                            </div>
                            <p className={styles.description}>{listing.description}</p>
                        </section>

                        <section className={styles.norms}>
                            <h2>Household Norms</h2>
                            <ul className={styles.normList}>
                                <li><strong>Diet:</strong> {listing.preferences.diet} household</li>
                                <li><strong>Cooking:</strong> {listing.preferences.cooking}</li>
                                <li><strong>Languages:</strong> {listing.preferences.languages.join(', ')} spoken</li>
                                <li><strong>Lifestyle:</strong> {listing.preferences.lifestyle.join(', ')}</li>
                                <li><strong>Guest Policy:</strong> {listing.preferences.guestPolicy}</li>
                            </ul>
                        </section>

                        <section className={styles.virtualMeet}>
                            <div className={styles.alert}>
                                <ShieldCheck size={24} />
                                <div>
                                    <h3>Virtual Meet & Greet Required</h3>
                                    <p>Safety is our priority. All hosts and guests must complete a 15-minute virtual introduction before booking or visiting.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className={styles.sidebar}>
                        <div className={styles.stickyCard}>
                            <div className={styles.cardPrice}>
                                <span className={styles.amount}>${listing.price}</span>
                                <span className={styles.period}>/ month</span>
                            </div>

                            <div className={styles.cardDetails}>
                                <div className={styles.detailRow}>
                                    <span>Security Deposit</span>
                                    <span>$200</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Move-in Date</span>
                                    <span>Flexible</span>
                                </div>
                            </div>

                            <button
                                className={styles.ctaButton}
                                onClick={() => handleAction("Request a Virtual Meet")}
                            >
                                Request virtual meet & greet
                            </button>

                            <button
                                className={styles.secondaryCta}
                                onClick={() => handleAction("Message the host")}
                            >
                                <MessageSquare size={18} /> Message host
                            </button>

                            <p className={styles.hint}>No payment required until after intro</p>
                        </div>
                    </div>
                </div>
            </div>

            <SignupPromptModal
                isOpen={isSignupModalOpen}
                onClose={() => setIsSignupModalOpen(false)}
                title={modalTitle}
                returnUrl={`/listing/${id}`}
            />
        </div>
    );
}
