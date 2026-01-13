'use client';

import React from 'react';
import styles from './FiltersPanel.module.css';
import { X } from 'lucide-react';

interface FiltersPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FiltersPanel({ isOpen, onClose }: FiltersPanelProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Filters</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Core Filters */}
                    <div className={styles.section}>
                        <h3>Price range</h3>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Min price</label>
                                <input type="number" placeholder="$0" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Max price</label>
                                <input type="number" placeholder="$5,000+" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Type of place</h3>
                        <div className={styles.options}>
                            <label className={styles.checkbox}>
                                <input type="checkbox" /> Entire place
                            </label>
                            <label className={styles.checkbox}>
                                <input type="checkbox" /> Private room
                            </label>
                            <label className={styles.checkbox}>
                                <input type="checkbox" /> Shared room
                            </label>
                        </div>
                    </div>

                    {/* Niveasa Specific Filters */}
                    <div className={styles.section}>
                        <h3>Household diet</h3>
                        <div className={styles.chips}>
                            <button className={styles.chip}>Vegetarian</button>
                            <button className={styles.chip}>Mixed</button>
                            <button className={styles.chip}>No preference</button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Cooking preferences</h3>
                        <div className={styles.chips}>
                            <button className={styles.chip}>No pork cooked</button>
                            <button className={styles.chip}>No beef cooked</button>
                            <button className={styles.chip}>No restrictions</button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Lifestyle</h3>
                        <div className={styles.options}>
                            <label className={styles.checkbox}><input type="checkbox" /> Quiet</label>
                            <label className={styles.checkbox}><input type="checkbox" /> Social</label>
                            <label className={styles.checkbox}><input type="checkbox" /> Working professionals</label>
                            <label className={styles.checkbox}><input type="checkbox" /> Family-friendly</label>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Guest policy</h3>
                        <div className={styles.options}>
                            <label className={styles.radio}><input type="radio" name="guest" /> Guests allowed</label>
                            <label className={styles.radio}><input type="radio" name="guest" /> Limited</label>
                            <label className={styles.radio}><input type="radio" name="guest" /> No overnight guests</label>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.clearBtn}>Clear all</button>
                    <button className={styles.applyBtn} onClick={onClose}>Show results</button>
                </div>
            </div>
        </div>
    );
}
