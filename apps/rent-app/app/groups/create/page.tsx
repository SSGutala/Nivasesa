import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import CreateGroupForm from './CreateGroupForm';

export const metadata: Metadata = {
    title: 'Create a Roommate Group | Nivasesa',
    description: 'Create a roommate group to find housing together with compatible South Asian professionals.',
};

export default async function CreateGroupPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/groups/create');
    }

    // Check if user has a roommate profile
    const profile = await prisma.roommateProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        redirect('/roommates/profile?redirect=/groups/create');
    }

    return <CreateGroupForm />;
}
