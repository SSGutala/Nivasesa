'use client';

import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(key: string, initialState: T) {
    // Initialize state with value from localStorage if available, otherwise use initialState
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') return initialState;

        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialState;
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return initialState;
        }
    });

    // Update localStorage whenever state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error('Error writing to localStorage', error);
            }
        }
    }, [key, state]);

    return [state, setState] as const;
}
