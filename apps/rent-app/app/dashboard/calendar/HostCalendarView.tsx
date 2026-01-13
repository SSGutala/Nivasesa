'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/Calendar';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import {
    getAvailabilityAction,
    blockDatesAction,
    unblockDatesAction,
    setPriceOverrideAction,
} from '@/actions/availability';
import { getMyListings } from '@/actions/rooms';
import styles from './HostCalendarView.module.css';

interface RoomListing {
    id: string;
    title: string;
    rent: number;
}

interface AvailabilityData {
    date: Date;
    available: boolean;
    priceOverride?: number;
    minStay?: number;
    note?: string;
}

export function HostCalendarView() {
    const [listings, setListings] = useState<RoomListing[]>([]);
    const [selectedListing, setSelectedListing] = useState<string>('');
    const [availability, setAvailability] = useState<AvailabilityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [blockNote, setBlockNote] = useState('');
    const [priceOverride, setPriceOverride] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
        null
    );

    // Load user's listings
    useEffect(() => {
        async function loadListings() {
            try {
                const result = await getMyListings();
                if (result && Array.isArray(result)) {
                    setListings(result);
                    if (result.length > 0) {
                        setSelectedListing(result[0].id);
                    }
                }
            } catch (error) {
                console.error('Error loading listings:', error);
            } finally {
                setLoading(false);
            }
        }
        loadListings();
    }, []);

    // Load availability when listing changes
    useEffect(() => {
        if (!selectedListing) return;

        async function loadAvailability() {
            const startDate = new Date();
            startDate.setDate(1); // First day of current month

            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3); // 3 months ahead
            endDate.setDate(0); // Last day of that month

            try {
                const result = await getAvailabilityAction(selectedListing, startDate, endDate);
                if (result.success && result.availability) {
                    setAvailability(
                        result.availability.map((a) => ({
                            ...a,
                            date: new Date(a.date),
                        }))
                    );
                }
            } catch (error) {
                console.error('Error loading availability:', error);
            }
        }

        loadAvailability();
    }, [selectedListing]);

    const handleDayClick = (date: Date, isBlocked: boolean) => {
        setSelectedDate(date);
        if (isBlocked) {
            // If blocked, offer to unblock
            handleUnblock(date);
        } else {
            // If available, show options to block or set price
            setBlockModalOpen(true);
        }
    };

    const handleBlock = async () => {
        if (!selectedDate || !selectedListing) return;

        setLoading(true);
        const result = await blockDatesAction(
            selectedListing,
            selectedDate,
            selectedDate,
            blockNote || undefined
        );

        if (result.success) {
            setMessage({ type: 'success', text: 'Date blocked successfully' });
            // Reload availability
            const startDate = new Date();
            startDate.setDate(1);
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);
            const availResult = await getAvailabilityAction(selectedListing, startDate, endDate);
            if (availResult.success && availResult.availability) {
                setAvailability(
                    availResult.availability.map((a) => ({
                        ...a,
                        date: new Date(a.date),
                    }))
                );
            }
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to block date' });
        }

        setBlockModalOpen(false);
        setBlockNote('');
        setLoading(false);
    };

    const handleUnblock = async (date: Date) => {
        if (!selectedListing) return;

        setLoading(true);
        const result = await unblockDatesAction(selectedListing, date, date);

        if (result.success) {
            setMessage({ type: 'success', text: 'Date unblocked successfully' });
            // Reload availability
            const startDate = new Date();
            startDate.setDate(1);
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);
            const availResult = await getAvailabilityAction(selectedListing, startDate, endDate);
            if (availResult.success && availResult.availability) {
                setAvailability(
                    availResult.availability.map((a) => ({
                        ...a,
                        date: new Date(a.date),
                    }))
                );
            }
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to unblock date' });
        }

        setLoading(false);
    };

    const handleSetPrice = async () => {
        if (!selectedDate || !selectedListing || !priceOverride) return;

        const price = parseInt(priceOverride, 10);
        if (isNaN(price) || price <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid price' });
            return;
        }

        setLoading(true);
        const result = await setPriceOverrideAction(selectedListing, selectedDate, price);

        if (result.success) {
            setMessage({ type: 'success', text: 'Price override set successfully' });
            // Reload availability
            const startDate = new Date();
            startDate.setDate(1);
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 3);
            const availResult = await getAvailabilityAction(selectedListing, startDate, endDate);
            if (availResult.success && availResult.availability) {
                setAvailability(
                    availResult.availability.map((a) => ({
                        ...a,
                        date: new Date(a.date),
                    }))
                );
            }
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to set price' });
        }

        setPriceModalOpen(false);
        setPriceOverride('');
        setLoading(false);
    };

    const currentListing = listings.find((l) => l.id === selectedListing);

    if (loading && listings.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading your listings...</div>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <h2>No Listings Yet</h2>
                    <p>Create a listing to start managing your calendar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Availability</h1>
                <p>Block dates, set pricing, and manage your listing calendar</p>
            </div>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                    <button
                        type="button"
                        onClick={() => setMessage(null)}
                        className={styles.closeMessage}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className={styles.controls}>
                <Select
                    value={selectedListing}
                    onChange={(e) => setSelectedListing(e.target.value)}
                    label="Select Listing"
                >
                    {listings.map((listing) => (
                        <option key={listing.id} value={listing.id}>
                            {listing.title}
                        </option>
                    ))}
                </Select>
            </div>

            <div className={styles.calendarSection}>
                <div className={styles.calendarHeader}>
                    <h2>Calendar</h2>
                    {currentListing && (
                        <div className={styles.defaultPrice}>
                            Default Price: ${currentListing.rent}/month
                        </div>
                    )}
                </div>

                <Calendar
                    mode="single"
                    availability={availability}
                    defaultPrice={currentListing?.rent}
                    showPrices={true}
                    onDayClick={handleDayClick}
                    minDate={new Date()}
                    loading={loading}
                />

                <div className={styles.instructions}>
                    <h3>How to use:</h3>
                    <ul>
                        <li>Click on an available date to block it</li>
                        <li>Click on a blocked date to unblock it</li>
                        <li>Use the price override option to set custom pricing for specific dates</li>
                    </ul>
                </div>
            </div>

            {/* Block Date Modal */}
            {blockModalOpen && (
                <div className={styles.modal} onClick={() => setBlockModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Block Date</h3>
                        <p>
                            Block {selectedDate?.toLocaleDateString()} from bookings?
                        </p>

                        <Input
                            label="Note (optional)"
                            placeholder="e.g., Personal use, maintenance"
                            value={blockNote}
                            onChange={(e) => setBlockNote(e.target.value)}
                        />

                        <div className={styles.modalActions}>
                            <Button variant="outline" onClick={() => setBlockModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleBlock}>
                                Block Date
                            </Button>
                            <Button onClick={() => {
                                setBlockModalOpen(false);
                                setPriceModalOpen(true);
                            }}>
                                Set Price Override
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Override Modal */}
            {priceModalOpen && (
                <div className={styles.modal} onClick={() => setPriceModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Set Price Override</h3>
                        <p>
                            Set custom price for {selectedDate?.toLocaleDateString()}
                        </p>

                        <Input
                            type="number"
                            label="Price per night"
                            placeholder={currentListing?.rent.toString()}
                            value={priceOverride}
                            onChange={(e) => setPriceOverride(e.target.value)}
                        />

                        <div className={styles.modalActions}>
                            <Button variant="outline" onClick={() => setPriceModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSetPrice}>
                                Set Price
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
