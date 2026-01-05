/**
 * @niv/payment - Payment service package for Nivasesa
 *
 * Provides Stripe integration and wallet management functionality
 */

// Re-export all types
export * from './types';

// Stripe operations
export {
  getStripe,
  createPaymentIntent,
  getPaymentIntent,
  createRefund,
  verifyWebhookSignature,
  listPaymentMethods,
  createOrGetCustomer,
} from './stripe';

// Wallet operations
export {
  getWalletBalance,
  processTopUp,
  deductFromWallet,
  creditWallet,
  hasSufficientBalance,
  transferBetweenWallets,
} from './wallet';

// Transaction operations
export {
  createTransaction,
  getTransaction,
  getTransactionHistory,
  getTransactionCount,
  updateTransactionStatus,
  getTotalByType,
  getTransactionsByStripeSession,
  getRecentTransactionsAdmin,
  getTransactionStats,
} from './transactions';

// Refund operations
export {
  requestRefund,
  getRefundRequest,
  getUserRefundRequests,
  getPendingRefundRequests,
  approveRefund,
  rejectRefund,
  getRefundStats,
  cancelRefundRequest,
} from './refunds';
