'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitRealtorApplication(prevState: any, formData: FormData) {
    try {
        const rawData = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            preferredContactMethod: formData.get('preferredContactMethod') as string || null,
            brokerageName: formData.get('brokerageName') as string,
            licenseNumber: formData.get('licenseNumber') as string,
            statesLicensed: formData.getAll('statesLicensed').join(', '),
            experienceYears: formData.get('experienceYears') as string,
            primaryMarkets: formData.get('primaryMarkets') as string,
            acceptingNewClients: formData.get('acceptingNewClients') as string || null,
            buyerSpecializations: formData.getAll('buyerSpecializations').join(', '),
            languages: formData.getAll('languages').join(', '),
            otherLanguage: formData.get('otherLanguage') as string || null,
            referralAcknowledgement: formData.get('referralAcknowledgement') === 'on',
            additionalContext: formData.get('additionalContext') as string || null,
            status: 'pending',
        };

        // Basic validation
        if (!rawData.fullName || !rawData.email || !rawData.phone || !rawData.licenseNumber || !rawData.statesLicensed || !rawData.experienceYears || !rawData.primaryMarkets) {
            return { success: false, message: 'Please fill in all required fields.' };
        }

        if (formData.getAll('buyerSpecializations').length === 0) {
            return { success: false, message: 'Please select at least one buyer specialization.' };
        }

        if (formData.getAll('languages').length === 0) {
            return { success: false, message: 'Please select at least one language.' };
        }

        // 1. Save to SQLite via Prisma
        // Ensure we use the exact model name property as it appears on the client
        const client = prisma as any;
        const model = client.realtorApplication || client.RealtorApplication;

        if (!model) {
            console.error('Available models:', Object.keys(client));
            throw new Error('Database configuration error: RealtorApplication model missing from client.');
        }

        await model.create({
            data: rawData,
        });

        return { success: true, message: 'Thank you for applying. Our team will review your application and follow up if there’s a fit.' };

    } catch (error) {
        console.error('Failed to submit application:', error);
        return { success: false, message: `Error: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}` };
    }
}
