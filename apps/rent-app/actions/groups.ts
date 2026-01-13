'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =============================================================================
// ROOMMATE PROFILE ACTIONS
// =============================================================================

interface CreateRoommateProfileData {
    preferredCities: string;
    preferredStates: string;
    maxBudget: number;
    minBudget?: number;
    dietaryPreference: string;
    smokingPreference: string;
    cannabisPreference: string;
    alcoholPreference: string;
    substancePreference?: string;
    lgbtqFriendly: string;
    relationshipStatus?: string;
    guestPolicy?: string;
    cleanlinessLevel: string;
    sleepSchedule: string;
    workStyle: string;
    noiseLevel?: string;
    petsPreference: string;
    hasPets?: string;
    gender?: string;
    ageRange?: string;
    occupation?: string;
    languages: string;
    isLookingForRoom?: boolean;
    isLookingForRoommate?: boolean;
    moveInDate?: Date;
    leaseDuration?: string;
    bio?: string;
}

export async function createRoommateProfile(data: CreateRoommateProfileData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const existingProfile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (existingProfile) {
            return { success: false, message: 'You already have a roommate profile' };
        }

        const profile = await prisma.roommateProfile.create({
            data: {
                userId: session.user.id,
                ...data,
            },
        });

        revalidatePath('/roommates');
        return { success: true, profile };
    } catch (error) {
        console.error('Error creating roommate profile:', error);
        return { success: false, message: 'Failed to create profile' };
    }
}

export async function updateRoommateProfile(data: Partial<CreateRoommateProfileData>) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const profile = await prisma.roommateProfile.update({
            where: { userId: session.user.id },
            data,
        });

        revalidatePath('/roommates');
        return { success: true, profile };
    } catch (error) {
        console.error('Error updating roommate profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

export async function getMyRoommateProfile() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return prisma.roommateProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            groupMemberships: {
                include: {
                    group: true,
                },
            },
        },
    });
}

// =============================================================================
// GROUP ACTIONS
// =============================================================================

interface CreateGroupData {
    name: string;
    description?: string;
    targetCity: string;
    targetState: string;
    targetBudgetMin?: number;
    targetBudgetMax?: number;
    targetMoveIn?: Date;
    propertyType?: string;
    bedroomsNeeded?: number;
    isPublic?: boolean;
    maxMembers?: number;
}

export async function createGroup(data: CreateGroupData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Check if user has a roommate profile
        let profile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return { success: false, message: 'Please create a roommate profile first' };
        }

        // Create the group
        const group = await prisma.group.create({
            data: {
                ...data,
                createdById: session.user.id,
                members: {
                    create: {
                        profileId: profile.id,
                        role: 'admin',
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: {
                            include: {
                                user: {
                                    select: { name: true, image: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        revalidatePath('/groups');
        return { success: true, group };
    } catch (error) {
        console.error('Error creating group:', error);
        return { success: false, message: 'Failed to create group' };
    }
}

export async function updateGroup(groupId: string, data: Partial<CreateGroupData>) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify user is admin of the group
        const membership = await prisma.groupMember.findFirst({
            where: {
                groupId,
                profile: { userId: session.user.id },
                role: 'admin',
            },
        });

        if (!membership) {
            return { success: false, message: 'Only group admins can update the group' };
        }

        const group = await prisma.group.update({
            where: { id: groupId },
            data,
        });

        revalidatePath(`/groups/${groupId}`);
        return { success: true, group };
    } catch (error) {
        console.error('Error updating group:', error);
        return { success: false, message: 'Failed to update group' };
    }
}

export async function getGroups(filters?: {
    city?: string;
    state?: string;
    status?: string;
    isPublic?: boolean;
}) {
    const where: Record<string, unknown> = {};

    if (filters?.city) where.targetCity = filters.city;
    if (filters?.state) where.targetState = filters.state;
    if (filters?.status) where.status = filters.status;
    if (filters?.isPublic !== undefined) where.isPublic = filters.isPublic;

    return prisma.group.findMany({
        where,
        include: {
            members: {
                include: {
                    profile: {
                        include: {
                            user: {
                                select: { name: true, image: true },
                            },
                        },
                    },
                },
            },
            createdBy: {
                select: { name: true, image: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getGroupById(groupId: string) {
    return prisma.group.findUnique({
        where: { id: groupId },
        include: {
            members: {
                include: {
                    profile: {
                        include: {
                            user: {
                                select: { id: true, name: true, image: true, email: true },
                            },
                        },
                    },
                },
            },
            createdBy: {
                select: { id: true, name: true, image: true },
            },
            assignedRealtor: {
                include: {
                    user: {
                        select: { name: true, image: true },
                    },
                },
            },
            realtorRequests: {
                include: {
                    realtor: {
                        include: {
                            user: {
                                select: { name: true, image: true },
                            },
                        },
                    },
                },
            },
        },
    });
}

export async function getMyGroups() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const profile = await prisma.roommateProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        return [];
    }

    const memberships = await prisma.groupMember.findMany({
        where: { profileId: profile.id },
        include: {
            group: {
                include: {
                    members: {
                        include: {
                            profile: {
                                include: {
                                    user: {
                                        select: { name: true, image: true },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return memberships.map((m: typeof memberships[0]) => m.group);
}

// =============================================================================
// GROUP MEMBERSHIP ACTIONS
// =============================================================================

export async function joinGroup(groupId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const profile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return { success: false, message: 'Please create a roommate profile first' };
        }

        // Check if group exists and is open
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });

        if (!group) {
            return { success: false, message: 'Group not found' };
        }

        if (!group.isPublic) {
            return { success: false, message: 'This group is private' };
        }

        if (group.members.length >= group.maxMembers) {
            return { success: false, message: 'Group is full' };
        }

        // Check if already a member
        const existingMembership = await prisma.groupMember.findUnique({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: profile.id,
                },
            },
        });

        if (existingMembership) {
            return { success: false, message: 'You are already a member of this group' };
        }

        await prisma.groupMember.create({
            data: {
                groupId,
                profileId: profile.id,
                role: 'member',
            },
        });

        revalidatePath(`/groups/${groupId}`);
        return { success: true, message: 'Successfully joined the group' };
    } catch (error) {
        console.error('Error joining group:', error);
        return { success: false, message: 'Failed to join group' };
    }
}

export async function leaveGroup(groupId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const profile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return { success: false, message: 'Profile not found' };
        }

        // Check membership
        const membership = await prisma.groupMember.findUnique({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: profile.id,
                },
            },
        });

        if (!membership) {
            return { success: false, message: 'You are not a member of this group' };
        }

        // Check if user is the only admin
        if (membership.role === 'admin') {
            const otherAdmins = await prisma.groupMember.count({
                where: {
                    groupId,
                    role: 'admin',
                    profileId: { not: profile.id },
                },
            });

            if (otherAdmins === 0) {
                // Check if there are other members to promote
                const otherMembers = await prisma.groupMember.findFirst({
                    where: {
                        groupId,
                        profileId: { not: profile.id },
                    },
                });

                if (otherMembers) {
                    // Promote another member to admin
                    await prisma.groupMember.update({
                        where: { id: otherMembers.id },
                        data: { role: 'admin' },
                    });
                }
            }
        }

        await prisma.groupMember.delete({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: profile.id,
                },
            },
        });

        revalidatePath(`/groups/${groupId}`);
        return { success: true, message: 'Successfully left the group' };
    } catch (error) {
        console.error('Error leaving group:', error);
        return { success: false, message: 'Failed to leave group' };
    }
}

export async function removeMember(groupId: string, profileId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify caller is admin
        const callerProfile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!callerProfile) {
            return { success: false, message: 'Profile not found' };
        }

        const callerMembership = await prisma.groupMember.findFirst({
            where: {
                groupId,
                profileId: callerProfile.id,
                role: 'admin',
            },
        });

        if (!callerMembership) {
            return { success: false, message: 'Only admins can remove members' };
        }

        // Don't allow removing yourself (use leaveGroup instead)
        if (profileId === callerProfile.id) {
            return { success: false, message: 'Use leave group to remove yourself' };
        }

        await prisma.groupMember.delete({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId,
                },
            },
        });

        revalidatePath(`/groups/${groupId}`);
        return { success: true, message: 'Member removed successfully' };
    } catch (error) {
        console.error('Error removing member:', error);
        return { success: false, message: 'Failed to remove member' };
    }
}

// =============================================================================
// REALTOR REQUEST ACTIONS
// =============================================================================

export async function requestRealtor(groupId: string, realtorId: string, message?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify caller is a group member
        const profile = await prisma.roommateProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return { success: false, message: 'Profile not found' };
        }

        const membership = await prisma.groupMember.findUnique({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: profile.id,
                },
            },
        });

        if (!membership) {
            return { success: false, message: 'Only group members can request realtors' };
        }

        // Check if realtor exists and accepts groups
        const realtor = await prisma.realtorProfile.findUnique({
            where: { id: realtorId },
        });

        if (!realtor) {
            return { success: false, message: 'Realtor not found' };
        }

        if (!realtor.acceptsGroups) {
            return { success: false, message: 'This realtor is not accepting group requests' };
        }

        // Check for existing request
        const existingRequest = await prisma.groupRealtorRequest.findUnique({
            where: {
                groupId_realtorId: {
                    groupId,
                    realtorId,
                },
            },
        });

        if (existingRequest) {
            return { success: false, message: 'Request already sent to this realtor' };
        }

        await prisma.groupRealtorRequest.create({
            data: {
                groupId,
                realtorId,
                message,
            },
        });

        revalidatePath(`/groups/${groupId}`);
        return { success: true, message: 'Request sent to realtor' };
    } catch (error) {
        console.error('Error requesting realtor:', error);
        return { success: false, message: 'Failed to send request' };
    }
}

export async function respondToGroupRequest(
    requestId: string,
    status: 'accepted' | 'rejected'
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Verify caller is the realtor
        const realtorProfile = await prisma.realtorProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!realtorProfile) {
            return { success: false, message: 'You must be a realtor' };
        }

        const request = await prisma.groupRealtorRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return { success: false, message: 'Request not found' };
        }

        if (request.realtorId !== realtorProfile.id) {
            return { success: false, message: 'This request is not for you' };
        }

        // Update request status
        await prisma.groupRealtorRequest.update({
            where: { id: requestId },
            data: { status },
        });

        // If accepted, assign realtor to group
        if (status === 'accepted') {
            await prisma.group.update({
                where: { id: request.groupId },
                data: {
                    assignedRealtorId: realtorProfile.id,
                    status: 'matched',
                },
            });
        }

        revalidatePath(`/groups/${request.groupId}`);
        revalidatePath('/dashboard');
        return { success: true, message: `Request ${status}` };
    } catch (error) {
        console.error('Error responding to request:', error);
        return { success: false, message: 'Failed to respond to request' };
    }
}

export async function getGroupRequestsForRealtor() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const realtorProfile = await prisma.realtorProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!realtorProfile) {
        return [];
    }

    return prisma.groupRealtorRequest.findMany({
        where: {
            realtorId: realtorProfile.id,
            status: 'pending',
        },
        include: {
            group: {
                include: {
                    members: {
                        include: {
                            profile: {
                                include: {
                                    user: {
                                        select: { name: true, image: true },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
