'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';

// =============================================================================
// BOOKING PRICING CONSTANTS
// =============================================================================

const SERVICE_FEE_PERCENTAGE = 0.12; // 12% service fee

// =============================================================================
// BOOKING CREATION & INQUIRY
// =============================================================================

interface CreateBookingRequestData {
    listingId: string;
    checkIn: Date;
    checkOut: Date;
    message?: string;
}

export async function createBookingRequestAction(data: CreateBookingRequestData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        // Validate dates
        const now = new Date();
        if (data.checkIn < now) {
            return { success: false, message: 'Check-in date must be in the future' };
        }
        if (data.checkOut <= data.checkIn) {
            return { success: false, message: 'Check-out must be after check-in' };
        }

        // Get listing
        const listing = await prisma.roomListing.findUnique({
            where: { id: data.listingId },
        });

        if (!listing) {
            return { success: false, message: 'Listing not found' };
        }

        if (listing.status !== 'active') {
            return { success: false, message: 'This listing is not available' };
        }

        if (listing.ownerId === session.user.id) {
            return { success: false, message: 'You cannot book your own listing' };
        }

        // Check for overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                listingId: data.listingId,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'ACTIVE'],
                },
                OR: [
                    {
                        checkIn: { lte: data.checkIn },
                        checkOut: { gt: data.checkIn },
                    },
                    {
                        checkIn: { lt: data.checkOut },
                        checkOut: { gte: data.checkOut },
                    },
                    {
                        checkIn: { gte: data.checkIn },
                        checkOut: { lte: data.checkOut },
                    },
                ],
            },
        });

        if (overlappingBooking) {
            return { success: false, message: 'These dates are already booked' };
        }

        // Calculate pricing
        const days = Math.ceil(
            (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        const nightlyRate = listing.rent / 30; // Convert monthly rent to daily rate
        const subtotal = nightlyRate * days;
        const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
        const totalPrice = subtotal + serviceFee;

        // Get user email from session
        const userEmail = session.user.email;
        if (!userEmail) {
            return { success: false, message: 'User email not found' };
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                bookingType: 'room_rental',
                listingId: data.listingId,
                guestId: session.user.id,
                hostId: listing.ownerId,
                checkIn: data.checkIn.toISOString(),
                checkOut: data.checkOut.toISOString(),
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Create booking in INQUIRY status initially
        // After payment confirmation, it will move to PENDING
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiry

        const booking = await prisma.booking.create({
            data: {
                listingId: data.listingId,
                guestId: session.user.id,
                hostId: listing.ownerId,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                status: 'INQUIRY',
                totalPrice,
                serviceFee,
                depositAmount: listing.deposit || undefined,
                paymentIntentId: paymentIntent.id,
                guestMessage: data.message,
                expiresAt,
            },
        });

        revalidatePath('/dashboard/bookings');
        return {
            success: true,
            booking,
            clientSecret: paymentIntent.client_secret,
        };
    } catch (error) {
        console.error('Error creating booking request:', error);
        return { success: false, message: 'Failed to create booking request' };
    }
}

// =============================================================================
// PAYMENT CONFIRMATION
// =============================================================================

export async function confirmPaymentAction(bookingId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }

        if (booking.guestId !== session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        if (booking.status !== 'INQUIRY') {
            return { success: false, message: 'Booking already processed' };
        }

        // Verify payment intent
        if (booking.paymentIntentId) {
            const paymentIntent = await stripe.paymentIntents.retrieve(
                booking.paymentIntentId
            );

            if (paymentIntent.status !== 'succeeded') {
                return { success: false, message: 'Payment not completed' };
            }
        }

        // Update booking to PENDING (awaiting host confirmation)
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'PENDING' },
        });

        revalidatePath('/dashboard/bookings');
        revalidatePath('/dashboard/reservations');
        return { success: true, booking: updatedBooking };
    } catch (error) {
        console.error('Error confirming payment:', error);
        return { success: false, message: 'Failed to confirm payment' };
    }
}

// =============================================================================
// HOST ACTIONS
// =============================================================================

export async function confirmBookingAction(bookingId: string, response?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }

        if (booking.hostId !== session.user.id) {
            return { success: false, message: 'Only the host can confirm bookings' };
        }

        if (booking.status !== 'PENDING') {
            return { success: false, message: 'Booking cannot be confirmed' };
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CONFIRMED',
                hostResponse: response,
            },
        });

        revalidatePath('/dashboard/bookings');
        revalidatePath('/dashboard/reservations');
        return { success: true, booking: updatedBooking };
    } catch (error) {
        console.error('Error confirming booking:', error);
        return { success: false, message: 'Failed to confirm booking' };
    }
}

export async function declineBookingAction(bookingId: string, reason?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }

        if (booking.hostId !== session.user.id) {
            return { success: false, message: 'Only the host can decline bookings' };
        }

        if (booking.status !== 'PENDING') {
            return { success: false, message: 'Booking cannot be declined' };
        }

        // Issue refund if payment was made
        if (booking.paymentIntentId) {
            await stripe.refunds.create({
                payment_intent: booking.paymentIntentId,
                reason: 'requested_by_customer',
            });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'DECLINED',
                declineReason: reason,
            },
        });

        revalidatePath('/dashboard/bookings');
        revalidatePath('/dashboard/reservations');
        return { success: true, booking: updatedBooking };
    } catch (error) {
        console.error('Error declining booking:', error);
        return { success: false, message: 'Failed to decline booking' };
    }
}

// =============================================================================
// CANCELLATION
// =============================================================================

export async function cancelBookingAction(bookingId: string, reason?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }

        // Both guest and host can cancel
        if (booking.guestId !== session.user.id && booking.hostId !== session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
            return { success: false, message: 'This booking cannot be cancelled' };
        }

        // Determine refund amount based on cancellation policy
        let refundAmount = booking.totalPrice;
        const daysUntilCheckIn = Math.ceil(
            (booking.checkIn.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        // Simple cancellation policy:
        // - 7+ days: 100% refund
        // - 3-6 days: 50% refund
        // - <3 days: No refund
        if (daysUntilCheckIn < 3) {
            refundAmount = 0;
        } else if (daysUntilCheckIn < 7) {
            refundAmount = booking.totalPrice * 0.5;
        }

        // Issue refund if applicable
        if (booking.paymentIntentId && refundAmount > 0) {
            await stripe.refunds.create({
                payment_intent: booking.paymentIntentId,
                amount: Math.round(refundAmount * 100),
                reason: 'requested_by_customer',
            });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                cancellationReason: reason,
            },
        });

        revalidatePath('/dashboard/bookings');
        revalidatePath('/dashboard/reservations');
        return { success: true, booking: updatedBooking, refundAmount };
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return { success: false, message: 'Failed to cancel booking' };
    }
}

// =============================================================================
// BOOKING COMPLETION
// =============================================================================

export async function completeBookingAction(bookingId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'You must be logged in' };
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { success: false, message: 'Booking not found' };
        }

        // Only host can mark as complete
        if (booking.hostId !== session.user.id) {
            return { success: false, message: 'Only the host can complete bookings' };
        }

        if (booking.status !== 'ACTIVE') {
            return { success: false, message: 'Only active bookings can be completed' };
        }

        // Check if checkout date has passed
        const now = new Date();
        if (booking.checkOut > now) {
            return {
                success: false,
                message: 'Cannot complete booking before checkout date',
            };
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'COMPLETED' },
        });

        revalidatePath('/dashboard/bookings');
        revalidatePath('/dashboard/reservations');
        return { success: true, booking: updatedBooking };
    } catch (error) {
        console.error('Error completing booking:', error);
        return { success: false, message: 'Failed to complete booking' };
    }
}

// =============================================================================
// BOOKING QUERIES
// =============================================================================

export async function getBookingAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    state: true,
                    roomType: true,
                    address: true,
                },
            },
        },
    });

    // Only guest or host can view
    if (
        booking &&
        booking.guestId !== session.user.id &&
        booking.hostId !== session.user.id
    ) {
        return null;
    }

    return booking;
}

export async function getGuestBookingsAction() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return prisma.booking.findMany({
        where: { guestId: session.user.id },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    state: true,
                    roomType: true,
                    address: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getHostBookingsAction() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return prisma.booking.findMany({
        where: { hostId: session.user.id },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    state: true,
                    roomType: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

// =============================================================================
// AUTOMATIC STATE TRANSITIONS (to be called by cron or background job)
// =============================================================================

export async function processBookingStateTransitionsAction() {
    // This should be called by a cron job
    const now = new Date();

    try {
        // 1. Expire PENDING bookings after 48h
        await prisma.booking.updateMany({
            where: {
                status: 'PENDING',
                expiresAt: { lte: now },
            },
            data: { status: 'EXPIRED' },
        });

        // 2. Move CONFIRMED to ACTIVE after check-in
        await prisma.booking.updateMany({
            where: {
                status: 'CONFIRMED',
                checkIn: { lte: now },
            },
            data: { status: 'ACTIVE' },
        });

        // 3. Move ACTIVE to COMPLETED after checkout
        await prisma.booking.updateMany({
            where: {
                status: 'ACTIVE',
                checkOut: { lte: now },
            },
            data: { status: 'COMPLETED' },
        });

        return { success: true };
    } catch (error) {
        console.error('Error processing booking state transitions:', error);
        return { success: false, message: 'Failed to process state transitions' };
    }
}
