'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HOST_NAV_ITEMS } from '@/lib/host-demo-data'; // Use the shared data
import styles from './host-layout.module.css';

export default function HostNav() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={styles.sidebar}>
                <Link href="/host/dashboard" className={styles.logo}>
                    N I V A E S A
                </Link>
                <nav className={styles.nav}>
                    {HOST_NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className={styles.mobileNav}>
                {HOST_NAV_ITEMS.slice(0, 5).map((item) => { // Limit items for mobile
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobileNavItem} ${isActive ? styles.activeMobile : ''}`}
                        >
                            <item.icon size={24} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
