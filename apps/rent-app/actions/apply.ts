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

        // 1. Save to SQLite via Prisma (Application record)
        const application = await (prisma as any).realtorApplication.create({
            data: rawData,
        });

        // 2. DEMO/TESTING FIX: Automatically create a verified profile
        // In a real production app, this would happen after admin review.
        try {
            // Find or create a User for this agent
            const user = await prisma.user.upsert({
                where: { email: rawData.email.toLowerCase() },
                update: { role: 'REALTOR', name: rawData.fullName },
                create: {
                    email: rawData.email.toLowerCase(),
                    name: rawData.fullName,
                    role: 'REALTOR',
                }
            });

            // Create verified RealtorProfile
            await prisma.realtorProfile.upsert({
                where: { userId: user.id },
                update: {
                    isVerified: true,
                    licenseNumber: rawData.licenseNumber,
                    brokerage: rawData.brokerageName,
                    languages: rawData.languages,
                    experienceYears: parseInt(rawData.experienceYears) || 0,
                    states: rawData.statesLicensed,
                    cities: rawData.primaryMarkets,
                    buyerTypes: rawData.buyerSpecializations,
                    bio: rawData.additionalContext || `Professional Realtor serving ${rawData.primaryMarkets}. Licensed in ${rawData.statesLicensed}.`,
                },
                create: {
                    userId: user.id,
                    licenseNumber: rawData.licenseNumber,
                    brokerage: rawData.brokerageName,
                    languages: rawData.languages,
                    experienceYears: parseInt(rawData.experienceYears) || 0,
                    states: rawData.statesLicensed,
                    cities: rawData.primaryMarkets,
                    buyerTypes: rawData.buyerSpecializations,
                    isVerified: true,
                    bio: rawData.additionalContext || `Professional Realtor serving ${rawData.primaryMarkets}. Licensed in ${rawData.statesLicensed}.`,
                }
            });

            console.log(`STABILIZATION: Automatically created verified profile for ${rawData.email} (App ID: ${application.id})`);
        } catch (profileError) {
            console.error('Failed to auto-create profile during application:', profileError);
            // We don't fail the whole request if profile creation fails, 
            // but we log it.
        }

        return {
            success: true,
            message: 'Application received! Redirecting to account setup...',
            redirectTo: `/onboarding/setup?email=${rawData.email.toLowerCase()}`
        };

    } catch (error) {
        console.error('Failed to submit application:', error);
        return { success: false, message: `Error: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}` };
    }
}
