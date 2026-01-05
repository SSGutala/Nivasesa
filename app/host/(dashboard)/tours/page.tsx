import styles from '../dashboard/dashboard.module.css';
import { HOST_TOURS } from '@/lib/host-demo-data';

export default function ToursPage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Tours</h1>
                    <p className={styles.kpiLabel}>Schedule and manage property viewings.</p>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.listingRow} style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, fontSize: '13px', color: '#6b7280' }}>
                    <div style={{ flex: 2 }}>Applicant</div>
                    <div style={{ flex: 2 }}>Listing</div>
                    <div style={{ flex: 1 }}>Date & Time</div>
                    <div style={{ flex: 1 }}>Type</div>
                    <div style={{ flex: 1 }}>Status</div>
                    <div style={{ width: '80px' }}></div>
                </div>
                {HOST_TOURS.map(tour => (
                    <div key={tour.id} className={styles.listingRow}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                            <span className={styles.listingTitle}>{tour.renterName}</span>
                        </div>
                        <div style={{ flex: 2, fontSize: '14px', color: '#374151' }}>
                            {tour.listingTitle}
                        </div>
                        <div style={{ flex: 1, fontSize: '14px' }}>
                            {tour.date}<br />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{tour.time}</span>
                        </div>
                        <div style={{ flex: 1, fontSize: '14px' }}>
                            {tour.type}
                        </div>
                        <div style={{ flex: 1 }}>
                            <span className={`${styles.statusBadge} ${tour.status === 'Confirmed' ? styles.statusAvailable :
                                    tour.status === 'Pending' ? styles.statusDiscussion :
                                        styles.statusDraft
                                }`}>
                                {tour.status}
                            </span>
                        </div>
                        <div style={{ width: '80px', display: 'flex', gap: '8px' }}>
                            <button className={styles.secondaryBtn} style={{ padding: '4px 8px', fontSize: '12px' }}>Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
