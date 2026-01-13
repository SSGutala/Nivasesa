'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  returnFocusOnDeactivate?: boolean
}

/**
 * Traps keyboard focus within a container (useful for modals, dialogs)
 */
export function FocusTrap({
  children,
  active = true,
  returnFocusOnDeactivate = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)

  useEffect(() => {
    if (!active) return

    previousActiveElement.current = document.activeElement

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements
    const getFocusableElements = () => {
      return container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    }

    // Focus first element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus when trap deactivates
      if (
        returnFocusOnDeactivate &&
        previousActiveElement.current instanceof HTMLElement
      ) {
        previousActiveElement.current.focus()
      }
    }
  }, [active, returnFocusOnDeactivate])

  return <div ref={containerRef}>{children}</div>
}
