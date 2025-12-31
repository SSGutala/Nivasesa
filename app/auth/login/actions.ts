'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { verifyTOTP, decryptSecret } from '@/lib/totp';

export async function checkTwoFactorRequired(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { twoFactorEnabled: true },
        });

        if (!user) {
            return { exists: false, requires2FA: false };
        }

        return { exists: true, requires2FA: user.twoFactorEnabled };
    } catch (error) {
        console.error('Check 2FA error:', error);
        return { exists: false, requires2FA: false };
    }
}

export async function verifyTwoFactorCode(email: string, code: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { twoFactorEnabled: true, twoFactorSecret: true },
        });

        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            return { success: false, error: '2FA not configured' };
        }

        const secret = decryptSecret(user.twoFactorSecret);
        const isValid = verifyTOTP(secret, email, code);

        if (!isValid) {
            return { success: false, error: 'Invalid code' };
        }

        return { success: true };
    } catch (error) {
        console.error('Verify 2FA error:', error);
        return { success: false, error: 'Verification failed' };
    }
}

export async function doLogin(prevState: any, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { message: 'User not found in database.' };
                default:
                    return { message: 'Something went wrong.' };
            }
        }
        throw error;
    }
}

export async function doLoginWith2FA(email: string, password: string) {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        await signIn('credentials', formData);
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, message: 'User not found in database.' };
                default:
                    return { success: false, message: 'Something went wrong.' };
            }
        }
        throw error;
    }
}
