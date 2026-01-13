import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { HostCalendarView } from './HostCalendarView';

export const metadata: Metadata = {
    title: 'Calendar - Nivasesa',
    description: 'Manage your listing availability',
};

export default async function CalendarPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/auth/login?callbackUrl=/dashboard/calendar');
    }

    return <HostCalendarView />;
}
