# Leads API Endpoint

## POST /api/leads

Creates a new lead in the lead-gen database from the Agent Profile contact form.

### Request Body

```json
{
  "agentId": "clxxx...",        // Required: RealtorProfile ID
  "name": "John Doe",           // Required: Buyer's name
  "email": "john@example.com",  // Required: Buyer's email
  "phone": "555-123-4567",      // Optional: Buyer's phone
  "message": "Looking for...",  // Required: Buyer's message
  "timeline": "1-3 months",     // Optional: When looking to move
  "budgetMin": 200000,          // Optional: Min budget (not stored in Lead)
  "budgetMax": 500000           // Optional: Max budget (not stored in Lead)
}
```

### Response

**Success (200)**
```json
{
  "success": true,
  "leadId": "clxxx...",
  "message": "Lead created successfully"
}
```

**Validation Error (400)**
```json
{
  "success": false,
  "error": "Valid email is required"
}
```

**Agent Not Found (404)**
```json
{
  "success": false,
  "error": "Agent not found"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "error": "Failed to create lead"
}
```

### Implementation Details

- Uses `better-sqlite3` for direct database access to the lead-gen database
- Lead is created with status "locked" (agent must unlock to view contact details)
- Default price is $30 per lead
- City is derived from agent's service areas (first city in list)
- Zipcode defaults to "00000" since it's not collected in the form
- Budget fields are validated but not stored (Lead model doesn't have these fields)

### Cross-Database Architecture

This endpoint writes to the lead-gen database from the rent-app application:

```
rent-app (RENT_DATABASE_URL)
  └─> API endpoint: /api/leads
      └─> writes to lead-gen database (LEADGEN_DATABASE_URL)
          └─> Table: Lead
```

### Environment Variables

- `LEADGEN_DATABASE_URL` (optional): Path to lead-gen database
  - Defaults to: `../lead-gen 2/prisma/dev.db`
  - Format: `file:/path/to/dev.db` or `/path/to/dev.db`

### TODO for Production

- [ ] Refactor to use shared service/package for lead-gen access
- [ ] Add authentication check (verify user is allowed to create leads)
- [ ] Add rate limiting to prevent spam
- [ ] Consider using PostgreSQL with proper cross-database queries
- [ ] Add lead notification system (notify agent of new lead)
- [ ] Store budget fields if Lead schema is extended
