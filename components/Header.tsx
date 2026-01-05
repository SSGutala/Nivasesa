'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const isWhitePage = pathname.startsWith('/join') || pathname.startsWith('/login') || pathname.startsWith('/explore') || pathname.startsWith('/logged-in') || pathname.startsWith('/listing') || pathname.startsWith('/tenant');

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        window.location.href = '/';
    };

    const isLoggedInPage = pathname.startsWith('/logged-in');

    if (pathname.startsWith('/onboarding') || pathname.startsWith('/host') || pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <header className={`${styles.header} ${isWhitePage ? styles.lightTheme : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    N I V A E S A
                </Link>

                <nav className={styles.nav}>
                    {user || isLoggedInPage ? (
                        <button
                            onClick={handleSignOut}
                            className={styles.signupBtn}
                            style={{ cursor: 'pointer' }}
                        >
                            Sign Out
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink}>
                                Log in
                            </Link>
                            <Link href="/join" className={styles.signupBtn}>
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
