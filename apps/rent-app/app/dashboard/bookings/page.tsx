import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getGuestBookingsAction } from '@/actions/booking';
import { cancelBookingAction } from '@/actions/booking';
import styles from './bookings.module.css';

export default async function BookingsPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const bookings = await getGuestBookingsAction();

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
                return 'Payment Pending';
            case 'PENDING':
                return 'Awaiting Host Approval';
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>My Bookings</h1>
                <p className={styles.subtitle}>Track your room reservations</p>
            </div>

            {bookings.length === 0 ? (
                <div className={styles.empty}>
                    <p>You don't have any bookings yet.</p>
                    <a href="/rooms" className={styles.browseLink}>
                        Browse Available Rooms
                    </a>
                </div>
            ) : (
                <div className={styles.bookingsList}>
                    {bookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingCard}>
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
                                    <span className={styles.label}>Total Price:</span>
                                    <span className={styles.value}>
                                        ${booking.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                {booking.serviceFee > 0 && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Service Fee:</span>
                                        <span className={styles.value}>
                                            ${booking.serviceFee.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {booking.depositAmount && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Deposit:</span>
                                        <span className={styles.value}>
                                            ${booking.depositAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {booking.guestMessage && (
                                <div className={styles.messageBox}>
                                    <strong>Your Message:</strong>
                                    <p>{booking.guestMessage}</p>
                                </div>
                            )}

                            {booking.hostResponse && (
                                <div className={styles.messageBox}>
                                    <strong>Host Response:</strong>
                                    <p>{booking.hostResponse}</p>
                                </div>
                            )}

                            {booking.declineReason && (
                                <div className={styles.messageBox}>
                                    <strong>Decline Reason:</strong>
                                    <p>{booking.declineReason}</p>
                                </div>
                            )}

                            {booking.cancellationReason && (
                                <div className={styles.messageBox}>
                                    <strong>Cancellation Reason:</strong>
                                    <p>{booking.cancellationReason}</p>
                                </div>
                            )}

                            <div className={styles.bookingActions}>
                                {booking.status === 'PENDING' ||
                                booking.status === 'CONFIRMED' ? (
                                    <form action={cancelBookingAction.bind(null, booking.id)}>
                                        <button type="submit" className={styles.cancelButton}>
                                            Cancel Booking
                                        </button>
                                    </form>
                                ) : null}

                                {booking.status === 'CONFIRMED' && booking.listing.address && (
                                    <div className={styles.addressBox}>
                                        <strong>Address:</strong>
                                        <p>{booking.listing.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
