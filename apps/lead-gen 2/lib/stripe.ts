import Stripe from 'stripe'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Subscription Tiers Configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    monthlyCredits: 0,
    features: [
      '10 free lead unlocks to start',
      'Pay-per-lead pricing at $30/lead',
      'Basic lead filtering',
      'Email support',
    ],
  },
  starter: {
    name: 'Starter',
    price: 2900, // $29 in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    monthlyCredits: 100, // $100 worth of credits
    features: [
      '$100 monthly lead credits',
      'Unused credits roll over',
      'Priority lead placement',
      'Advanced filtering',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 7900, // $79 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    monthlyCredits: 300, // $300 worth of credits
    features: [
      '$300 monthly lead credits',
      'Unused credits roll over',
      'Priority lead placement',
      'Advanced filtering',
      'Lead analytics dashboard',
      'Priority email & chat support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 19900, // $199 in cents
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    monthlyCredits: 1000, // $1000 worth of credits
    features: [
      '$1,000 monthly lead credits',
      'Unlimited rollover credits',
      'First access to new leads',
      'Advanced filtering & analytics',
      'Dedicated account manager',
      'Custom integrations',
      'Priority phone support',
    ],
  },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

// Top-up amounts for pay-per-lead
export const TOPUP_AMOUNTS = [
  { amount: 100, label: '$100', credits: 100 },
  { amount: 250, label: '$250', credits: 250 },
  { amount: 500, label: '$500', credits: 500 },
  { amount: 1000, label: '$1,000', credits: 1000 },
]

export const LEAD_PRICES = {
  basic: 30,
  premium: 50,
}
