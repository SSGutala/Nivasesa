'use client';

import { useState, useTransition } from 'react';
import styles from './page.module.css';
import { Search, MapPin, User, ChevronRight, Filter, Map as MapIcon, List } from 'lucide-react';
import { searchRealtors } from '@/actions/search';

export default function FindRealtorPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setHasSearched(true);
    startTransition(async () => {
      const data = await searchRealtors({ location: query });
      setResults(data);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Left: Listings */}
        <div className={styles.listingColumn}>
          <div className={styles.searchRow}>
            <div className={styles.inputWrapper}>
              <MapPin size={20} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="City, neighborhood, or zip"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className={styles.searchBtn} onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>

          <div className={styles.filterBar} style={{ padding: '0 0 20px 0' }}>
            <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>Price</button>
            <button className={styles.filterBtn}>Type</button>
            <button className={styles.filterBtn}>Bedrooms</button>
            <button className={styles.filterBtn}>
              <Filter size={14} style={{ marginRight: '4px' }} />
              More
            </button>
          </div>

          <div className={styles.resultsGrid}>
            {results.length > 0 ? (
              results.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.agentCard} ${selectedId === item.id ? styles.agentCardSelected : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className={styles.photoWrapper}>
                    <img
                      src={item.user.image || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop`}
                      alt={item.user.name}
                      className={styles.agentImage}
                    />
                  </div>
                  <div className={styles.infoCol}>
                    <div className={styles.badge}>Lavender Listed</div>
                    <h3 className={styles.agentName}>{item.user.name}</h3>
                    <p className={styles.brokerage}>{item.brokerage || 'Nivaesa Verified Partner'}</p>
                    <div className={styles.areaTags}>
                      <span className={styles.areaTag}>{item.cities?.split(',')[0] || 'Local Area'}</span>
                      <span className={styles.areaTag}>Verified</span>
                    </div>
                    <div className={styles.actionCol}>
                      <button className={styles.primaryBtn}>Message</button>
                      <button className={styles.secondaryBtn}>Details</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}>
                {hasSearched ? 'No results found. Try a different location.' : 'Search for a place to start exploring.'}
              </div>
            )}
          </div>
        </div>

        {/* Right: Map Placeholder */}
        <div className={styles.mapColumn}>
          <div className={styles.mapPlaceholder}>
            <MapIcon size={64} />
            <p style={{ marginTop: '12px', fontWeight: 'bold' }}>Interactive Map View</p>
            <p style={{ fontSize: '14px' }}>Click on listings to view locations</p>
          </div>

          <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            <button className={styles.filterBtn} style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <List size={16} /> List
            </button>
            <button className={`${styles.filterBtn} ${styles.filterBtnActive}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon size={16} /> Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
