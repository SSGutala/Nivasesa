'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import styles from './ExploreMap.module.css';
import { Listing } from '@/lib/listings-data';
import { Plus, Minus } from 'lucide-react';
import {
  clusterListings,
  calculateViewportBounds,
  type Cluster,
  type MapItem,
} from '@/lib/map-clustering';
import { ClusterMarker } from './ClusterMarker';
import { ListingMarker } from './ListingMarker';

interface ExploreMapProps {
  listings: Listing[];
  hoveredListingId: string | null;
  selectedListingId?: string | null;
  onPinClick: (id: string) => void;
}

export default function ExploreMap({
  listings,
  hoveredListingId,
  selectedListingId,
  onPinClick,
}: ExploreMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ lat: 40.75, lng: -74.0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Track container size for viewport calculations
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Effect to pan and zoom when a listing is selected
  useEffect(() => {
    if (selectedListingId) {
      const selected = listings.find(l => l.id === selectedListingId);
      if (selected) {
        setCenter({ lat: selected.lat, lng: selected.lng });
        setZoom(prev => Math.max(prev, 1.2));
      }
    }
  }, [selectedListingId, listings]);

  // Calculate viewport bounds with memoization
  const viewportBounds = useMemo(
    () =>
      calculateViewportBounds(
        center.lat,
        center.lng,
        zoom,
        containerSize.width,
        containerSize.height
      ),
    [center.lat, center.lng, zoom, containerSize.width, containerSize.height]
  );

  // Cluster listings with virtualization
  const mapItems = useMemo(() => {
    return clusterListings(listings, zoom, viewportBounds);
  }, [listings, zoom, viewportBounds]);

  // Simple coordinate to percentage conversion for NYC area
  const coordToPercent = useCallback((lat: number, lng: number) => {
    // NYC bounds approximately: lat 40.5-41.0, lng -74.3 to -73.7
    const latPercent = ((lat - 40.5) / 0.5) * 100;
    const lngPercent = ((lng + 74.3) / 0.6) * 100;
    return { top: `${100 - latPercent}%`, left: `${lngPercent}%` };
  }, []);

  // Debounced zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  // Handle cluster click - zoom in to cluster center
  const handleClusterClick = useCallback((cluster: Cluster) => {
    setCenter({ lat: cluster.lat, lng: cluster.lng });
    setZoom(prev => Math.min(prev + 0.4, 2));
  }, []);

  // Render map items (clusters or individual markers)
  const renderMapItems = useMemo(() => {
    return mapItems.map(item => {
      const position = coordToPercent(item.lat, item.lng);

      if (item.isCluster) {
        return (
          <ClusterMarker
            key={item.id}
            cluster={item}
            onClick={handleClusterClick}
            position={position}
          />
        );
      } else {
        return (
          <ListingMarker
            key={item.id}
            listing={item.listing}
            onClick={onPinClick}
            position={position}
            isHovered={hoveredListingId === item.listing.id}
            isSelected={selectedListingId === item.listing.id}
          />
        );
      }
    });
  }, [mapItems, coordToPercent, handleClusterClick, onPinClick, hoveredListingId, selectedListingId]);

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      <div
        className={styles.mapBackground}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {/* Simulated map with streets */}
        <div className={styles.mapOverlay}>
          <div className={styles.waterArea} />
          <div className={styles.landArea} />
        </div>
      </div>

      <div
        className={styles.markersContainer}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {renderMapItems}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={handleZoomIn} title="Zoom in">
          <Plus size={20} />
        </button>
        <button className={styles.controlBtn} onClick={handleZoomOut} title="Zoom out">
          <Minus size={20} />
        </button>
      </div>

      {/* Debug info (remove in production) */}
      <div className={styles.debugInfo}>
        <div>Zoom: {zoom.toFixed(1)}x</div>
        <div>Items: {mapItems.length} ({listings.length} total)</div>
        <div>
          Clusters: {mapItems.filter(i => i.isCluster).length} | Markers:{' '}
          {mapItems.filter(i => !i.isCluster).length}
        </div>
      </div>
    </div>
  );
}
