import { Skeleton } from '@/components/ui'
import styles from './page.module.css'

export default function FindRealtorLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          style={{
            width: '200px',
            height: '32px',
            background: '#e5e7eb',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        />
        <div
          style={{
            width: '400px',
            height: '20px',
            background: '#e5e7eb',
            borderRadius: '8px',
          }}
        />
      </div>

      <div className={styles.filters}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '120px',
              height: '40px',
              background: '#e5e7eb',
              borderRadius: '8px',
            }}
          />
        ))}
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    </div>
  )
}
