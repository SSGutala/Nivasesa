import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SUBSCRIPTION_TIERS } from '@/lib/stripe'
import { PricingCard } from './PricingCard'
import { redirect } from 'next/navigation'

export default async function PricingPage() {
  const session = await auth()

  // Get current subscription if logged in
  let currentTier: string | null = null
  if (session?.user?.id) {
    const realtorProfile = await prisma.realtorProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })
    currentTier = realtorProfile?.subscription?.tier || 'free'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include unused credit rollover.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <PricingCard
            tier="free"
            config={SUBSCRIPTION_TIERS.free}
            currentTier={currentTier}
            isLoggedIn={!!session}
          />
          <PricingCard
            tier="starter"
            config={SUBSCRIPTION_TIERS.starter}
            currentTier={currentTier}
            isLoggedIn={!!session}
            featured={false}
          />
          <PricingCard
            tier="pro"
            config={SUBSCRIPTION_TIERS.pro}
            currentTier={currentTier}
            isLoggedIn={!!session}
            featured={true}
          />
          <PricingCard
            tier="enterprise"
            config={SUBSCRIPTION_TIERS.enterprise}
            currentTier={currentTier}
            isLoggedIn={!!session}
            featured={false}
          />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="How does credit rollover work?"
              answer="Any unused credits from your monthly subscription will roll over to the next month. For example, if you have the Pro plan ($300/month) and only use $200 worth of leads, you'll have $400 available next month."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! All subscriptions can be cancelled at any time. You'll continue to have access until the end of your billing period."
            />
            <FAQItem
              question="What happens to my credits if I cancel?"
              answer="Any credits you've accumulated will remain available even after cancellation. You can use them to unlock leads at the standard pay-per-lead rate."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan?"
              answer="Absolutely! You can upgrade or downgrade at any time. When upgrading, you'll be prorated for the remainder of your billing period. When downgrading, the change takes effect at the end of your current billing period."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment processing."
            />
            <FAQItem
              question="Is there a refund policy?"
              answer="We offer a 7-day money-back guarantee on all subscription plans. If you're not satisfied, contact us within 7 days of your purchase for a full refund."
            />
          </div>
        </div>

        {/* CTA Section */}
        {!session && (
          <div className="max-w-2xl mx-auto mt-16 text-center bg-blue-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-lg mb-6">
              Join hundreds of realtors already using Nivasesa to connect with qualified South Asian buyers.
            </p>
            <a
              href="/auth/signup"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Create Free Account
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <summary className="font-semibold text-gray-900 cursor-pointer">
        {question}
      </summary>
      <p className="mt-3 text-gray-600">{answer}</p>
    </details>
  )
}
