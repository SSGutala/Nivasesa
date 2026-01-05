import styles from '../dashboard/dashboard.module.css';
import Link from 'next/link';
import { HOST_LISTINGS } from '@/lib/host-demo-data';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';

export default function ListingsPage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>My Listings</h1>
                    <p className={styles.kpiLabel}>Manage your properties and rooms.</p>
                </div>
                <div className={styles.actions}>
                    <Link href="/host/listings/new" className={styles.primaryBtn}>
                        Create New Listing
                    </Link>
                </div>
            </div>

            <div className={styles.card}>
                {HOST_LISTINGS.map(listing => (
                    <div key={listing.id} className={styles.listingRow}>
                        <img src={listing.image} alt={listing.title} className={styles.listingThumb} />
                        <div className={styles.listingInfo}>
                            <span className={styles.listingTitle}>{listing.title}</span>
                            <div className={styles.listingMeta}>
                                <span className={`${styles.statusBadge} ${listing.status === 'Available' ? styles.statusAvailable :
                                        listing.status === 'In Discussion' ? styles.statusDiscussion :
                                            styles.statusDraft
                                    }`}>
                                    {listing.status}
                                </span>
                                <span>• {listing.views} Views</span>
                                <span>• {listing.inquiries} Inquiries</span>
                                <span>• ${listing.price}/mo</span>
                            </div>
                        </div>
                        <div className={styles.rowActions}>
                            <button className={styles.iconBtn} title="View"><Eye size={18} /></button>
                            <button className={styles.iconBtn} title="Edit"><Edit2 size={18} /></button>
                            <button className={styles.iconBtn} title="More"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
