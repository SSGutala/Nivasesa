'use client';

import { useState, useEffect } from 'react';
import { Users, Home, Settings, CreditCard, Search, Lock, Unlock, CheckCircle, Clock, MapPin, Globe, Briefcase, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    addBalanceAction,
    updateRealtorProfile,
    getCurrentUserAction,
    getInboundLeadsAction,
    getRealtorProfileByEmail,
    getUserBalanceAction,
    getUnlockedLeadsAction,
    unlockLeadsBulkAction,
    getLeadCountAction
} from '@/actions/dashboard';

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState('test@example.com');
    const [userData, setUserData] = useState<any>(null);
    const [unlockedLeads, setUnlockedLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('leads');
    const [realtorData, setRealtorData] = useState<any>({ fullName: 'Test Realtor', status: 'Active' });

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const user = await getCurrentUserAction();
            if (!user) {
                // If no session, wait or redirect? For now just handle null
                setLoading(false);
                return;
            }

            const fullUser = await getUserBalanceAction(user.email!);
            setUserData(fullUser);

            const profile = await getRealtorProfileByEmail(user.email!);
            if (profile) setRealtorData({ fullName: profile.user.name, status: profile.isVerified ? 'Active' : 'Pending', id: profile.id });

            const unlocked = await getUnlockedLeadsAction(fullUser?.id);
            setUnlockedLeads(unlocked);
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const refreshData = async () => {
        const user = await getUserBalanceAction(userEmail);
        setUserData(user);
        const unlocked = await getUnlockedLeadsAction(user?.id);
        setUnlockedLeads(unlocked);
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>Loading Dashboard...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Dashboard</h2>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>Realtor Partner</p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <SidebarItem icon={<Search size={20} />} label="Marketplace" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
                    <SidebarItem icon={<Clock size={20} />} label="Inbound Leads" active={activeTab === 'inbound'} onClick={() => setActiveTab('inbound')} />
                    <SidebarItem icon={<Users size={20} />} label="My Clients" active={activeTab === 'my-leads'} onClick={() => setActiveTab('my-leads')} />
                    <SidebarItem icon={<Home size={20} />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SidebarItem icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    <SidebarItem icon={<Shield size={20} />} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                </nav>

                <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>
                            {realtorData?.fullName?.charAt(0) || 'R'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{realtorData?.fullName || 'Realtor'}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Balance: ${userData?.balance || 0}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {activeTab === 'leads' && <LeadsSearchSection userId={userData?.id} balance={userData?.balance} onPurchaseComplete={refreshData} />}
                {activeTab === 'inbound' && <InboundLeadsSection agentId={realtorData?.id} userId={userData?.id} balance={userData?.balance} onPurchaseComplete={refreshData} />}
                {activeTab === 'my-leads' && <MyLeadsSection leads={unlockedLeads} />}
                {activeTab === 'profile' && <ProfileSection realtorData={{ ...realtorData, id: userData?.id }} />}
                {activeTab === 'payments' && <PaymentsSection userId={userData?.id} balance={userData?.balance} onPaymentComplete={refreshData} />}
                {activeTab === 'security' && <SecuritySection />}
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: active ? '#f3f4f6' : 'transparent',
            color: active ? '#111827' : '#4b5563',
            border: 'none',
            fontSize: '14px',
            fontWeight: active ? 600 : 500,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 0.2s'
        }}>
            {icon} {label}
        </button>
    );
}

// --- SECTIONS ---

function LeadsSearchSection({ userId, balance, onPurchaseComplete }: { userId: string, balance: number, onPurchaseComplete: () => void }) {
    const [searchZip, setSearchZip] = useState('');
    const [radius, setRadius] = useState(25);
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searching, setSearching] = useState(false);
    const [unlocking, setUnlocking] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearching(true);
        const res = await getLeadCountAction(searchZip, radius);
        setSearchResult(res);
        setSearching(false);
    };

    const handleUnlock = async () => {
        if (!searchResult || searchResult.count === 0) return;

        const totalCost = searchResult.count * 30;
        if (balance < totalCost) {
            alert('Insufficient balance. Please add funds.');
            return;
        }

        setUnlocking(true);
        const res = await unlockLeadsBulkAction(searchResult.leadIds, userId, totalCost);
        if (res.success) {
            setSearchResult(null);
            setSearchZip('');
            onPurchaseComplete();
            alert(`Success! You have unlocked ${leadCountText(searchResult.count)}.`);
        } else {
            alert(res.message);
        }
        setUnlocking(false);
    };

    const leadCountText = (count: number) => count === 1 ? '1 lead' : `${count} leads`;

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Leads Marketplace</h1>
                <p style={{ color: '#6b7280' }}>Find and unlock qualified buyer leads by radius.</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>ZIP Code</label>
                            <input
                                type="text"
                                placeholder="e.g. 75024"
                                value={searchZip}
                                onChange={e => setSearchZip(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Radius (Miles)</label>
                            <select
                                value={radius}
                                onChange={e => setRadius(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: 'white' }}
                            >
                                <option value={10}>10 miles</option>
                                <option value={25}>25 miles</option>
                                <option value={50}>50 miles</option>
                                <option value={100}>100 miles</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={searching} style={{ width: '100%', padding: '14px', borderRadius: '8px', backgroundColor: '#111827', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                        {searching ? 'Searching...' : 'Search Leads'}
                    </button>
                </form>

                {searchResult && !searching && (
                    <div style={{ marginTop: '32px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        {searchResult.error ? (
                            <p style={{ color: '#dc2626', fontWeight: 500 }}>{searchResult.error}</p>
                        ) : searchResult.count === 0 ? (
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>0 leads found in this area.</p>
                                <p style={{ color: '#6b7280' }}>Try expanding your radius or searching another ZIP code.</p>
                            </div>
                        ) : (
                            <div>
                                <p style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{searchResult.count} {searchResult.count === 1 ? 'lead' : 'leads'} found within {radius} miles of {searchZip}</p>
                                <p style={{ color: '#6b7280', marginBottom: '24px' }}>Total cost to unlock: <strong style={{ color: '#111827' }}>${searchResult.count * 30}</strong></p>
                                <button
                                    onClick={handleUnlock}
                                    disabled={unlocking}
                                    style={{ padding: '12px 32px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}
                                >
                                    {unlocking ? 'Unlocking...' : <><Lock size={18} /> Unlock {searchResult.count} {searchResult.count === 1 ? 'Lead' : 'Leads'} for ${searchResult.count * 30}</>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function MyLeadsSection({ leads }: { leads: any[] }) {
    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>My Unlocked Leads</h1>
                <p style={{ color: '#6b7280' }}>Manage and contact your purchased leads.</p>
            </div>

            {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                    <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>No unlocked leads yet</h3>
                    <p style={{ color: '#6b7280' }}>Search and unlock leads in the Marketplace to see them here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {leads.map((lead) => (
                        <div key={lead.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>{lead.buyerType}</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>{lead.buyerName}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                                        <MapPin size={16} style={{ color: '#9ca3af' }} /> {lead.city}, {lead.zipcode}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                                        <Globe size={16} style={{ color: '#9ca3af' }} /> {lead.languagePreference}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                                        <Briefcase size={16} style={{ color: '#9ca3af' }} /> {lead.timeline}
                                    </div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Contact Info</p>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{lead.buyerContact}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PaymentsSection({ userId, balance, onPaymentComplete }: { userId: string, balance: number, onPaymentComplete: () => void }) {
    const [paying, setPaying] = useState<number | null>(null);

    const handleAddFunds = async (amount: number) => {
        setPaying(amount);
        const res = await addBalanceAction(userId, amount);
        if (res.success) {
            onPaymentComplete();
            alert(`Success! $${amount} has been added to your balance.`);
        } else {
            alert('Payment failed. Please try again.');
        }
        setPaying(null);
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '32px' }}>Payments & Credits</h1>

            <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Current Balance</p>
                    <p style={{ fontSize: '48px', fontWeight: 700, color: '#111827' }}>${balance}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Select an option to add funds:</p>
                    <PaymentOption amount={300} onClick={() => handleAddFunds(300)} loading={paying === 300} />
                    <PaymentOption amount={600} onClick={() => handleAddFunds(600)} loading={paying === 600} />
                    <PaymentOption amount={1200} onClick={() => handleAddFunds(1200)} loading={paying === 1200} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', color: '#9a3412', fontSize: '13px' }}>
                <Clock size={16} /> Mock Stripe Integration: Payment will be processed instantly for testing.
            </div>
        </div>
    );
}

function PaymentOption({ amount, onClick, loading }: { amount: number, onClick: () => void, loading: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#d1d5db'}
        >
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Add ${amount}</span>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{loading ? 'Processing...' : 'Select'}</span>
        </button>
    );
}

function ProfileSection({ realtorData }: { realtorData: any }) {
    const [formData, setFormData] = useState({
        fullName: realtorData?.fullName || '',
        bio: realtorData?.bio || '',
        description: realtorData?.description || '',
        citiesZipcodesServed: realtorData?.citiesZipcodesServed || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await updateRealtorProfile(realtorData.id, formData);
        if (res.success) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
        setSaving(false);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '32px' }}>Public Profile</h1>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Full Name</label>
                            <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Serving Regions</label>
                            <input type="text" value={formData.citiesZipcodesServed} onChange={e => setFormData({ ...formData, citiesZipcodesServed: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Short Bio</label>
                        <input type="text" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="e.g. Expert in Luxury Homes & Relocation" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>About / Description</label>
                        <textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}></textarea>
                    </div>

                    <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
function InboundLeadsSection({ agentId, userId, balance, onPurchaseComplete }: { agentId: string, userId: string, balance: number, onPurchaseComplete: () => void }) {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlocking, setUnlocking] = useState<string | null>(null);

    const fetchLeads = async () => {
        if (!agentId) return;
        setLoading(true);
        const data = await getInboundLeadsAction(agentId);
        setLeads(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, [agentId]);

    const handleUnlock = async (leadId: string) => {
        if (balance < 30) {
            alert('Insufficient balance. Please add funds.');
            return;
        }

        setUnlocking(leadId);
        const res = await unlockLeadsBulkAction([leadId], userId, 30);
        if (res.success) {
            onPurchaseComplete();
            fetchLeads();
            alert('Lead unlocked! You can now view contact details in "My Clients".');
        } else {
            alert(res.message);
        }
        setUnlocking(null);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading inquiries...</div>;

    const lockedLeads = leads.filter(l => !l.unlockedBy.some((u: any) => u.userId === userId));

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Inbound Inquiries</h1>
                <p style={{ color: '#6b7280' }}>Buyers who reached out specifically to you through your profile.</p>
            </div>

            {lockedLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                    <MessageSquare size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>No new inquiries</h3>
                    <p style={{ color: '#6b7280' }}>When buyers contact you through your profile, they will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {lockedLeads.map((lead) => (
                        <div key={lead.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>{lead.interest || 'New Lead'}</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Interested Buyer in {lead.zipcode}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                        A buyer is interested in <strong>{lead.interest?.toLowerCase()}</strong> in the {lead.city} area. Unlock to see their contact info and full message.
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleUnlock(lead.id)}
                                    disabled={!!unlocking}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#111827', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    {unlocking === lead.id ? 'Unlocking...' : <><Lock size={16} /> Unlock for $30</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { MessageSquare } from 'lucide-react';
import {
    setupTwoFactorAction,
    enableTwoFactorAction,
    disableTwoFactorAction,
    getCurrentUserTwoFactorStatusAction,
} from '@/actions/two-factor';

function SecuritySection() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [setupMode, setSetupMode] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [disableCode, setDisableCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const checkStatus = async () => {
            const status = await getCurrentUserTwoFactorStatusAction();
            setTwoFactorEnabled(status.enabled);
            setLoading(false);
        };
        checkStatus();
    }, []);

    const handleSetup = async () => {
        setLoading(true);
        setError('');
        const result = await setupTwoFactorAction();
        if (result.success && result.qrCode && result.secret) {
            setQrCode(result.qrCode);
            setSecret(result.secret);
            setSetupMode(true);
        } else {
            setError(result.error || 'Failed to setup 2FA');
        }
        setLoading(false);
    };

    const handleEnable = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await enableTwoFactorAction(verifyCode);
        if (result.success) {
            setTwoFactorEnabled(true);
            setSetupMode(false);
            setSuccess('Two-factor authentication enabled successfully!');
            setVerifyCode('');
        } else {
            setError(result.error || 'Failed to verify code');
        }
        setLoading(false);
    };

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await disableTwoFactorAction(disableCode);
        if (result.success) {
            setTwoFactorEnabled(false);
            setSuccess('Two-factor authentication disabled.');
            setDisableCode('');
        } else {
            setError(result.error || 'Failed to disable 2FA');
        }
        setLoading(false);
    };

    if (loading && !setupMode) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading security settings...</div>;
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Security Settings</h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>Manage your account security and two-factor authentication.</p>

            {error && (
                <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', marginBottom: '24px' }}>
                    {success}
                </div>
            )}

            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: twoFactorEnabled ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={24} style={{ color: twoFactorEnabled ? '#16a34a' : '#6b7280' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Two-Factor Authentication</h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            {twoFactorEnabled ? 'Enabled - Your account is protected' : 'Add an extra layer of security to your account'}
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            backgroundColor: twoFactorEnabled ? '#dcfce7' : '#f3f4f6',
                            color: twoFactorEnabled ? '#16a34a' : '#6b7280'
                        }}>
                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>

                {!twoFactorEnabled && !setupMode && (
                    <button
                        onClick={handleSetup}
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#111827', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                        {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                    </button>
                )}

                {setupMode && (
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>1. Scan this QR code with your authenticator app</h4>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={qrCode} alt="2FA QR Code" style={{ maxWidth: '200px', margin: '0 auto' }} />
                        </div>

                        <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Or enter this secret manually:</p>
                            <code style={{ fontSize: '14px', fontFamily: 'monospace', color: '#111827', wordBreak: 'break-all' }}>{secret}</code>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>2. Enter the 6-digit code from your app</h4>
                        <form onSubmit={handleEnable} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={verifyCode}
                                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', fontFamily: 'monospace' }}
                            />
                            <button
                                type="submit"
                                disabled={loading || verifyCode.length !== 6}
                                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: '#16a34a', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: verifyCode.length !== 6 ? 0.5 : 1 }}
                            >
                                {loading ? 'Verifying...' : 'Verify & Enable'}
                            </button>
                        </form>
                        <button
                            onClick={() => { setSetupMode(false); setQrCode(''); setSecret(''); }}
                            style={{ marginTop: '16px', padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {twoFactorEnabled && (
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Disable Two-Factor Authentication</h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Enter your current 2FA code to disable two-factor authentication.</p>
                        <form onSubmit={handleDisable} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={disableCode}
                                onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', fontFamily: 'monospace' }}
                            />
                            <button
                                type="submit"
                                disabled={loading || disableCode.length !== 6}
                                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: disableCode.length !== 6 ? 0.5 : 1 }}
                            >
                                {loading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                    <strong>Tip:</strong> Use apps like Google Authenticator, Authy, or 1Password to generate your 2FA codes.
                </p>
            </div>
        </div>
    );
}
