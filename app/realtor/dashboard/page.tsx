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
    Clock,
    CheckCircle,
    MapPin,
    ArrowUpRight,
    Search,
    Download
} from "lucide-react";

export default async function RealtorDashboard() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Fetch Realtor Profile and Connections
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', textAlign: 'center', padding: '20px' }}>
                <div style={{ background: 'white', padding: '48px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', maxWidth: '400px' }}>
                    <h1 style={{ color: 'var(--color-primary)', fontSize: '24px', marginBottom: '16px' }}>Expert Access Required</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>This dashboard is reserved for Nivaesa Housing Experts.</p>
                    <Link href="/" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatCurrency = (val: number | null) => val ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val) : 'N/A';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid var(--color-border)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Nivaesa</h2>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Portal</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '16px', marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>
                        {realtor.user.name?.charAt(0)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{realtor.user.name}</h3>
                        <p style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>{realtor.licenseNumber}</p>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <SidebarLink href="/realtor/dashboard" icon={<Home size={20} />} label="Overview" active />
                    <SidebarLink href="#" icon={<Users size={20} />} label="Connections" count={realtor.referrals.length} />
                    <SidebarLink href="#" icon={<MessageSquare size={20} />} label="Chat" />
                    <SidebarLink href="#" icon={<Settings size={20} />} label="Expert Profile" />
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>Connection Pipeline</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>Manage your community interest and referrals.</p>
                    </div>
                    <button style={{ backgroundColor: 'white', border: '2px solid var(--color-border)', padding: '12px 20px', borderRadius: '12px', color: 'var(--color-text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <Download size={18} /> Export Data
                    </button>
                </header>

                {/* Utilities */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                        <input type="text" placeholder="Search by name, city, or interest..." style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '15px' }} />
                    </div>
                    <select style={{ padding: '0 16px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'white', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer' }}>
                        <option>Status: All Activity</option>
                        <option>New Connection</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                    </select>
                </div>

                {/* Connection Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Member Name</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Location</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Budget & Goals</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Received</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '20px 24px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {realtor.referrals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <Users size={48} color="var(--color-border)" style={{ margin: '0 auto' }} />
                                        </div>
                                        <p style={{ fontWeight: 600 }}>No active connections found yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                realtor.referrals.map((referral: Prisma.ReferralGetPayload<{ include: { buyerRequest: true } }>) => (
                                    <tr key={referral.id} style={{ borderBottom: '1px solid var(--color-border-subtle)', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>{referral.buyerRequest.name}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>{referral.buyerRequest.email}</div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                                <MapPin size={16} color="var(--color-secondary)" /> {referral.buyerRequest.locations}
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{formatCurrency(referral.buyerRequest.budgetMax)}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{referral.buyerRequest.timeframe}</div>
                                        </td>
                                        <td style={{ padding: '24px', color: 'var(--color-text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Clock size={16} /> {formatDate(referral.createdAt)}
                                            </div>
                                        </td>
                                        <td style={{ padding: '24px' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                backgroundColor: referral.status === 'SENT' ? 'var(--color-bg-subtle)' : '#ECFDF5',
                                                color: referral.status === 'SENT' ? 'var(--color-primary)' : '#047857'
                                            }}>
                                                {referral.status === 'SENT' ? <Clock size={14} /> : <CheckCircle size={14} />}
                                                {referral.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '24px', textAlign: 'right' }}>
                                            <button style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: 'var(--color-text-main)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                View <ArrowUpRight size={14} />
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

function SidebarLink({ href, icon, label, active, count }: { href: string, icon: any, label: string, active?: boolean, count?: number }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: active ? 'var(--color-bg-subtle)' : 'transparent',
            color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: active ? 700 : 600,
            transition: 'all 0.2s'
        }}>
            {icon} {label}
            {count !== undefined && (
                <span style={{ marginLeft: 'auto', backgroundColor: active ? 'var(--color-primary)' : 'var(--color-border)', color: active ? 'white' : 'var(--color-text-main)', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>{count}</span>
            )}
        </Link>
    );
}

// Re-using local MapPin for consistency if global one differs
// Removing local declaration to avoid conflict with Lucide import

