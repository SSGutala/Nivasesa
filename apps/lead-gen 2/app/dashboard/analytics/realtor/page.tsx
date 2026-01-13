'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  UserCheck,
  MapPin,
  TrendingUp,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
} from 'lucide-react'
import { getRealtorAnalyticsAction } from '@/actions/realtor-analytics'

type Period = '7d' | '30d' | '90d' | 'all'

type Analytics = {
  summary: {
    totalReferrals: number
    referralsInPeriod: number
    leadsAssigned: number
    unlockedLeads: number
    groupsAssigned: number
    groupRequestsReceived: number
    conversionRate: string
  }
  referralStatus: {
    sent: number
    viewed: number
    accepted: number
    declined: number
  }
  leadsByCity: { name: string; count: number }[]
  recentReferrals: {
    id: string
    buyerName: string
    locations: string
    status: string
    createdAt: Date
  }[]
  profile: {
    cities: string
    languages: string
    isVerified: boolean
  }
}

export default function RealtorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)

  const loadAnalytics = async () => {
    setLoading(true)
    const result = await getRealtorAnalyticsAction(period)
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
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return { bg: '#dbeafe', text: '#1e40af' }
      case 'VIEWED':
        return { bg: '#fef3c7', text: '#92400e' }
      case 'ACCEPTED':
        return { bg: '#d1fae5', text: '#065f46' }
      case 'DECLINED':
        return { bg: '#fee2e2', text: '#991b1b' }
      default:
        return { bg: '#f3f4f6', text: '#4b5563' }
    }
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
              <TrendingUp size={28} style={{ color: '#10b981' }} />
              Realtor Analytics
            </h1>
            <p style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Track your referrals and performance
              {analytics?.profile.isVerified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '13px' }}>
                  <Shield size={14} /> Verified
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: period === p ? '#10b981' : 'white',
                  color: period === p ? 'white' : '#374151',
                  border: `1px solid ${period === p ? '#10b981' : '#e5e7eb'}`,
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

      {/* Profile Info */}
      {analytics?.profile && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: '#059669' }} />
            <span style={{ fontSize: '14px' }}>
              <strong>Service Areas:</strong> {analytics.profile.cities}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: '#059669' }} />
            <span style={{ fontSize: '14px' }}>
              <strong>Languages:</strong> {analytics.profile.languages}
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <SummaryCard
          icon={<Send size={20} />}
          label="Referrals"
          value={analytics?.summary.referralsInPeriod || 0}
          subtext={`${analytics?.summary.totalReferrals || 0} total`}
          color="#3b82f6"
        />
        <SummaryCard
          icon={<UserCheck size={20} />}
          label="Conversion Rate"
          value={`${analytics?.summary.conversionRate || 0}%`}
          subtext="Accepted referrals"
          color="#10b981"
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Leads Unlocked"
          value={analytics?.summary.unlockedLeads || 0}
          subtext="Purchased leads"
          color="#f59e0b"
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Groups Assigned"
          value={analytics?.summary.groupsAssigned || 0}
          subtext={`${analytics?.summary.groupRequestsReceived || 0} requests`}
          color="#8b5cf6"
        />
      </div>

      {/* Referral Status Funnel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
            Referral Funnel
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FunnelItem
              icon={<Send size={18} />}
              label="Sent"
              count={analytics?.referralStatus.sent || 0}
              color="#3b82f6"
              total={analytics?.summary.referralsInPeriod || 1}
            />
            <FunnelItem
              icon={<Eye size={18} />}
              label="Viewed"
              count={analytics?.referralStatus.viewed || 0}
              color="#f59e0b"
              total={analytics?.summary.referralsInPeriod || 1}
            />
            <FunnelItem
              icon={<CheckCircle size={18} />}
              label="Accepted"
              count={analytics?.referralStatus.accepted || 0}
              color="#10b981"
              total={analytics?.summary.referralsInPeriod || 1}
            />
            <FunnelItem
              icon={<XCircle size={18} />}
              label="Declined"
              count={analytics?.referralStatus.declined || 0}
              color="#ef4444"
              total={analytics?.summary.referralsInPeriod || 1}
            />
          </div>
        </div>

        {/* Leads by City */}
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
            Leads by City
          </h2>
          {analytics?.leadsByCity && analytics.leadsByCity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analytics.leadsByCity.slice(0, 5).map((city, idx) => {
                const total = analytics.leadsByCity.reduce((sum, c) => sum + c.count, 0)
                const percentage = total > 0 ? (city.count / total) * 100 : 0
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                return (
                  <div key={city.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px' }}>{city.name}</span>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>{city.count}</span>
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
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
              No lead data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Referrals */}
      {analytics?.recentReferrals && analytics.recentReferrals.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Recent Referrals
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {analytics.recentReferrals.map((referral) => {
              const statusColors = getStatusColor(referral.status)
              return (
                <div
                  key={referral.id}
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
                    <span style={{ fontWeight: 500 }}>{referral.buyerName}</span>
                    <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '14px' }}>
                      {referral.locations}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                      }}
                    >
                      {referral.status}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {formatDate(referral.createdAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
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
      <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#6b7280' }}>{subtext}</div>
    </div>
  )
}

function FunnelItem({
  icon,
  label,
  count,
  color,
  total,
}: {
  icon: React.ReactNode
  label: string
  count: number
  color: string
  total: number
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color }}>
          {icon}
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>{count}</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
