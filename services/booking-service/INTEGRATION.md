# Integration Guide

## Adding Booking Service to the Gateway

To integrate this booking-service with the Apollo Federation Gateway, add it to the gateway configuration:

### 1. Update Gateway Supergraph Config

Add to `services/gateway/supergraph.yaml` (or your supergraph config):

```yaml
subgraphs:
  booking-service:
    routing_url: http://localhost:4003/graphql
    schema:
      subgraph_url: http://localhost:4003/graphql
```

### 2. Update Gateway Service List

If using managed federation or a custom gateway setup, add:

```typescript
const server = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'user-service', url: 'http://localhost:4001/graphql' },
      { name: 'listing-service', url: 'http://localhost:4002/graphql' },
      { name: 'booking-service', url: 'http://localhost:4003/graphql' }, // Add this
    ],
  }),
});
```

### 3. Start Services in Order

```bash
# Terminal 1: User Service
cd services/user-service
pnpm dev

# Terminal 2: Listing Service
cd services/listing-service
pnpm dev

# Terminal 3: Booking Service
cd services/booking-service
pnpm dev

# Terminal 4: Gateway
cd services/gateway
pnpm dev
```

## Example Queries

### Create a Booking

```graphql
mutation CreateBooking {
  createBooking(input: {
    listingId: "listing123"
    checkIn: "2025-02-01T15:00:00Z"
    checkOut: "2025-02-05T11:00:00Z"
    guestCount: 2
    message: "Looking forward to staying at your place!"
  }) {
    id
    status
    totalPrice
    listing {
      id
      title
    }
    renter {
      id
      name
    }
  }
}
```

### Query My Bookings

```graphql
query MyBookings {
  myBookings(status: CONFIRMED) {
    nodes {
      id
      checkIn
      checkOut
      status
      totalPrice
      listing {
        id
        title
        city
        state
      }
      host {
        id
        name
      }
    }
    totalCount
  }
}
```

### Host Confirming a Booking

```graphql
mutation ConfirmBooking {
  confirmBooking(input: {
    bookingId: "booking123"
  }) {
    id
    status
    renter {
      name
      email
    }
  }
}
```

## Federation Features

This service references entities from other services:

- **User** (from user-service): Used for `renter` and `host` fields
- **Listing** (from listing-service): Used for `listing` field

The gateway will automatically resolve these references across services.

## TODO: Future Enhancements

1. **Price Calculation**: Currently uses placeholder pricing. Should fetch from listing-service
2. **Host Resolution**: Currently uses placeholder host. Should fetch from listing-service
3. **Payment Integration**: Add payment processing before confirming bookings
4. **Notifications**: Send emails/SMS on booking status changes
5. **Calendar Integration**: Sync with external calendars (Google, iCal)
6. **Booking Modifications**: Allow changing dates on confirmed bookings
7. **Reviews**: Link to review service after completion
8. **Dispute Resolution**: Add dispute handling workflow
