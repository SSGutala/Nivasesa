'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitRealtorApplication(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            brokerage: formData.get('brokerage') as string,
            licenseNumber: formData.get('licenseNumber') as string,
            states: formData.get('states') as string,
            cities: formData.get('cities') as string,
            languages: formData.getAll('languages').join(', '),
            experienceYears: formData.get('experienceYears') as string,
            notes: formData.get('notes') as string || '',
        };

        // Basic validation
        if (!rawData.name || !rawData.email || !rawData.licenseNumber) {
            return { success: false, message: 'Please fill in all required fields.' };
        }

        await (prisma as any).realtorApplication.create({
            data: rawData,
        });

        return { success: true, message: 'Application submitted successfully.' };
    } catch (error) {
        console.error('Failed to submit application:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}
