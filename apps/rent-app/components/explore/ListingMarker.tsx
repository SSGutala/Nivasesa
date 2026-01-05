'use client';

import React from 'react';
import styles from './ExploreMap.module.css';
import { Listing } from '@/lib/listings-data';

interface ListingMarkerProps {
  listing: Listing;
  onClick: (id: string) => void;
  position: { top: string; left: string };
  isHovered: boolean;
  isSelected: boolean;
}

export const ListingMarker = React.memo(
  function ListingMarker({
    listing,
    onClick,
    position,
    isHovered,
    isSelected,
  }: ListingMarkerProps) {
    return (
      <button
        className={`${styles.pin} ${isHovered ? styles.hovered : ''} ${isSelected ? styles.selected : ''}`}
        style={position}
        onClick={() => onClick(listing.id)}
        aria-label={`${listing.title} - $${listing.price}`}
      >
        <span className={styles.pinPrice}>${listing.price.toLocaleString()}</span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for performance
    return (
      prevProps.listing.id === nextProps.listing.id &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.position.top === nextProps.position.top &&
      prevProps.position.left === nextProps.position.left
    );
  }
);
