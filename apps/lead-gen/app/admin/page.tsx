'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Users, Clock, AlertCircle, Mail, Calendar, Building } from 'lucide-react';
import {
    getAllRealtorsAction,
    verifyRealtorAction,
    unverifyRealtorAction,
    getVerificationStatsAction
} from '../../actions/realtor-verification';

export default function AdminDashboard() {
    const [realtors, setRealtors] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [realtorsRes, statsRes] = await Promise.all([
            getAllRealtorsAction(),
            getVerificationStatsAction()
        ]);

        if (realtorsRes.success) {
            setRealtors(realtorsRes.data);
        }
        setStats(statsRes);
        setLoading(false);
    };

    const handleVerify = async (realtorProfileId: string) => {
        setProcessingId(realtorProfileId);
        const res = await verifyRealtorAction(realtorProfileId);
        if (res.success) {
            await loadData();
        } else {
            alert(res.message || 'Failed to verify realtor');
        }
        setProcessingId(null);
    };

    const handleUnverify = async (realtorProfileId: string) => {
        if (!confirm('Are you sure you want to remove verification from this realtor?')) return;

        setProcessingId(realtorProfileId);
        const res = await unverifyRealtorAction(realtorProfileId);
        if (res.success) {
            await loadData();
        } else {
            alert(res.message || 'Failed to unverify realtor');
        }
        setProcessingId(null);
    };

    const filteredRealtors = realtors.filter(r => {
        if (filter === 'verified') return r.isVerified;
        if (filter === 'pending') return !r.isVerified;
        return true;
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
                Loading Admin Dashboard...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Shield size={32} style={{ color: '#3b82f6' }} />
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', margin: 0 }}>Admin Dashboard</h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>Manage realtor verifications and platform access</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                        <StatCard
                            icon={<Users size={24} style={{ color: '#3b82f6' }} />}
                            label="Total Realtors"
                            value={stats.total}
                            bgColor="#eff6ff"
                        />
                        <StatCard
                            icon={<CheckCircle size={24} style={{ color: '#16a34a' }} />}
                            label="Verified Realtors"
                            value={stats.verified}
                            bgColor="#f0fdf4"
                        />
                        <StatCard
                            icon={<Clock size={24} style={{ color: '#f59e0b' }} />}
                            label="Pending Verification"
                            value={stats.pending}
                            bgColor="#fffbeb"
                        />
                    </div>
                )}

                {/* Filters */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <FilterButton
                            label="All Realtors"
                            count={realtors.length}
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        />
                        <FilterButton
                            label="Verified"
                            count={stats?.verified || 0}
                            active={filter === 'verified'}
                            onClick={() => setFilter('verified')}
                        />
                        <FilterButton
                            label="Pending"
                            count={stats?.pending || 0}
                            active={filter === 'pending'}
                            onClick={() => setFilter('pending')}
                        />
                    </div>
                </div>

                {/* Realtors List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredRealtors.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                            <AlertCircle size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No realtors found</h3>
                            <p style={{ color: '#6b7280' }}>No realtors match your current filter.</p>
                        </div>
                    ) : (
                        filteredRealtors.map((realtor) => (
                            <RealtorCard
                                key={realtor.id}
                                realtor={realtor}
                                processing={processingId === realtor.id}
                                onVerify={() => handleVerify(realtor.id)}
                                onUnverify={() => handleUnverify(realtor.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, bgColor }: any) {
    return (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: bgColor }}>
                    {icon}
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{label}</p>
            </div>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#111827', margin: 0 }}>{value}</p>
        </div>
    );
}

function FilterButton({ label, count, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: active ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                backgroundColor: active ? '#eff6ff' : 'white',
                color: active ? '#3b82f6' : '#6b7280',
                fontWeight: active ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
            }}
        >
            {label}
            <span style={{
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: active ? '#3b82f6' : '#e5e7eb',
                color: active ? 'white' : '#6b7280',
                fontSize: '12px',
                fontWeight: 600
            }}>
                {count}
            </span>
        </button>
    );
}

function RealtorCard({ realtor, processing, onVerify, onUnverify }: any) {
    return (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                {/* Profile Image */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    {realtor.user.image ? (
                        <img
                            src={realtor.user.image}
                            alt={realtor.user.name || 'Realtor'}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e7eb' }}
                        />
                    ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, color: '#9ca3af', border: '3px solid #e5e7eb' }}>
                            {realtor.user.name?.charAt(0) || 'R'}
                        </div>
                    )}
                    {realtor.isVerified && (
                        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#16a34a', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={14} style={{ color: 'white' }} />
                        </div>
                    )}
                </div>

                {/* Realtor Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>
                            {realtor.user.name || 'Unnamed Realtor'}
                        </h3>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            backgroundColor: realtor.isVerified ? '#dcfce7' : '#fef3c7',
                            color: realtor.isVerified ? '#16a34a' : '#f59e0b'
                        }}>
                            {realtor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <InfoRow icon={<Mail size={16} />} label="Email" value={realtor.user.email} />
                        <InfoRow icon={<Building size={16} />} label="Brokerage" value={realtor.brokerage} />
                        <InfoRow icon={<Shield size={16} />} label="License" value={realtor.licenseNumber} />
                        <InfoRow icon={<Calendar size={16} />} label="Joined" value={new Date(realtor.user.createdAt).toLocaleDateString()} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        {!realtor.isVerified ? (
                            <button
                                onClick={onVerify}
                                disabled={processing}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    opacity: processing ? 0.5 : 1
                                }}
                            >
                                <CheckCircle size={18} />
                                {processing ? 'Processing...' : 'Verify Realtor'}
                            </button>
                        ) : (
                            <button
                                onClick={onUnverify}
                                disabled={processing}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    opacity: processing ? 0.5 : 1
                                }}
                            >
                                <XCircle size={18} />
                                {processing ? 'Processing...' : 'Remove Verification'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: '#9ca3af' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>{value}</p>
            </div>
        </div>
    );
}
