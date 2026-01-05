'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCoordinates, calculateDistance } from '@/lib/geo';

export async function getLeadCountAction(zipcode: string, radius: number) {
    try {
        const center = getCoordinates(zipcode);
        if (!center) {
            console.log(`STABILIZATION: No coordinates found for ZIP ${zipcode}. Returning empty result.`);
            return {
                leads: [],
                count: 0,
                zipcode,
                radius,
                message: "No leads found for this area.",
                leadIds: []
            };
        }

        const client = prisma as any;
        const allLeads = await client.lead.findMany({
            where: {
                status: 'locked'
            }
        });

        const nearbyLeads = allLeads.filter((lead: any) => {
            const distance = calculateDistance(center.lat, center.lng, lead.lat, lead.lng);
            return distance <= radius;
        });

        return {
            leads: [], // User requested this field in fallback
            count: nearbyLeads.length,
            zipcode,
            radius,
            leadIds: nearbyLeads.map((l: any) => l.id)
        };
    } catch (error) {
        console.error('STABILIZATION: Failed to get lead count gracefully:', error);
        return {
            leads: [],
            count: 0,
            zipcode,
            radius,
            message: "No leads found for this area.",
            leadIds: []
        };
    }
}

export async function getUnlockedLeadsAction(userId: string) {
    try {
        const client = prisma as any;
        if (!client.unlockedLead) return [];

        const unlocked = await client.unlockedLead.findMany({
            where: { userId },
            include: { lead: true }
        });
        return unlocked.map((u: any) => u.lead);
    } catch (error) {
        console.error('STABILIZATION: Failed to fetch unlocked leads:', error);
        return [];
    }
}

export async function unlockLeadsBulkAction(leadIds: string[], userId: string, totalCost: number) {
    try {
        const client = prisma as any;
        return await client.$transaction(async (tx: any) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { balance: true }
            });

            if (!user || (user.balance || 0) < totalCost) {
                return { success: false, message: 'Insufficient balance' };
            }

            // Deduct balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: totalCost } }
            });

            // Mark leads as unlocked for this user
            for (const leadId of leadIds) {
                // Check if already unlocked to avoid duplication error manually if needed, 
                // but since we want to skip duplicates, we can try/catch or find first.
                // However, the schema has a unique constraint @@unique([userId, leadId]).
                // We'll use upsert or just ignore unique constraint errors? 
                // Better: findUnique then create. Or just count on 'connect'. 
                // Simpler: Just try create and ignore error if it exists? 
                // Efficient way for SQLite safety:
                const existing = await tx.unlockedLead.findUnique({
                    where: { userId_leadId: { userId, leadId } }
                });

                if (!existing) {
                    await tx.unlockedLead.create({
                        data: { userId, leadId }
                    });
                }
            }

            // Create transaction record
            if (tx.financialRecord) {
                await tx.financialRecord.create({
                    data: {
                        userId,
                        amount: totalCost,
                        type: 'WITHDRAWAL',
                        status: 'completed'
                    }
                });
            }

            revalidatePath('/dashboard');
            return { success: true };
        });
    } catch (error: any) {
        console.error('STABILIZATION: Failed to unlock leads:', error);
        return { success: false, message: error.message || 'Failed to unlock leads' };
    }
}

export async function getUserBalanceAction(email: string) {
    try {
        const client = prisma as any;
        const user = await client.user.findUnique({
            where: { email },
            select: { id: true, balance: true }
        });
        return user;
    } catch (error) {
        console.error('STABILIZATION: Failed to get user balance:', error);
        return null;
    }
}

export async function addBalanceAction(userId: string, amount: number) {
    try {
        const client = prisma as any;
        await client.$transaction(async (tx: any) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } }
            });

            if (tx.financialRecord) {
                await tx.financialRecord.create({
                    data: {
                        userId,
                        amount,
                        type: 'DEPOSIT',
                        status: 'completed'
                    }
                });
            }
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('STABILIZATION: Failed to add balance:', error);
        return { success: false };
    }
}

import { auth } from '@/auth';

export async function getCurrentUserAction() {
    const session = await auth();
    return session?.user;
}

export async function updateRealtorProfile(realtorId: string, data: any) {
    try {
        const client = prisma as any;
        // Check if we should update RealtorProfile or RealtorApplication
        await client.realtorProfile.update({
            where: { id: realtorId },
            data: {
                bio: data.bio,
                cities: data.citiesZipcodesServed,
            }
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('STABILIZATION: Failed to update profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

export async function getInboundLeadsAction(agentId: string) {
    try {
        let leads = await prisma.lead.findMany({
            where: { agentId },
            include: {
                unlockedBy: true
            },
            orderBy: { createdAt: 'desc' }
        });

        if (leads.length === 0) {
            // Lazy seed mock leads for this agent
            const MOCK_LEADS = [
                {
                    agentId,
                    buyerName: 'Amit Patel',
                    buyerEmail: 'amit.patel@example.com',
                    buyerPhone: '(555) 123-4567',
                    city: 'Frisco',
                    zipcode: '75034',
                    interest: 'Single Family Home',
                    languagePreference: 'Gujarati, English',
                    timeline: 'ASAP',
                    message: 'Looking for a 4-bedroom home near good schools. Budget around $650k.',
                    buyerType: 'First-time Buyer',
                    status: 'locked'
                },
                {
                    agentId,
                    buyerName: 'Sarah Jenkins',
                    buyerEmail: 'sarah.j@example.com',
                    buyerPhone: '(555) 987-6543',
                    city: 'Plano',
                    zipcode: '75024',
                    interest: 'Luxury Apartment',
                    languagePreference: 'English',
                    timeline: '1-3 months',
                    message: 'Relocating for work, need a modern apartment with a gym.',
                    buyerType: 'Relocation',
                    status: 'locked'
                },
                {
                    agentId,
                    buyerName: 'Rajiv & Priya',
                    buyerEmail: 'rajiv.priya@example.com',
                    buyerPhone: '(555) 555-5555',
                    city: 'McKinney',
                    zipcode: '75070',
                    interest: 'Investment Property',
                    languagePreference: 'Hindi, English',
                    timeline: '3-6 months',
                    message: 'Interested in rental properties for investment purposes.',
                    buyerType: 'Investor',
                    status: 'locked'
                }
            ];

            for (const lead of MOCK_LEADS) {
                await prisma.lead.create({ data: lead });
            }

            // Fetch again
            leads = await prisma.lead.findMany({
                where: { agentId },
                include: {
                    unlockedBy: true
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return leads;
    } catch (error) {
        console.error('Failed to fetch inbound leads:', error);
        return [];
    }
}

export async function getRealtorProfileByEmail(email: string) {
    try {
        const profile = await prisma.realtorProfile.findFirst({
            where: { user: { email } },
            include: { user: true }
        });
        return profile;
    } catch (error) {
        console.error('Failed to get realtor profile:', error);
        return null;
    }
}
