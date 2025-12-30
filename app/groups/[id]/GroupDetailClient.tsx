'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { joinGroup, leaveGroup, removeMember } from '@/actions/groups';
import styles from './page.module.css';

interface GroupMember {
    id: string;
    profileId: string;
    role: string;
    profile: {
        id: string;
        languages: string;
        dietaryPreference: string;
        user: {
            id: string;
            name: string | null;
            image: string | null;
            email: string | null;
        };
    };
}

interface Group {
    id: string;
    name: string;
    description: string | null;
    targetCity: string;
    targetState: string;
    targetBudgetMin: number | null;
    targetBudgetMax: number | null;
    targetMoveIn: Date | null;
    propertyType: string | null;
    bedroomsNeeded: number | null;
    status: string;
    isPublic: boolean;
    maxMembers: number;
    members: GroupMember[];
    createdBy: {
        id: string;
        name: string | null;
        image: string | null;
    };
    assignedRealtor: {
        id: string;
        languages: string;
        user: {
            name: string | null;
            image: string | null;
        };
    } | null;
    realtorRequests: Array<{
        id: string;
        status: string;
        realtor: {
            id: string;
            user: {
                name: string | null;
                image: string | null;
            };
        };
    }>;
}

interface RoommateProfile {
    id: string;
    userId: string;
}

interface Props {
    group: Group;
    currentUserProfile: RoommateProfile | null;
    isMember: boolean;
    isAdmin: boolean;
    isLoggedIn: boolean;
}

export default function GroupDetailClient({
    group,
    currentUserProfile,
    isMember,
    isAdmin,
    isLoggedIn,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async () => {
        if (!isLoggedIn) {
            router.push('/login?callbackUrl=' + encodeURIComponent(`/groups/${group.id}`));
            return;
        }

        if (!currentUserProfile) {
            router.push('/roommates/profile?redirect=' + encodeURIComponent(`/groups/${group.id}`));
            return;
        }

        setLoading(true);
        setError(null);

        const result = await joinGroup(group.id);
        if (result.success) {
            router.refresh();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this group?')) return;

        setLoading(true);
        setError(null);

        const result = await leaveGroup(group.id);
        if (result.success) {
            router.refresh();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleRemoveMember = async (profileId: string, name: string) => {
        if (!confirm(`Remove ${name} from the group?`)) return;

        setLoading(true);
        const result = await removeMember(group.id, profileId);
        if (result.success) {
            router.refresh();
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const isFull = group.members.length >= group.maxMembers;

    return (
        <main className={styles.container}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.breadcrumb}>
                    <Link href="/groups">Groups</Link>
                    <span>/</span>
                    <span>{group.name}</span>
                </div>

                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>{group.name}</h1>
                        <p className={styles.location}>
                            {group.targetCity}, {group.targetState}
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <span className={`${styles.status} ${styles[group.status]}`}>
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                        </span>
                        <span className={styles.memberBadge}>
                            {group.members.length}/{group.maxMembers} members
                        </span>
                    </div>
                </div>
            </section>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.content}>
                {/* Main Content */}
                <div className={styles.mainContent}>
                    {/* Description */}
                    {group.description && (
                        <section className={styles.section}>
                            <h2>About This Group</h2>
                            <p>{group.description}</p>
                        </section>
                    )}

                    {/* Housing Preferences */}
                    <section className={styles.section}>
                        <h2>Housing Preferences</h2>
                        <div className={styles.preferencesGrid}>
                            {group.targetBudgetMax && (
                                <div className={styles.preference}>
                                    <span className={styles.prefLabel}>Budget</span>
                                    <span className={styles.prefValue}>
                                        ${group.targetBudgetMin?.toLocaleString() || 0} - $
                                        {group.targetBudgetMax.toLocaleString()}/mo
                                    </span>
                                </div>
                            )}
                            {group.bedroomsNeeded && (
                                <div className={styles.preference}>
                                    <span className={styles.prefLabel}>Bedrooms</span>
                                    <span className={styles.prefValue}>{group.bedroomsNeeded}</span>
                                </div>
                            )}
                            {group.propertyType && (
                                <div className={styles.preference}>
                                    <span className={styles.prefLabel}>Property Type</span>
                                    <span className={styles.prefValue}>{group.propertyType}</span>
                                </div>
                            )}
                            {group.targetMoveIn && (
                                <div className={styles.preference}>
                                    <span className={styles.prefLabel}>Move-in Date</span>
                                    <span className={styles.prefValue}>
                                        {new Date(group.targetMoveIn).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Members */}
                    <section className={styles.section}>
                        <h2>Members ({group.members.length})</h2>
                        <div className={styles.membersList}>
                            {group.members.map((member) => (
                                <div key={member.id} className={styles.memberCard}>
                                    <div className={styles.memberAvatar}>
                                        {member.profile.user.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={member.profile.user.image} alt="" />
                                        ) : (
                                            <span>
                                                {(member.profile.user.name || 'M')[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.memberInfo}>
                                        <div className={styles.memberName}>
                                            {member.profile.user.name || 'Anonymous'}
                                            {member.role === 'admin' && (
                                                <span className={styles.adminBadge}>Admin</span>
                                            )}
                                        </div>
                                        <div className={styles.memberDetails}>
                                            <span>{member.profile.languages}</span>
                                            <span>•</span>
                                            <span>{member.profile.dietaryPreference}</span>
                                        </div>
                                    </div>
                                    {isAdmin && member.profile.id !== currentUserProfile?.id && (
                                        <button
                                            onClick={() =>
                                                handleRemoveMember(
                                                    member.profile.id,
                                                    member.profile.user.name || 'this member'
                                                )
                                            }
                                            className={styles.removeButton}
                                            disabled={loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Assigned Realtor */}
                    {group.assignedRealtor && (
                        <section className={styles.section}>
                            <h2>Your Realtor</h2>
                            <div className={styles.realtorCard}>
                                <div className={styles.realtorAvatar}>
                                    {group.assignedRealtor.user.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={group.assignedRealtor.user.image} alt="" />
                                    ) : (
                                        <span>
                                            {(group.assignedRealtor.user.name || 'R')[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className={styles.realtorName}>
                                        {group.assignedRealtor.user.name}
                                    </div>
                                    <div className={styles.realtorLanguages}>
                                        Speaks: {group.assignedRealtor.languages}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.actionCard}>
                        {isMember ? (
                            <>
                                <p className={styles.memberMessage}>
                                    You are a member of this group
                                </p>
                                {!group.assignedRealtor && (
                                    <Link
                                        href={`/groups/${group.id}/find-realtor`}
                                        className={styles.primaryButton}
                                    >
                                        Find a Realtor
                                    </Link>
                                )}
                                <button
                                    onClick={handleLeave}
                                    className={styles.leaveButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Leaving...' : 'Leave Group'}
                                </button>
                            </>
                        ) : (
                            <>
                                {isFull ? (
                                    <p className={styles.fullMessage}>This group is full</p>
                                ) : (
                                    <>
                                        <p className={styles.joinMessage}>
                                            Join this group to search for housing together
                                        </p>
                                        <button
                                            onClick={handleJoin}
                                            className={styles.primaryButton}
                                            disabled={loading}
                                        >
                                            {loading
                                                ? 'Joining...'
                                                : !isLoggedIn
                                                  ? 'Sign In to Join'
                                                  : !currentUserProfile
                                                    ? 'Create Profile to Join'
                                                    : 'Join This Group'}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Share */}
                    <div className={styles.shareCard}>
                        <h3>Invite Roommates</h3>
                        <p>Share this group with potential roommates</p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className={styles.copyButton}
                        >
                            Copy Link
                        </button>
                    </div>
                </aside>
            </div>
        </main>
    );
}
