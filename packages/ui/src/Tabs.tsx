'use client'

import { useState } from 'react'
import styles from './Tabs.module.css'

export interface Tab {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'line' | 'pills'
  className?: string
  children?: (activeTab: string) => React.ReactNode
}

export function Tabs({
  tabs,
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'line',
  className = '',
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.value || '')
  const activeTab = controlledValue !== undefined ? controlledValue : internalValue

  const handleTabClick = (tabValue: string, disabled?: boolean) => {
    if (disabled) return

    if (controlledValue === undefined) {
      setInternalValue(tabValue)
    }
    onChange?.(tabValue)
  }

  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      <div className={`${styles.tabsList} ${styles[variant]}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-disabled={tab.disabled}
            className={`
              ${styles.tab}
              ${activeTab === tab.value ? styles.active : ''}
              ${tab.disabled ? styles.disabled : ''}
            `}
            onClick={() => handleTabClick(tab.value, tab.disabled)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      {children && (
        <div className={styles.tabContent} role="tabpanel">
          {children(activeTab)}
        </div>
      )}
    </div>
  )
}

export interface TabPanelProps {
  value: string
  activeValue: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ value, activeValue, children, className = '' }: TabPanelProps) {
  if (value !== activeValue) return null

  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  )
}
