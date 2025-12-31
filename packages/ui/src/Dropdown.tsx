'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from './Dropdown.module.css'

export interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  items: DropdownItem[]
  trigger: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ items, trigger, align = 'left', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.()
      setIsOpen(false)
    }
  }

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      {isOpen && (
        <div className={`${styles.menu} ${styles[align]}`} role="menu">
          {items.map((item, index) => (
            <button
              key={item.value || index}
              type="button"
              className={`${styles.item} ${item.disabled ? styles.disabled : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export interface DropdownButtonProps {
  items: DropdownItem[]
  label: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  align?: 'left' | 'right'
  className?: string
}

export function DropdownButton({
  items,
  label,
  variant = 'outline',
  align = 'left',
  className = '',
}: DropdownButtonProps) {
  return (
    <Dropdown
      items={items}
      align={align}
      className={className}
      trigger={
        <span className={`${styles.buttonTrigger} ${styles[`trigger-${variant}`]}`}>
          {label}
          <ChevronDown size={16} />
        </span>
      }
    />
  )
}
