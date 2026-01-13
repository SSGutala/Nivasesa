'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getUnreadCountAction } from '@/actions/messaging';
import styles from './UnreadBadge.module.css';

export default function UnreadBadge() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const result = await getUnreadCountAction();
        if (result.success && result.count !== undefined) {
          setUnreadCount(result.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUnreadCount();

    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/messages" className={styles.messagesLink}>
      <MessageCircle size={20} />
      <span className={styles.label}>Messages</span>
      {!loading && unreadCount > 0 && (
        <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </Link>
  );
}
