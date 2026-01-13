'use client';

import React from 'react';
import styles from './FormInput.module.css';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    error?: string;
}

export default function FormSelect({ label, options, error, id, ...props }: FormSelectProps) {
    return (
        <div className={styles.inputContainer}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <div className={styles.selectWrapper}>
                <select
                    id={id}
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p className={`${styles.hint} ${styles.hintError}`}>
                    {error}
                </p>
            )}
        </div>
    );
}
