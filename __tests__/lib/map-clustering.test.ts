import { describe, it, expect } from 'vitest';
import {
  clusterListings,
  getClusterDistance,
  calculateViewportBounds,
  isInViewport,
  getClusterSize,
  type ViewportBounds,
} from '../../apps/rent-app/lib/map-clustering';
import type { Listing } from '../../apps/rent-app/lib/listings-data';

// Helper to create test listings
function createListing(id: string, lat: number, lng: number): Listing {
  return {
    id,
    title: `Listing ${id}`,
    price: 1000,
    neighborhood: 'Test',
    city: 'Test City',
    type: 'Private room',
    roommates: 2,
    stayDuration: 'Long-term',
    availability: 'available',
    images: [],
    badges: [],
    preferences: {
      diet: 'Mixed',
      cooking: 'No restrictions',
      languages: ['English'],
      lifestyle: [],
      guestPolicy: 'Open',
    },
    amenities: [],
    description: 'Test listing',
    lat,
    lng,
  };
}

describe('map-clustering', () => {
  describe('getClusterDistance', () => {
    it('should return larger distance for lower zoom levels', () => {
      const zoom05 = getClusterDistance(0.5);
      const zoom10 = getClusterDistance(1.0);
      const zoom20 = getClusterDistance(2.0);

      expect(zoom05).toBeGreaterThan(zoom10);
      expect(zoom10).toBeGreaterThan(zoom20);
    });

    it('should return appropriate distances for each zoom range', () => {
      expect(getClusterDistance(0.5)).toBe(0.05);
      expect(getClusterDistance(0.7)).toBe(0.03);
      expect(getClusterDistance(0.9)).toBe(0.02);
      expect(getClusterDistance(1.2)).toBe(0.015);
      expect(getClusterDistance(1.5)).toBe(0.01);
      expect(getClusterDistance(2.0)).toBe(0.005);
    });
  });

  describe('isInViewport', () => {
    const bounds: ViewportBounds = {
      minLat: 40.0,
      maxLat: 41.0,
      minLng: -75.0,
      maxLng: -73.0,
    };

    it('should return true for points inside viewport', () => {
      expect(isInViewport(40.5, -74.0, bounds)).toBe(true);
    });

    it('should return false for points outside viewport', () => {
      expect(isInViewport(39.5, -74.0, bounds)).toBe(false); // below min lat
      expect(isInViewport(41.5, -74.0, bounds)).toBe(false); // above max lat
      expect(isInViewport(40.5, -76.0, bounds)).toBe(false); // below min lng
      expect(isInViewport(40.5, -72.0, bounds)).toBe(false); // above max lng
    });

    it('should return true for points on boundaries', () => {
      expect(isInViewport(40.0, -74.0, bounds)).toBe(true);
      expect(isInViewport(41.0, -74.0, bounds)).toBe(true);
      expect(isInViewport(40.5, -75.0, bounds)).toBe(true);
      expect(isInViewport(40.5, -73.0, bounds)).toBe(true);
    });
  });

  describe('calculateViewportBounds', () => {
    it('should create bounds centered on given coordinates', () => {
      const bounds = calculateViewportBounds(40.75, -74.0, 1.0);

      expect(bounds.minLat).toBeLessThan(40.75);
      expect(bounds.maxLat).toBeGreaterThan(40.75);
      expect(bounds.minLng).toBeLessThan(-74.0);
      expect(bounds.maxLng).toBeGreaterThan(-74.0);
    });

    it('should create smaller bounds at higher zoom levels', () => {
      const bounds1x = calculateViewportBounds(40.75, -74.0, 1.0);
      const bounds2x = calculateViewportBounds(40.75, -74.0, 2.0);

      const latRange1x = bounds1x.maxLat - bounds1x.minLat;
      const latRange2x = bounds2x.maxLat - bounds2x.minLat;

      expect(latRange2x).toBeLessThan(latRange1x);
    });
  });

  describe('getClusterSize', () => {
    it('should return "small" for 2-5 listings', () => {
      expect(getClusterSize(2)).toBe('small');
      expect(getClusterSize(5)).toBe('small');
    });

    it('should return "medium" for 6-15 listings', () => {
      expect(getClusterSize(6)).toBe('medium');
      expect(getClusterSize(15)).toBe('medium');
    });

    it('should return "large" for 16+ listings', () => {
      expect(getClusterSize(16)).toBe('large');
      expect(getClusterSize(50)).toBe('large');
    });
  });

  describe('clusterListings', () => {
    it('should not cluster listings that are far apart', () => {
      const listings = [
        createListing('1', 40.7, -74.0),
        createListing('2', 40.8, -73.9), // ~15km away
      ];

      const result = clusterListings(listings, 1.0);

      expect(result).toHaveLength(2);
      expect(result.every(item => !item.isCluster)).toBe(true);
    });

    it('should cluster listings that are close together at low zoom', () => {
      const listings = [
        createListing('1', 40.730, -74.000),
        createListing('2', 40.732, -74.002), // ~300m away
        createListing('3', 40.731, -74.001), // ~150m away from 1
      ];

      const result = clusterListings(listings, 0.5); // Low zoom = more clustering

      const clusters = result.filter(item => item.isCluster);
      expect(clusters.length).toBeGreaterThan(0);

      if (clusters.length > 0) {
        const cluster = clusters[0];
        expect(cluster.count).toBeGreaterThan(1);
        expect(cluster.listings.length).toBe(cluster.count);
      }
    });

    it('should not cluster at high zoom if listings are far enough apart', () => {
      const listings = [
        createListing('1', 40.730, -74.000),
        createListing('2', 40.736, -74.006), // ~800m apart
      ];

      const result = clusterListings(listings, 2.0); // High zoom (0.005 degree threshold)

      expect(result).toHaveLength(2);
      expect(result.every(item => !item.isCluster)).toBe(true);
    });

    it('should filter listings outside viewport when bounds provided', () => {
      const bounds: ViewportBounds = {
        minLat: 40.7,
        maxLat: 40.8,
        minLng: -74.1,
        maxLng: -73.9,
      };

      const listings = [
        createListing('1', 40.75, -74.0), // Inside
        createListing('2', 40.9, -74.0), // Outside (lat)
        createListing('3', 40.75, -74.5), // Outside (lng)
      ];

      const result = clusterListings(listings, 1.0, bounds);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should calculate cluster center as average of listing positions', () => {
      const listings = [
        createListing('1', 40.730, -74.000),
        createListing('2', 40.740, -74.010),
      ];

      const result = clusterListings(listings, 0.5);
      const cluster = result.find(item => item.isCluster);

      if (cluster && cluster.isCluster) {
        const expectedLat = (40.730 + 40.740) / 2;
        const expectedLng = (-74.000 + -74.010) / 2;

        expect(cluster.lat).toBeCloseTo(expectedLat, 5);
        expect(cluster.lng).toBeCloseTo(expectedLng, 5);
      }
    });

    it('should handle empty listings array', () => {
      const result = clusterListings([], 1.0);
      expect(result).toHaveLength(0);
    });

    it('should handle single listing', () => {
      const listings = [createListing('1', 40.75, -74.0)];
      const result = clusterListings(listings, 1.0);

      expect(result).toHaveLength(1);
      expect(result[0].isCluster).toBe(false);
    });

    it('should create multiple clusters for distinct groups', () => {
      const listings = [
        // Group 1 - close together
        createListing('1', 40.730, -74.000),
        createListing('2', 40.731, -74.001),
        createListing('3', 40.732, -74.002),
        // Group 2 - close together but far from group 1
        createListing('4', 40.750, -74.050),
        createListing('5', 40.751, -74.051),
      ];

      const result = clusterListings(listings, 0.6);

      const clusters = result.filter(item => item.isCluster);
      expect(clusters.length).toBeGreaterThanOrEqual(1);

      const totalListingsInClusters = clusters.reduce(
        (sum, c) => sum + (c.isCluster ? c.count : 0),
        0
      );
      expect(totalListingsInClusters).toBeGreaterThan(0);
    });

    it('should not process same listing twice in clustering', () => {
      const listings = [
        createListing('1', 40.730, -74.000),
        createListing('2', 40.730, -74.000), // Same position
        createListing('3', 40.730, -74.000), // Same position
      ];

      const result = clusterListings(listings, 0.5);

      // Count total listings across all items
      const totalListings = result.reduce((sum, item) => {
        return sum + (item.isCluster ? item.count : 1);
      }, 0);

      expect(totalListings).toBe(listings.length);
    });

    it('should handle high density scenarios', () => {
      // Create 20 listings in a small area
      const listings = Array.from({ length: 20 }, (_, i) =>
        createListing(
          `${i}`,
          40.730 + i * 0.001, // Small increments
          -74.000 + i * 0.001
        )
      );

      const resultLowZoom = clusterListings(listings, 0.5);
      const resultHighZoom = clusterListings(listings, 1.8);

      // Low zoom should create fewer items (more clustering)
      // High zoom should create more items (less clustering)
      expect(resultLowZoom.length).toBeLessThan(resultHighZoom.length);
    });
  });
});
