import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable", "@requires"])

  """
  Booking entity - represents a reservation for a listing
  """
  type Booking @key(fields: "id") {
    id: ID!
    listing: Listing!
    renter: User!
    host: User!

    checkIn: DateTime!
    checkOut: DateTime!
    status: BookingStatus!

    totalPrice: Int!
    currency: String!

    guestCount: Int!
    message: String

    # Cancellation info
    cancelledBy: String
    cancelledAt: DateTime
    cancellationReason: String

    # Review references
    hostReviewId: String
    renterReviewId: String

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Reference to User from User Service
  """
  type User @key(fields: "id", resolvable: false) {
    id: ID!
  }

  """
  Reference to Listing from Listing Service
  """
  type Listing @key(fields: "id", resolvable: false) {
    id: ID!
  }

  """
  Booking status states
  """
  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  # Input types
  input CreateBookingInput {
    listingId: ID!
    checkIn: DateTime!
    checkOut: DateTime!
    guestCount: Int
    message: String
  }

  input ConfirmBookingInput {
    bookingId: ID!
  }

  input CancelBookingInput {
    bookingId: ID!
    reason: String
  }

  input CompleteBookingInput {
    bookingId: ID!
  }

  # Query filters
  input BookingFilter {
    status: BookingStatus
    listingId: ID
    renterId: ID
    hostId: ID
    checkInAfter: DateTime
    checkInBefore: DateTime
    checkOutAfter: DateTime
    checkOutBefore: DateTime
  }

  # Connection types for pagination
  type BookingConnection {
    nodes: [Booking!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  # Queries
  type Query {
    """
    Get a booking by ID
    """
    booking(id: ID!): Booking

    """
    Get bookings for the current user (as renter)
    """
    myBookings(
      status: BookingStatus
      limit: Int
      offset: Int
    ): BookingConnection!

    """
    Get bookings for listings owned by current user (as host)
    """
    hostBookings(
      status: BookingStatus
      limit: Int
      offset: Int
    ): BookingConnection!

    """
    Get all bookings for a specific listing
    """
    bookingsForListing(
      listingId: ID!
      status: BookingStatus
      limit: Int
      offset: Int
    ): BookingConnection!

    """
    Check if dates are available for a listing
    """
    checkAvailability(
      listingId: ID!
      checkIn: DateTime!
      checkOut: DateTime!
    ): Boolean!
  }

  # Mutations
  type Mutation {
    """
    Create a new booking request
    """
    createBooking(input: CreateBookingInput!): Booking!

    """
    Confirm a pending booking (host only)
    """
    confirmBooking(input: ConfirmBookingInput!): Booking!

    """
    Cancel a booking
    """
    cancelBooking(input: CancelBookingInput!): Booking!

    """
    Mark booking as completed
    """
    completeBooking(input: CompleteBookingInput!): Booking!
  }

  # Custom scalars
  scalar DateTime
`;
