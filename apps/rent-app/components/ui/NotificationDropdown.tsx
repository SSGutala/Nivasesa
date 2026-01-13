'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import {
  getNotificationsAction,
  getUnreadNotificationCountAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
  type NotificationWithDetails,
} from '@/actions/notifications'
import styles from './NotificationDropdown.module.css'

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    const result = await getNotificationsAction(10)
    if (result.success && result.notifications) {
      setNotifications(result.notifications)
    }
    setLoading(false)
  }

  const fetchUnreadCount = async () => {
    const result = await getUnreadNotificationCountAction()
    if (result.success && result.count !== undefined) {
      setUnreadCount(result.count)
    }
  }

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const result = await markNotificationReadAction(notificationId)
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsReadAction()
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const result = await deleteNotificationAction(notificationId)
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      const notification = notifications.find((n) => n.id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      booking: '📅',
      message: '💬',
      review: '⭐',
      system: '🔔',
      waitlist: '⏰',
      connection: '🤝',
    }
    return icons[type] || '📢'
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Notifications</h3>
            {notifications.some((n) => !n.read) && (
              <button className={styles.markAllButton} onClick={handleMarkAllAsRead}>
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.content}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={48} />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className={styles.list}>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    getNotificationIcon={getNotificationIcon}
                    formatTimestamp={formatTimestamp}
                  />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.footer}>
              <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface NotificationItemProps {
  notification: NotificationWithDetails
  onMarkAsRead: (id: string, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  getNotificationIcon: (type: string) => string
  formatTimestamp: (date: Date) => string
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  formatTimestamp,
}: NotificationItemProps) {
  const content = (
    <div className={`${styles.item} ${notification.read ? styles.read : styles.unread}`}>
      <div className={styles.icon}>{getNotificationIcon(notification.type)}</div>
      <div className={styles.details}>
        <p className={styles.title}>{notification.title}</p>
        <p className={styles.body}>{notification.body}</p>
        <span className={styles.timestamp}>{formatTimestamp(notification.createdAt)}</span>
      </div>
      <div className={styles.actions}>
        {!notification.read && (
          <button
            className={styles.markReadButton}
            onClick={(e) => onMarkAsRead(notification.id, e)}
            aria-label="Mark as read"
            title="Mark as read"
          >
            <Check size={16} />
          </button>
        )}
        <button
          className={styles.deleteButton}
          onClick={(e) => onDelete(notification.id, e)}
          aria-label="Delete notification"
          title="Delete"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} className={styles.itemLink}>
        {content}
      </Link>
    )
  }

  return content
}
