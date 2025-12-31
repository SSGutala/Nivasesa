import { z } from 'zod';

/**
 * Transaction type enumeration
 */
export enum TransactionType {
  TOP_UP = 'TOP_UP',
  DEDUCTION = 'DEDUCTION',
  REFUND = 'REFUND',
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Refund status enumeration
 */
export enum RefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

/**
 * Payment metadata type
 */
export interface PaymentMetadata {
  userId: string;
  type: TransactionType;
  reason?: string;
  [key: string]: string | undefined;
}

/**
 * Wallet balance type
 */
export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
}

/**
 * Transaction record type
 */
export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  stripeSessionId?: string | null;
  createdAt: Date;
}

/**
 * Refund request type
 */
export interface RefundRequest {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Zod validation schemas
 */
export const PaymentIntentSchema = z.object({
  amount: z.number().positive().min(0.5, 'Minimum amount is $0.50'),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const TopUpSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  paymentIntentId: z.string().min(1),
});

export const DeductionSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().min(1),
});

export const RefundRequestSchema = z.object({
  transactionId: z.string().min(1),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

/**
 * Stripe webhook event types
 */
export type StripeWebhookEvent =
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.refunded'
  | 'charge.dispute.created';

/**
 * Payment intent result type
 */
export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

/**
 * Top-up result type
 */
export interface TopUpResult {
  transaction: Transaction;
  newBalance: number;
}

/**
 * Deduction result type
 */
export interface DeductionResult {
  transaction: Transaction;
  newBalance: number;
}

/**
 * Transaction history filters
 */
export interface TransactionHistoryFilters {
  userId: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
