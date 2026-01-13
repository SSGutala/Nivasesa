import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { getSurveyResponses, getSurveyStats, SurveyUserType } from '../../actions/survey';
import Link from 'next/link';
import styles from './page.module.css';

// Force dynamic rendering since we're using auth
export const dynamic = 'force-dynamic';

export default async function AdminSurveysPage({
    searchParams,
}: {
    searchParams: { userType?: string; status?: string; search?: string };
}) {
    const session = await auth();

    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const [responsesResult, statsResult] = await Promise.all([
        getSurveyResponses({
            userType: searchParams.userType as SurveyUserType | undefined,
            status: searchParams.status,
            search: searchParams.search,
        }),
        getSurveyStats(),
    ]);

    const responses = responsesResult.success ? responsesResult.data : [];
    const stats = statsResult.success ? statsResult.data : null;

    const userTypeLabels: Record<string, string> = {
        roommate_seeker: 'Roommate Seeker',
        host: 'Host / Landlord',
        buyer: 'Home Buyer',
        seller: 'Home Seller',
        agent: 'Agent',
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        new: { label: 'New', color: '#3b82f6' },
        contacted: { label: 'Contacted', color: '#f59e0b' },
        scheduled: { label: 'Scheduled', color: '#8b5cf6' },
        interviewed: { label: 'Interviewed', color: '#10b981' },
        converted: { label: 'Converted', color: '#059669' },
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Survey Responses</h1>
                <p className={styles.subtitle}>Manage waitlist signups and schedule interviews</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Responses</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.byStatus.new}</div>
                        <div className={styles.statLabel}>New / Uncontacted</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.byStatus.scheduled}</div>
                        <div className={styles.statLabel}>Scheduled Calls</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.byStatus.converted}</div>
                        <div className={styles.statLabel}>Converted</div>
                    </div>
                </div>
            )}

            {/* User Type Breakdown */}
            {stats && (
                <div className={styles.breakdownSection}>
                    <h2 className={styles.sectionTitle}>By User Type</h2>
                    <div className={styles.breakdownGrid}>
                        {Object.entries(stats.byUserType).map(([type, count]) => (
                            <Link
                                key={type}
                                href={`/admin/surveys?userType=${type}`}
                                className={`${styles.breakdownCard} ${searchParams.userType === type ? styles.active : ''}`}
                            >
                                <div className={styles.breakdownValue}>{count}</div>
                                <div className={styles.breakdownLabel}>{userTypeLabels[type]}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <form className={styles.filters}>
                <select
                    name="userType"
                    defaultValue={searchParams.userType || ''}
                    className={styles.filterSelect}
                >
                    <option value="">All User Types</option>
                    {Object.entries(userTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <select
                    name="status"
                    defaultValue={searchParams.status || ''}
                    className={styles.filterSelect}
                >
                    <option value="">All Statuses</option>
                    {Object.entries(statusLabels).map(([value, { label }]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="search"
                    defaultValue={searchParams.search || ''}
                    placeholder="Search by email, name, city..."
                    className={styles.searchInput}
                />

                <button type="submit" className={styles.filterButton}>
                    Apply Filters
                </button>

                {(searchParams.userType || searchParams.status || searchParams.search) && (
                    <Link href="/admin/surveys" className={styles.clearFilters}>
                        Clear
                    </Link>
                )}
            </form>

            {/* Responses Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    No survey responses found.
                                </td>
                            </tr>
                        ) : (
                            responses.map((response: any) => (
                                <tr key={response.id}>
                                    <td>{new Date(response.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={styles.userTypeBadge}>
                                            {userTypeLabels[response.userType] || response.userType}
                                        </span>
                                    </td>
                                    <td>{response.name || '-'}</td>
                                    <td>{response.email}</td>
                                    <td>
                                        {response.city && response.state
                                            ? `${response.city}, ${response.state}`
                                            : response.city || response.state || '-'}
                                    </td>
                                    <td>
                                        <span
                                            className={styles.statusBadge}
                                            style={{
                                                backgroundColor: statusLabels[response.status]?.color || '#6b7280',
                                            }}
                                        >
                                            {statusLabels[response.status]?.label || response.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/admin/surveys/${response.id}`}
                                            className={styles.viewButton}
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
