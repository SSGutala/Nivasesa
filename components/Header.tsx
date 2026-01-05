'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isWhitePage = pathname.startsWith('/join') || pathname.startsWith('/login') || pathname.startsWith('/explore') || pathname.startsWith('/listing');

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
                    <Link href="/login" className={styles.navLink}>
                        Log in
                    </Link>
                    <Link href="/join" className={styles.signupBtn}>
                        Sign up
                    </Link>
                </nav>
            </div>
        </header>
    );
}
