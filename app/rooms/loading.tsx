import { Skeleton } from '@/components/ui'

export default function RoomsLoading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            width: '200px',
            height: '32px',
            background: '#e5e7eb',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        />
        <div
          style={{
            width: '350px',
            height: '20px',
            background: '#e5e7eb',
            borderRadius: '8px',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: '100px',
              height: '36px',
              background: '#e5e7eb',
              borderRadius: '18px',
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    </div>
  )
}
