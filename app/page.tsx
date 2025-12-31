import Link from 'next/link';
import styles from './page.module.css';
import { Home, Users, MapPin, TrendingUp, Award, Shield, Heart, ChevronRight } from 'lucide-react';
import { getRoomListings } from '@/actions/rooms';
import { CITIES } from '@/lib/cities';

export default async function HomePage() {
  // Fetch recent room listings for featured section
  const recentRooms = await getRoomListings();
  const featuredRooms = recentRooms.slice(0, 6);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Your Home in a Community That Understands
          </h1>
          <p className={styles.heroSubtitle}>
            Connect with culturally-aligned housing, roommates, and realtors across Texas, New Jersey, and California
          </p>

          {/* City Selector */}
          <div className={styles.citySelector}>
            <MapPin className={styles.citySelectorIcon} size={20} />
            <select className={styles.citySelect} defaultValue="">
              <option value="" disabled>Select your city</option>
              {CITIES.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {city.stateAbbr}
                </option>
              ))}
            </select>
          </div>

          {/* User Path Buttons */}
          <div className={styles.pathButtons}>
            <Link href="/rooms" className={styles.pathButton}>
              <div className={styles.pathButtonIcon}>
                <Home size={24} />
              </div>
              <span className={styles.pathButtonText}>Find a Room</span>
              <ChevronRight className={styles.pathButtonArrow} size={20} />
            </Link>
            <Link href="/rooms/post" className={styles.pathButton}>
              <div className={styles.pathButtonIcon}>
                <MapPin size={24} />
              </div>
              <span className={styles.pathButtonText}>List Your Room</span>
              <ChevronRight className={styles.pathButtonArrow} size={20} />
            </Link>
            <Link href="/roommates" className={styles.pathButton}>
              <div className={styles.pathButtonIcon}>
                <Users size={24} />
              </div>
              <span className={styles.pathButtonText}>Find Roommates</span>
              <ChevronRight className={styles.pathButtonArrow} size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recently Available Rooms</h2>
            <p className={styles.sectionSubtitle}>
              Find your next home in vibrant South Asian communities
            </p>
          </div>

          {featuredRooms.length > 0 ? (
            <div className={styles.listingsGrid}>
              {featuredRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className={styles.listingCard}
                >
                  <div className={styles.listingImagePlaceholder}>
                    <div className={styles.freedomScoreBadge}>
                      Freedom Score: {room.freedomScore}
                    </div>
                  </div>
                  <div className={styles.listingContent}>
                    <h3 className={styles.listingTitle}>{room.title}</h3>
                    <p className={styles.listingLocation}>
                      <MapPin size={14} />
                      {room.neighborhood ? `${room.neighborhood}, ` : ''}{room.city}, {room.state}
                    </p>
                    <div className={styles.listingDetails}>
                      <span className={styles.listingDetail}>
                        {room.roomType}
                      </span>
                      <span className={styles.listingDetail}>
                        {room.totalBedrooms} bed
                      </span>
                      <span className={styles.listingDetail}>
                        {room.totalBathrooms} bath
                      </span>
                    </div>
                    <div className={styles.listingFooter}>
                      <span className={styles.listingPrice}>${room.rent}/mo</span>
                      <span className={styles.viewDetails}>View Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No listings available yet. Be the first to list your room!</p>
              <Link href="/rooms/post" className={styles.emptyStateButton}>
                List Your Room
              </Link>
            </div>
          )}

          <div className={styles.sectionFooter}>
            <Link href="/rooms" className={styles.viewAllLink}>
              View All Rooms <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Freedom Score */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Understanding Freedom Score</h2>
            <p className={styles.sectionSubtitle}>
              We believe you should know what life will really be like before you move in
            </p>
          </div>

          <div className={styles.freedomScoreExplainer}>
            <div className={styles.freedomScoreVisual}>
              <div className={styles.scoreCircle}>
                <div className={styles.scoreNumber}>85</div>
                <div className={styles.scoreLabel}>Freedom Score</div>
              </div>
            </div>

            <div className={styles.freedomScoreContent}>
              <h3 className={styles.freedomScoreTitle}>What is Freedom Score?</h3>
              <p className={styles.freedomScoreDescription}>
                Every room listing gets a Freedom Score (0-100) based on house rules and lifestyle flexibility.
                Higher scores mean more personal freedom and fewer restrictions.
              </p>

              <div className={styles.freedomScoreFactors}>
                <div className={styles.scoreFactor}>
                  <Award className={styles.scoreFactorIcon} size={20} />
                  <div>
                    <h4 className={styles.scoreFactorTitle}>Guest Policy</h4>
                    <p className={styles.scoreFactorText}>Overnight guests, partner visits, extended stays</p>
                  </div>
                </div>
                <div className={styles.scoreFactor}>
                  <Shield className={styles.scoreFactorIcon} size={20} />
                  <div>
                    <h4 className={styles.scoreFactorTitle}>Lifestyle Freedom</h4>
                    <p className={styles.scoreFactorText}>Curfews, noise policies, social events</p>
                  </div>
                </div>
                <div className={styles.scoreFactor}>
                  <Heart className={styles.scoreFactorIcon} size={20} />
                  <div>
                    <h4 className={styles.scoreFactorTitle}>Cultural Flexibility</h4>
                    <p className={styles.scoreFactorText}>Dietary choices, cooking freedom, inclusivity</p>
                  </div>
                </div>
              </div>

              <Link href="/rooms" className={styles.freedomScoreButton}>
                Find High Freedom Score Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Join Our Growing Community</h2>
            <p className={styles.sectionSubtitle}>
              Helping South Asians find their perfect home across America
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Home size={32} />
              </div>
              <div className={styles.statNumber}>{featuredRooms.length}+</div>
              <div className={styles.statLabel}>Active Listings</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <MapPin size={32} />
              </div>
              <div className={styles.statNumber}>{CITIES.length}</div>
              <div className={styles.statLabel}>Cities Covered</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={32} />
              </div>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Community Members</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <TrendingUp size={32} />
              </div>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
          </div>

          <div className={styles.citiesHighlight}>
            <h3 className={styles.citiesHighlightTitle}>We serve South Asian communities in:</h3>
            <div className={styles.citiesList}>
              {CITIES.slice(0, 8).map((city) => (
                <span key={city.slug} className={styles.cityBadge}>
                  {city.name}, {city.stateAbbr}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Community?</h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of South Asians who have found their perfect housing match
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/rooms" className={styles.ctaPrimaryButton}>
              Browse Rooms
            </Link>
            <Link href="/roommates" className={styles.ctaSecondaryButton}>
              Find Roommates
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
