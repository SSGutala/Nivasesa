import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGroupById } from '@/actions/groups';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import GroupDetailClient from './GroupDetailClient';

interface PageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const group = await getGroupById(params.id);

    if (!group) {
        return { title: 'Group Not Found | Nivasesa' };
    }

    return {
        title: `${group.name} - Roommate Group | Nivasesa`,
        description: `Join ${group.name} - a roommate group looking for housing in ${group.targetCity}, ${group.targetState}. ${group.members.length}/${group.maxMembers} members.`,
    };
}

export default async function GroupDetailPage({ params }: PageProps) {
    const group = await getGroupById(params.id);

    if (!group) {
        notFound();
    }

    const session = await auth();
    let currentUserProfile = null;
    let isMember = false;
    let isAdmin = false;

    if (session?.user?.id) {
        currentUserProfile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (currentUserProfile) {
            const membership = group.members.find(
                (m) => m.profileId === currentUserProfile!.id
            );
            isMember = !!membership;
            isAdmin = membership?.role === 'admin';
        }
    }

    return (
        <GroupDetailClient
            group={group}
            currentUserProfile={currentUserProfile}
            isMember={isMember}
            isAdmin={isAdmin}
            isLoggedIn={!!session?.user}
        />
    );
}
