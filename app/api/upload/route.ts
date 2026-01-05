import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILES = 5;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    // Validate number of files
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, message: `Maximum ${MAX_FILES} photos allowed` },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // Process each file
    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid file type: ${file.type}. Only JPG, PNG, and WebP are allowed.`,
          },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `File too large: ${file.name}. Maximum size is 5MB.`,
          },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `room_${timestamp}_${random}.${extension}`;

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'rooms');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Write file to disk
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Store the public URL
      const publicUrl = `/uploads/rooms/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} photo(s) uploaded successfully`,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}
