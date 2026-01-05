import styles from '../dashboard/dashboard.module.css';
import { HOST_TRANSACTIONS } from '@/lib/host-demo-data';

export default function TransactionsPage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Transactions</h1>
                    <p className={styles.kpiLabel}>View your earnings and payment history.</p>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.listingRow} style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb', fontWeight: 600, fontSize: '13px', color: '#6b7280' }}>
                    <div style={{ flex: 2 }}>Description</div>
                    <div style={{ flex: 1 }}>Date</div>
                    <div style={{ flex: 1 }}>Status</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
                </div>
                {HOST_TRANSACTIONS.map(tx => (
                    <div key={tx.id} className={styles.listingRow}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                            <span className={styles.listingTitle}>{tx.renter}</span>
                            <span className={styles.snippet} style={{ fontSize: '12px' }}>{tx.listing}</span>
                        </div>
                        <div style={{ flex: 1, fontSize: '14px', color: '#6b7280' }}>
                            {tx.date}
                        </div>
                        <div style={{ flex: 1 }}>
                            <span className={`${styles.statusBadge} ${tx.status === 'Completed' ? styles.statusAvailable :
                                    tx.status === 'In Escrow' ? styles.statusDraft :
                                        styles.statusDiscussion
                                }`}>
                                {tx.status}
                            </span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, color: tx.amount > 0 ? '#059669' : '#111827' }}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
