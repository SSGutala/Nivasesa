import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getHostBookingsAction } from '@/actions/booking';
import {
    confirmBookingAction,
    declineBookingAction,
    completeBookingAction,
} from '@/actions/booking';
import styles from './reservations.module.css';

export default async function ReservationsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const bookings = await getHostBookingsAction();

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'INQUIRY':
                return styles.statusInquiry;
            case 'PENDING':
                return styles.statusPending;
            case 'CONFIRMED':
                return styles.statusConfirmed;
            case 'ACTIVE':
                return styles.statusActive;
            case 'COMPLETED':
                return styles.statusCompleted;
            case 'DECLINED':
                return styles.statusDeclined;
            case 'CANCELLED':
                return styles.statusCancelled;
            case 'EXPIRED':
                return styles.statusExpired;
            default:
                return '';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'INQUIRY':
                return 'Guest Payment Pending';
            case 'PENDING':
                return 'Awaiting Your Approval';
            case 'CONFIRMED':
                return 'Confirmed';
            case 'ACTIVE':
                return 'Active';
            case 'COMPLETED':
                return 'Completed';
            case 'DECLINED':
                return 'Declined';
            case 'CANCELLED':
                return 'Cancelled';
            case 'EXPIRED':
                return 'Expired';
            default:
                return status;
        }
    };

    const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
    const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
    const activeBookings = bookings.filter((b) => b.status === 'ACTIVE');
    const pastBookings = bookings.filter((b) =>
        ['COMPLETED', 'CANCELLED', 'DECLINED', 'EXPIRED'].includes(b.status)
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>My Reservations</h1>
                <p className={styles.subtitle}>Manage bookings for your listings</p>
            </div>

            {bookings.length === 0 ? (
                <div className={styles.empty}>
                    <p>You don't have any reservations yet.</p>
                    <a href="/dashboard/rooms" className={styles.browseLink}>
                        Manage My Listings
                    </a>
                </div>
            ) : (
                <div className={styles.sectionsContainer}>
                    {pendingBookings.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Pending Approval ({pendingBookings.length})
                            </h2>
                            <div className={styles.bookingsList}>
                                {pendingBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        getStatusBadgeClass={getStatusBadgeClass}
                                        getStatusLabel={getStatusLabel}
                                        showActions={true}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {upcomingBookings.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Upcoming ({upcomingBookings.length})
                            </h2>
                            <div className={styles.bookingsList}>
                                {upcomingBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        getStatusBadgeClass={getStatusBadgeClass}
                                        getStatusLabel={getStatusLabel}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeBookings.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Active ({activeBookings.length})
                            </h2>
                            <div className={styles.bookingsList}>
                                {activeBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        getStatusBadgeClass={getStatusBadgeClass}
                                        getStatusLabel={getStatusLabel}
                                        showActions={true}
                                        showComplete={true}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {pastBookings.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Past ({pastBookings.length})</h2>
                            <div className={styles.bookingsList}>
                                {pastBookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        getStatusBadgeClass={getStatusBadgeClass}
                                        getStatusLabel={getStatusLabel}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function BookingCard({
    booking,
    getStatusBadgeClass,
    getStatusLabel,
    showActions,
    showComplete = false,
}: {
    booking: any;
    getStatusBadgeClass: (status: string) => string;
    getStatusLabel: (status: string) => string;
    showActions: boolean;
    showComplete?: boolean;
}) {
    return (
        <div className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
                <div>
                    <h3>{booking.listing.title}</h3>
                    <p className={styles.location}>
                        {booking.listing.city}, {booking.listing.state}
                    </p>
                </div>
                <span
                    className={`${styles.statusBadge} ${getStatusBadgeClass(booking.status)}`}
                >
                    {getStatusLabel(booking.status)}
                </span>
            </div>

            <div className={styles.bookingDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Check-in:</span>
                    <span className={styles.value}>
                        {new Date(booking.checkIn).toLocaleDateString()}
                    </span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Check-out:</span>
                    <span className={styles.value}>
                        {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Total:</span>
                    <span className={styles.value}>${booking.totalPrice.toFixed(2)}</span>
                </div>
                {booking.status === 'PENDING' && booking.expiresAt && (
                    <div className={styles.detailRow}>
                        <span className={styles.label}>Expires:</span>
                        <span className={styles.value}>
                            {new Date(booking.expiresAt).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>

            {booking.guestMessage && (
                <div className={styles.messageBox}>
                    <strong>Guest Message:</strong>
                    <p>{booking.guestMessage}</p>
                </div>
            )}

            {booking.hostResponse && (
                <div className={styles.messageBox}>
                    <strong>Your Response:</strong>
                    <p>{booking.hostResponse}</p>
                </div>
            )}

            {showActions && (
                <div className={styles.bookingActions}>
                    {booking.status === 'PENDING' && (
                        <>
                            <form action={confirmBookingAction.bind(null, booking.id)}>
                                <button type="submit" className={styles.approveButton}>
                                    Approve Booking
                                </button>
                            </form>
                            <form action={declineBookingAction.bind(null, booking.id)}>
                                <button type="submit" className={styles.declineButton}>
                                    Decline
                                </button>
                            </form>
                        </>
                    )}
                    {showComplete && booking.status === 'ACTIVE' && (
                        <form action={completeBookingAction.bind(null, booking.id)}>
                            <button type="submit" className={styles.completeButton}>
                                Mark as Complete
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
