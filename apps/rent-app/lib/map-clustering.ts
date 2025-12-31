/**
 * Map clustering utilities for performance optimization
 * Groups nearby markers based on zoom level and viewport
 */

import { Listing } from './listings-data';

export interface ClusterPoint {
  id: string;
  lat: number;
  lng: number;
  listing: Listing;
}

export interface Cluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  listings: Listing[];
  isCluster: true;
}

export interface MarkerItem {
  id: string;
  lat: number;
  lng: number;
  listing: Listing;
  isCluster: false;
}

export type MapItem = Cluster | MarkerItem;

export interface ViewportBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Calculate clustering distance based on zoom level
 * Lower zoom = larger distance threshold = more clustering
 */
export function getClusterDistance(zoom: number): number {
  // Zoom range: 0.5 to 2.0
  // At zoom 0.5: cluster distance = 0.05 degrees (~5.5km)
  // At zoom 1.0: cluster distance = 0.02 degrees (~2.2km)
  // At zoom 2.0: cluster distance = 0.005 degrees (~550m)

  if (zoom <= 0.6) return 0.05;
  if (zoom <= 0.8) return 0.03;
  if (zoom <= 1.0) return 0.02;
  if (zoom <= 1.3) return 0.015;
  if (zoom <= 1.6) return 0.01;
  return 0.005;
}

/**
 * Calculate distance between two coordinates (simple Euclidean for small areas)
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Check if a point is within viewport bounds
 */
export function isInViewport(
  lat: number,
  lng: number,
  bounds: ViewportBounds
): boolean {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  );
}

/**
 * Calculate viewport bounds with padding
 */
export function calculateViewportBounds(
  centerLat: number,
  centerLng: number,
  zoom: number,
  containerWidth: number = 800,
  containerHeight: number = 600
): ViewportBounds {
  // Base viewport size in degrees (for NYC area)
  const baseLatRange = 0.5; // ~55km
  const baseLngRange = 0.6; // ~50km

  // Adjust for zoom level
  const latRange = (baseLatRange / zoom) * 1.5; // Add 50% padding
  const lngRange = (baseLngRange / zoom) * 1.5;

  return {
    minLat: centerLat - latRange / 2,
    maxLat: centerLat + latRange / 2,
    minLng: centerLng - lngRange / 2,
    maxLng: centerLng + lngRange / 2,
  };
}

/**
 * Cluster listings based on proximity and zoom level
 */
export function clusterListings(
  listings: Listing[],
  zoom: number,
  viewportBounds?: ViewportBounds
): MapItem[] {
  const clusterDistance = getClusterDistance(zoom);
  const clusters: Cluster[] = [];
  const processed = new Set<string>();
  const items: MapItem[] = [];

  // Filter to viewport if bounds provided
  const visibleListings = viewportBounds
    ? listings.filter(l => isInViewport(l.lat, l.lng, viewportBounds))
    : listings;

  visibleListings.forEach(listing => {
    if (processed.has(listing.id)) return;

    // Find nearby unprocessed listings
    const nearby = visibleListings.filter(other => {
      if (processed.has(other.id) || other.id === listing.id) return false;
      return getDistance(listing.lat, listing.lng, other.lat, other.lng) < clusterDistance;
    });

    if (nearby.length > 0) {
      // Create cluster
      const allListings = [listing, ...nearby];
      const avgLat = allListings.reduce((sum, l) => sum + l.lat, 0) / allListings.length;
      const avgLng = allListings.reduce((sum, l) => sum + l.lng, 0) / allListings.length;

      const cluster: Cluster = {
        id: `cluster-${listing.id}`,
        lat: avgLat,
        lng: avgLng,
        count: allListings.length,
        listings: allListings,
        isCluster: true,
      };

      clusters.push(cluster);
      items.push(cluster);

      // Mark all as processed
      allListings.forEach(l => processed.add(l.id));
    } else {
      // Single marker
      const marker: MarkerItem = {
        id: listing.id,
        lat: listing.lat,
        lng: listing.lng,
        listing,
        isCluster: false,
      };
      items.push(marker);
      processed.add(listing.id);
    }
  });

  return items;
}

/**
 * Get cluster size category for styling
 */
export function getClusterSize(count: number): 'small' | 'medium' | 'large' {
  if (count <= 5) return 'small';
  if (count <= 15) return 'medium';
  return 'large';
}
