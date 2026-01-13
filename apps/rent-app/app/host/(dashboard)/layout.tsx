
import React from 'react';
import HostNav from './HostNav';
import styles from './host-layout.module.css';

export default function HostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layoutContainer}>
            <HostNav />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
