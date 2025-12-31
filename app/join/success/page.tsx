'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './success.module.css';
import { ShieldCheck } from 'lucide-react';

export default function JoinSuccessPage() {
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <ShieldCheck size={64} className={styles.icon} />
                </div>
                <h1 className={styles.title}>Welcome to Nivaesa!</h1>
                <p className={styles.subtitle}>Account created successfully.</p>

                <div className={styles.infoBox}>
                    <p>Nivaesa is currently under development. You&apos;ll receive an email with next steps and updates as we launch.</p>
                </div>

                <Link
                    href={returnUrl || "/"}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    {returnUrl ? 'Back to Listing' : 'Return Home'}
                </Link>
            </div>
        </div>
    );
}
