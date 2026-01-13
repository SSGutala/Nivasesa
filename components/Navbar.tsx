'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { signOutAction } from '@/actions/auth';

export default function Navbar({ session }: { session?: any }) {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (e: React.MouseEvent) => {
        // We don't prevent default here because the icon itself should be a link for "tapping"
        // But if we want the menu to show on click on mobile, we might need a separate trigger or use state
        setShowDropdown(!showDropdown);
    };

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
                    <Search size={18} className={styles.actionIcon} />

                    <div className={styles.profileWrapper} ref={dropdownRef} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                        <Link href={session ? "/dashboard" : "/login"} className={styles.profileIconLink}>
                            <User size={18} />
                        </Link>

                        {showDropdown && (
                            <div className={styles.dropdown}>
                                {session ? (
                                    <>
                                        <Link href="/dashboard" className={styles.dropdownItem}>
                                            <User size={14} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <form action={signOutAction} className={styles.signOutForm}>
                                            <button type="submit" className={styles.dropdownItem}>
                                                <LogOut size={14} />
                                                <span>Sign out</span>
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <Link href="/login" className={styles.dropdownItem}>
                                        <LogOut size={14} />
                                        <span>Sign In</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Navigation */}
            <nav className={styles.navRow}>
                <Link href="/about" className={styles.navLink}>Our Story</Link>
                <Link href="/find-a-realtor" className={styles.navLink}>Find a Realtor</Link>
                <Link href="/join-the-network" className={styles.navLink}>Join Network</Link>
            </nav>
        </header>
    );
}
