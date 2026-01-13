'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import styles from './Toast.module.css'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: string
  variant: ToastVariant
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  info: (message: string, title?: string) => void
  success: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const icons: Record<ToastVariant, ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle size={18} />,
  warning: <AlertCircle size={18} />,
  error: <XCircle size={18} />,
}

interface ToastProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastProvider({ children, position = 'top-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const info = useCallback(
    (message: string, title?: string) => addToast({ variant: 'info', message, title }),
    [addToast]
  )

  const success = useCallback(
    (message: string, title?: string) => addToast({ variant: 'success', message, title }),
    [addToast]
  )

  const warning = useCallback(
    (message: string, title?: string) => addToast({ variant: 'warning', message, title }),
    [addToast]
  )

  const error = useCallback(
    (message: string, title?: string) => addToast({ variant: 'error', message, title }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, info, success, warning, error }}>
      {children}
      <div className={`${styles.container} ${styles[position.replace('-', '')]}`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.variant]}`}
            role="alert"
          >
            <div className={styles.icon}>{icons[toast.variant]}</div>
            <div className={styles.content}>
              {toast.title && <div className={styles.title}>{toast.title}</div>}
              <div className={styles.message}>{toast.message}</div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
