'use client';

import { useState } from 'react';
import styles from './survey.module.css';

const LANGUAGES = [
    'English',
    'Hindi',
    'Telugu',
    'Tamil',
    'Gujarati',
    'Punjabi',
    'Bengali',
    'Malayalam',
    'Kannada',
    'Marathi',
    'Urdu',
    'Nepali',
    'Sinhala',
    'Other',
];

interface LanguageSelectProps {
    value: string[];
    onChange: (languages: string[]) => void;
    label?: string;
    required?: boolean;
}

export default function LanguageSelect({
    value,
    onChange,
    label = 'Languages Spoken',
    required = false,
}: LanguageSelectProps) {
    const [otherLanguage, setOtherLanguage] = useState('');

    const toggleLanguage = (language: string) => {
        if (value.includes(language)) {
            onChange(value.filter((l) => l !== language));
        } else {
            onChange([...value, language]);
        }
    };

    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOther = e.target.value;
        setOtherLanguage(newOther);

        // Remove any previous "Other: ..." entry and add new one if not empty
        const filtered = value.filter((l) => !l.startsWith('Other:'));
        if (newOther.trim()) {
            onChange([...filtered, `Other: ${newOther.trim()}`]);
        } else {
            onChange(filtered);
        }
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.languageGrid}>
                {LANGUAGES.map((language) => (
                    <label key={language} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={value.includes(language) || (language === 'Other' && value.some(l => l.startsWith('Other:')))}
                            onChange={() => toggleLanguage(language)}
                        />
                        <span>{language}</span>
                    </label>
                ))}
            </div>
            {(value.includes('Other') || value.some(l => l.startsWith('Other:'))) && (
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Please specify other language(s)"
                    value={otherLanguage}
                    onChange={handleOtherChange}
                    style={{ marginTop: '8px' }}
                />
            )}
        </div>
    );
}
