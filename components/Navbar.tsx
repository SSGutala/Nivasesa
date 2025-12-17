'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Search, User } from 'lucide-react';

export default function Navbar({ session }: { session?: any }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className={`${styles.header} ${isHome ? styles.headerHome : styles.headerLight}`}>
            {/* Top Row: Socials - Logo - User */}
            <div className={styles.topRow}>
                <div className={styles.socialIcons}>
                    <Instagram size={18} />
                    <Facebook size={18} />
                </div>

                <Link href="/" className={styles.logo}>
                    N I V A E S A
                </Link>

                <div className={styles.userActions}>
                    <Search size={18} />
                    {session ? (
                        <Link href="/realtor/dashboard"><User size={18} /></Link>
                    ) : (
                        <Link href="/login"><User size={18} /></Link>
                    )}
                </div>
            </div>

            {/* Bottom Row: Navigation */}
            <nav className={styles.navRow}>
                <Link href="/about" className={styles.navLink}>Our Story</Link>
                <Link href="/find-a-realtor" className={styles.navLink}>Find a Realtor</Link>
                <Link href="#" className={styles.navLink}>Cities</Link>
                <Link href="/join-the-network" className={styles.navLink}>Join Network</Link>
            </nav>
        </header>
    );
}
