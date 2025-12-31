import Link from 'next/link';
import styles from './page.module.css';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Belong with your community,<br />feel at home.
          </h1>
          <p className={styles.subtitle}>
            The most trusted way to find your next space and roommates.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/explore" className={styles.primaryBtn}>
              Find a Place to Belong <ArrowRight size={20} className={styles.btnIcon} />
            </Link>
            <Link href="/join/offer" className={styles.outlineBtn}>
              Offer a Place to Stay
            </Link>
          </div>
        </div>
      </section>

      {/* Other sections have been removed for a clean, minimalist launch as requested */}
    </main>
  );
}
