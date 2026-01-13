export type ListingStatus = 'AVAILABLE' | 'IN_DISCUSSION' | 'UNAVAILABLE';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  lat: number;
  lng: number;
  images: string[];
  amenities: string[];
  norms: string[];
  status: ListingStatus;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomListing extends Listing {
  roomType: 'private' | 'shared';
  availableFrom: Date;
  leaseDuration: 'short' | 'long' | 'flexible';
}
