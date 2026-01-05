import styles from '../dashboard/dashboard.module.css';
import { HOST_MESSAGES } from '@/lib/host-demo-data';

export default function MessagesPage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Messages</h1>
                    <p className={styles.kpiLabel}>Chat with potential tenants.</p>
                </div>
            </div>

            <div className={styles.card}>
                {HOST_MESSAGES.map(msg => (
                    <div key={msg.id} className={styles.messageRow}>
                        <div className={styles.avatar}>
                            {msg.avatar ? (
                                <img src={msg.avatar} alt={msg.renterName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                msg.renterName.charAt(0)
                            )}
                        </div>
                        <div className={styles.messageContent}>
                            <div className={styles.messageHeader}>
                                <span className={styles.sender}>{msg.renterName}</span>
                                <span className={styles.time}>{msg.time}</span>
                            </div>
                            <span className={styles.snippet} style={{ fontWeight: 500, color: '#111827', marginBottom: '4px', fontSize: '12px' }}>
                                {msg.listingTitle}
                            </span>
                            <span className={styles.snippet}>
                                {msg.snippet}
                            </span>
                        </div>
                        {msg.needsAction && (
                            <div style={{ alignSelf: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
