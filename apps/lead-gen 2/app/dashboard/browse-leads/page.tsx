'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Phone, Mail, Lock, Unlock, DollarSign, Filter, Search, CheckCircle } from 'lucide-react'
import { getAvailableLeadsAction, getUnlockedLeadsAction } from '@/actions/leads'
import { unlockLeadWithBalanceAction, createLeadPurchaseCheckoutAction, processLeadPurchaseAction, getWalletDataAction } from '@/actions/payment'

type Lead = {
  id: string
  buyerName: string
  buyerEmail?: string | null
  buyerPhone?: string | null
  buyerContact?: string | null
  message?: string | null
  city: string
  zipcode: string
  buyerType?: string | null
  interest?: string | null
  languagePreference?: string | null
  timeline?: string | null
  price: number
  status: string
  createdAt: Date
}

export default function BrowseLeadsPage() {
  const searchParams = useSearchParams()
  const [leads, setLeads] = useState<Lead[]>([])
  const [unlockedLeads, setUnlockedLeads] = useState<Lead[]>([])
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [unlocking, setUnlocking] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'available' | 'unlocked'>('available')
  const [filters, setFilters] = useState({ city: '', language: '' })

  useEffect(() => {
    loadData()

    // Handle Stripe redirect
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')
    const leadId = searchParams.get('lead_id')

    if (success === 'true' && sessionId && leadId) {
      processLeadPurchase(sessionId, leadId)
    } else if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Payment was canceled' })
    }
  }, [searchParams])

  const loadData = async () => {
    setLoading(true)
    const [availableResult, unlockedResult, walletResult] = await Promise.all([
      getAvailableLeadsAction(),
      getUnlockedLeadsAction(),
      getWalletDataAction(),
    ])

    if (availableResult.success) {
      setLeads(availableResult.leads || [])
    }
    if (unlockedResult.success) {
      setUnlockedLeads(unlockedResult.leads || [])
      setUnlockedIds(new Set(unlockedResult.leads?.map((l: Lead) => l.id) || []))
    }
    if (walletResult.success) {
      setBalance(walletResult.balance || 0)
    }
    setLoading(false)
  }

  const processLeadPurchase = async (sessionId: string, leadId: string) => {
    const result = await processLeadPurchaseAction(sessionId, leadId)
    if (result.success) {
      setMessage({ type: 'success', text: 'Lead unlocked successfully!' })
      loadData()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to process payment' })
    }
    window.history.replaceState({}, '', '/dashboard/browse-leads')
  }

  const handleUnlock = async (lead: Lead) => {
    setUnlocking(lead.id)
    setMessage(null)

    if (balance >= lead.price) {
      // Use wallet balance
      const result = await unlockLeadWithBalanceAction(lead.id)
      if (result.success) {
        setMessage({ type: 'success', text: 'Lead unlocked!' })
        loadData()
      } else if (result.needsTopup) {
        // Redirect to Stripe checkout
        const checkoutResult = await createLeadPurchaseCheckoutAction(lead.id)
        if (checkoutResult.success && checkoutResult.url) {
          window.location.href = checkoutResult.url
          return
        } else {
          setMessage({ type: 'error', text: checkoutResult.error || 'Failed to create checkout' })
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to unlock lead' })
      }
    } else {
      // Redirect to Stripe checkout
      const checkoutResult = await createLeadPurchaseCheckoutAction(lead.id)
      if (checkoutResult.success && checkoutResult.url) {
        window.location.href = checkoutResult.url
        return
      } else {
        setMessage({ type: 'error', text: checkoutResult.error || 'Failed to create checkout' })
      }
    }

    setUnlocking(null)
  }

  const filteredLeads = leads.filter(lead => {
    if (filters.city && !lead.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }
    if (filters.language && lead.languagePreference && !lead.languagePreference.toLowerCase().includes(filters.language.toLowerCase())) {
      return false
    }
    return true
  })

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Loading leads...
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Browse Leads</h1>
          <p style={{ color: '#6b7280' }}>Find and unlock leads in your service area</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
          <DollarSign size={20} style={{ color: '#16a34a' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Wallet Balance</div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#16a34a' }}>${balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

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
          <CheckCircle size={20} />
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('available')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'available' ? 'white' : 'transparent',
            fontWeight: activeTab === 'available' ? 600 : 400,
            color: activeTab === 'available' ? '#111827' : '#6b7280',
            cursor: 'pointer',
            boxShadow: activeTab === 'available' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          Available ({filteredLeads.length})
        </button>
        <button
          onClick={() => setActiveTab('unlocked')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'unlocked' ? 'white' : 'transparent',
            fontWeight: activeTab === 'unlocked' ? 600 : 400,
            color: activeTab === 'unlocked' ? '#111827' : '#6b7280',
            cursor: 'pointer',
            boxShadow: activeTab === 'unlocked' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          My Unlocked ({unlockedLeads.length})
        </button>
      </div>

      {activeTab === 'available' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Filter by city..."
                value={filters.city}
                onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Filter by language..."
                value={filters.language}
                onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Available Leads Grid */}
          {filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <Lock size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>No leads available</h3>
              <p style={{ color: '#6b7280' }}>Check back later for new leads in your area</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{lead.buyerName}</h3>
                      {lead.buyerType && (
                        <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '4px' }}>
                          {lead.buyerType}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} />
                        {lead.city}, {lead.zipcode}
                      </span>
                      {lead.languagePreference && (
                        <span>{lead.languagePreference}</span>
                      )}
                      {lead.timeline && (
                        <span>Timeline: {lead.timeline}</span>
                      )}
                      {lead.interest && (
                        <span>{lead.interest}</span>
                      )}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                      Posted {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '24px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                      ${lead.price}
                    </div>
                    <button
                      onClick={() => handleUnlock(lead)}
                      disabled={unlocking === lead.id || unlockedIds.has(lead.id)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: unlockedIds.has(lead.id) ? '#d1d5db' : '#3b82f6',
                        color: 'white',
                        fontWeight: 600,
                        cursor: unlocking === lead.id || unlockedIds.has(lead.id) ? 'not-allowed' : 'pointer',
                        opacity: unlocking === lead.id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {unlockedIds.has(lead.id) ? (
                        <>
                          <CheckCircle size={18} />
                          Unlocked
                        </>
                      ) : unlocking === lead.id ? (
                        'Unlocking...'
                      ) : (
                        <>
                          <Unlock size={18} />
                          Unlock Lead
                        </>
                      )}
                    </button>
                    {!unlockedIds.has(lead.id) && balance >= lead.price && (
                      <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px' }}>
                        Using wallet balance
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'unlocked' && (
        <>
          {unlockedLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
              <Unlock size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>No unlocked leads yet</h3>
              <p style={{ color: '#6b7280' }}>Browse available leads and unlock them to see contact details</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {unlockedLeads.map(lead => (
                <div
                  key={lead.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{lead.buyerName}</h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={16} />
                          {lead.city}, {lead.zipcode}
                        </span>
                        {lead.buyerType && <span>{lead.buyerType}</span>}
                      </div>
                    </div>
                    <span style={{ padding: '6px 12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      UNLOCKED
                    </span>
                  </div>

                  {/* Contact Details */}
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#065f46' }}>Contact Information</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                      {lead.buyerEmail && (
                        <a
                          href={`mailto:${lead.buyerEmail}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', textDecoration: 'none' }}
                        >
                          <Mail size={18} />
                          {lead.buyerEmail}
                        </a>
                      )}
                      {lead.buyerPhone && (
                        <a
                          href={`tel:${lead.buyerPhone}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', textDecoration: 'none' }}
                        >
                          <Phone size={18} />
                          {lead.buyerPhone}
                        </a>
                      )}
                      {lead.buyerContact && !lead.buyerEmail && !lead.buyerPhone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {lead.buyerContact}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {lead.languagePreference && (
                      <span><strong>Language:</strong> {lead.languagePreference}</span>
                    )}
                    {lead.timeline && (
                      <span><strong>Timeline:</strong> {lead.timeline}</span>
                    )}
                    {lead.interest && (
                      <span><strong>Interest:</strong> {lead.interest}</span>
                    )}
                  </div>

                  {lead.message && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', color: '#4b5563' }}>
                      <strong>Message:</strong> {lead.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
