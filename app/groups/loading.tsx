import { Skeleton } from '@/components/ui'

export default function GroupsLoading() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <div
            style={{
              width: '180px',
              height: '32px',
              background: '#e5e7eb',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          />
          <div
            style={{
              width: '300px',
              height: '20px',
              background: '#e5e7eb',
              borderRadius: '8px',
            }}
          />
        </div>
        <div
          style={{
            width: '140px',
            height: '44px',
            background: '#e5e7eb',
            borderRadius: '8px',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    </div>
  )
}
