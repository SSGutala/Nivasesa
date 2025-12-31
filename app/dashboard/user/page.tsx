'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home,
    Send,
    Inbox,
    MapPin,
    DollarSign,
    Calendar,
    Eye,
    Edit,
    Trash2,
    X,
    Check,
    Plus,
    MessageCircle,
    User,
    Globe,
} from 'lucide-react';
import {
    getDashboardDataAction,
    deleteListingAction,
    withdrawApplicationAction,
    respondToApplicationAction,
    markListingAsRentedAction,
    reactivateListingAction,
    type DashboardData,
} from '@/actions/user-dashboard';
import styles from './page.module.css';

export default function UserDashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        const result = await getDashboardDataAction();
        if (result.success && result.data) {
            setData(result.data);
        } else {
            setError(result.message || 'Failed to load dashboard data');
        }
        setLoading(false);
    };

    const handleDeleteListing = async (listingId: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        setActionLoading(listingId);
        const result = await deleteListingAction(listingId);
        if (result.success) {
            await loadData();
        } else {
            alert(result.message);
        }
        setActionLoading(null);
    };

    const handleWithdrawApplication = async (applicationId: string) => {
        if (!confirm('Are you sure you want to withdraw this application?')) return;

        setActionLoading(applicationId);
        const result = await withdrawApplicationAction(applicationId);
        if (result.success) {
            await loadData();
        } else {
            alert(result.message);
        }
        setActionLoading(null);
    };

    const handleRespondToApplication = async (
        applicationId: string,
        status: 'accepted' | 'rejected'
    ) => {
        const confirmMsg =
            status === 'accepted'
                ? 'Accept this application?'
                : 'Reject this application?';
        if (!confirm(confirmMsg)) return;

        setActionLoading(applicationId);
        const result = await respondToApplicationAction(applicationId, status);
        if (result.success) {
            await loadData();
        } else {
            alert(result.message);
        }
        setActionLoading(null);
    };

    const handleMarkAsRented = async (listingId: string) => {
        if (!confirm('Mark this listing as rented?')) return;

        setActionLoading(listingId);
        const result = await markListingAsRentedAction(listingId);
        if (result.success) {
            await loadData();
        } else {
            alert(result.message);
        }
        setActionLoading(null);
    };

    const handleReactivate = async (listingId: string) => {
        setActionLoading(listingId);
        const result = await reactivateListingAction(listingId);
        if (result.success) {
            await loadData();
        } else {
            alert(result.message);
        }
        setActionLoading(null);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return styles.pending;
            case 'accepted':
                return styles.accepted;
            case 'rejected':
                return styles.rejected;
            case 'withdrawn':
                return styles.withdrawn;
            case 'active':
                return styles.active;
            case 'rented':
                return styles.rented;
            case 'expired':
                return styles.expired;
            default:
                return '';
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading your dashboard...</div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>No data available</div>
            </div>
        );
    }

    const pendingApplicationsCount = data.myApplications.filter(
        (app) => app.status === 'pending'
    ).length;
    const receivedPendingCount = data.receivedApplications.filter(
        (app) => app.status === 'pending'
    ).length;
    const activeListingsCount = data.myListings.filter(
        (listing) => listing.status === 'active'
    ).length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Dashboard</h1>
                <p className={styles.subtitle}>
                    Manage your listings, applications, and more
                </p>
            </div>

            {/* MY LISTINGS SECTION */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Home size={24} />
                        My Listings
                        {activeListingsCount > 0 && (
                            <span className={styles.badge}>{activeListingsCount}</span>
                        )}
                    </h2>
                    <button
                        className={styles.addButton}
                        onClick={() => router.push('/rooms/post')}
                    >
                        <Plus size={18} />
                        Post New Room
                    </button>
                </div>

                {data.myListings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Home size={48} className={styles.emptyIcon} />
                        <h3 className={styles.emptyTitle}>No listings yet</h3>
                        <p className={styles.emptyText}>
                            Post a room to find the perfect roommate
                        </p>
                        <button
                            className={styles.emptyButton}
                            onClick={() => router.push('/rooms/post')}
                        >
                            <Plus size={20} />
                            Post Your First Room
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {data.myListings.map((listing) => (
                            <div key={listing.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>{listing.title}</h3>
                                        <p className={styles.cardSubtitle}>
                                            {listing.roomType}
                                        </p>
                                    </div>
                                    <span
                                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                                            listing.status
                                        )}`}
                                    >
                                        {listing.status}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.infoRow}>
                                        <MapPin size={16} />
                                        {listing.city}, {listing.state}
                                    </div>
                                    <div className={styles.infoRow}>
                                        <DollarSign size={16} />
                                        <span className={styles.price}>
                                            ${listing.rent}
                                            <span className={styles.priceLabel}>/month</span>
                                        </span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <Calendar size={16} />
                                        Available: {formatDate(listing.availableFrom)}
                                    </div>
                                </div>

                                <div className={styles.statsRow}>
                                    <div className={styles.stat}>
                                        <p className={styles.statValue}>{listing.viewCount}</p>
                                        <p className={styles.statLabel}>Views</p>
                                    </div>
                                    <div className={styles.stat}>
                                        <p className={styles.statValue}>
                                            {listing._count.applications}
                                        </p>
                                        <p className={styles.statLabel}>Applications</p>
                                    </div>
                                    <div className={styles.stat}>
                                        <p className={styles.statValue}>{listing.freedomScore}</p>
                                        <p className={styles.statLabel}>Freedom Score</p>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => router.push(`/rooms/${listing.id}`)}
                                        title="View listing"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => router.push(`/rooms/${listing.id}/edit`)}
                                        disabled={actionLoading === listing.id}
                                        title="Edit listing"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    {listing.status === 'active' && (
                                        <button
                                            className={`${styles.actionButton} ${styles.success}`}
                                            onClick={() => handleMarkAsRented(listing.id)}
                                            disabled={actionLoading === listing.id}
                                            title="Mark as rented"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    {listing.status === 'rented' && (
                                        <button
                                            className={`${styles.actionButton} ${styles.primary}`}
                                            onClick={() => handleReactivate(listing.id)}
                                            disabled={actionLoading === listing.id}
                                            title="Reactivate"
                                        >
                                            Reactivate
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.actionButton} ${styles.danger}`}
                                        onClick={() => handleDeleteListing(listing.id)}
                                        disabled={actionLoading === listing.id}
                                        title="Delete listing"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* MY APPLICATIONS SECTION */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Send size={24} />
                        My Applications
                        {pendingApplicationsCount > 0 && (
                            <span className={styles.badge}>{pendingApplicationsCount}</span>
                        )}
                    </h2>
                </div>

                {data.myApplications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Send size={48} className={styles.emptyIcon} />
                        <h3 className={styles.emptyTitle}>No applications sent</h3>
                        <p className={styles.emptyText}>
                            Browse available rooms and apply to ones you like
                        </p>
                        <button
                            className={styles.emptyButton}
                            onClick={() => router.push('/rooms')}
                        >
                            Browse Rooms
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {data.myApplications.map((application) => (
                            <div key={application.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>
                                            {application.listing.title}
                                        </h3>
                                        <p className={styles.cardSubtitle}>
                                            {application.listing.roomType}
                                        </p>
                                    </div>
                                    <span
                                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.infoRow}>
                                        <MapPin size={16} />
                                        {application.listing.city}, {application.listing.state}
                                    </div>
                                    <div className={styles.infoRow}>
                                        <DollarSign size={16} />
                                        <span className={styles.price}>
                                            ${application.listing.rent}
                                            <span className={styles.priceLabel}>/month</span>
                                        </span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <User size={16} />
                                        Host: {application.listing.owner.name || 'Anonymous'}
                                    </div>
                                    <div className={styles.infoRow}>
                                        <Calendar size={16} />
                                        Applied: {formatDate(application.createdAt)}
                                    </div>

                                    {application.message && (
                                        <div className={styles.message}>
                                            <p className={styles.messageText}>
                                                {application.message}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() =>
                                            router.push(`/rooms/${application.listing.id}`)
                                        }
                                    >
                                        <Eye size={16} />
                                        View Listing
                                    </button>
                                    {application.status === 'pending' && (
                                        <button
                                            className={`${styles.actionButton} ${styles.danger}`}
                                            onClick={() =>
                                                handleWithdrawApplication(application.id)
                                            }
                                            disabled={actionLoading === application.id}
                                        >
                                            <X size={16} />
                                            Withdraw
                                        </button>
                                    )}
                                    {application.status === 'accepted' && (
                                        <button
                                            className={`${styles.actionButton} ${styles.primary}`}
                                            onClick={() => router.push('/messages')}
                                        >
                                            <MessageCircle size={16} />
                                            Message
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* RECEIVED APPLICATIONS SECTION */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Inbox size={24} />
                        Received Applications
                        {receivedPendingCount > 0 && (
                            <span className={styles.badge}>{receivedPendingCount}</span>
                        )}
                    </h2>
                </div>

                {data.receivedApplications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Inbox size={48} className={styles.emptyIcon} />
                        <h3 className={styles.emptyTitle}>No applications received</h3>
                        <p className={styles.emptyText}>
                            When people apply to your listings, they will appear here
                        </p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {data.receivedApplications.map((application) => (
                            <div key={application.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>
                                            {application.listing.title}
                                        </h3>
                                        <p className={styles.cardSubtitle}>Application</p>
                                    </div>
                                    <span
                                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.applicantInfo}>
                                        {application.applicant.user.image ? (
                                            <img
                                                src={application.applicant.user.image}
                                                alt={
                                                    application.applicant.user.name || 'Applicant'
                                                }
                                                className={styles.avatarImage}
                                            />
                                        ) : (
                                            <div className={styles.avatar}>
                                                {application.applicant.user.name?.[0] ||
                                                    application.applicant.user.email[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div className={styles.applicantDetails}>
                                            <p className={styles.applicantName}>
                                                {application.applicant.user.name || 'Anonymous'}
                                            </p>
                                            <p className={styles.applicantEmail}>
                                                {application.applicant.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailItem}>
                                            <p className={styles.detailLabel}>Budget</p>
                                            <p className={styles.detailValue}>
                                                ${application.applicant.maxBudget.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <p className={styles.detailLabel}>Diet</p>
                                            <p className={styles.detailValue}>
                                                {application.applicant.dietaryPreference}
                                            </p>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <p className={styles.detailLabel}>Languages</p>
                                            <p className={styles.detailValue}>
                                                {application.applicant.languages
                                                    .split(',')
                                                    .slice(0, 2)
                                                    .join(', ')}
                                            </p>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <p className={styles.detailLabel}>Applied</p>
                                            <p className={styles.detailValue}>
                                                {formatDate(application.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {application.message && (
                                        <div className={styles.message}>
                                            <p className={styles.messageText}>
                                                {application.message}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actions}>
                                    {application.status === 'pending' ? (
                                        <>
                                            <button
                                                className={`${styles.actionButton} ${styles.success}`}
                                                onClick={() =>
                                                    handleRespondToApplication(
                                                        application.id,
                                                        'accepted'
                                                    )
                                                }
                                                disabled={actionLoading === application.id}
                                            >
                                                <Check size={16} />
                                                Accept
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.danger}`}
                                                onClick={() =>
                                                    handleRespondToApplication(
                                                        application.id,
                                                        'rejected'
                                                    )
                                                }
                                                disabled={actionLoading === application.id}
                                            >
                                                <X size={16} />
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className={styles.actionButton}
                                                onClick={() =>
                                                    router.push(`/rooms/${application.listing.id}`)
                                                }
                                            >
                                                <Eye size={16} />
                                                View Listing
                                            </button>
                                            {application.status === 'accepted' && (
                                                <button
                                                    className={`${styles.actionButton} ${styles.primary}`}
                                                    onClick={() => router.push('/messages')}
                                                >
                                                    <MessageCircle size={16} />
                                                    Message
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
