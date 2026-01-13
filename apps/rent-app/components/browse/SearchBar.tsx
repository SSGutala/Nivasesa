'use client';

import React from 'react';
import styles from './SearchBar.module.css';
import { Search, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';

interface SearchBarProps {
    onFilterClick: () => void;
}

export default function SearchBar({ onFilterClick }: SearchBarProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.searchBar}>
                <div className={styles.section}>
                    <div className={styles.icon}>
                        <MapPin size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Jersey City, NJ"
                        className={styles.input}
                    />
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                    <div className={styles.icon}>
                        <Calendar size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Any move-in date"
                        className={styles.input}
                    />
                </div>

                <div className={styles.actions}>
                    <button className={styles.filterBtn} onClick={onFilterClick}>
                        <SlidersHorizontal size={18} />
                        <span>Filters</span>
                    </button>
                    <button className={styles.searchBtn}>
                        <Search size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
