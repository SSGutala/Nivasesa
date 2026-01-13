'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getTransactionsAction, exportTransactionsAction } from '@/actions/payment'

type Transaction = {
  id: string
  amount: number
  type: string
  description?: string | null
  leadId?: string | null
  createdAt: Date
}

type Stats = {
  totalDeposits: number
  totalSpent: number
  totalRefunds: number
  transactionCount: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [typeFilter, setTypeFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const loadTransactions = async () => {
    setLoading(true)
    const result = await getTransactionsAction(page, 15, {
      type: typeFilter,
    })

    if (result.success) {
      setTransactions(result.transactions || [])
      setTotalPages(result.pages || 1)
      setTotal(result.total || 0)
      // stats not implemented in action
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [page, typeFilter, startDate, endDate])

  const handleExport = async () => {
    setExporting(true)
    const result = await exportTransactionsAction({
      type: typeFilter,
    })

    if (result.success && result.csv) {
      // Download CSV
      const blob = new Blob([result.csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    setExporting(false)
  }

  const clearFilters = () => {
    setTypeFilter('all')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionLabel = (type: string, description?: string | null) => {
    if (description) return description
    switch (type) {
      case 'purchase':
        return 'Credit Purchase'
      case 'unlock':
        return 'Lead Unlock'
      case 'refund':
        return 'Refund'
      default:
        return type
    }
  }

  const hasActiveFilters = typeFilter !== 'all' || startDate || endDate

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/wallet"
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
          <ArrowLeft size={16} /> Back to Wallet
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
          Transaction History
        </h1>
        <p style={{ color: '#6b7280' }}>
          View and export your complete transaction history
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Total Deposits"
            value={`$${stats.totalDeposits.toFixed(2)}`}
            color="#10b981"
          />
          <StatCard
            icon={<TrendingDown size={20} />}
            label="Total Spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
            color="#ef4444"
          />
          <StatCard
            icon={<RefreshCw size={20} />}
            label="Total Refunds"
            value={`$${stats.totalRefunds.toFixed(2)}`}
            color="#3b82f6"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            label="Transactions"
            value={stats.transactionCount.toString()}
            color="#8b5cf6"
          />
        </div>
      )}

      {/* Filters & Export */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: hasActiveFilters ? '#eff6ff' : 'white',
            border: `1px solid ${hasActiveFilters ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: hasActiveFilters ? '#3b82f6' : '#374151',
          }}
        >
          <Filter size={16} />
          Filters {hasActiveFilters && `(${[typeFilter !== 'all', startDate, endDate].filter(Boolean).length})`}
        </button>

        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: 'white',
            opacity: exporting ? 0.7 : 1,
          }}
        >
          <Download size={16} />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label
                style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
              >
                Transaction Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="all">All Types</option>
                <option value="purchase">Credit Purchases</option>
                <option value="unlock">Lead Unlocks</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
              >
                <Calendar size={12} style={{ marginRight: '4px' }} />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}
              >
                <Calendar size={12} style={{ marginRight: '4px' }} />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPage(1)
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Info */}
      <div
        style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '12px',
        }}
      >
        Showing {transactions.length} of {total} transactions
      </div>

      {/* Transactions List */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280',
          }}
        >
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            color: '#6b7280',
          }}
        >
          <DollarSign size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
            No transactions found
          </p>
          <p style={{ fontSize: '14px' }}>
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Your transaction history will appear here'}
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: idx < transactions.length - 1 ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: tx.amount > 0 ? '#d1fae5' : '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tx.amount > 0 ? (
                    <ArrowDownLeft size={20} style={{ color: '#10b981' }} />
                  ) : (
                    <ArrowUpRight size={20} style={{ color: '#ef4444' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                    {getTransactionLabel(tx.type, tx.description)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {formatDate(tx.createdAt)}
                    {tx.leadId && (
                      <span style={{ marginLeft: '8px', padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                        Lead {tx.leadId.substring(0, 8)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: tx.amount > 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <span style={{ fontSize: '14px', color: '#374151', padding: '0 12px' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          color,
        }}
      >
        {icon}
        <span style={{ fontSize: '13px', color: '#6b7280' }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>{value}</div>
    </div>
  )
}
