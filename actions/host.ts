'use server';

import { prisma } from '@/lib/prisma';

export async function createHostAccount(data: any) {
    try {
        const { email, password, firstName, lastName } = data;

        if (!email) {
            return { success: false, message: 'Email is required.' };
        }

        const normalizedEmail = email.trim().toLowerCase();
        const fullName = `${firstName || 'Host'} ${lastName || 'User'}`.trim();

        try {
            // Try to Upsert
            await prisma.user.upsert({
                where: { email: normalizedEmail },
                update: {
                    role: 'LANDLORD',
                    name: fullName,
                    // If password is provided, update it, otherwise keep existing
                    ...(password ? { password } : {}),
                },
                create: {
                    email: normalizedEmail,
                    role: 'LANDLORD',
                    name: fullName,
                    password: password || 'tempPass123', // Fallback password
                }
            });
            return { success: true };
        } catch (dbError) {
            console.error('Prisma upsert failed, checking existence:', dbError);

            // Fallback: If upsert failed (e.g. connection issue or unique constraint on other fields),
            // check if user at least exists. If so, we can proceed to login.
            const existingUser = await prisma.user.findUnique({
                where: { email: normalizedEmail }
            });

            if (existingUser) {
                console.log('User exists despite upsert failure. Proceeding.');
                return { success: true };
            }

            throw dbError; // Re-throw if user really doesn't exist
        }

    } catch (error: any) {
        console.error('Failed to create host account:', error);
        return {
            success: false,
            message: error.message || 'Failed to create account.'
        };
    }
}
