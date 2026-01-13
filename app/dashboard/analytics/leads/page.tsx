'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { getLeadAnalyticsAction } from '@/actions/leads'

type Period = '7d' | '30d' | '90d' | 'all'

type Analytics = {
  summary: {
    totalUnlockedAllTime: number
    unlockedInPeriod: number
    availableLeads: number
    totalSpent: number
    avgCostPerLead: number
  }
  distributions: {
    byCity: { name: string; count: number }[]
    byBuyerType: { name: string; count: number }[]
    byLanguage: { name: string; count: number }[]
    byTimeline: { name: string; count: number }[]
  }
  trend: { date: string; count: number }[]
  recentLeads: {
    id: string
    city: string
    buyerType: string
    unlockedAt: Date
  }[]
}

export default function LeadAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)

  const loadAnalytics = async () => {
    setLoading(true)
    const result = await getLeadAnalyticsAction(period)
    if (result.success && result.analytics) {
      setAnalytics(result.analytics as Analytics)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          Loading analytics...
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BarChart3 size={28} style={{ color: '#3b82f6' }} />
              Lead Analytics
            </h1>
            <p style={{ color: '#6b7280' }}>
              Track your lead acquisition performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: period === p ? '#3b82f6' : 'white',
                  color: period === p ? 'white' : '#374151',
                  border: `1px solid ${period === p ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <SummaryCard
          icon={<Users size={24} />}
          label="Leads Unlocked"
          value={analytics?.summary.unlockedInPeriod || 0}
          subtext={`${analytics?.summary.totalUnlockedAllTime || 0} total all time`}
          color="#3b82f6"
        />
        <SummaryCard
          icon={<TrendingUp size={24} />}
          label="Available Leads"
          value={analytics?.summary.availableLeads || 0}
          subtext="Ready to unlock"
          color="#10b981"
        />
        <SummaryCard
          icon={<DollarSign size={24} />}
          label="Total Spent"
          value={`$${(analytics?.summary.totalSpent || 0).toFixed(0)}`}
          subtext={`$${(analytics?.summary.avgCostPerLead || 0).toFixed(2)} avg per lead`}
          color="#f59e0b"
        />
      </div>

      {/* Trend Chart */}
      {analytics?.trend && analytics.trend.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
            Leads Over Time
          </h2>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            {analytics.trend.map((day, idx) => {
              const maxCount = Math.max(...analytics.trend.map(d => d.count), 1)
              const height = (day.count / maxCount) * 100
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  title={`${day.date}: ${day.count} leads`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${height}%`,
                      minHeight: '4px',
                      backgroundColor: day.count > 0 ? '#3b82f6' : '#e5e7eb',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            <span>{analytics.trend[0]?.date}</span>
            <span>{analytics.trend[analytics.trend.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* Distributions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* By City */}
        <DistributionCard
          title="By City"
          icon={<MapPin size={18} />}
          data={analytics?.distributions.byCity || []}
        />

        {/* By Buyer Type */}
        <DistributionCard
          title="By Buyer Type"
          icon={<Users size={18} />}
          data={analytics?.distributions.byBuyerType || []}
        />

        {/* By Language */}
        <DistributionCard
          title="By Language"
          icon={<PieChart size={18} />}
          data={analytics?.distributions.byLanguage || []}
        />

        {/* By Timeline */}
        <DistributionCard
          title="By Timeline"
          icon={<Calendar size={18} />}
          data={analytics?.distributions.byTimeline || []}
        />
      </div>

      {/* Recent Leads */}
      {analytics?.recentLeads && analytics.recentLeads.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Recent Unlocks
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {analytics.recentLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>{lead.city}</span>
                  <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '14px' }}>
                    {lead.buyerType}
                  </span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(lead.unlockedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analytics?.summary.unlockedInPeriod && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
          }}
        >
          <BarChart3 size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            No leads unlocked in this period
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Try selecting a different time range or unlock some leads to see analytics
          </p>
          <Link
            href="/dashboard/browse-leads"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Browse Leads
          </Link>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext: string
  color: string
}) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color }}>
        {icon}
        <span style={{ fontSize: '13px', color: '#6b7280' }}>{label}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#6b7280' }}>{subtext}</div>
    </div>
  )
}

function DistributionCard({
  title,
  icon,
  data,
}: {
  title: string
  icon: React.ReactNode
  data: { name: string; count: number }[]
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  if (data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon} {title}
        </h3>
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '14px' }}>
          No data available
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon} {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.slice(0, 5).map((item, idx) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0
          return (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px' }}>{item.name}</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {item.count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: colors[idx % colors.length],
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
