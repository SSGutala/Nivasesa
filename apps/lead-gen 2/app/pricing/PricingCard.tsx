'use client'

import { createSubscriptionAction } from '@/actions/subscriptions'
import { useState } from 'react'

type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise'

interface TierConfig {
  name: string
  price: number
  monthlyCredits: number
  features: readonly string[]
}

interface PricingCardProps {
  tier: SubscriptionTier
  config: TierConfig
  currentTier: string | null
  isLoggedIn: boolean
  featured?: boolean
}

export function PricingCard({
  tier,
  config,
  currentTier,
  isLoggedIn,
  featured = false,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCurrentPlan = currentTier === tier
  const isFree = tier === 'free'

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      window.location.href = '/auth/signup'
      return
    }

    if (isFree || isCurrentPlan) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await createSubscriptionAction(tier)

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        setError(result.error || 'Failed to create subscription')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan'
    if (isFree) return 'Get Started Free'
    if (!isLoggedIn) return 'Sign Up'
    return 'Subscribe'
  }

  const getButtonStyles = () => {
    if (isCurrentPlan) {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed'
    }
    if (featured) {
      return 'bg-blue-600 text-white hover:bg-blue-700'
    }
    return 'bg-gray-900 text-white hover:bg-gray-800'
  }

  return (
    <div
      className={`relative rounded-lg p-6 ${
        featured
          ? 'bg-blue-600 text-white shadow-xl scale-105 border-2 border-blue-500'
          : 'bg-white text-gray-900 shadow-md border border-gray-200'
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
          Most Popular
        </div>
      )}

      {/* Plan Name */}
      <h3 className={`text-2xl font-bold mb-2 ${featured ? 'text-white' : 'text-gray-900'}`}>
        {config.name}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className={`text-4xl font-bold ${featured ? 'text-white' : 'text-gray-900'}`}>
            ${(config.price / 100).toFixed(0)}
          </span>
          {!isFree && (
            <span className={`ml-2 ${featured ? 'text-blue-100' : 'text-gray-600'}`}>
              /month
            </span>
          )}
        </div>
        {config.monthlyCredits > 0 && (
          <p className={`text-sm mt-2 ${featured ? 'text-blue-100' : 'text-gray-600'}`}>
            ${config.monthlyCredits} in lead credits/month
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {config.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                featured ? 'text-blue-200' : 'text-green-500'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className={`text-sm ${featured ? 'text-blue-50' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition ${getButtonStyles()} ${
          loading ? 'opacity-50 cursor-wait' : ''
        }`}
      >
        {loading ? 'Processing...' : getButtonText()}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
