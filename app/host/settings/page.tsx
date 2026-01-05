import styles from '../dashboard/dashboard.module.css';

export default function SettingsPage() {
    return (
        <div className={styles.mainColumn} style={{ maxWidth: '100%' }}>
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.kpiLabel}>Manage your account preferences and notifications.</p>
                </div>
            </div>

            <div className={styles.card} style={{ padding: '0' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: '4px' }}>Notifications</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Choose what you want to be notified about.</p>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>New Inquiries</div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>Receive emails when potential tenants contact you.</div>
                        </div>
                        <input type="checkbox" defaultChecked />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>Tour Requests</div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>Get notified about new tour requests.</div>
                        </div>
                        <input type="checkbox" defaultChecked />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>Listing Tips</div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>Receive advice on how to improve your listing performance.</div>
                        </div>
                        <input type="checkbox" />
                    </div>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className={styles.primaryBtn}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
