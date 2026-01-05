'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './ExploreMap.module.css';
import { Listing } from '@/lib/listings-data';
import ListingPreviewOverlay from './ListingPreviewOverlay';

// Fix for default marker icons in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapClientProps {
    listings: Listing[];
    hoveredListingId: string | null;
    selectedListingId?: string | null;
    onPinClick: (id: string | null) => void;
}

// Component to handle map view updates
function MapUpdater({ selectedId, listings }: { selectedId?: string | null, listings: Listing[] }) {
    const map = useMap();

    useEffect(() => {
        if (selectedId) {
            const listing = listings.find(l => l.id === selectedId);
            if (listing) {
                const currentZoom = map.getZoom();
                const targetZoom = Math.max(currentZoom, 14); // Keep current zoom if >= 14, otherwise 14

                map.flyTo([listing.lat, listing.lng], targetZoom, {
                    animate: true,
                    duration: 1.5 // Smooth flight
                });
            }
        }
    }, [selectedId, listings, map]);

    return null;
}

// Component to handle global map events (like background clicks)
function MapEvents({ onMapClick }: { onMapClick: () => void }) {
    useMapEvents({
        click: () => {
            onMapClick();
        },
    });
    return null;
}

export default function MapClient({ listings, hoveredListingId, selectedListingId, onPinClick }: MapClientProps) {
    // Default center (NYC-ish) if no listings
    const defaultCenter: LatLngExpression = listings.length > 0
        ? [listings[0].lat, listings[0].lng]
        : [40.7128, -74.0060];

    const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

    // Effect to open popup when selectedListingId changes
    useEffect(() => {
        if (selectedListingId && markerRefs.current[selectedListingId]) {
            const marker = markerRefs.current[selectedListingId];
            if (marker) {
                marker.openPopup();
            }
        }
    }, [selectedListingId]);

    // Create custom price markers
    const createPriceIcon = (price: number, isSelected: boolean, isHovered: boolean) => {
        return L.divIcon({
            className: 'custom-icon', // managed by react-leaflet's class, but we use html
            html: `<div class="${styles.priceMarker} ${isSelected ? styles.selectedMarker : ''} ${isHovered ? styles.hoveredMarker : ''}">
                     $${price.toLocaleString()}
                   </div>`,
            iconSize: [60, 24], // approximate size
            iconAnchor: [30, 12], // center it
        });
    };

    return (
        <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            className={styles.mapContainer}
            zoomControl={false}
        >
            {/* OpenStreetMap Tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Event Handler for Map Clicks */}
            <MapEvents onMapClick={() => onPinClick(null)} />

            {/* Sync map with selection */}
            <MapUpdater selectedId={selectedListingId} listings={listings} />

            {/* Listing Pins */}
            {listings.map(listing => {
                const isSelected = selectedListingId === listing.id;

                return (
                    <Marker
                        key={listing.id}
                        position={[listing.lat, listing.lng]}
                        icon={createPriceIcon(
                            listing.price,
                            isSelected,
                            hoveredListingId === listing.id
                        )}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e.originalEvent);
                                onPinClick(listing.id);
                            },
                        }}
                        ref={(element) => {
                            if (element) {
                                markerRefs.current[listing.id] = element;
                            } else {
                                delete markerRefs.current[listing.id];
                            }
                        }}
                    >
                        <Popup
                            closeButton={false}
                            offset={[0, -18]} // Position slightly above the marker
                            minWidth={320}
                            maxWidth={320}
                            autoPan={true}
                            autoPanPadding={[50, 50]}
                        >
                            <ListingPreviewOverlay
                                listing={listing}
                                onClose={() => onPinClick(null)}
                            />
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
