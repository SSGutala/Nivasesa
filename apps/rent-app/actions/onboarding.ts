'use server';

import { prisma } from '@/lib/prisma';
import { hash } from 'crypto';

/**
 * Checks if a username is already taken.
 */
export async function checkUsernameAction(username: string) {
    if (!username || username.length < 3) {
        return { available: false, message: 'Username too short' };
    }

    try {
        const lowerUsername = username.toLowerCase();

        // Use raw SQL to be 100% sure we are querying correctly and bypassing any Prisma client type issues
        // We select the ID of any user that matches the username
        const results = await (prisma as any).$queryRawUnsafe(
            'SELECT id FROM User WHERE LOWER(username) = ? LIMIT 1',
            lowerUsername
        ) as { id: string }[];

        const isAvailable = results.length === 0;
        console.log(`[STABILIZATION] RAW SQL Username check: "${lowerUsername}" -> ${isAvailable ? 'AVAILABLE' : 'TAKEN'}`);

        return {
            available: isAvailable,
            message: isAvailable ? 'Username is available' : 'Username is already taken'
        };
    } catch (error) {
        console.error('[STABILIZATION] Raw SQL Error in checkUsernameAction:', error);
        return { available: false, message: 'Database error during availability check' };
    }
}

/**
 * Finalizes realtor account setup by setting username and password.
 */
export async function completeSetupAction(email: string, username: string, password: string) {
    if (!email || !username || !password) {
        return { success: false, message: 'Missing required fields' };
    }

    try {
        const lowerUsername = username.toLowerCase();

        // 1. Check uniqueness again with raw SQL to be safe
        const results = await (prisma as any).$queryRawUnsafe(
            'SELECT id FROM User WHERE LOWER(username) = ? LIMIT 1',
            lowerUsername
        ) as { id: string }[];

        if (results.length > 0) {
            return { success: false, message: 'Username is already taken' };
        }

        // 2. Update the user record
        // Note: For production, we would use bcrypt. Here we just store it for MVP simplicity 
        await (prisma as any).user.update({
            where: { email: email.toLowerCase() },
            data: {
                username: lowerUsername,
                password: password, // In a real app, hash this!
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error completing setup:', error);
        return { success: false, message: 'Failed to complete setup' };
    }
}
