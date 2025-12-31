'use client';

import React from 'react';
import styles from './ReviewSummary.module.css';

interface SummaryItem {
    label: string;
    value: string | string[];
    step: number;
}

interface ReviewSummaryProps {
    items: SummaryItem[];
    onEdit: (step: number) => void;
}

export default function ReviewSummary({ items, onEdit }: ReviewSummaryProps) {
    return (
        <div className={styles.summaryContainer}>
            {items.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.content}>
                        <span className={styles.label}>{item.label}</span>
                        <span className={styles.value}>
                            {Array.isArray(item.value) ? item.value.join(', ') : item.value || '--'}
                        </span>
                    </div>
                    <button className={styles.editBtn} onClick={() => onEdit(item.step)}>
                        Edit
                    </button>
                </div>
            ))}
        </div>
    );
}
