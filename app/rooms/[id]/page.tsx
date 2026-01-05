'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoomListingById, applyToRoom, respondToApplication, getOrCreateApplicationConversation, getMyApplicationForListing } from '@/actions/rooms';
import { getFreedomScoreLabel } from '@/lib/freedom-score';
import {
    ArrowLeft,
    MapPin,
    Home,
    BedDouble,
    Bath,
    Calendar,
    DollarSign,
    Check,
    X,
    Users,
    Wine,
    Moon,
    Clock,
    Cigarette,
    Cannabis,
    ChefHat,
    Eye,
    Heart,
    MessageSquare,
    Shield,
    Image as ImageIcon,
} from 'lucide-react';
import styles from './page.module.css';

type RoomListing = Awaited<ReturnType<typeof getRoomListingById>>;

export default function RoomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<RoomListing>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [userApplication, setUserApplication] = useState<any>(null);

    useEffect(() => {
        async function loadListing() {
            if (!params.id) return;
            const data = await getRoomListingById(params.id as string);
            setListing(data);

            // Check if current user has applied
            const myApp = await getMyApplicationForListing(params.id as string);
            setUserApplication(myApp);
            setHasApplied(!!myApp);

            setLoading(false);
        }
        loadListing();
    }, [params.id]);

    const handleApply = async () => {
        setApplying(true);
        setFeedback(null);
        const result = await applyToRoom(listing!.id, applicationMessage);
        setApplying(false);
        setShowApplyModal(false);

        if (result.success) {
            setHasApplied(true);
            setFeedback({ type: 'success', message: result.message || 'Application submitted!' });
        } else {
            setFeedback({ type: 'error', message: result.message || 'Failed to apply' });
        }
    };

    const handleRespond = async (applicationId: string, status: 'accepted' | 'rejected') => {
        const result = await respondToApplication(applicationId, status);
        if (result.success) {
            // Refresh listing data
            const data = await getRoomListingById(params.id as string);
            setListing(data);
            setFeedback({
                type: 'success',
                message: status === 'accepted'
                    ? 'Application accepted! A conversation has been created.'
                    : `Application ${status}`
            });
        } else {
            setFeedback({ type: 'error', message: result.message || 'Failed to respond' });
        }
    };

    const handleMessageApplicant = async (applicationId: string) => {
        const result = await getOrCreateApplicationConversation(applicationId);
        if (result.success && result.conversationId) {
            router.push(`/messages?conversation=${result.conversationId}`);
        } else {
            setFeedback({ type: 'error', message: result.message || 'Failed to start conversation' });
        }
    };

    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </main>
        );
    }

    if (!listing) {
        return (
            <main className={styles.container}>
                <div className={styles.notFound}>
                    <h1>Room Not Found</h1>
                    <p>This listing may have been removed or is no longer available.</p>
                    <Link href="/rooms" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Rooms
                    </Link>
                </div>
            </main>
        );
    }

    const freedomLabel = getFreedomScoreLabel(listing.freedomScore);
    const availableDate = new Date(listing.availableFrom);
    const isAvailableNow = availableDate <= new Date();

    // Parse photos from JSON
    const photos: string[] = listing.photos ? JSON.parse(listing.photos) : [];

    return (
        <main className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/rooms" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Rooms
                </Link>
            </nav>

            {/* Feedback */}
            {feedback && (
                <div className={`${styles.feedback} ${styles[feedback.type]}`}>
                    {feedback.message}
                </div>
            )}

            {/* Photo Gallery */}
            {photos.length > 0 ? (
                <div className={styles.photoGallery}>
                    <div className={styles.photoGrid}>
                        {photos.slice(0, 5).map((photo, index) => (
                            <div key={index} className={styles.photoItem}>
                                <img src={photo} alt={`Room photo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.photoPlaceholder}>
                    <ImageIcon size={120} color="#d97706" />
                </div>
            )}

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Left Column - Details */}
                <div className={styles.mainContent}>
                    {/* Header */}
                    <header className={styles.header}>
                        <div className={styles.headerTop}>
                            <div>
                                <h1 className={styles.title}>{listing.title}</h1>
                                <p className={styles.location}>
                                    <MapPin size={16} />
                                    {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
                                    {listing.city}, {listing.state} {listing.zipcode}
                                </p>
                            </div>
                            <div className={styles.rent}>
                                <span className={styles.rentAmount}>${listing.rent.toLocaleString()}</span>
                                <span className={styles.rentPeriod}>/month</span>
                            </div>
                        </div>

                        <div className={styles.tags}>
                            <span className={styles.tag}>{listing.roomType}</span>
                            <span className={styles.tag}>{listing.propertyType}</span>
                            {listing.furnished && <span className={styles.tag}>Furnished</span>}
                            {listing.parking && <span className={styles.tag}>Parking</span>}
                            {listing.laundryInUnit && <span className={styles.tag}>In-Unit Laundry</span>}
                            {listing.lgbtqFriendly && (
                                <span className={`${styles.tag} ${styles.prideTag}`}>LGBTQ+ Friendly</span>
                            )}
                            {listing.cannabisPolicy === '420 Friendly' && (
                                <span className={`${styles.tag} ${styles.greenTag}`}>420 Friendly</span>
                            )}
                        </div>

                        {/* View Count */}
                        <div className={styles.viewCount}>
                            <Eye size={14} /> {listing.viewCount || 0} views
                        </div>
                    </header>

                    {/* Freedom Score Card */}
                    <section className={styles.freedomSection}>
                        <div
                            className={styles.freedomCard}
                            style={{ borderColor: freedomLabel.color }}
                        >
                            <div className={styles.freedomHeader}>
                                <div
                                    className={styles.freedomBadge}
                                    style={{ backgroundColor: freedomLabel.color }}
                                >
                                    {listing.freedomScore}
                                </div>
                                <div>
                                    <h3 style={{ color: freedomLabel.color }}>{freedomLabel.label}</h3>
                                    <p>{freedomLabel.description}</p>
                                </div>
                            </div>

                            {/* Freedom Score Breakdown */}
                            <div className={styles.freedomBreakdown}>
                                <h4>Household Policies</h4>
                                <div className={styles.policyGrid}>
                                    <PolicyItem
                                        icon={<Users size={16} />}
                                        label="Overnight Guests"
                                        value={listing.overnightGuests}
                                    />
                                    <PolicyItem
                                        icon={<Calendar size={16} />}
                                        label="Extended Stays"
                                        value={listing.extendedStays}
                                    />
                                    <PolicyItem
                                        icon={<Heart size={16} />}
                                        label="Partner Visits"
                                        value={listing.partnerVisits}
                                    />
                                    <PolicyItem
                                        icon={<Users size={16} />}
                                        label="Parties"
                                        value={listing.partiesAllowed}
                                    />
                                    <PolicyItem
                                        icon={<Clock size={16} />}
                                        label="Curfew"
                                        value={listing.curfew || 'None'}
                                    />
                                    <PolicyItem
                                        icon={<Moon size={16} />}
                                        label="Night Owl Friendly"
                                        value={listing.nightOwlFriendly ? 'Yes' : 'No'}
                                        isBoolean
                                        boolValue={listing.nightOwlFriendly}
                                    />
                                    <PolicyItem
                                        icon={<Cigarette size={16} />}
                                        label="Smoking"
                                        value={listing.smokingPolicy}
                                    />
                                    <PolicyItem
                                        icon={<Cannabis size={16} />}
                                        label="Cannabis"
                                        value={listing.cannabisPolicy}
                                    />
                                    <PolicyItem
                                        icon={<Wine size={16} />}
                                        label="Alcohol"
                                        value={listing.alcoholPolicy}
                                    />
                                    <PolicyItem
                                        icon={<ChefHat size={16} />}
                                        label="Kitchen Access"
                                        value={listing.fullKitchenAccess ? 'Full Access' : 'Limited'}
                                        isBoolean
                                        boolValue={listing.fullKitchenAccess}
                                    />
                                    <PolicyItem
                                        icon={<ChefHat size={16} />}
                                        label="Beef/Pork Cooking"
                                        value={listing.beefPorkCookingOk ? 'OK' : 'Not Allowed'}
                                        isBoolean
                                        boolValue={listing.beefPorkCookingOk}
                                    />
                                    <PolicyItem
                                        icon={<Shield size={16} />}
                                        label="Landlord On-Site"
                                        value={listing.landlordOnSite ? 'Yes' : 'No'}
                                        isBoolean
                                        boolValue={!listing.landlordOnSite}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Property Details */}
                    <section className={styles.section}>
                        <h2>Property Details</h2>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <Home size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Property Type</span>
                                    <span className={styles.detailValue}>{listing.propertyType}</span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <BedDouble size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Bedrooms</span>
                                    <span className={styles.detailValue}>{listing.totalBedrooms}</span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <Bath size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Bathrooms</span>
                                    <span className={styles.detailValue}>{listing.totalBathrooms}</span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Available</span>
                                    <span className={styles.detailValue}>
                                        {isAvailableNow ? 'Now' : availableDate.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <DollarSign size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Deposit</span>
                                    <span className={styles.detailValue}>
                                        {listing.deposit ? `$${listing.deposit.toLocaleString()}` : 'Ask'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <DollarSign size={20} />
                                <div>
                                    <span className={styles.detailLabel}>Utilities</span>
                                    <span className={styles.detailValue}>
                                        {listing.utilitiesIncluded ? 'Included' : 'Not Included'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Description */}
                    <section className={styles.section}>
                        <h2>Description</h2>
                        <p className={styles.description}>{listing.description}</p>
                    </section>

                    {/* Amenities */}
                    {listing.amenities && (
                        <section className={styles.section}>
                            <h2>Amenities</h2>
                            <div className={styles.amenities}>
                                {listing.amenities.split(',').map((amenity, idx) => (
                                    <span key={idx} className={styles.amenityTag}>
                                        <Check size={14} /> {amenity.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Preferences */}
                    <section className={styles.section}>
                        <h2>Roommate Preferences</h2>
                        <div className={styles.preferences}>
                            {listing.preferredGender && (
                                <div className={styles.preferenceItem}>
                                    <span className={styles.preferenceLabel}>Preferred Gender:</span>
                                    <span>{listing.preferredGender}</span>
                                </div>
                            )}
                            {listing.preferredAge && (
                                <div className={styles.preferenceItem}>
                                    <span className={styles.preferenceLabel}>Preferred Age:</span>
                                    <span>{listing.preferredAge}</span>
                                </div>
                            )}
                            {listing.languages && (
                                <div className={styles.preferenceItem}>
                                    <span className={styles.preferenceLabel}>Languages:</span>
                                    <span>{listing.languages}</span>
                                </div>
                            )}
                            {listing.minLease && (
                                <div className={styles.preferenceItem}>
                                    <span className={styles.preferenceLabel}>Minimum Lease:</span>
                                    <span>{listing.minLease}</span>
                                </div>
                            )}
                            {listing.petsPolicy && (
                                <div className={styles.preferenceItem}>
                                    <span className={styles.preferenceLabel}>Pets:</span>
                                    <span>{listing.petsPolicy}</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column - Actions & Owner */}
                <aside className={styles.sidebar}>
                    {/* Owner Card */}
                    <div className={styles.ownerCard}>
                        <div className={styles.ownerInfo}>
                            {listing.owner.image ? (
                                <img
                                    src={listing.owner.image}
                                    alt={listing.owner.name || 'Owner'}
                                    className={styles.ownerAvatar}
                                />
                            ) : (
                                <div className={styles.ownerAvatarPlaceholder}>
                                    {listing.owner.name?.[0] || 'O'}
                                </div>
                            )}
                            <div>
                                <h3>Listed by</h3>
                                <p>{listing.owner.name || 'Anonymous'}</p>
                            </div>
                        </div>

                        {!isOwner && !hasApplied && listing.status === 'active' && (
                            <button
                                className={styles.applyButton}
                                onClick={() => setShowApplyModal(true)}
                            >
                                <MessageSquare size={18} /> Apply Now
                            </button>
                        )}

                        {hasApplied && userApplication && userApplication.status === 'pending' && (
                            <div className={styles.appliedBadge}>
                                <Check size={18} /> Application Submitted
                            </div>
                        )}

                        {hasApplied && userApplication && userApplication.status === 'accepted' && (
                            <>
                                <div className={styles.appliedBadge}>
                                    <Check size={18} /> Application Accepted
                                </div>
                                <button
                                    className={styles.applyButton}
                                    onClick={() => handleMessageApplicant(userApplication.id)}
                                    style={{ marginTop: '12px' }}
                                >
                                    <MessageSquare size={18} /> Message Host
                                </button>
                            </>
                        )}

                        {hasApplied && userApplication && userApplication.status === 'rejected' && (
                            <div className={styles.appliedBadge} style={{ background: '#fee2e2', color: '#991b1b' }}>
                                <X size={18} /> Application Declined
                            </div>
                        )}
                    </div>

                    {/* Quick Facts */}
                    <div className={styles.quickFacts}>
                        <h3>Quick Facts</h3>
                        <ul>
                            <li>
                                <Check size={14} />
                                <span>
                                    {listing.unmarriedCouplesOk
                                        ? 'Unmarried couples welcome'
                                        : 'Married couples only'}
                                </span>
                            </li>
                            <li>
                                <Check size={14} />
                                <span>
                                    {listing.sameSexCouplesWelcome
                                        ? 'Same-sex couples welcome'
                                        : 'Traditional couples only'}
                                </span>
                            </li>
                            <li>
                                {listing.privateEntrance ? <Check size={14} /> : <X size={14} />}
                                <span>Private entrance</span>
                            </li>
                            <li>
                                {listing.nonJudgmental ? <Check size={14} /> : <X size={14} />}
                                <span>Non-judgmental household</span>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Apply to this Room</h2>
                        <p>
                            Send a message to the landlord. Make sure you have a{' '}
                            <Link href="/roommates/profile">roommate profile</Link> set up.
                        </p>
                        <textarea
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            placeholder="Introduce yourself and explain why you'd be a good fit..."
                            rows={5}
                        />
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowApplyModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleApply}
                                disabled={applying}
                            >
                                {applying ? 'Sending...' : 'Send Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Section (for owners) */}
            {listing.applications && listing.applications.length > 0 && (
                <section className={styles.applicationsSection}>
                    <h2>Applications ({listing.applications.length})</h2>
                    <div className={styles.applicationsList}>
                        {listing.applications.map((app) => (
                            <div key={app.id} className={styles.applicationCard}>
                                <div className={styles.applicantInfo}>
                                    {app.applicant.user.image ? (
                                        <img
                                            src={app.applicant.user.image}
                                            alt={app.applicant.user.name || 'Applicant'}
                                            className={styles.applicantAvatar}
                                        />
                                    ) : (
                                        <div className={styles.applicantAvatarPlaceholder}>
                                            {app.applicant.user.name?.[0] || 'A'}
                                        </div>
                                    )}
                                    <div>
                                        <h4>{app.applicant.user.name || 'Anonymous'}</h4>
                                        <p className={styles.applicationDate}>
                                            Applied {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {app.message && <p className={styles.applicationMessage}>{app.message}</p>}
                                {app.status === 'pending' && (
                                    <div className={styles.applicationActions}>
                                        <button
                                            className={styles.acceptButton}
                                            onClick={() => handleRespond(app.id, 'accepted')}
                                        >
                                            <Check size={16} /> Accept
                                        </button>
                                        <button
                                            className={styles.rejectButton}
                                            onClick={() => handleRespond(app.id, 'rejected')}
                                        >
                                            <X size={16} /> Decline
                                        </button>
                                    </div>
                                )}
                                {app.status === 'accepted' && (
                                    <div className={styles.applicationActions}>
                                        <div
                                            className={`${styles.statusBadge} ${styles[app.status]}`}
                                        >
                                            {app.status}
                                        </div>
                                        <button
                                            className={styles.messageButton}
                                            onClick={() => handleMessageApplicant(app.id)}
                                        >
                                            <MessageSquare size={16} /> Message
                                        </button>
                                    </div>
                                )}
                                {app.status === 'rejected' && (
                                    <div
                                        className={`${styles.statusBadge} ${styles[app.status]}`}
                                    >
                                        {app.status}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

function PolicyItem({
    icon,
    label,
    value,
    isBoolean = false,
    boolValue = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    isBoolean?: boolean;
    boolValue?: boolean;
}) {
    return (
        <div className={styles.policyItem}>
            <span className={styles.policyIcon}>{icon}</span>
            <div>
                <span className={styles.policyLabel}>{label}</span>
                <span
                    className={`${styles.policyValue} ${isBoolean ? (boolValue ? styles.positive : styles.negative) : ''}`}
                >
                    {value}
                </span>
            </div>
        </div>
    );
}
