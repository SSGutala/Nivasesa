'use client';

import React from 'react';
import styles from './SignupPromptModal.module.css';
import { X, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface SignupPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export default function SignupPromptModal({ isOpen, onClose, title = "Sign up to continue" }: SignupPromptModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                <div className={styles.iconContainer}>
                    <UserPlus size={48} />
                </div>

                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>
                    Create a free account to save listings, message hosts, and request virtual meet & greets.
                </p>

                <div className={styles.actions}>
                    <Link href="/auth/signup" className={styles.joinBtn}>
                        Create Account
                    </Link>
                    <Link href="/auth/login" className={styles.loginBtn}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
