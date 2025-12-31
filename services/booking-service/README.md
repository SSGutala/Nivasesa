# Booking Service

GraphQL Federation subgraph for managing bookings in the Nivasesa platform.

## Features

- **Booking Management**: Create, confirm, cancel, and complete bookings
- **Status Transitions**: PENDING -> CONFIRMED -> CANCELLED/COMPLETED
- **Availability Checking**: Prevent double-bookings with date overlap detection
- **Federation Integration**: References User and Listing entities from other services
- **Access Control**: Renter and host-specific operations

## Tech Stack

- **Apollo Server** with GraphQL Federation v2
- **Prisma** with SQLite (development) / PostgreSQL (production)
- **TypeScript** for type safety

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### Development

```bash
# Start in development mode with hot reload
pnpm dev
```

The service will start on port 4003.

### Build

```bash
# Type check
pnpm typecheck

# Build for production
pnpm build

# Start production server
pnpm start
```

## GraphQL Schema

### Entities

- **Booking**: Main entity with fields for listing, renter, host, dates, status, and pricing

### Queries

- `booking(id)`: Get a specific booking
- `myBookings()`: Get bookings for current user as renter
- `hostBookings()`: Get bookings for current user as host
- `bookingsForListing(listingId)`: Get all bookings for a listing
- `checkAvailability(listingId, checkIn, checkOut)`: Check if dates are available

### Mutations

- `createBooking(input)`: Create a new booking request
- `confirmBooking(bookingId)`: Confirm a pending booking (host only)
- `cancelBooking(bookingId, reason)`: Cancel a booking (renter or host)
- `completeBooking(bookingId)`: Mark booking as completed (host only)

### Booking States

1. **PENDING**: Initial state after booking creation
2. **CONFIRMED**: Host has accepted the booking
3. **CANCELLED**: Either party has cancelled
4. **COMPLETED**: Stay has ended successfully

## Federation

This service extends entities from other services:

- **User** (from user-service): Referenced for renter and host
- **Listing** (from listing-service): Referenced for the booked property

## Database Schema

```prisma
model Booking {
  id        String   @id @default(cuid())
  listingId String
  renterId  String
  hostId    String
  checkIn   DateTime
  checkOut  DateTime
  status    String   @default("PENDING")
  totalPrice Int
  guestCount Int      @default(1)
  message    String?
  cancelledBy String?
  cancelledAt DateTime?
  cancellationReason String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Environment Variables

```bash
NODE_ENV=development
PORT=4003
DATABASE_URL=file:./dev.db
```

## Integration with Gateway

This service is designed to work with Apollo Federation Gateway:

```typescript
// In gateway configuration
{
  name: 'booking-service',
  url: 'http://localhost:4003/graphql'
}
```

## TODO

- [ ] Integrate with payment service for booking payments
- [ ] Add booking notifications via messaging service
- [ ] Implement refund logic for cancellations
- [ ] Add booking modification functionality
- [ ] Integrate with calendar sync (iCal, etc.)
- [ ] Add booking analytics and reporting
