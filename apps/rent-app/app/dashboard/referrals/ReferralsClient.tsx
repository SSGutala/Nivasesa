'use client';

import { useState } from 'react';
import { Gift, Users, Link, Copy, Check } from 'lucide-react';

interface ReferralStats {
    referralCode: string | null;
    totalReferrals: number;
    pendingRewards: number;
    appliedRewards: number;
    totalBoostDays: number;
    referrals: Array<{
        id: string;
        referredEmail: string;
        referredUserType: string;
        createdAt: Date;
        rewardStatus: string;
        referredBoostDays: number;
    }>;
}

interface ReferralsClientProps {
    data: ReferralStats;
}

export default function ReferralsClient({ data }: ReferralsClientProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (!data.referralCode) return;

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const referralLink = `${baseUrl}/survey?ref=${data.referralCode}`;

        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getEmailInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const referralLink = data.referralCode ? `${baseUrl}/survey?ref=${data.referralCode}` : '';

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 24px',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 8px 0'
                }}>
                    Referral Program
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: 0
                }}>
                    Invite friends and earn boost days for your listing
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                {/* Total Referrals */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Users size={24} style={{ color: '#3b82f6' }} />
                        </div>
                        <div>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                                lineHeight: 1
                            }}>
                                {data.totalReferrals}
                            </p>
                        </div>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0
                    }}>
                        Total Referrals
                    </p>
                </div>

                {/* Pending Rewards */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Gift size={24} style={{ color: '#f59e0b' }} />
                        </div>
                        <div>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                                lineHeight: 1
                            }}>
                                {data.pendingRewards}
                            </p>
                        </div>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0
                    }}>
                        Pending Rewards
                    </p>
                    <p style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        margin: '4px 0 0 0'
                    }}>
                        Will activate at launch
                    </p>
                </div>

                {/* Total Boost Days */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#d1fae5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Check size={24} style={{ color: '#10b981' }} />
                        </div>
                        <div>
                            <p style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                                lineHeight: 1
                            }}>
                                {data.totalBoostDays}
                            </p>
                        </div>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0
                    }}>
                        Total Boost Days
                    </p>
                    <p style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        margin: '4px 0 0 0'
                    }}>
                        Earned from referrals
                    </p>
                </div>
            </div>

            {/* Referral Link Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '32px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <Link size={24} style={{ color: '#3b82f6' }} />
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                    }}>
                        Your Referral Link
                    </h2>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        display: 'block',
                        marginBottom: '8px'
                    }}>
                        Referral Code
                    </label>
                    <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'monospace',
                        letterSpacing: '2px'
                    }}>
                        {data.referralCode || 'Not available'}
                    </div>
                </div>

                <div>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        display: 'block',
                        marginBottom: '8px'
                    }}>
                        Shareable Link
                    </label>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            flex: 1,
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {referralLink || 'Not available'}
                        </div>
                        <button
                            onClick={handleCopyLink}
                            disabled={!data.referralCode}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: copied ? '#10b981' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: data.referralCode ? 'pointer' : 'not-allowed',
                                opacity: data.referralCode ? 1 : 0.5,
                                transition: 'all 0.2s'
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={18} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1e40af'
                }}>
                    Share this link with friends! When they sign up, you'll both get boost days for your listings when the platform launches.
                </div>
            </div>

            {/* Referred Users List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <Users size={24} style={{ color: '#3b82f6' }} />
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                    }}>
                        Your Referrals
                    </h2>
                    {data.totalReferrals > 0 && (
                        <span style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '12px'
                        }}>
                            {data.totalReferrals}
                        </span>
                    )}
                </div>

                {data.referrals.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 24px'
                    }}>
                        <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#374151',
                            margin: '0 0 8px 0'
                        }}>
                            No referrals yet
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: 0
                        }}>
                            Share your referral link to start earning boost days
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.referrals.map((referral) => (
                            <div
                                key={referral.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 600
                                    }}>
                                        {getEmailInitials(referral.referredEmail)}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: '#111827',
                                            margin: '0 0 4px 0'
                                        }}>
                                            {referral.referredEmail}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: 0
                                        }}>
                                            Joined {formatDate(referral.createdAt)} • {referral.referredUserType}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        backgroundColor: referral.rewardStatus === 'applied' ? '#d1fae5' : '#fef3c7',
                                        color: referral.rewardStatus === 'applied' ? '#065f46' : '#92400e'
                                    }}>
                                        {referral.rewardStatus === 'applied' ? 'Boost Active' : 'Pending'}
                                    </span>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        margin: '4px 0 0 0'
                                    }}>
                                        +{referral.referredBoostDays} days
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* How It Works Section */}
            <div style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: '0 0 16px 0'
                }}>
                    How It Works
                </h3>
                <ol style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#4b5563',
                    fontSize: '14px',
                    lineHeight: 1.6
                }}>
                    <li style={{ marginBottom: '8px' }}>
                        Share your unique referral link with friends and family
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                        They sign up using your referral code
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                        You earn <strong>14 days</strong> of boost for your listing
                    </li>
                    <li>
                        Your friend gets <strong>7 days</strong> of boost for their listing
                    </li>
                </ol>
                <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '16px 0 0 0',
                    fontStyle: 'italic'
                }}>
                    Boost days will be automatically applied when the platform launches
                </p>
            </div>
        </div>
    );
}
