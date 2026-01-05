'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ListingTypeToggleProps {
    activeType: 'lease' | 'sublease';
    onChange: (type: 'lease' | 'sublease') => void;
}

export default function ListingTypeToggle({ activeType, onChange }: ListingTypeToggleProps) {
    return (
        <div style={{
            display: 'inline-flex',
            backgroundColor: '#f3f4f6', // gray-100
            borderRadius: '9999px',
            padding: '4px',
            position: 'relative',
            marginBottom: '24px' // Add some spacing below
        }}>
            {/* Background Pill Animation */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: activeType === 'lease' ? 4 : '50%',
                    width: 'calc(50% - 4px)',
                    backgroundColor: 'white',
                    borderRadius: '9999px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            />

            <button
                onClick={() => onChange('lease')}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'transparent',
                    color: activeType === 'lease' ? '#000' : '#6b7280',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1,
                    fontSize: '15px',
                    transition: 'color 0.2s'
                }}
            >
                Lease
            </button>

            <button
                onClick={() => onChange('sublease')}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'transparent',
                    color: activeType === 'sublease' ? '#000' : '#6b7280',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1,
                    fontSize: '15px',
                    transition: 'color 0.2s'
                }}
            >
                Sublease
            </button>
        </div>
    );
}
