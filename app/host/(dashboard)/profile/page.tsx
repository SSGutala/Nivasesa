import styles from '../dashboard/dashboard.module.css';
import { HOST_PROFILE } from '@/lib/host-demo-data';
import { User, Shield, Star, Clock } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Host Profile</h1>
                    <p className={styles.kpiLabel}>Manage your public host profile and trust badge.</p>
                </div>
            </div>

            <div className={styles.dashboardGrid}>
                <div className={styles.mainColumn} style={{ gap: '24px' }}>
                    <div className={styles.card} style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <User size={40} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{HOST_PROFILE.name}</h2>
                            <p style={{ color: '#6b7280' }}>Host since {HOST_PROFILE.joinDate}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <span className={styles.pill} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Shield size={14} fill="#10b981" color="#10b981" /> {HOST_PROFILE.verificationLevel}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card} style={{ padding: '24px' }}>
                        <h3 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>Stats</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label className={styles.kpiLabel}>Response Rate</label>
                                <div style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                    <Star size={18} /> {HOST_PROFILE.responseRate}
                                </div>
                            </div>
                            <div>
                                <label className={styles.kpiLabel}>Response Time</label>
                                <div style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                    <Clock size={18} /> {HOST_PROFILE.responseTime}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>Contact Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label className={styles.kpiLabel} style={{ fontSize: '12px' }}>Email</label>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{HOST_PROFILE.email}</div>
                            </div>
                            <div>
                                <label className={styles.kpiLabel} style={{ fontSize: '12px' }}>Phone</label>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{HOST_PROFILE.phone}</div>
                            </div>
                        </div>
                        <button className={styles.secondaryBtn} style={{ marginTop: '12px' }}>Edit Contact</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
