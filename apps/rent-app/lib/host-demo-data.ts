
import { Home, MessageSquare, Calendar, CreditCard, Settings, User } from 'lucide-react';

export const HOST_KPI_STATS = [
    { label: 'Active Listings', value: '2', change: '+1', trend: 'up' },
    { label: 'New Inquiries', value: '4', change: '+2', trend: 'up' }, // Last 7 days
    { label: 'Scheduled Tours', value: '1', change: 'Upcoming', trend: 'neutral' },
    { label: 'Pending Actions', value: '1', change: 'Urgent', trend: 'down' }
];

export const HOST_LISTINGS = [
    {
        id: '1',
        title: 'Modern 1BHK in Arlington',
        location: 'Arlington, VA',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop', // Real-ish image
        type: 'Lease',
        status: 'Available',
        verificationStatus: 'Verified',
        views: 124,
        inquiries: 12,
        price: 1850
    },
    {
        id: '2',
        title: 'Sunny Private Room near Metro',
        location: 'Washington, DC',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2340&auto=format&fit=crop',
        type: 'Sublease',
        status: 'In Discussion',
        verificationStatus: 'Verified',
        views: 89,
        inquiries: 5,
        price: 1100
    },
    {
        id: '3',
        title: 'Cozy Studio in Bethesda',
        location: 'Bethesda, MD',
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2340&auto=format&fit=crop',
        type: 'Lease',
        status: 'Draft',
        verificationStatus: 'Pending',
        views: 0,
        inquiries: 0,
        price: 1600
    }
];

export const HOST_MESSAGES = [
    {
        id: 'm1',
        renterName: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', // Placeholder
        listingTitle: 'Modern 1BHK in Arlington',
        snippet: 'Hi, is this apartment still available for a September 1st move-in? I have a cat.',
        time: '2h ago',
        status: 'New',
        needsAction: true
    },
    {
        id: 'm2',
        renterName: 'Amit Patel',
        avatar: '', // No avatar
        listingTitle: 'Sunny Private Room near Metro',
        snippet: 'Thanks for the info. Could we schedule a virtual tour this weekend?',
        time: '1d ago',
        status: 'Virtual Meet Required',
        needsAction: true
    },
    {
        id: 'm3',
        renterName: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
        listingTitle: 'Modern 1BHK in Arlington',
        snippet: 'That works perfect for me. See you then!',
        time: '3d ago',
        status: 'Scheduled',
        needsAction: false
    }
];

export const HOST_TRANSACTIONS = [
    {
        id: 't1',
        listing: 'Modern 1BHK in Arlington',
        renter: 'Priya Sharma (Security Deposit)',
        amount: 1850,
        date: 'Oct 24, 2024',
        status: 'In Escrow'
    },
    {
        id: 't2',
        listing: 'Sunny Private Room near Metro',
        renter: 'Previous Tenant (Refund)',
        amount: -500,
        date: 'Oct 15, 2024',
        status: 'Refunded'
    }
];

export const HOST_TOURS = [
    {
        id: 'tour1',
        listingTitle: 'Modern 1BHK in Arlington',
        renterName: 'David Kim',
        date: 'Oct 28, 2024',
        time: '4:00 PM',
        type: 'In-Person',
        status: 'Confirmed'
    },
    {
        id: 'tour2',
        listingTitle: 'Sunny Private Room',
        renterName: 'Amit Patel',
        date: 'Oct 30, 2024',
        time: '6:30 PM',
        type: 'Virtual',
        status: 'Pending'
    },
    {
        id: 'tour3',
        listingTitle: 'Modern 1BHK in Arlington',
        renterName: 'Sarah Jenkins',
        date: 'Nov 1, 2024',
        time: '11:00 AM',
        type: 'In-Person',
        status: 'Scheduled'
    }
];

export const HOST_PROFILE = {
    name: 'Sai Gutala',
    email: 'sai@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'September 2024',
    verificationLevel: 'Level 2 (ID Verified)',
    responseRate: '100%',
    responseTime: 'Within an hour'
};

export const HOST_NAV_ITEMS = [
    { label: 'Dashboard', href: '/host/dashboard', icon: Home },
    { label: 'My Listings', href: '/host/listings', icon: MessageSquare }, // Using MessageSquare temporarily if layout icon needed? No, use distinct ones.
    { label: 'Messages', href: '/host/messages', icon: MessageSquare },
    { label: 'Tours', href: '/host/tours', icon: Calendar },
    { label: 'Transactions', href: '/host/transactions', icon: CreditCard },
    { label: 'Profile', href: '/host/profile', icon: User },
    { label: 'Settings', href: '/host/settings', icon: Settings },
];
