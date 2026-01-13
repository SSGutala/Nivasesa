'use server';

import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Upload realtor profile photo
 * Stores the image in /public/uploads/realtors/ and updates User.image field
 */
export async function uploadRealtorPhotoAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: 'Unauthorized' };
        }

        const file = formData.get('photo') as File;
        if (!file || !file.size) {
            return { success: false, message: 'No file provided' };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { success: false, message: 'File too large. Maximum size is 5MB.' };
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, role: true }
        });

        if (!user || (user as any).role !== 'REALTOR') {
            return { success: false, message: 'Only realtors can upload profile photos' };
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'realtors');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, continue
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = path.extname(file.name);
        const filename = `${user.id}-${timestamp}${extension}`;
        const filepath = path.join(uploadDir, filename);

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Update user image in database
        const publicPath = `/uploads/realtors/${filename}`;
        await prisma.user.update({
            where: { id: user.id },
            data: { image: publicPath }
        });

        revalidatePath('/dashboard');
        return { success: true, imageUrl: publicPath };
    } catch (error) {
        console.error('Failed to upload photo:', error);
        return { success: false, message: 'Failed to upload photo' };
    }
}

/**
 * Remove realtor profile photo
 */
export async function removeRealtorPhotoAction() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: 'Unauthorized' };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, role: true }
        });

        if (!user || (user as any).role !== 'REALTOR') {
            return { success: false, message: 'Unauthorized' };
        }

        // Update user image to null
        await prisma.user.update({
            where: { id: user.id },
            data: { image: null }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to remove photo:', error);
        return { success: false, message: 'Failed to remove photo' };
    }
}

/**
 * Get realtor profile data including photo
 */
export async function getRealtorProfileAction() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                realtorProfile: true
            }
        });

        return user;
    } catch (error) {
        console.error('Failed to get realtor profile:', error);
        return null;
    }
}
