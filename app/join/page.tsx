'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowRight } from 'lucide-react';
import styles from './join.module.css';

export default function JoinPage() {
    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    N I V A E S A
                </Link>
            </header>

            <main className={styles.mainContent}>
                <h1 className={styles.title}>Are you signing up to find a place or host a place?</h1>

                <div className={styles.optionsGrid}>
                    <Link href="/tenant/onboarding/start" className={styles.optionCard}>
                        <div className={styles.iconWrapper}>
                            <Search size={32} color="#1a1a1a" />
                        </div>
                        <h2 className={styles.optionTitle}>Find a place</h2>
                        <p className={styles.optionDescription}>
                            I'm looking for a room, roommate, or sublease in a shared home.
                        </p>
                    </Link>

                    <Link href="/host/onboarding/start" className={styles.optionCard}>
                        <div className={styles.iconWrapper}>
                            <Home size={32} color="#1a1a1a" />
                        </div>
                        <h2 className={styles.optionTitle}>Host a place</h2>
                        <p className={styles.optionDescription}>
                            I have a space to list or want to find a roommate for my property.
                        </p>
                    </Link>
                </div>

                <div className={styles.loginPrompt}>
                    Already have an account?
                    <Link href="/login" className={styles.loginLink}>Log in</Link>
                </div>
            </main>
        </div>
    );
}
