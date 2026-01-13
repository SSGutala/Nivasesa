'use client';

import { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarDate {
    date: Date;
    available: boolean;
    priceOverride?: number;
    minStay?: number;
    note?: string;
}

interface CalendarProps {
    // Mode: 'single' for single date selection, 'range' for date range
    mode?: 'single' | 'range';
    // Selected date(s)
    selectedDate?: Date | null;
    selectedStartDate?: Date | null;
    selectedEndDate?: Date | null;
    // Callback when date(s) are selected
    onDateSelect?: (date: Date) => void;
    onRangeSelect?: (startDate: Date, endDate: Date) => void;
    // Availability data
    availability?: CalendarDate[];
    // Default price for the listing (to show overrides)
    defaultPrice?: number;
    // Disabled dates (before today, etc.)
    minDate?: Date;
    maxDate?: Date;
    // Show price on dates
    showPrices?: boolean;
    // Show legend
    showLegend?: boolean;
    // Click handler for individual dates (for host calendar)
    onDayClick?: (date: Date, isBlocked: boolean) => void;
    // Loading state
    loading?: boolean;
    // Class name
    className?: string;
}

export function Calendar({
    mode = 'single',
    selectedDate,
    selectedStartDate,
    selectedEndDate,
    onDateSelect,
    onRangeSelect,
    availability = [],
    defaultPrice,
    minDate,
    maxDate,
    showPrices = false,
    showLegend = true,
    onDayClick,
    loading = false,
    className,
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [rangeStart, setRangeStart] = useState<Date | null>(selectedStartDate || null);

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get the first day of the month
    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    );
    const lastDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    );

    // Get the starting day of the week for the first day
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Total days in month
    const daysInMonth = lastDayOfMonth.getDate();

    // Generate calendar grid
    const calendarDays: (Date | null)[] = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        );
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSameDay = (date1: Date, date2: Date | null | undefined): boolean => {
        if (!date2) return false;
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const isInRange = (date: Date): boolean => {
        if (mode !== 'range' || !rangeStart) return false;
        const hoveredDate = date;
        return rangeStart < hoveredDate;
    };

    const isDateDisabled = (date: Date): boolean => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const getAvailabilityForDate = (date: Date): CalendarDate | undefined => {
        return availability.find((a) => isSameDay(new Date(a.date), date));
    };

    const handleDayClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        const dateAvailability = getAvailabilityForDate(date);

        // If custom click handler provided (for host calendar)
        if (onDayClick) {
            onDayClick(date, !dateAvailability?.available);
            return;
        }

        // Guest calendar logic
        if (mode === 'single') {
            onDateSelect?.(date);
        } else if (mode === 'range') {
            if (!rangeStart) {
                setRangeStart(date);
            } else {
                if (date < rangeStart) {
                    // If clicked date is before range start, make it the new start
                    setRangeStart(date);
                } else {
                    // Complete the range
                    onRangeSelect?.(rangeStart, date);
                    setRangeStart(null);
                }
            }
        }
    };

    const getDayClassNames = (date: Date): string => {
        const classes = [styles.day];
        const dateAvailability = getAvailabilityForDate(date);

        if (isToday(date)) classes.push(styles.today);
        if (isDateDisabled(date)) classes.push(styles.disabled);

        // Check if blocked
        if (dateAvailability && !dateAvailability.available) {
            classes.push(styles.blocked);
        }

        // Selection states
        if (mode === 'single') {
            if (isSameDay(date, selectedDate)) classes.push(styles.selected);
        } else if (mode === 'range') {
            if (isSameDay(date, selectedStartDate)) {
                classes.push(styles.rangeStart);
                classes.push(styles.selected);
            }
            if (isSameDay(date, selectedEndDate)) {
                classes.push(styles.rangeEnd);
                classes.push(styles.selected);
            }
            if (selectedStartDate && selectedEndDate) {
                if (date > selectedStartDate && date < selectedEndDate) {
                    classes.push(styles.inRange);
                }
            }
            // Show preview of range while selecting
            if (rangeStart && !selectedEndDate && isInRange(date)) {
                classes.push(styles.inRange);
            }
        }

        return classes.join(' ');
    };

    const formatPrice = (price: number): string => {
        return `$${price}`;
    };

    return (
        <div className={`${styles.calendar} ${loading ? styles.loading : ''} ${className || ''}`}>
            <div className={styles.header}>
                <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className={styles.navButton}
                    aria-label="Previous month"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <div className={styles.monthYear}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <button
                    type="button"
                    onClick={goToNextMonth}
                    className={styles.navButton}
                    aria-label="Next month"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <div className={styles.weekdays}>
                {weekdays.map((day) => (
                    <div key={day} className={styles.weekday}>
                        {day}
                    </div>
                ))}
            </div>

            <div className={`${styles.days} ${mode === 'range' ? styles.rangeMode : ''}`}>
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className={`${styles.day} ${styles.empty}`} />;
                    }

                    const dateAvailability = getAvailabilityForDate(date);
                    const price = dateAvailability?.priceOverride || defaultPrice;

                    return (
                        <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => handleDayClick(date)}
                            className={getDayClassNames(date)}
                            disabled={isDateDisabled(date) || (dateAvailability && !dateAvailability.available)}
                        >
                            <span className={styles.dayNumber}>{date.getDate()}</span>
                            {showPrices && price && dateAvailability?.priceOverride && (
                                <span className={styles.priceOverride}>{formatPrice(price)}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {showLegend && (
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendBox} ${styles.available}`} />
                        <span>Available</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendBox} ${styles.selected}`} />
                        <span>Selected</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={`${styles.legendBox} ${styles.blocked}`} />
                        <span>Blocked</span>
                    </div>
                    {mode === 'range' && (
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendBox} ${styles.inRange}`} />
                            <span>In Range</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
