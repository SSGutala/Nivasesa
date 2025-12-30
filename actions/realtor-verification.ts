'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

/**
 * Admin action to verify a realtor
 */
export async function verifyRealtorAction(realtorProfileId: string) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        await prisma.realtorProfile.update({
            where: { id: realtorProfileId },
            data: { isVerified: true }
        });

        revalidatePath('/admin');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to verify realtor:', error);
        return { success: false, message: 'Failed to verify realtor' };
    }
}

/**
 * Admin action to unverify a realtor
 */
export async function unverifyRealtorAction(realtorProfileId: string) {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized: Admin access required' };
        }

        await prisma.realtorProfile.update({
            where: { id: realtorProfileId },
            data: { isVerified: false }
        });

        revalidatePath('/admin');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to unverify realtor:', error);
        return { success: false, message: 'Failed to unverify realtor' };
    }
}

/**
 * Admin action to get all realtors with their verification status
 */
export async function getAllRealtorsAction() {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized', data: [] };
        }

        const realtors = await prisma.realtorProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: realtors };
    } catch (error) {
        console.error('Failed to get realtors:', error);
        return { success: false, message: 'Failed to fetch realtors', data: [] };
    }
}

/**
 * Admin action to get verification statistics
 */
export async function getVerificationStatsAction() {
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'ADMIN') {
            return null;
        }

        const totalRealtors = await prisma.realtorProfile.count();
        const verifiedRealtors = await prisma.realtorProfile.count({
            where: { isVerified: true }
        });
        const pendingRealtors = await prisma.realtorProfile.count({
            where: { isVerified: false }
        });

        return {
            total: totalRealtors,
            verified: verifiedRealtors,
            pending: pendingRealtors
        };
    } catch (error) {
        console.error('Failed to get verification stats:', error);
        return null;
    }
}
