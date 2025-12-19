'use client';

import { useState, useTransition } from 'react';
import styles from './page.module.css';
import { Search, MapPin, User, ChevronRight } from 'lucide-react';
import { searchRealtors } from '@/actions/search';

export default function FindRealtorPage() {
  const [query, setQuery] = useState('');


  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    // If name mode, search logic might differ, for now effectively same action
    if (!query.trim()) return;

    setHasSearched(true);
    startTransition(async () => {
      const data = await searchRealtors({
        location: query,
        // language/filters could be added later or via secondary UI
      });
      setResults(data);
    });
  };

  const getMockStats = (id: string) => {
    const num = id.charCodeAt(0) || 0;
    return {
      sales: (num % 50) + 5,
      reviews: (num % 100) + 12,
      rating: 4.8 + ((num % 3) / 10)
    };
  };

  // Nivaesa/Zillow Hybrid Hero Image
  // Dynamic content based on category
  const [activeCategory, setActiveCategory] = useState<'Agents' | 'Property Managers' | 'Inspectors' | 'Photographers'>('Agents');

  const contentMap = {
    'Agents': {
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop",
      title: "Find an agent that\nunderstands you",
      placeholder: "City, Zip, Address, or Area",
      faqs: [
        { q: "Why do I need a buyer's agent?", a: "A buyer's agent represents your best interests, helping you negotiate price, navigate inspections, and understand local market nuances that data alone can't show." },
        { q: "How are real estate agents paid?", a: "Typically, agent commissions are paid by the seller at closing. However, recent industry changes mean it's important to discuss representation agreements upfront." },
        { q: "What should I look for in an agent?", a: "Look for local expertise, responsiveness, and a personality that meshes well with yours. An agent who speaks your native language can also ensure clearer communication." }
      ]
    },
    'Property Managers': {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2596&auto=format&fit=crop", // People/Agent showing listings
      title: "Find a manager for\nyour peace of mind",
      placeholder: "City, Zip, or Address",
      faqs: [
        { q: "What does a property manager do?", a: "They handle tenant screening, rent collection, maintenance requests, and legal compliance, saving you significant time and stress." },
        { q: "How much do property managers charge?", a: "Fees typically range from 8-12% of the monthly rent, plus a leasing fee for placing new tenants. Some may offer flat-rate pricing." },
        { q: "Can they handle eviction proceedings?", a: "Yes, professional managers are influential in local landlord-tenant laws and can handle the eviction process legally and efficiently if necessary." }
      ]
    },
    'Inspectors': {
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop", // Construction/Builder/Inspector
      title: "Ensure your home is\nsafe and sound",
      placeholder: "City, Zip, or Address",
      faqs: [
        { q: "When should I hire a home inspector?", a: "You should hire an inspector immediately after your offer is accepted, during the 'option period', to identify any major repairs before closing." },
        { q: "What does a standard inspection cover?", a: "It covers the home's structural components, roof, electrical, plumbing, and HVAC systems. Specialized inspections (pest, foundation) may be extra." },
        { q: "Can I attend the inspection?", a: "Absolutely. We encourage buyers to join the inspector for the last 30 minutes to walk through findings and ask questions directly." }
      ]
    },
    'Photographers': {
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2670&auto=format&fit=crop", // Camera lense/Photographer
      title: "Showcase your property\nin the best light",
      placeholder: "City, Zip, or Address",
      faqs: [
        { q: "Why hire a professional real estate photographer?", a: "Listings with professional photos sell 32% faster on average. High-quality visuals are your property's first showing online." },
        { q: "Do they offer virtual tours?", a: "Many of our photographers offer 3D Matterport tours, drone videography, and floor plan creation as part of their packages." },
        { q: "How long does a shoot take?", a: "A standard shoot for a 2,500 sq ft home usually takes about 1-2 hours, with edited photos delivered within 24-48 hours." }
      ]
    }
  };

  const currentContent = contentMap[activeCategory];

  // Helper Component for FAQ Item
  const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className={styles.faqItem}>
        <button className={styles.faqQuestion} onClick={() => setIsOpen(!isOpen)}>
          {question}
          {isOpen ? <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight size={20} />}
        </button>
        {isOpen && <div className={styles.faqAnswer}>{answer}</div>}
      </div>
    );
  };


  return (
    <div className={styles.container}>

      {/* SUB NAV */}
      <div className={styles.subNav}>
        <div className={styles.subNavContainer}>
          {['Agents', 'Property Managers', 'Inspectors', 'Photographers'].map((cat) => (
            <span
              key={cat}
              className={`${styles.subNavLink} ${activeCategory === cat ? styles.subNavLinkActive : ''}`}
              onClick={() => setActiveCategory(cat as any)}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className={styles.hero}>
        <img src={currentContent.image} alt={activeCategory} className={styles.heroBg} />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ whiteSpace: 'pre-line' }}>{currentContent.title}</h1>

          <div className={styles.searchRow}>
            {/* INPUT */}
            <div className={styles.inputWrapper} style={{ width: '100%' }}>
              <MapPin size={20} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder={currentContent.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* BUTTON */}
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              aria-label="Search"
            >
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className={styles.resultsContainer}>

        {hasSearched ? (
          <h2 className={styles.resultsHeader}>
            {results.length} Professionals found in &quot;{query}&quot;
          </h2>
        ) : (
          // Empty State / Default Content when no search yet
          <div style={{ textAlign: 'center', margin: '40px 0', color: 'var(--color-text-muted)' }}>
            {/* Could put "Featured Agents" here if desired */}
          </div>
        )}

        {results.map((realtor) => {
          const stats = getMockStats(realtor.id);
          return (
            <div key={realtor.id} className={styles.agentCard}>
              <div className={styles.photoCol}>
                <div className={styles.avatar}>
                  <User size={48} />
                </div>
              </div>

              <div className={styles.infoCol}>
                <div className={styles.agentHeader}>
                  <a href={`/find-a-realtor/${realtor.id}`} className={styles.agentName}>{realtor.user.name}</a>
                  <span className={styles.brokerage}>{realtor.brokerage}</span>
                </div>

                <div className={styles.statsRow}>
                  <span className={styles.rating}>
                    {stats.rating} <span className={styles.stars}>★★★★★</span>
                  </span>
                  <span className={styles.reviewCount}>({stats.reviews} reviews)</span>
                  <span style={{ color: 'var(--color-border)' }}>|</span>
                  <span>{stats.sales} Recent Sales</span>
                  <span style={{ color: 'var(--color-border)' }}>|</span>
                  <span>{realtor.experienceYears} Yrs Exp</span>
                </div>

                <p className={styles.bioSnippet}>
                  {realtor.bio || `Specializing in ${realtor.cities}, I help families find their perfect home. Fluent in ${realtor.languages}, I bridge cultural gaps.`}
                </p>

                <div className={styles.tags}>
                  <span className={styles.tag}>Buyer&apos;s Agent</span>
                  <span className={styles.tag}>Listing Agent</span>
                  {realtor.languages.split(',').slice(0, 3).map((lang: string) => (
                    <span key={lang} className={styles.tag}>{lang.trim()}</span>
                  ))}
                </div>
              </div>

              <div className={styles.actionCol}>
                <button className={`btn btn-primary ${styles.primaryBtn}`}>Contact Agent</button>
                <button className={`btn btn-outline ${styles.secondaryBtn}`}>{realtor.phone}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
