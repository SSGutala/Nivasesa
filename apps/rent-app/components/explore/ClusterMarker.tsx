'use client';

import React from 'react';
import styles from './ClusterMarker.module.css';
import { Cluster, getClusterSize } from '@/lib/map-clustering';

interface ClusterMarkerProps {
  cluster: Cluster;
  onClick: (cluster: Cluster) => void;
  position: { top: string; left: string };
}

export const ClusterMarker = React.memo(function ClusterMarker({
  cluster,
  onClick,
  position,
}: ClusterMarkerProps) {
  const size = getClusterSize(cluster.count);

  return (
    <button
      className={`${styles.cluster} ${styles[size]}`}
      style={position}
      onClick={() => onClick(cluster)}
      aria-label={`Cluster of ${cluster.count} listings`}
    >
      <span className={styles.count}>{cluster.count}</span>
    </button>
  );
});
