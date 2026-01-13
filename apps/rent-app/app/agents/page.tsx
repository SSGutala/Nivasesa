'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Globe, Briefcase, ChevronDown, CheckCircle, X } from 'lucide-react';
import { searchAgentsAction, getAgentFilterOptionsAction, type AgentSummary } from '@/actions/agents';
import styles from './agents.module.css';

const LANGUAGES = ['Hindi', 'Telugu', 'Tamil', 'Gujarati', 'Punjabi', 'Bengali', 'Marathi', 'Kannada', 'Malayalam', 'Urdu'];
const STATES = ['TX', 'CA', 'NJ', 'NY', 'IL', 'FL', 'GA', 'VA', 'WA', 'MA'];

export default function AgentDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options
  const [filterOptions, setFilterOptions] = useState<{
    states: string[];
    cities: string[];
    languages: string[];
  }>({ states: STATES, cities: [], languages: LANGUAGES });

  // Load filter options
  useEffect(() => {
    getAgentFilterOptionsAction().then(setFilterOptions);
  }, []);

  // Search agents
  const searchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchAgentsAction({
        query: query || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
        language: selectedLanguage || undefined,
        page,
      });
      setAgents(result.agents);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to search agents:', error);
    } finally {
      setLoading(false);
    }
  }, [query, selectedState, selectedCity, selectedLanguage, page]);

  useEffect(() => {
    searchAgents();
  }, [searchAgents]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedState) params.set('state', selectedState);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedLanguage) params.set('language', selectedLanguage);

    const newUrl = params.toString() ? `?${params.toString()}` : '/agents';
    router.replace(newUrl, { scroll: false });
  }, [query, selectedState, selectedCity, selectedLanguage, router]);

  const clearFilters = () => {
    setQuery('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedLanguage('');
    setPage(1);
  };

  const activeFilterCount = [selectedState, selectedCity, selectedLanguage].filter(Boolean).length;

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Find Your Perfect Real Estate Agent</h1>
          <p>Connect with South Asian real estate professionals who understand your needs</p>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, brokerage, or specialty..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
              <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filterGroup}>
                <label>State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className={styles.select}
                >
                  <option value="">All States</option>
                  {filterOptions.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={styles.select}
                >
                  <option value="">All Cities</option>
                  {filterOptions.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={styles.select}
                >
                  <option value="">All Languages</option>
                  {filterOptions.languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className={styles.clearBtn}>
                  <X size={16} />
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className={styles.results}>
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            {loading ? 'Searching...' : `${total} agent${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        ) : agents.length === 0 ? (
          <div className={styles.empty}>
            <h3>No agents found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className={styles.resetBtn}>
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles.agentsGrid}>
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentSummary }) {
  return (
    <Link href={`/agents/${agent.id}`} className={styles.agentCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {agent.image ? (
            <img src={agent.image} alt={agent.name} />
          ) : (
            <span>{agent.name.charAt(0)}</span>
          )}
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.agentName}>
            {agent.name}
            {agent.isVerified && (
              <CheckCircle size={16} className={styles.verifiedBadge} />
            )}
          </h3>
          <p className={styles.brokerage}>{agent.brokerage}</p>
        </div>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <Briefcase size={16} />
          <span>{agent.experienceYears} years experience</span>
        </div>
        <div className={styles.detail}>
          <MapPin size={16} />
          <span>{agent.cities.slice(0, 2).join(', ')}{agent.cities.length > 2 ? ` +${agent.cities.length - 2}` : ''}</span>
        </div>
        <div className={styles.detail}>
          <Globe size={16} />
          <span>{agent.languages.slice(0, 2).join(', ')}{agent.languages.length > 2 ? ` +${agent.languages.length - 2}` : ''}</span>
        </div>
      </div>

      {agent.bio && (
        <p className={styles.bio}>{agent.bio.substring(0, 100)}{agent.bio.length > 100 ? '...' : ''}</p>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.viewProfile}>View Profile →</span>
      </div>
    </Link>
  );
}
