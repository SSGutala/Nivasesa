'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BuyerRequest, Referral, RealtorProfile, User } from '@prisma/client';
import { Home, Mail, Phone, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import styles from './buyer.module.css';

type BuyerRequestWithReferrals = BuyerRequest & {
    referrals: (Referral & {
        realtor: RealtorProfile & {
            user: Pick<User, 'name' | 'email' | 'image'>;
        };
    })[];
};

interface BuyerDashboardClientProps {
    requests: BuyerRequestWithReferrals[];
    userName: string;
}

export default function BuyerDashboardClient({ requests, userName }: BuyerDashboardClientProps) {
    const [filter, setFilter] = useState<'all' | 'active' | 'matched'>('all');

    const filteredRequests = requests.filter((request) => {
        if (filter === 'all') return true;
        if (filter === 'matched') return request.referrals.length > 0;
        if (filter === 'active') return request.referrals.length === 0;
        return true;
    });

    return (
        <div>
            {/* Stats Overview */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Home size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{requests.length}</div>
                        <div className={styles.statLabel}>Total Requests</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>
                            {requests.reduce((sum, r) => sum + r.referrals.length, 0)}
                        </div>
                        <div className={styles.statLabel}>Realtor Matches</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div className={styles.statValue}>
                            {requests.filter(r => r.referrals.some(ref => ref.status === 'ACCEPTED')).length}
                        </div>
                        <div className={styles.statLabel}>Active Connections</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <Link href="/buyer/request/new" className={styles.primaryButton}>
                    <Home size={18} />
                    New Request
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                <button
                    className={filter === 'all' ? styles.filterTabActive : styles.filterTab}
                    onClick={() => setFilter('all')}
                >
                    All Requests ({requests.length})
                </button>
                <button
                    className={filter === 'active' ? styles.filterTabActive : styles.filterTab}
                    onClick={() => setFilter('active')}
                >
                    Pending ({requests.filter(r => r.referrals.length === 0).length})
                </button>
                <button
                    className={filter === 'matched' ? styles.filterTabActive : styles.filterTab}
                    onClick={() => setFilter('matched')}
                >
                    Matched ({requests.filter(r => r.referrals.length > 0).length})
                </button>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className={styles.emptyState}>
                    <Home size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                        {filter === 'all' ? 'No Requests Yet' : `No ${filter} requests`}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        Create your first buyer request to get matched with realtors
                    </p>
                    <Link href="/buyer/request/new" className={styles.primaryButton}>
                        Create Request
                    </Link>
                </div>
            ) : (
                <div className={styles.requestsList}>
                    {filteredRequests.map((request) => (
                        <div key={request.id} className={styles.requestCard}>
                            <div className={styles.requestHeader}>
                                <div>
                                    <h3 className={styles.requestTitle}>
                                        Home Buyer Request
                                    </h3>
                                    <div className={styles.requestMeta}>
                                        <Calendar size={14} />
                                        <span>Created {new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={styles.requestStatus}>
                                    {request.referrals.length > 0 ? (
                                        <span className={styles.statusMatched}>
                                            {request.referrals.length} Match{request.referrals.length !== 1 ? 'es' : ''}
                                        </span>
                                    ) : (
                                        <span className={styles.statusPending}>Pending</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.requestDetails}>
                                <div className={styles.detailRow}>
                                    <MapPin size={16} />
                                    <span>{request.locations}</span>
                                </div>
                                {request.budgetMin && request.budgetMax && (
                                    <div className={styles.detailRow}>
                                        <DollarSign size={16} />
                                        <span>
                                            ${request.budgetMin.toLocaleString()} - ${request.budgetMax.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {request.timeframe && (
                                    <div className={styles.detailRow}>
                                        <Calendar size={16} />
                                        <span>{request.timeframe}</span>
                                    </div>
                                )}
                                {request.languages && (
                                    <div className={styles.detailRow}>
                                        <Users size={16} />
                                        <span>{request.languages}</span>
                                    </div>
                                )}
                            </div>

                            {/* Matched Realtors */}
                            {request.referrals.length > 0 && (
                                <div className={styles.matchedRealtors}>
                                    <h4 className={styles.matchedTitle}>Matched Realtors</h4>
                                    <div className={styles.realtorsList}>
                                        {request.referrals.map((referral) => (
                                            <div key={referral.id} className={styles.realtorCard}>
                                                <div className={styles.realtorInfo}>
                                                    {referral.realtor.user.image ? (
                                                        <img
                                                            src={referral.realtor.user.image}
                                                            alt={referral.realtor.user.name || 'Realtor'}
                                                            className={styles.realtorAvatar}
                                                        />
                                                    ) : (
                                                        <div className={styles.realtorAvatarPlaceholder}>
                                                            {(referral.realtor.user.name || 'R')[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className={styles.realtorName}>
                                                            {referral.realtor.user.name}
                                                        </div>
                                                        <div className={styles.realtorMeta}>
                                                            {referral.realtor.brokerage}
                                                        </div>
                                                        <div className={styles.realtorLanguages}>
                                                            {referral.realtor.languages}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.realtorActions}>
                                                    <a
                                                        href={`mailto:${referral.realtor.user.email}`}
                                                        className={styles.contactButton}
                                                    >
                                                        <Mail size={16} />
                                                        Email
                                                    </a>
                                                    <span className={styles.referralStatus}>
                                                        {referral.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.requestActions}>
                                <Link
                                    href={`/buyer/requests/${request.id}`}
                                    className={styles.viewButton}
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
