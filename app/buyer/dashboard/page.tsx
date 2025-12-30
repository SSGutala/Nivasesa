import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getBuyerRequests } from '@/actions/buyer-request';
import BuyerDashboardClient from '@/components/buyer/BuyerDashboardClient';

export const metadata = {
    title: 'Buyer Dashboard - Nivasesa',
    description: 'Track your home buying requests and realtor matches',
};

export default async function BuyerDashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login?callbackUrl=/buyer/dashboard');
    }

    // Fetch buyer requests
    const result = await getBuyerRequests(session.user.id);

    return (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                    Buyer Dashboard
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>
                    Track your home buying journey and connect with realtors
                </p>
            </div>

            <BuyerDashboardClient
                requests={result.data}
                userName={session.user.name || 'there'}
            />
        </main>
    );
}
