import Stripe from 'stripe';
import { PaymentIntentSchema, type PaymentIntentResult, type PaymentMetadata } from './types';

/**
 * Initialize Stripe client with secret key from environment
 */
const getStripeClient = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
};

let stripeInstance: Stripe | null = null;

/**
 * Get singleton Stripe instance
 */
export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    stripeInstance = getStripeClient();
  }
  return stripeInstance;
};

/**
 * Create a payment intent for wallet top-up
 *
 * @param amount - Amount in USD (will be converted to cents)
 * @param metadata - Optional metadata to attach to the payment intent
 * @returns Payment intent result with client secret
 */
export async function createPaymentIntent(
  amount: number,
  metadata?: PaymentMetadata
): Promise<PaymentIntentResult> {
  // Validate input
  const validated = PaymentIntentSchema.parse({ amount, metadata });

  const stripe = getStripe();

  // Convert amount to cents (Stripe expects smallest currency unit)
  const amountInCents = Math.round(validated.amount * 100);

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: (metadata || {}) as Record<string, string>,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    amount: validated.amount,
    currency: 'usd',
  };
}

/**
 * Retrieve a payment intent by ID
 *
 * @param paymentIntentId - Stripe payment intent ID
 * @returns Payment intent object
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Create a refund for a charge
 *
 * @param paymentIntentId - Stripe payment intent ID
 * @param amount - Optional amount to refund (if partial refund)
 * @param reason - Refund reason
 * @returns Refund object
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason
): Promise<Stripe.Refund> {
  const stripe = getStripe();

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
    reason: reason || 'requested_by_customer',
  };

  if (amount) {
    refundParams.amount = Math.round(amount * 100); // Convert to cents
  }

  return await stripe.refunds.create(refundParams);
}

/**
 * Verify Stripe webhook signature
 *
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 * @param webhookSecret - Webhook signing secret
 * @returns Verified Stripe event
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe();

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all payment methods for a customer
 *
 * @param customerId - Stripe customer ID
 * @returns List of payment methods
 */
export async function listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  const stripe = getStripe();

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

/**
 * Create or retrieve a Stripe customer
 *
 * @param email - Customer email
 * @param metadata - Optional metadata
 * @returns Stripe customer object
 */
export async function createOrGetCustomer(
  email: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  const stripe = getStripe();

  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    metadata: metadata || {},
  });
}
