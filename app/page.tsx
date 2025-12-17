import Link from 'next/link';
import styles from './page.module.css';
import { Search, MapPin, ShieldCheck, Languages } from 'lucide-react';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.world}>HOME</span>
          <span className={styles.of}>starts with</span>
          <span className={styles.nivaesa}>TRUST</span>
            
          <Link href="/find-a-realtor" className={styles.ctaButton}>
               Find a Realtor
          </Link>
        </div>
      </section>

      {/* Trust Factors / Value Props */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <Languages className={styles.featureIcon} />
              <h3 className={styles.featureTitle}>Language Match</h3>
              <p className={styles.featureDesc}>
                Connect with agents who speak Hindi, Gujarati, Telugu, Punjabi, and more. A shared language builds deeper trust.
              </p>
            </div>
            <div className={styles.featureCard}>
              <ShieldCheck className={styles.featureIcon} />
              <h3 className={styles.featureTitle}>Verified Partners</h3>
              <p className={styles.featureDesc}>
                Every realtor is rigorously vetted for license validity and community reputation. Peace of mind is standard.
              </p>
            </div>
            <div className={styles.featureCard}>
              <MapPin className={styles.featureIcon} />
              <h3 className={styles.featureTitle}>Local Experts</h3>
              <p className={styles.featureDesc}>
                Agents who truly understand the neighborhood nuances, school districts, and community vibes you're looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className={styles.citiesSection}>
        <div className="container">
          <h2 style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>Current Locations</h2>
          <div className={styles.cityGrid}>
            <Link href="/find-realtor?location=Frisco" className={styles.cityCard}>Frisco, TX</Link>
            <Link href="/find-realtor?location=Dallas" className={styles.cityCard}>Dallas, TX</Link>
            <Link href="/find-realtor?location=Irving" className={styles.cityCard}>Irving, TX</Link>
            <Link href="/find-realtor?location=Jersey City" className={styles.cityCard}>Jersey City, NJ</Link>
            <Link href="/find-realtor?location=Edison" className={styles.cityCard}>Edison, NJ</Link>
            <Link href="/find-realtor?location=Fremont" className={styles.cityCard}>Fremont, CA</Link>
            <Link href="/find-realtor?location=San Jose" className={styles.cityCard}>San Jose, CA</Link>
            <Link href="/find-realtor?location=Alpharetta" className={styles.cityCard}>Alpharetta, GA</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
