import Link from 'next/link';
import { auth } from '@/auth';
import UnreadBadge from './UnreadBadge';
import styles from './Header.module.css';

export default async function Header() {
  const session = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          N I V A E S A
        </Link>

        <nav className={styles.nav}>
          {session?.user ? (
            <>
              <UnreadBadge />
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Log in
              </Link>
              <Link href="/join/find" className={styles.signupBtn}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
