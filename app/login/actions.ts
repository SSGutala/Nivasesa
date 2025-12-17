'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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
