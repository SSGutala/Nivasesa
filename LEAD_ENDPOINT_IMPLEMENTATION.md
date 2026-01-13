# Lead API Endpoint Implementation Summary

## Overview
Created the missing `/api/leads` endpoint for the Agent Profile contact form in the rent-app. This endpoint creates leads in the lead-gen database when users contact realtors through their profile pages.

## Files Created

### 1. `/apps/rent-app/app/api/leads/route.ts`
Main API endpoint handler with:
- **POST handler** for creating leads
- **Input validation** using Zod schema
- **Cross-database integration** using better-sqlite3
- **Error handling** with appropriate HTTP status codes

**Key Features:**
- Validates required fields: name, email, agentId, message
- Checks if agent exists before creating lead
- Derives city from agent's service areas
- Generates unique CUID for lead ID
- Creates lead with status "locked" (default price: $30)

### 2. `/apps/rent-app/app/api/leads/README.md`
Documentation for the endpoint including:
- Request/response formats
- Error handling
- Implementation details
- Environment variables
- Production TODOs

### 3. `/apps/rent-app/app/api/leads/test-endpoint.sh`
Test script with three scenarios:
- Valid lead creation
- Missing required field validation
- Invalid agent ID handling

### 4. `/apps/lead-gen 2/.env`
Environment configuration:
```
LEADGEN_DATABASE_URL="file:./prisma/dev.db"
```

### 5. `/apps/rent-app/.env` (updated)
Added lead-gen database URL:
```
LEADGEN_DATABASE_URL="file:../lead-gen 2/prisma/prisma/dev.db"
```

## Dependencies Installed

Added to `@niv/rent-app`:
- `better-sqlite3` - Direct SQLite database access
- `@types/better-sqlite3` - TypeScript definitions

## Database Schema

Lead model fields used:
```typescript
{
  id: string (generated CUID)
  agentId: string (references RealtorProfile)
  buyerName: string
  buyerEmail: string
  buyerPhone: string | null
  buyerContact: string (email)
  message: string
  city: string (from agent's cities)
  zipcode: string (default: "00000")
  timeline: string | null
  status: string (default: "locked")
  price: number (default: 30)
  createdAt: string (ISO timestamp)
}
```

## Architecture

### Cross-Database Pattern
```
rent-app (SQLite)
  ├─ Database: prisma/dev.db
  └─ API Route: /api/leads
      └─ writes to →
          lead-gen (SQLite)
            └─ Database: prisma/prisma/dev.db
                └─ Table: Lead
```

### Why better-sqlite3?
The rent-app and lead-gen use separate Prisma schemas with different database files. Since Prisma Client is generated per-schema, accessing the lead-gen database from rent-app requires either:
1. **Raw SQL** via better-sqlite3 (chosen approach)
2. **Dual Prisma clients** with custom output paths
3. **Shared package** for lead-gen client
4. **Service layer** with API calls

Option 1 was chosen for simplicity and direct control during development.

## Testing

### Manual Testing Steps
1. Start rent-app: `cd apps/rent-app && npm run dev`
2. Run test script: `./app/api/leads/test-endpoint.sh`
3. Verify leads in database:
   ```bash
   cd "apps/lead-gen 2"
   sqlite3 prisma/prisma/dev.db "SELECT * FROM Lead;"
   ```

### Test Data
Created test realtor profile:
- **ID:** test-agent-001
- **User ID:** user-001
- **License:** TX12345
- **Brokerage:** Test Realty
- **Cities:** Dallas, Frisco
- **Languages:** English, Hindi

## Integration Points

### Frontend (Existing)
`/apps/rent-app/app/agents/[id]/ContactForm.tsx` already POSTs to `/api/leads` with:
```typescript
{
  agentId: string,
  name: string,
  email: string,
  phone: string,
  message: string,
  timeline: string,
  budgetMin: number,
  budgetMax: number
}
```

### Backend (New)
`/apps/rent-app/app/api/leads/route.ts` handles the request and:
1. Validates input
2. Connects to lead-gen database
3. Verifies agent exists
4. Creates lead record
5. Returns success/error response

## Production Considerations

### Current Limitations
1. **Budget fields** (budgetMin, budgetMax) validated but not stored (Lead schema doesn't include them)
2. **Zipcode** defaults to "00000" (not collected in form)
3. **No authentication** check (anyone can create leads)
4. **No rate limiting** (vulnerable to spam)
5. **Synchronous database access** (blocks on I/O)

### Recommended Improvements
1. **Refactor to shared package:**
   ```
   packages/lead-gen-db/
     ├─ prisma/schema.prisma (lead-gen schema)
     ├─ src/client.ts (generated client)
     └─ src/actions/leads.ts (CRUD operations)
   ```

2. **Add authentication:**
   ```typescript
   import { auth } from '@/lib/auth';
   const session = await auth();
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

3. **Add rate limiting:**
   ```typescript
   import { rateLimit } from '@/lib/rate-limit';
   await rateLimit.check(request.ip, 'create-lead');
   ```

4. **Extend Lead schema** to include budget fields:
   ```prisma
   model Lead {
     // ... existing fields
     budgetMin Int?
     budgetMax Int?
   }
   ```

5. **Add lead notifications:**
   - Email agent when new lead arrives
   - In-app notification system
   - SMS via Twilio (optional)

6. **Switch to PostgreSQL** for production:
   - Better concurrency
   - ACID guarantees
   - Foreign key constraints across databases

## Environment Variables

### Development
- `RENT_DATABASE_URL`: `file:./prisma/dev.db`
- `LEADGEN_DATABASE_URL`: `file:../lead-gen 2/prisma/prisma/dev.db`

### Production
- `RENT_DATABASE_URL`: PostgreSQL connection string
- `LEADGEN_DATABASE_URL`: PostgreSQL connection string (same server, different schema)

## Success Criteria ✓

- [x] API endpoint created at `/api/leads`
- [x] Accepts POST requests with lead data
- [x] Validates required fields (name, email, agentId, message)
- [x] Creates Lead record in lead-gen database
- [x] Returns JSON success/error responses
- [x] Handles agent not found (404)
- [x] Handles validation errors (400)
- [x] Handles server errors (500)
- [x] Compatible with existing ContactForm.tsx
- [x] Documentation provided
- [x] Test script created

## Next Steps

1. **Test the endpoint:**
   ```bash
   cd apps/rent-app
   npm run dev
   # In another terminal:
   ./app/api/leads/test-endpoint.sh
   ```

2. **Verify in database:**
   ```bash
   cd "apps/lead-gen 2"
   sqlite3 prisma/prisma/dev.db "SELECT * FROM Lead;"
   ```

3. **Test via UI:**
   - Navigate to `/agents/test-agent-001`
   - Fill out contact form
   - Submit and verify lead creation

4. **Production deployment:**
   - Add authentication
   - Add rate limiting
   - Switch to PostgreSQL
   - Set up monitoring/alerts
   - Add lead notification system

## File Paths Summary

| File | Path |
|------|------|
| API Route | `/apps/rent-app/app/api/leads/route.ts` |
| Documentation | `/apps/rent-app/app/api/leads/README.md` |
| Test Script | `/apps/rent-app/app/api/leads/test-endpoint.sh` |
| Contact Form | `/apps/rent-app/app/agents/[id]/ContactForm.tsx` |
| Lead-gen DB | `/apps/lead-gen 2/prisma/prisma/dev.db` |
| Rent-app DB | `/apps/rent-app/prisma/dev.db` |
| Lead Schema | `/apps/lead-gen 2/prisma/schema.prisma` |

---

**Implementation Date:** 2026-01-04
**Status:** Complete and ready for testing
