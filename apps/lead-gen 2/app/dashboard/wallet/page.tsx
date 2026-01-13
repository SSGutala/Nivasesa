'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Wallet, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react'
import { createWalletTopupAction, processWalletTopupAction, getWalletDataAction } from '@/actions/payment'
import { TOPUP_AMOUNTS } from '@/lib/stripe'

type Transaction = {
  id: string
  amount: number
  type: string
  description?: string | null
  leadId?: string | null
  createdAt: Date
}

export default function WalletPage() {
  const searchParams = useSearchParams()
  const [creditBalance, setCreditBalance] = useState(0)
  const [freeUnlocksRemaining, setFreeUnlocksRemaining] = useState(10)
  const [totalUnlocks, setTotalUnlocks] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadWalletData()

    // Handle Stripe redirect
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')

    if (success === 'true' && sessionId) {
      processTopup(sessionId)
    } else if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Payment was canceled' })
    }
  }, [searchParams])

  const loadWalletData = async () => {
    const result = await getWalletDataAction()
    if (result.success) {
      setCreditBalance(result.creditBalance || 0)
      setFreeUnlocksRemaining(result.freeUnlocksRemaining || 0)
      setTotalUnlocks(result.totalUnlocks || 0)
      setTransactions(result.transactions || [])
    }
    setLoading(false)
  }

  const processTopup = async (sessionId: string) => {
    setProcessing(true)
    const result = await processWalletTopupAction(sessionId)
    if (result.success) {
      setMessage({ type: 'success', text: 'Wallet topped up successfully!' })
      loadWalletData()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to process payment' })
    }
    setProcessing(false)

    // Clear URL params
    window.history.replaceState({}, '', '/dashboard/wallet')
  }

  const handleTopup = async (amount: number) => {
    setProcessing(true)
    setMessage(null)

    const result = await createWalletTopupAction(amount)

    if (result.success && result.url) {
      window.location.href = result.url
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create checkout' })
      setProcessing(false)
    }
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

  const getTransactionIcon = (type: string, amount: number) => {
    if (type === 'deposit' || amount > 0) {
      return <ArrowDownLeft size={20} style={{ color: '#10b981' }} />
    }
    return <ArrowUpRight size={20} style={{ color: '#ef4444' }} />
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

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>Loading wallet...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Wallet size={28} />
        Wallet
      </h1>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Balance Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: 'white',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Free Unlocks Remaining</div>
            <div style={{ fontSize: '42px', fontWeight: 700 }}>
              {freeUnlocksRemaining}/10
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Credit Balance</div>
            <div style={{ fontSize: '42px', fontWeight: 700 }}>
              ${creditBalance.toFixed(2)}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>
            Total Unlocks: {totalUnlocks}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {freeUnlocksRemaining > 0
              ? `Use your ${freeUnlocksRemaining} free unlocks, then $30 per lead`
              : 'Lead unlocks cost $30 each after free tier'
            }
          </div>
        </div>
      </div>

      {/* Top-up Options */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} />
          Add Funds
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {TOPUP_AMOUNTS.map(({ amount, label }) => (
            <button
              key={amount}
              onClick={() => handleTopup(amount)}
              disabled={processing}
              style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                background: 'white',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (!processing) {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.background = '#eff6ff'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.background = 'white'
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <CreditCard size={14} /> Card payment
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>
            Recent Transactions
          </h2>
          <a
            href="/dashboard/transactions"
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
            }}
          >
            View all →
          </a>
        </div>

        {transactions.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
            }}
          >
            No transactions yet. Add funds to get started!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: tx.amount > 0 ? '#d1fae5' : '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getTransactionIcon(tx.type, tx.amount)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{getTransactionLabel(tx.type, tx.description)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formatDate(tx.createdAt)}
                      {tx.leadId && <span> • Lead {tx.leadId.substring(0, 8)}</span>}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: tx.amount > 0 ? '#10b981' : '#ef4444',
                  }}
                >
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
