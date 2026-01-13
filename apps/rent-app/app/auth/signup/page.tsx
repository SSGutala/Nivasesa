'use client';

import React from 'react';
import Link from 'next/link';
import { User, Home } from 'lucide-react';
import styles from './signup.module.css';

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Join Nivaesa</h1>
                <p className={styles.subtitle}>Choose how you want to use the platform.</p>

                <div className={styles.options}>
                    <Link href="/onboarding/renter" className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <User size={32} />
                        </div>
                        <div className={styles.text}>
                            <h2>I'm looking for a place</h2>
                            <p>Find a room or roommate and connect with the community.</p>
                        </div>
                    </Link>

                    <Link href="/onboarding/host" className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <Home size={32} />
                        </div>
                        <div className={styles.text}>
                            <h2>I'm offering a space</h2>
                            <p>List your room or property and find trusted tenants.</p>
                        </div>
                    </Link>
                </div>

                <div className={styles.login}>
                    Already have an account? <Link href="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}
