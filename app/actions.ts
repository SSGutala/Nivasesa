'use server';

import { z } from 'zod';
// import prisma from '@/lib/prisma'; // Will need to create lib/prisma

const BuyerRequestSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    location: z.string().min(2, "City or Zip is required"),
    budget: z.string().optional(),
    timeframe: z.string().optional(),
    language: z.string().default("English"),
});

import { prisma } from '@/lib/prisma';
import { findMatches } from '@/lib/matching';

export async function submitBuyerRequest(prevState: any, formData: FormData) {
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        location: formData.get('location') as string,
        budget: formData.get('budget') ? Number(formData.get('budget')) : undefined, // Simplify for MVP
        timeframe: formData.get('timeframe') as string,
        languages: formData.get('language') as string,
    };

    const validatedFields = BuyerRequestSchema.safeParse({
        ...data,
        budget: "0", // Bypass zod schema which expects string/optional for now, or fix schema. 
        // Actually schema said string optional. Let's keep it string in schema but I cast to number above? 
        // Wait, schema: budget: z.string().optional(). 
        // Let's revert casting to Number and keep string for simplicity 
    });

    // Re-map to string for schema validation to match form
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        budget: formData.get('budget') as string,
        timeframe: formData.get('timeframe'),
        language: formData.get('language'),
    };

    const validation = BuyerRequestSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to submit request.',
            success: false,
            matches: [],
            location: '',
        };
    }

    const validData = validation.data;

    try {
        // 1. Save Buyer Request
        const request = await prisma.buyerRequest.create({
            data: {
                name: validData.name,
                email: validData.email,
                phone: validData.phone,
                locations: validData.location,
                languages: validData.language,
                timeframe: validData.timeframe,
                // budgetMin/Max parsing omitted for MVP speed, storing simplified in notes or future field
            }
        });

        // 2. Find Matches
        const matches = await findMatches({
            city: validData.location,
            language: validData.language
        });

        // 3. Create Referrals
        for (const match of matches) {
            await prisma.referral.create({
                data: {
                    buyerRequestId: request.id,
                    realtorId: match.id,
                    status: 'SENT',
                }
            });
        }

        return {
            success: true,
            message: `Request submitted! We found ${matches.length} matches for you.`,
            matches: matches, // Return matches to frontend
            location: validData.location,
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: 'Server error. Please try again.',
            errors: null,
            matches: [],
            location: '',
        };
    }
}
