'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, DollarSign, Users, Leaf, Wine, Moon, ChefHat, Shield, ArrowRight, ArrowLeft } from 'lucide-react'
import { createRoomListing } from '@/actions/rooms'

const STEPS = ['basics', 'details', 'policies', 'freedom', 'review']

export default function PostRoomPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Basics
    title: '',
    city: '',
    state: 'TX',
    zipcode: '',
    neighborhood: '',
    // Details
    description: '',
    roomType: 'Private Room',
    propertyType: 'Apartment',
    totalBedrooms: 2,
    totalBathrooms: 1,
    rent: 800,
    deposit: 800,
    availableFrom: new Date().toISOString().split('T')[0],
    minLease: '6 months',
    // Amenities
    furnished: false,
    parking: false,
    laundryInUnit: false,
    utilitiesIncluded: false,
    utilities: '',
    amenities: '',
    // Policies
    petsPolicy: 'No Pets',
    lgbtqFriendly: true,
    preferredGender: '',
    preferredAge: '',
    languages: '',
    // Freedom Score Factors
    overnightGuests: 'No Preference',
    extendedStays: 'Not Allowed',
    oppositeGenderVisitors: 'No Preference',
    partnerVisits: 'No Preference',
    unmarriedCouplesOk: true,
    sameSexCouplesWelcome: true,
    partiesAllowed: 'Small OK',
    curfew: '',
    nightOwlFriendly: true,
    smokingPolicy: 'No Smoking',
    cannabisPolicy: 'No Cannabis',
    alcoholPolicy: 'No Preference',
    dietaryPreference: 'No Preference',
    beefPorkCookingOk: true,
    noSmellRestrictions: true,
    fullKitchenAccess: true,
    landlordOnSite: false,
    privateEntrance: false,
    nonJudgmental: true,
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    const result = await createRoomListing({
      ...formData,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit),
      totalBedrooms: Number(formData.totalBedrooms),
      totalBathrooms: Number(formData.totalBathrooms),
      availableFrom: new Date(formData.availableFrom),
      curfew: formData.curfew || undefined,
    })

    if (result.success) {
      router.push('/rooms')
    } else {
      setError(result.message || 'Failed to create listing')
    }

    setSubmitting(false)
  }

  const canProceed = () => {
    if (step === 0) {
      return formData.title && formData.city && formData.zipcode && formData.rent
    }
    if (step === 1) {
      return formData.description && formData.roomType
    }
    return true
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>Post a Room</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>List your room and find the perfect roommate</p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: i <= step ? '#3b82f6' : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e5e7eb' }}>
          {step === 0 && (
            <BasicsStep formData={formData} updateField={updateField} />
          )}
          {step === 1 && (
            <DetailsStep formData={formData} updateField={updateField} />
          )}
          {step === 2 && (
            <PoliciesStep formData={formData} updateField={updateField} />
          )}
          {step === 3 && (
            <FreedomStep formData={formData} updateField={updateField} />
          )}
          {step === 4 && (
            <ReviewStep formData={formData} />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 600,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                opacity: canProceed() ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.5 : 1,
              }}
            >
              {submitting ? 'Posting...' : 'Post Room'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BasicsStep({ formData, updateField }: { formData: any; updateField: (f: string, v: any) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Home size={24} style={{ color: '#3b82f6' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Basic Information</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Listing Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            placeholder="e.g., Sunny room in Frisco townhouse"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => updateField('city', e.target.value)}
              placeholder="Frisco"
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>State</label>
            <select
              value={formData.state}
              onChange={e => updateField('state', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option>TX</option>
              <option>CA</option>
              <option>NJ</option>
              <option>NY</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>ZIP *</label>
            <input
              type="text"
              value={formData.zipcode}
              onChange={e => updateField('zipcode', e.target.value)}
              placeholder="75034"
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Monthly Rent *</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="number"
                value={formData.rent}
                onChange={e => updateField('rent', e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Security Deposit</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="number"
                value={formData.deposit}
                onChange={e => updateField('deposit', e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Available From</label>
            <input
              type="date"
              value={formData.availableFrom}
              onChange={e => updateField('availableFrom', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Minimum Lease</label>
            <select
              value={formData.minLease}
              onChange={e => updateField('minLease', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
              <option>Flexible</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailsStep({ formData, updateField }: { formData: any; updateField: (f: string, v: any) => void }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Room Details</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description *</label>
          <textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            placeholder="Describe your room and living situation..."
            rows={4}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Room Type</label>
            <select
              value={formData.roomType}
              onChange={e => updateField('roomType', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option>Private Room</option>
              <option>Shared Room</option>
              <option>Master Bedroom</option>
              <option>Studio</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Property Type</label>
            <select
              value={formData.propertyType}
              onChange={e => updateField('propertyType', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Townhouse</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Total Bedrooms</label>
            <input
              type="number"
              min={1}
              value={formData.totalBedrooms}
              onChange={e => updateField('totalBedrooms', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Total Bathrooms</label>
            <input
              type="number"
              min={1}
              step={0.5}
              value={formData.totalBathrooms}
              onChange={e => updateField('totalBathrooms', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Amenities</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { key: 'furnished', label: 'Furnished' },
              { key: 'parking', label: 'Parking' },
              { key: 'laundryInUnit', label: 'In-Unit Laundry' },
              { key: 'utilitiesIncluded', label: 'Utilities Included' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData[key]}
                  onChange={e => updateField(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PoliciesStep({ formData, updateField }: { formData: any; updateField: (f: string, v: any) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Users size={24} style={{ color: '#3b82f6' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Household Policies</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pets Policy</label>
          <select
            value={formData.petsPolicy}
            onChange={e => updateField('petsPolicy', e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option>No Pets</option>
            <option>Cats OK</option>
            <option>Dogs OK</option>
            <option>All Pets OK</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.lgbtqFriendly}
              onChange={e => updateField('lgbtqFriendly', e.target.checked)}
            />
            <span style={{ fontWeight: 500 }}>LGBTQ+ Friendly</span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Preferred Gender</label>
            <select
              value={formData.preferredGender}
              onChange={e => updateField('preferredGender', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option value="">No Preference</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-Binary</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Preferred Age</label>
            <select
              value={formData.preferredAge}
              onChange={e => updateField('preferredAge', e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            >
              <option value="">No Preference</option>
              <option>Students (18-24)</option>
              <option>Young Professionals (25-35)</option>
              <option>Professionals (35+)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Languages Spoken</label>
          <input
            type="text"
            value={formData.languages}
            onChange={e => updateField('languages', e.target.value)}
            placeholder="e.g., Hindi, Telugu, English"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
      </div>
    </div>
  )
}

function FreedomStep({ formData, updateField }: { formData: any; updateField: (f: string, v: any) => void }) {
  const Section = ({ icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        {icon}
        <h3 style={{ fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Freedom Score Settings</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>These settings determine your listing&apos;s Freedom Score - how much independence roommates have.</p>

      <Section icon={<Users size={20} style={{ color: '#8b5cf6' }} />} title="Guests & Visitors">
        <select
          value={formData.overnightGuests}
          onChange={e => updateField('overnightGuests', e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option>No Overnight Guests</option>
          <option>Occasional Guests OK</option>
          <option>Regular Guests OK</option>
          <option>No Preference</option>
        </select>

        <select
          value={formData.partnerVisits}
          onChange={e => updateField('partnerVisits', e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option>Partner Visits Not Allowed</option>
          <option>Occasional Visits OK</option>
          <option>Regular Visits OK</option>
          <option>Overnight OK</option>
          <option>No Preference</option>
        </select>
      </Section>

      <Section icon={<Moon size={20} style={{ color: '#3b82f6' }} />} title="Social Life">
        <select
          value={formData.partiesAllowed}
          onChange={e => updateField('partiesAllowed', e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option>No Parties</option>
          <option>Small OK</option>
          <option>Medium OK</option>
          <option>Large OK</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={formData.nightOwlFriendly}
            onChange={e => updateField('nightOwlFriendly', e.target.checked)}
          />
          Night Owl Friendly
        </label>
      </Section>

      <Section icon={<Leaf size={20} style={{ color: '#16a34a' }} />} title="Substances">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <select
            value={formData.smokingPolicy}
            onChange={e => updateField('smokingPolicy', e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option>No Smoking</option>
            <option>Outside Only</option>
            <option>Smoking OK</option>
          </select>
          <select
            value={formData.cannabisPolicy}
            onChange={e => updateField('cannabisPolicy', e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          >
            <option>No Cannabis</option>
            <option>Outside Only</option>
            <option>420 Friendly</option>
          </select>
        </div>
        <select
          value={formData.alcoholPolicy}
          onChange={e => updateField('alcoholPolicy', e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option>No Alcohol</option>
          <option>Social Drinking OK</option>
          <option>No Preference</option>
        </select>
      </Section>

      <Section icon={<ChefHat size={20} style={{ color: '#f59e0b' }} />} title="Kitchen & Diet">
        <select
          value={formData.dietaryPreference}
          onChange={e => updateField('dietaryPreference', e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
        >
          <option>No Preference</option>
          <option>Vegetarian Only</option>
          <option>Halal Only</option>
        </select>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.beefPorkCookingOk}
              onChange={e => updateField('beefPorkCookingOk', e.target.checked)}
            />
            Beef/Pork cooking allowed
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.fullKitchenAccess}
              onChange={e => updateField('fullKitchenAccess', e.target.checked)}
            />
            Full kitchen access
          </label>
        </div>
      </Section>
    </div>
  )
}

function ReviewStep({ formData }: { formData: any }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Shield size={24} style={{ color: '#16a34a' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Review Your Listing</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Basic Info</h3>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{formData.title || 'Untitled'}</p>
            <p style={{ color: '#6b7280' }}>{formData.city}, {formData.state} {formData.zipcode}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a', marginTop: '12px' }}>
              ${formData.rent}/mo
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Room Details</h3>
          <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p><strong>Type:</strong> {formData.roomType} in {formData.propertyType}</p>
            <p><strong>Beds:</strong> {formData.totalBedrooms} | <strong>Baths:</strong> {formData.totalBathrooms}</p>
            <p><strong>Available:</strong> {formData.availableFrom} | <strong>Lease:</strong> {formData.minLease}</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Policies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ padding: '4px 12px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '9999px', fontSize: '13px' }}>
              {formData.petsPolicy}
            </span>
            <span style={{ padding: '4px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '9999px', fontSize: '13px' }}>
              {formData.smokingPolicy}
            </span>
            <span style={{ padding: '4px 12px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '13px' }}>
              {formData.cannabisPolicy}
            </span>
            {formData.lgbtqFriendly && (
              <span style={{ padding: '4px 12px', backgroundColor: '#fae8ff', color: '#a21caf', borderRadius: '9999px', fontSize: '13px' }}>
                LGBTQ+ Friendly
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
          <p style={{ color: '#92400e', fontSize: '14px' }}>
            <strong>Note:</strong> By posting this listing, you agree to our terms of service. Your listing will be visible to all users searching for rooms.
          </p>
        </div>
      </div>
    </div>
  )
}
