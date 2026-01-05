
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateListingStub() {
    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <Link href="/host/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', textDecoration: 'none', marginBottom: '40px' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>Listing creation coming next</h1>
            <p style={{ fontSize: '18px', color: '#4b5563', lineHeight: '1.6' }}>
                The full listing creation flow is being built. This page will guide hosts through adding photos, details, amenities, and availability settings.
            </p>

            <div style={{ marginTop: '40px', padding: '30px', background: '#f3f4f6', borderRadius: '12px', border: '1px dashed #9ca3af' }}>
                <p style={{ fontWeight: 600, color: '#374151' }}>UI Placeholder</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Configured for /host/listings/new</p>
            </div>
        </div>
    );
}
