import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';
import { z } from 'zod';
import Database from 'better-sqlite3';

// Validation schema
const leadSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  timeline: z.string().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
});

// Helper to generate cuid-like ID
function generateCuid(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `c${timestamp}${randomPart}`;
}

/**
 * POST /api/leads
 * Creates a new lead from Agent Profile contact form
 *
 * This endpoint writes to the lead-gen database using raw SQL
 * since the Lead model exists in a separate database schema.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate input
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError ? firstError.message : 'Validation failed' },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Determine lead-gen database path
    const leadGenDbPath =
      process.env.LEADGEN_DATABASE_URL ||
      path.join(process.cwd(), '..', 'lead-gen 2', 'prisma', 'dev.db');

    // Clean the path (remove file: prefix if present)
    const dbPath = leadGenDbPath.replace('file:', '');

    // Use raw SQL to insert into lead-gen database
    // Since we're using SQLite, we can use $queryRawUnsafe with a connection to the lead-gen DB
    // However, Prisma doesn't support connecting to multiple databases directly
    // So we'll use better-sqlite3 or a simpler approach

    // For now, use a simple file-based approach with prisma's raw query
    // We'll need to manually connect to the lead-gen database

    // Generate unique ID for the lead
    const leadId = generateCuid();
    const now = new Date().toISOString();

    // Since we can't easily access lead-gen DB from rent-app prisma client,
    // we'll use a workaround: import the Database class for SQLite
    // For production, this should be refactored to use a shared service

    try {
      // Connect to the lead-gen SQLite database
      const db = new Database(dbPath);

      // First, check if agent exists
      const agent = db
        .prepare('SELECT id, cities FROM RealtorProfile WHERE id = ?')
        .get(data.agentId) as { id: string; cities: string } | undefined;

      if (!agent) {
        db.close();
        return NextResponse.json(
          { success: false, error: 'Agent not found' },
          { status: 404 }
        );
      }

      // Derive city from agent's service areas
      const cities = agent.cities ? agent.cities.split(',').map((c: string) => c.trim()) : [];
      const city = cities[0] || 'Unknown';
      const zipcode = '00000'; // Default since we don't collect it in the form

      // Insert the lead
      const insertStmt = db.prepare(`
        INSERT INTO Lead (
          id, agentId, buyerName, buyerEmail, buyerPhone, buyerContact,
          message, city, zipcode, timeline, status, price, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        leadId,
        data.agentId,
        data.name,
        data.email,
        data.phone || null,
        data.email, // buyerContact is the primary contact method
        data.message,
        city,
        zipcode,
        data.timeline || null,
        'locked', // Default status
        30, // Default price
        now
      );

      db.close();

      return NextResponse.json({
        success: true,
        leadId,
        message: 'Lead created successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Create lead error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create lead',
      },
      { status: 500 }
    );
  }
}
