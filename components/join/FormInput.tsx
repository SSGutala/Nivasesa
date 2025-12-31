'use client';

import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export default function FormInput({ label, error, helperText, id, ...props }: FormInputProps) {
    return (
        <div className={styles.inputContainer}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input
                id={id}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder={props.placeholder || `Enter ${label.toLowerCase()}`}
                {...props}
            />
            {error ? (
                <p className={`${styles.hint} ${styles.hintError}`}>
                    {error}
                </p>
            ) : helperText ? (
                <p className={styles.hint}>
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}
