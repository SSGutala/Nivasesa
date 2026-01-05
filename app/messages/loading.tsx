import { Skeleton } from '@/components/ui'

export default function MessagesLoading() {
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: 'white' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '360px',
          borderRight: '1px solid #e5e7eb',
          padding: '20px',
        }}
      >
        <Skeleton width={120} height={28} />
        <div style={{ height: '16px' }} />
        <Skeleton width="100%" height={40} />
        <div style={{ height: '20px' }} />

        {/* Conversation items */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 0',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <Skeleton width={48} height={48} borderRadius="50%" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Skeleton width={120} height={16} />
                <Skeleton width={50} height={12} />
              </div>
              <Skeleton width="80%" height={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Message area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Skeleton width={40} height={40} borderRadius="50%" />
          <div>
            <Skeleton width={140} height={18} />
            <div style={{ height: '4px' }} />
            <Skeleton width={60} height={14} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ alignSelf: 'flex-start', maxWidth: '60%' }}>
              <Skeleton width={200} height={48} />
            </div>
            <div style={{ alignSelf: 'flex-end', maxWidth: '60%' }}>
              <Skeleton width={180} height={48} />
            </div>
            <div style={{ alignSelf: 'flex-start', maxWidth: '60%' }}>
              <Skeleton width={250} height={64} />
            </div>
            <div style={{ alignSelf: 'flex-end', maxWidth: '60%' }}>
              <Skeleton width={150} height={48} />
            </div>
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Skeleton width="100%" height={48} />
          <Skeleton width={80} height={48} />
        </div>
      </div>
    </div>
  )
}
