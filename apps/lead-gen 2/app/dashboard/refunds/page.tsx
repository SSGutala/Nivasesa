'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react'
import {
  getRefundRequestsAction,
  cancelRefundRequestAction,
  requestRefundAction,
  getTransactionsAction,
} from '@/actions/payment'

type RefundRequest = {
  id: string
  transactionId: string
  amount: number
  reason: string
  status: string
  adminNote: string | null
  createdAt: Date
  processedAt: Date | null
  transaction: {
    id: string
    amount: number
    type: string
    createdAt: Date
  }
}

type Transaction = {
  id: string
  amount: number
  type: string
  status: string
  createdAt: Date
}

export default function RefundsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>([])
  const [eligibleTransactions, setEligibleTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadData = async () => {
    setLoading(true)
    const [refundResult, txResult] = await Promise.all([
      getRefundRequestsAction(),
      getTransactionsAction(1, 50, { type: 'lead_purchase' }),
    ])

    if (refundResult.success) {
      setRequests((refundResult.requests as RefundRequest[]) || [])
    }

    if (txResult.success) {
      // Filter to eligible transactions (within 7 days, not refunded, no pending request)
      const refundedIds = new Set(
        (refundResult.requests as RefundRequest[])
          ?.filter(r => r.status === 'pending' || r.status === 'approved')
          .map(r => r.transactionId) || []
      )
      const now = Date.now()
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      const eligible = (txResult.transactions as Transaction[] || []).filter(tx =>
        tx.type === 'lead_purchase' &&
        tx.status === 'completed' &&
        now - new Date(tx.createdAt).getTime() <= sevenDays &&
        !refundedIds.has(tx.id)
      )
      setEligibleTransactions(eligible)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmitRequest = async () => {
    if (!selectedTransaction || !reason.trim()) {
      setMessage({ type: 'error', text: 'Please select a transaction and provide a reason' })
      return
    }

    setSubmitting(true)
    const result = await requestRefundAction(selectedTransaction, reason)

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Refund request submitted' })
      setShowRequestForm(false)
      setSelectedTransaction('')
      setReason('')
      loadData()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to submit request' })
    }
    setSubmitting(false)
  }

  const handleCancel = async (requestId: string) => {
    const result = await cancelRefundRequestAction(requestId)
    if (result.success) {
      setMessage({ type: 'success', text: 'Request cancelled' })
      loadData()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to cancel' })
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} style={{ color: '#f59e0b' }} />
      case 'approved':
        return <CheckCircle size={18} style={{ color: '#10b981' }} />
      case 'rejected':
        return <XCircle size={18} style={{ color: '#ef4444' }} />
      case 'cancelled':
        return <AlertCircle size={18} style={{ color: '#6b7280' }} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' }
      case 'approved':
        return { bg: '#d1fae5', text: '#065f46' }
      case 'rejected':
        return { bg: '#fee2e2', text: '#991b1b' }
      case 'cancelled':
        return { bg: '#f3f4f6', text: '#4b5563' }
      default:
        return { bg: '#f3f4f6', text: '#4b5563' }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/transactions"
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
          <ArrowLeft size={16} /> Back to Transactions
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
              Refund Requests
            </h1>
            <p style={{ color: '#6b7280' }}>
              Request refunds for lead purchases within 7 days
            </p>
          </div>
          {eligibleTransactions.length > 0 && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <RefreshCw size={16} />
              Request Refund
            </button>
          )}
        </div>
      </div>

      {/* Message */}
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
          {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Request Form */}
      {showRequestForm && (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            New Refund Request
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}
            >
              Select Transaction
            </label>
            <select
              value={selectedTransaction}
              onChange={(e) => setSelectedTransaction(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option value="">Select a transaction...</option>
              {eligibleTransactions.map((tx) => (
                <option key={tx.id} value={tx.id}>
                  Lead Purchase - ${Math.abs(tx.amount).toFixed(2)} - {formatDate(tx.createdAt)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}
            >
              Reason for Refund
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you're requesting a refund..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowRequestForm(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRequest}
              disabled={submitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      )}

      {/* Refund Requests List */}
      {requests.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
          }}
        >
          <DollarSign size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
            No refund requests yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            You can request refunds for lead purchases made within the last 7 days
          </p>
          {eligibleTransactions.length > 0 && (
            <button
              onClick={() => setShowRequestForm(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Request Refund
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requests.map((request) => {
            const statusColors = getStatusColor(request.status)
            return (
              <div
                key={request.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      {getStatusIcon(request.status)}
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      Requested on {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>
                      ${request.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Original: ${Math.abs(request.transaction.amount).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#4b5563' }}>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                </div>

                {request.adminNote && (
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: statusColors.bg,
                      borderRadius: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <p style={{ fontSize: '14px', color: statusColors.text }}>
                      <strong>Admin Note:</strong> {request.adminNote}
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleCancel(request.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Cancel Request
                    </button>
                  </div>
                )}

                {request.processedAt && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                    Processed on {formatDate(request.processedAt)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#0369a1' }}>
          Refund Policy
        </h3>
        <ul
          style={{
            fontSize: '13px',
            color: '#0c4a6e',
            paddingLeft: '20px',
            margin: 0,
            lineHeight: '1.6',
          }}
        >
          <li>Refund requests must be submitted within 7 days of purchase</li>
          <li>Only lead unlock purchases are eligible for refunds</li>
          <li>Refunds are credited to your wallet balance</li>
          <li>Processing typically takes 1-3 business days</li>
          <li>Approved refunds cannot be reversed</li>
        </ul>
      </div>
    </div>
  )
}
