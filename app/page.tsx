import Link from 'next/link';
import Image from 'next/image';
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
            <Link href="/onboarding/host" className={styles.outlineBtn}>
              Offer a Place to Stay
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className={`${styles.featured} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="animate-fade-in">Featured Properties</h2>
            <p className="animate-fade-in">Handpicked premium properties just for you.</p>
          </div>

          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card hover-lift animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.propertyImagePlaceholder}>
                  <Image src={`https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800`} alt="Property" className={styles.propertyImage} width={800} height={600} />
                </div>
                <div className={styles.propertyInfo}>
                  <h3 className={styles.propertyTitle}>Modern Sapphire Villa</h3>
                  <p className={styles.propertyLocation}>Beverly Hills, CA</p>
                  <div className={styles.propertyFooter}>
                    <span className={styles.propertyPrice}>$4,200,000</span>
                    <Link href={`/listing/${i}`} className={styles.viewLink}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nivaesa Section */}
      <section className={`${styles.whyChoose} section-subtle`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="animate-fade-in">Why Choose Nivaesa?</h2>
            <p className="animate-fade-in">We provide a premium experience tailored to your needs.</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className="card hover-lift animate-fade-in">
              <h3>Verified Listings</h3>
              <p>Every property is manually verified for quality and authenticity.</p>
            </div>
            <div className="card hover-lift animate-fade-in">
              <h3>Secure Platform</h3>
              <p>Your data and transactions are protected by bank-grade security.</p>
            </div>
            <div className="card hover-lift animate-fade-in">
              <h3>Expert Agents</h3>
              <p>Work with the top 1% of real estate agents in your area.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
