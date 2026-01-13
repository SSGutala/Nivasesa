'use client'

import { ReactNode } from 'react'
import styles from './VisuallyHidden.module.css'

interface VisuallyHiddenProps {
  children: ReactNode
  as?: 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'p'
}

/**
 * Visually hides content while keeping it accessible to screen readers
 */
export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return <Component className={styles.visuallyHidden}>{children}</Component>
}
