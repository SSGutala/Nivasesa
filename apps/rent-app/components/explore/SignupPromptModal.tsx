'use client';

import React from 'react';
import styles from './SignupPromptModal.module.css';
import { X, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface SignupPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    returnUrl?: string;
}

export default function SignupPromptModal({ isOpen, onClose, title = "Sign up to continue", returnUrl }: SignupPromptModalProps) {
    if (!isOpen) return null;

    const signupUrl = returnUrl ? `/join/find?returnUrl=${encodeURIComponent(returnUrl)}` : '/join/find';

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
                    <Link href={signupUrl} className={styles.joinBtn}>
                        Create Account
                    </Link>
                    <button className={styles.loginBtn}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
}
