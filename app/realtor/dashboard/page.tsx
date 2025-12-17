import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Users,
    Home,
    Settings,
    MessageSquare,
    // LogOut, // Unused
    Clock,
    CheckCircle,
    // MoreHorizontal // Unused
} from "lucide-react";

export default async function RealtorDashboard() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Fetch Realtor Profile and Referrals
    const realtor = await prisma.realtorProfile.findUnique({
        where: { userId: session.user?.id },
        include: {
            referrals: {
                include: {
                    buyerRequest: true,
                },
                orderBy: { createdAt: 'desc' },
            },
            user: true,
        },
    });

    if (!realtor) {
        return (
            <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>You do not have a Realtor specific account.</p>
                <Link href="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Go Home</Link>
            </div>
        );
    }

    // Formatting helpers
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatCurrency = (val: number | null) => val ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val) : 'N/A';

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--color-bg-subtle)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--color-border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {realtor.user.name?.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '15px', color: 'var(--color-primary)', marginBottom: '0' }}>{realtor.user.name}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '0' }}>{realtor.licenseNumber}</p>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/realtor/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-navy)', fontWeight: 500 }}>
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                        <Users size={18} /> Leads <span style={{ marginLeft: 'auto', backgroundColor: 'var(--color-border)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>{realtor.referrals.length}</span>
                    </Link>
                    <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                        <MessageSquare size={18} /> Messages
                    </Link>
                    <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                        <Settings size={18} /> Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Lead Overview</h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Manage your incoming referral requests.</p>
                    </div>
                    <button className="btn btn-primary" style={{ fontSize: '14px' }}>Download CSV</button>
                </header>

                {/* Filters (Mock) */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <input type="text" placeholder="Search by name, city..." style={{ width: '300px', margin: 0 }} />
                    <select style={{ width: 'auto', margin: 0 }}>
                        <option>All Statuses</option>
                        <option>Sent</option>
                        <option>Contacted</option>
                    </select>
                </div>

                {/* Lead Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Client Name</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Location</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Budget & Time</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Received</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {realtor.referrals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No active leads found.
                                    </td>
                                </tr>
                            ) : (
                                realtor.referrals.map((referral: Prisma.ReferralGetPayload<{ include: { buyerRequest: true } }>) => (
                                    <tr key={referral.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                                        <td style={{ padding: '16px', fontWeight: 500 }}>
                                            {referral.buyerRequest.name}
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 400 }}>{referral.buyerRequest.email}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <MapPin size={14} className="text-secondary" /> {referral.buyerRequest.locations}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div>{formatCurrency(referral.buyerRequest.budgetMax)}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{referral.buyerRequest.timeframe}</div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={14} /> {formatDate(referral.createdAt)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                backgroundColor: referral.status === 'SENT' ? '#DBEAFE' : '#ECFDF5',
                                                color: referral.status === 'SENT' ? '#1E40AF' : '#047857'
                                            }}>
                                                {referral.status === 'SENT' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                {referral.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

// Helper component for table icons that aren't imported inside map
function MapPin({ size, className }: { size: number, className?: string }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-4 10-6 10s-6-4-6-10a6 6 0 0 1 12 0Z" /><circle cx="12" cy="10" r="3" /></svg>
}
