'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkUsernameAction, completeSetupAction } from '@/actions/onboarding';
import styles from './setup.module.css';
import { Check, X, Loader2, ShieldCheck, User } from 'lucide-react';

function OnboardingSetupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    // Asynchronous username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setIsAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            try {
                const res = await checkUsernameAction(username);
                setIsAvailable(res.available);
                setAvailabilityMessage(res.message || '');
            } catch (err) {
                console.error('Check failed:', err);
                setIsAvailable(false);
                setAvailabilityMessage('Service error');
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Missing email in URL. Please try again from the application link.');
            return;
        }

        if (!isAvailable) {
            setError(availabilityMessage || 'Please choose an available username.');
            return;
        }

        startTransition(async () => {
            const res = await completeSetupAction(email, username, password);
            if (res.success) {
                // Redirect to login or auto-login
                router.push('/login?onboarding=success');
            } else {
                setError(res.message || 'Failed to complete setup');
            }
        });
    };

    if (!email) {
        return (
            <div className={styles.container}>
                <div className={styles.errorCard}>
                    <h1>Invalid Session</h1>
                    <p>We couldn't find your application details. Please return to the join page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.setupCard}>
                <div className={styles.header}>
                    <ShieldCheck size={40} className={styles.icon} />
                    <h1>Complete Your Account</h1>
                    <p>Experience the future of real estate. Set your credentials to access your dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Choose a Username</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.fieldIcon} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                placeholder="luxury_agent_01"
                                required
                            />
                            <div className={styles.statusIcon}>
                                {isChecking && <Loader2 size={18} className={styles.spinner} />}
                                {!isChecking && isAvailable === true && <Check size={18} className={styles.available} />}
                                {!isChecking && isAvailable === false && <X size={18} className={styles.unavailable} />}
                            </div>
                        </div>
                        {isAvailable === false && <span className={styles.helperTextError}>{availabilityMessage || 'Username is already taken'}</span>}
                        {isAvailable === true && <span className={styles.helperTextSuccess}>{availabilityMessage || 'Username is available'}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Create a Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <button type="submit" className={styles.submitBtn} disabled={!isAvailable || isPending}>
                        {isPending ? 'Finalizing...' : 'Create Account & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function OnboardingSetup() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.setupCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <Loader2 size={32} className={styles.spinner} />
                </div>
            </div>
        }>
            <OnboardingSetupForm />
        </Suspense>
    );
}
