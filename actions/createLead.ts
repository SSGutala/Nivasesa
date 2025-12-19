'use server';

import prisma from '@/lib/prisma';
import { Lead } from '@prisma/client';

export type CreateLeadParams = {
    agentId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone?: string;
    interest: string;
    message: string;
    city: string;
    zipcode: string;
};

export async function createLead(params: CreateLeadParams) {
    try {
        const lead = await prisma.lead.create({
            data: {
                agentId: params.agentId,
                buyerName: params.buyerName,
                buyerEmail: params.buyerEmail,
                buyerPhone: params.buyerPhone,
                interest: params.interest,
                message: params.message,
                city: params.city,
                zipcode: params.zipcode,
                status: 'locked',
                price: 30,
            },
        });

        return { success: true, lead };
    } catch (error) {
        console.error('Error creating lead:', error);
        return { success: false, message: 'Database error' };
    }
}
