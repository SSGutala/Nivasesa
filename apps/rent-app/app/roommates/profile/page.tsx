import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getMyRoommateProfile } from '@/actions/groups';
import RoommateProfileForm from './RoommateProfileForm';

export const metadata: Metadata = {
    title: 'Roommate Profile | Nivasesa',
    description: 'Create your roommate profile to find compatible roommates and housing in the South Asian community.',
};

interface PageProps {
    searchParams: { redirect?: string };
}

export default async function RoommateProfilePage({ searchParams }: PageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/roommates/profile');
    }

    const existingProfile = await getMyRoommateProfile();

    return (
        <RoommateProfileForm
            existingProfile={existingProfile}
            redirectTo={searchParams.redirect}
        />
    );
}
