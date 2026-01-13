'use client';

import React, { useState, useCallback } from 'react';
import styles from './FiltersPanel.module.css';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  // Core filters
  minPrice?: number;
  maxPrice?: number;
  roomTypes: string[];

  // Dietary
  dietaryPreference?: string;
  beefPorkCookingOk?: boolean;

  // Substances
  smokingPolicy?: string;
  cannabisPolicy?: string;
  alcoholPolicy?: string;

  // Guest policies
  overnightGuests?: string;
  partnerVisits?: string;

  // Social
  partiesAllowed?: string;
  curfew?: string;
  nightOwlFriendly?: boolean;

  // Demographics
  lgbtqFriendly?: boolean;
  petsPolicy?: string;
  languages?: string[];

  // Freedom Score range
  minFreedomScore?: number;
  maxFreedomScore?: number;
}

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const ROOM_TYPES = ['Private Room', 'Shared Room', 'Master Bedroom', 'Studio'];
const DIETARY_OPTIONS = ['No Preference', 'Vegetarian Only', 'Halal Only'];
const SMOKING_OPTIONS = ['No Preference', 'No Smoking', 'Outside Only', 'Smoking OK'];
const CANNABIS_OPTIONS = ['No Preference', 'No Cannabis', 'Outside Only', '420 Friendly'];
const ALCOHOL_OPTIONS = ['No Preference', 'No Alcohol', 'Social OK'];
const GUEST_OPTIONS = ['No Preference', 'No Overnight', 'Occasional', 'Regular', 'Anytime OK'];
const PARTY_OPTIONS = ['No Preference', 'No Parties', 'Small OK', 'Medium OK', 'Large OK'];
const PETS_OPTIONS = ['No Preference', 'No Pets', 'Cats OK', 'Dogs OK', 'All Pets'];
const LANGUAGES = ['Hindi', 'Telugu', 'Tamil', 'Gujarati', 'Punjabi', 'Bengali', 'Marathi', 'Kannada', 'Malayalam'];

export default function FiltersPanel({ isOpen, onClose, filters, onFiltersChange }: FiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    roomType: true,
    dietary: false,
    substances: false,
    guests: false,
    social: false,
    demographics: false,
    freedom: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const toggleRoomType = (type: string) => {
    const current = filters.roomTypes || [];
    if (current.includes(type)) {
      updateFilter(
        'roomTypes',
        current.filter((t) => t !== type)
      );
    } else {
      updateFilter('roomTypes', [...current, type]);
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = filters.languages || [];
    if (current.includes(lang)) {
      updateFilter(
        'languages',
        current.filter((l) => l !== lang)
      );
    } else {
      updateFilter('languages', [...current, lang]);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      roomTypes: [],
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'roomTypes' || key === 'languages') {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== 'No Preference';
  }).length;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            Filters {activeFilterCount > 0 && <span className={styles.filterCount}>{activeFilterCount}</span>}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Price Range */}
          <Section title="Price Range" expanded={expandedSections.price} onToggle={() => toggleSection('price')}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Min price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Max price</label>
                <input
                  type="number"
                  placeholder="$5,000+"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </Section>

          {/* Room Type */}
          <Section title="Room Type" expanded={expandedSections.roomType} onToggle={() => toggleSection('roomType')}>
            <div className={styles.chips}>
              {ROOM_TYPES.map((type) => (
                <button
                  key={type}
                  className={`${styles.chip} ${filters.roomTypes?.includes(type) ? styles.chipActive : ''}`}
                  onClick={() => toggleRoomType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </Section>

          {/* Dietary */}
          <Section title="Dietary Preferences" expanded={expandedSections.dietary} onToggle={() => toggleSection('dietary')}>
            <div className={styles.chips}>
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option}
                  className={`${styles.chip} ${filters.dietaryPreference === option ? styles.chipActive : ''}`}
                  onClick={() => updateFilter('dietaryPreference', option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.beefPorkCookingOk !== false}
                onChange={(e) => updateFilter('beefPorkCookingOk', e.target.checked)}
              />
              Beef/Pork cooking OK
            </label>
          </Section>

          {/* Substances */}
          <Section title="Substance Policies" expanded={expandedSections.substances} onToggle={() => toggleSection('substances')}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Smoking</label>
              <div className={styles.chips}>
                {SMOKING_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.smokingPolicy === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('smokingPolicy', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Cannabis</label>
              <div className={styles.chips}>
                {CANNABIS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.cannabisPolicy === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('cannabisPolicy', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Alcohol</label>
              <div className={styles.chips}>
                {ALCOHOL_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.alcoholPolicy === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('alcoholPolicy', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Guests */}
          <Section title="Guest Policy" expanded={expandedSections.guests} onToggle={() => toggleSection('guests')}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Overnight Guests</label>
              <div className={styles.chips}>
                {GUEST_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.overnightGuests === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('overnightGuests', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Partner Visits</label>
              <div className={styles.chips}>
                {GUEST_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.partnerVisits === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('partnerVisits', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Social */}
          <Section title="Social & Lifestyle" expanded={expandedSections.social} onToggle={() => toggleSection('social')}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Parties</label>
              <div className={styles.chips}>
                {PARTY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.partiesAllowed === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('partiesAllowed', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.nightOwlFriendly === true}
                onChange={(e) => updateFilter('nightOwlFriendly', e.target.checked)}
              />
              Night owl friendly
            </label>
          </Section>

          {/* Demographics */}
          <Section
            title="Preferences & Language"
            expanded={expandedSections.demographics}
            onToggle={() => toggleSection('demographics')}
          >
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.lgbtqFriendly === true}
                onChange={(e) => updateFilter('lgbtqFriendly', e.target.checked)}
              />
              LGBTQ+ Friendly
            </label>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Pets</label>
              <div className={styles.chips}>
                {PETS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`${styles.chip} ${filters.petsPolicy === option ? styles.chipActive : ''}`}
                    onClick={() => updateFilter('petsPolicy', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Languages Spoken</label>
              <div className={styles.chips}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    className={`${styles.chip} ${filters.languages?.includes(lang) ? styles.chipActive : ''}`}
                    onClick={() => toggleLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Freedom Score */}
          <Section title="Freedom Score" expanded={expandedSections.freedom} onToggle={() => toggleSection('freedom')}>
            <p className={styles.helpText}>
              Higher scores indicate more flexibility with guests, substances, and lifestyle choices.
            </p>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Min score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={filters.minFreedomScore || ''}
                  onChange={(e) => updateFilter('minFreedomScore', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Max score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={filters.maxFreedomScore || ''}
                  onChange={(e) => updateFilter('maxFreedomScore', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </Section>
        </div>

        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear all
          </button>
          <button className={styles.applyBtn} onClick={onClose}>
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={onToggle}>
        <h3>{title}</h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expanded && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}
