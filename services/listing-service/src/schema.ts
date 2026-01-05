import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable", "@requires"])

  """
  Listing entity - a room or property available for rent
  """
  type Listing @key(fields: "id") {
    id: ID!
    host: User!
    title: String!
    description: String!
    type: ListingType!
    status: ListingStatus!

    # Location
    address: String
    city: String!
    state: String!
    zipCode: String
    neighborhood: String
    location: GeoLocation

    # Pricing
    price: Int!
    currency: String!
    depositAmount: Int
    utilitiesIncluded: Boolean!

    # Room details
    bedrooms: Int!
    bathrooms: Float!
    squareFeet: Int
    furnished: Boolean!

    # Lifestyle & preferences
    freedomScore: Int!
    smokingAllowed: Boolean!
    petsAllowed: Boolean!
    partyFriendly: Boolean!
    dietaryPreference: String

    # Media
    photos: [Photo!]!
    virtualTourUrl: String

    # Availability
    availableFrom: DateTime!
    availableUntil: DateTime
    minStay: Int
    maxStay: Int
    instantBook: Boolean!

    # Amenities & features
    amenities: [String!]!
    houseRules: [String!]!

    # Current roommates
    roommates: [Roommate!]!

    # Stats
    viewCount: Int!
    favoriteCount: Int!

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Reference to User from User Service
  """
  type User @key(fields: "id", resolvable: false) {
    id: ID!
  }

  enum ListingType {
    PRIVATE_ROOM
    SHARED_ROOM
    ENTIRE_PLACE
    MASTER_BEDROOM
  }

  enum ListingStatus {
    DRAFT
    PENDING_REVIEW
    ACTIVE
    PAUSED
    RENTED
    EXPIRED
    REMOVED
  }

  type GeoLocation {
    lat: Float!
    lng: Float!
  }

  type Photo {
    id: ID!
    url: String!
    caption: String
    isPrimary: Boolean!
    order: Int!
  }

  type Roommate {
    id: ID!
    name: String!
    age: Int
    occupation: String
    bio: String
    image: String
    languages: [String!]!
    moveInDate: DateTime
  }

  """
  Availability calendar entry
  """
  type Availability {
    id: ID!
    listingId: ID!
    date: DateTime!
    available: Boolean!
    priceOverride: Int
    minStay: Int
    note: String
  }

  # Input types
  input CreateListingInput {
    title: String!
    description: String!
    type: ListingType!

    # Location
    address: String
    city: String!
    state: String!
    zipCode: String
    neighborhood: String
    lat: Float
    lng: Float

    # Pricing
    price: Int!
    currency: String
    depositAmount: Int
    utilitiesIncluded: Boolean

    # Room details
    bedrooms: Int!
    bathrooms: Float!
    squareFeet: Int
    furnished: Boolean

    # Lifestyle
    smokingAllowed: Boolean
    petsAllowed: Boolean
    partyFriendly: Boolean
    dietaryPreference: String

    # Availability
    availableFrom: DateTime!
    availableUntil: DateTime
    minStay: Int
    maxStay: Int
    instantBook: Boolean

    # Features
    amenities: [String!]
    houseRules: [String!]
  }

  input UpdateListingInput {
    title: String
    description: String
    type: ListingType
    price: Int
    depositAmount: Int
    utilitiesIncluded: Boolean
    bedrooms: Int
    bathrooms: Float
    squareFeet: Int
    furnished: Boolean
    smokingAllowed: Boolean
    petsAllowed: Boolean
    partyFriendly: Boolean
    dietaryPreference: String
    availableFrom: DateTime
    availableUntil: DateTime
    minStay: Int
    maxStay: Int
    instantBook: Boolean
    amenities: [String!]
    houseRules: [String!]
  }

  input ListingFilter {
    city: String
    state: String
    neighborhood: String
    type: ListingType
    priceMin: Int
    priceMax: Int
    bedroomsMin: Int
    freedomScoreMin: Int
    availableFrom: DateTime
    availableUntil: DateTime
    smokingAllowed: Boolean
    petsAllowed: Boolean
    partyFriendly: Boolean
    instantBook: Boolean
    amenities: [String!]
  }

  input SearchInput {
    query: String
    location: String
    lat: Float
    lng: Float
    radius: Int
    filter: ListingFilter
    sortBy: ListingSortBy
    limit: Int
    offset: Int
  }

  enum ListingSortBy {
    PRICE_ASC
    PRICE_DESC
    NEWEST
    FREEDOM_SCORE
    DISTANCE
    POPULARITY
  }

  input AvailabilityInput {
    date: DateTime!
    available: Boolean!
    priceOverride: Int
    minStay: Int
    note: String
  }

  input RoommateInput {
    name: String!
    age: Int
    occupation: String
    bio: String
    languages: [String!]
    moveInDate: DateTime
  }

  # Query types
  type ListingConnection {
    nodes: [Listing!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type SearchResult {
    listings: [Listing!]!
    total: Int!
    facets: SearchFacets!
  }

  type SearchFacets {
    priceRanges: [FacetBucket!]!
    neighborhoods: [FacetBucket!]!
    types: [FacetBucket!]!
    amenities: [FacetBucket!]!
  }

  type FacetBucket {
    key: String!
    count: Int!
  }

  # Queries
  type Query {
    """
    Get a listing by ID
    """
    listing(id: ID!): Listing

    """
    Get listings with filters
    """
    listings(
      filter: ListingFilter
      sortBy: ListingSortBy
      limit: Int
      offset: Int
    ): ListingConnection!

    """
    Search listings with full-text and geo
    """
    searchListings(input: SearchInput!): SearchResult!

    """
    Get listings by host
    """
    myListings(status: ListingStatus): [Listing!]!

    """
    Get similar listings
    """
    similarListings(listingId: ID!, limit: Int): [Listing!]!

    """
    Get availability calendar for a listing
    """
    availability(listingId: ID!, startDate: DateTime!, endDate: DateTime!): [Availability!]!

    """
    Get featured/promoted listings
    """
    featuredListings(city: String, limit: Int): [Listing!]!
  }

  # Mutations
  type Mutation {
    """
    Create a new listing
    """
    createListing(input: CreateListingInput!): Listing!

    """
    Update a listing
    """
    updateListing(id: ID!, input: UpdateListingInput!): Listing!

    """
    Publish a draft listing
    """
    publishListing(id: ID!): Listing!

    """
    Pause a listing (temporarily hide)
    """
    pauseListing(id: ID!): Listing!

    """
    Resume a paused listing
    """
    resumeListing(id: ID!): Listing!

    """
    Mark listing as rented
    """
    markAsRented(id: ID!): Listing!

    """
    Delete a listing
    """
    deleteListing(id: ID!): Boolean!

    """
    Add photos to listing
    """
    addPhotos(listingId: ID!, urls: [String!]!): [Photo!]!

    """
    Remove a photo
    """
    removePhoto(listingId: ID!, photoId: ID!): Boolean!

    """
    Reorder photos
    """
    reorderPhotos(listingId: ID!, photoIds: [ID!]!): [Photo!]!

    """
    Set primary photo
    """
    setPrimaryPhoto(listingId: ID!, photoId: ID!): Photo!

    """
    Update availability calendar
    """
    updateAvailability(listingId: ID!, entries: [AvailabilityInput!]!): [Availability!]!

    """
    Block dates
    """
    blockDates(listingId: ID!, dates: [DateTime!]!): [Availability!]!

    """
    Unblock dates
    """
    unblockDates(listingId: ID!, dates: [DateTime!]!): [Availability!]!

    """
    Add a roommate profile
    """
    addRoommate(listingId: ID!, input: RoommateInput!): Roommate!

    """
    Update roommate
    """
    updateRoommate(listingId: ID!, roommateId: ID!, input: RoommateInput!): Roommate!

    """
    Remove roommate
    """
    removeRoommate(listingId: ID!, roommateId: ID!): Boolean!

    """
    Increment view count
    """
    recordView(listingId: ID!): Boolean!

    """
    Toggle favorite
    """
    toggleFavorite(listingId: ID!): Boolean!
  }

  # Custom scalars
  scalar DateTime
`;
