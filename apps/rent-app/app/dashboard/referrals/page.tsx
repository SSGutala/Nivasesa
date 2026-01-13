import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getReferralStatsAction } from '@/actions/referral';
import ReferralsClient from './ReferralsClient';

export default async function ReferralsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/auth/login');
    }

    // For now, we'll use a placeholder userId since the referral system
    // is tied to HostIntakeSubmission/RenterIntakeSubmission
    // In a real scenario, you'd link the User to these submissions
    const result = await getReferralStatsAction(session.user.id);

    if (!result.success) {
        return (
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#991b1b'
                }}>
                    {result.message || 'Failed to load referral stats. Please complete the intake survey first.'}
                </div>
            </div>
        );
    }

    return <ReferralsClient data={result.data} />;
}
