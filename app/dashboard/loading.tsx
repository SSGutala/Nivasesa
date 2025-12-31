import { Skeleton } from '@/components/ui'

export default function DashboardLoading() {
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Skeleton width={200} height={28} />
        <div style={{ height: '8px' }} />
        <Skeleton width={300} height={18} />
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <Skeleton width={100} height={14} />
            <div style={{ height: '8px' }} />
            <Skeleton width={80} height={32} />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}
      >
        <Skeleton width={150} height={24} />
        <div style={{ height: '20px' }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <Skeleton width="100%" height={16} />
          </div>
        ))}
      </div>
    </div>
  )
}
