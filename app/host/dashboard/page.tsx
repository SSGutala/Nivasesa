'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './dashboard.module.css';
import { HOST_KPI_STATS, HOST_LISTINGS, HOST_MESSAGES, HOST_TRANSACTIONS, HOST_PROFILE } from '@/lib/host-demo-data';
import { Plus, Edit2, Eye, MoreHorizontal, Video, AlertCircle } from 'lucide-react';

export default function HostDashboardPage() {
    const router = useRouter();

    // Mock User Data (would come from auth)
    // Using HOST_PROFILE to match the other pages
    const firstName = HOST_PROFILE.name.split(' ')[0];
    const user = { firstName: firstName, role: 'Landlord' };
    const hasListings = HOST_LISTINGS.length > 0;

    return (
        <div>
            {/* A) HEADER */}
            <header className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Welcome back, {user.firstName}</h1>
                    <div className={styles.roleTags}>
                        <span className={`${styles.pill} ${styles.primary}`}>Host</span>
                        <span className={styles.pill}>{user.role}</span>
                        <span className={styles.pill} style={{ color: '#059669', background: '#d1fae5' }}>Verified Profile</span>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Link href="/host/profile">
                        <button className={styles.secondaryBtn}>Complete Profile</button>
                    </Link>
                    <Link href="/host/listings/new">
                        <button className={styles.primaryBtn}>
                            <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                            Create Listing
                        </button>
                    </Link>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => signOut({ callbackUrl: '/' })}
                        style={{ border: 'none', color: '#ef4444' }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* B) KPI OVERVIEW */}
            <div className={styles.kpiGrid}>
                {HOST_KPI_STATS.map((stat, i) => (
                    <div key={i} className={styles.kpiCard}>
                        <span className={styles.kpiLabel}>{stat.label}</span>
                        <span className={styles.kpiValue}>{stat.value}</span>
                        <span className={`${styles.kpiTrend} ${stat.trend === 'up' ? styles.trendUp : (stat.trend === 'down' ? styles.trendDown : styles.trendNeutral)}`}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.dashboardGrid}>
                <div className={styles.mainColumn}>

                    {/* C) PRIMARY ACTION PANEL - Conditional */}
                    {!hasListings && (
                        <div className={styles.panel} style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Get Started</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ marginBottom: '16px', color: '#4b5563' }}>You're currently not hosting any spaces. Follow these steps to go live.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
                                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span>
                                            Complete host profile
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
                                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>2</span>
                                            Create your first listing
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: '#9ca3af' }}>
                                            <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>3</span>
                                            Verify & Go Live
                                        </div>
                                    </div>
                                </div>
                                <Link href="/host/listings/new">
                                    <button className={styles.primaryBtn}>Start Listing</button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {hasListings && (
                        <div className={styles.panel} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 className={styles.sectionTitle}>Quick Actions</h3>
                                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Manage your properties efficiently</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Link href="/host/listings/new">
                                    <button className={styles.secondaryBtn}>+ New Listing</button>
                                </Link>
                                <button className={styles.secondaryBtn}>Manage Availability</button>
                            </div>
                        </div>
                    )}


                    {/* D) MY LISTINGS PREVIEW */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>My Listings</h2>
                            <Link href="/host/listings" className={styles.link}>View all listings</Link>
                        </div>
                        <div className={styles.card}>
                            {HOST_LISTINGS.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No listings found.</div>
                            ) : (
                                HOST_LISTINGS.slice(0, 3).map(listing => (
                                    <div key={listing.id} className={styles.listingRow}>
                                        <img src={listing.image} alt={listing.title} className={styles.listingThumb} />
                                        <div className={styles.listingInfo}>
                                            <span className={styles.listingTitle}>{listing.title}</span>
                                            <div className={styles.listingMeta}>
                                                <span className={`${styles.statusBadge} ${listing.status === 'Available' ? styles.statusAvailable :
                                                    listing.status === 'In Discussion' ? styles.statusDiscussion : styles.statusDraft
                                                    }`}>
                                                    {listing.status}
                                                </span>
                                                <span>•</span>
                                                <span>{listing.type}</span>
                                                <span>•</span>
                                                <span>{listing.location}</span>
                                            </div>
                                        </div>
                                        <div className={styles.rowActions}>
                                            <button className={styles.iconBtn} title="View"><Eye size={18} /></button>
                                            <button className={styles.iconBtn} title="Edit"><Edit2 size={18} /></button>
                                            <button className={styles.iconBtn} title="More"><MoreHorizontal size={18} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* E) INQUIRIES & MESSAGES */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Recent Inquiries</h2>
                            <Link href="/host/messages" className={styles.link}>View inbox</Link>
                        </div>
                        <div className={styles.card}>
                            {HOST_MESSAGES.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center' }}>
                                    <p style={{ color: '#6b7280' }}>No inquiries yet. Once your listing is live, requests will appear here.</p>
                                </div>
                            ) : (
                                HOST_MESSAGES.map(msg => (
                                    <div key={msg.id} className={styles.messageRow} onClick={() => router.push(`/host/messages/${msg.id}`)}>
                                        <div className={styles.avatar}>
                                            {msg.avatar ? (
                                                <img src={msg.avatar} alt={msg.renterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                msg.renterName.charAt(0)
                                            )}
                                        </div>
                                        <div className={styles.messageContent}>
                                            <div className={styles.messageHeader}>
                                                <span className={styles.sender}>
                                                    {msg.renterName}
                                                    {msg.status === 'New' && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>NEW</span>}
                                                </span>
                                                <span className={styles.time}>{msg.time}</span>
                                            </div>
                                            <span className={styles.snippet} style={{ fontWeight: msg.needsAction ? 600 : 400, color: msg.needsAction ? '#111827' : '#6b7280' }}>
                                                {msg.listingTitle} • {msg.snippet}
                                            </span>
                                            {msg.status === 'Virtual Meet Required' && (
                                                <div style={{ marginTop: '6px', fontSize: '12px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertCircle size={12} />
                                                    Action Required: Schedule Virtual Meet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* G) TRANSACTIONS PREVIEW */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Transactions</h2>
                            <Link href="/host/transactions" className={styles.link}>View all</Link>
                        </div>
                        <div className={styles.card}>
                            {HOST_TRANSACTIONS.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    Your completed bookings and payouts will appear here.
                                </div>
                            ) : (
                                HOST_TRANSACTIONS.map(tx => (
                                    <div key={tx.id} className={styles.listingRow} style={{ justifyContent: 'space-between' }}>
                                        <div>
                                            <span className={styles.listingTitle} style={{ fontSize: '14px' }}>{tx.renter}</span>
                                            <span className={styles.listingMeta}>{tx.date} • {tx.listing}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', fontWeight: 600, color: tx.amount > 0 ? '#059669' : '#111827' }}>
                                                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>{tx.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles.sideColumn}>
                    {/* F) VIRTUAL MEET & GREET PANEL */}
                    <div className={styles.panel} style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af' }}>
                            <Video size={20} />
                            <h3 className={styles.panelTitle} style={{ color: '#1e40af' }}>Virtual Meet & Greet</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#1e3a8a' }}>
                            Before proceeding with any lease, schedule and complete a virtual call in-platform.
                        </p>
                        {/* Check for messages that require meet */}
                        {HOST_MESSAGES.some(m => m.status === 'Virtual Meet Required' || m.status === 'Scheduled') ? (
                            <button className={styles.primaryBtn} style={{ width: '100%', background: '#2563eb' }}>
                                Join Scheduled Call
                            </button>
                        ) : (
                            <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#60a5fa' }}>No upcoming calls.</p>
                        )}
                    </div>

                    {/* H) PROFILE & TRUST PANEL */}
                    <div className={styles.panel}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.panelTitle}>Your Profile</h3>
                            <Link href="/host/profile" className={styles.link} style={{ fontSize: '13px' }}>Edit</Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} color="#9ca3af" />
                            </div>
                            <div>
                                <div className={styles.listingTitle}>{HOST_PROFILE.name}</div>
                                <span className={styles.pill} style={{ fontSize: '11px', padding: '2px 8px' }}>Landlord</span>
                            </div>
                        </div>
                        <div className={styles.progressContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className={styles.kpiLabel}>Profile Strength</span>
                                <span className={styles.progressText}>85%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                            <Link href="/host/guidelines" className={styles.link} style={{ fontSize: '13px', display: 'block' }}>
                                Community Guidelines
                            </Link>
                            <Link href="/help" className={styles.link} style={{ fontSize: '13px', display: 'block', marginTop: '8px' }}>
                                Help Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon for profile fallback
import { User } from 'lucide-react';
