'use client';

import { useState } from 'react';
import { doLogin, checkTwoFactorRequired, verifyTwoFactorCode, doLoginWith2FA, doGoogleLogin } from './actions';
import styles from '../find-realtor/form.module.css';
import { useActionState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const initialState = {
    message: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(doLogin, initialState);
    const [show2FA, setShow2FA] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setChecking(true);

        // Check if 2FA is required
        const result = await checkTwoFactorRequired(email);

        if (!result.exists) {
            setError('User not found in database.');
            setChecking(false);
            return;
        }

        if (result.requires2FA) {
            // Show 2FA step
            setShow2FA(true);
            setChecking(false);
        } else {
            // No 2FA, proceed with normal login via form
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formAction(formData);
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setVerifying(true);

        // Verify the 2FA code
        const verifyResult = await verifyTwoFactorCode(email, twoFactorCode);

        if (!verifyResult.success) {
            setError(verifyResult.error || 'Invalid code');
            setVerifying(false);
            return;
        }

        // 2FA verified, complete login
        await doLoginWith2FA(email, password);
        setVerifying(false);
    };

    if (show2FA) {
        return (
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={32} style={{ color: '#6b7280' }} />
                            </div>
                        </div>
                        <h1>Two-Factor Authentication</h1>
                        <p>Enter the 6-digit code from your authenticator app</p>
                    </div>

                    <form onSubmit={handle2FASubmit} className={styles.form}>
                        {error && (
                            <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>
                        )}

                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                value={twoFactorCode}
                                onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    letterSpacing: '12px',
                                    fontFamily: 'monospace',
                                    padding: '16px'
                                }}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={verifying || twoFactorCode.length !== 6}
                            style={{ width: '100%', opacity: twoFactorCode.length !== 6 ? 0.5 : 1 }}
                        >
                            {verifying ? 'Verifying...' : 'Verify & Sign In'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShow2FA(false);
                                setTwoFactorCode('');
                                setError('');
                            }}
                            style={{
                                marginTop: '16px',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Back to login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className={styles.form}>
                    {(state?.message || error) && (
                        <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{state?.message || error}</div>
                    )}

                    <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <button
                            type="button"
                            onClick={() => doGoogleLogin()}
                            className="btn"
                            style={{
                                width: '100%',
                                backgroundColor: '#fff',
                                color: '#333',
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                fontWeight: 500
                            }}
                        >
                            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#888' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                        <span style={{ padding: '0 10px', fontSize: '14px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="realtor@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="unnecessary-for-demo"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <Link href="/forgot-password" style={{ fontSize: '14px', color: '#007bff', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isPending || checking} style={{ width: '100%' }}>
                        {isPending || checking ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className={styles.disclaimer} style={{ textAlign: 'left' }}>
                        <p style={{ marginBottom: '8px', fontWeight: 500 }}>Demo Credentials (any password):</p>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                            <li><code>raj.patel@example.com</code> — Realtor (Frisco, TX)</li>
                            <li><code>priya.sharma@example.com</code> — Realtor (Dallas, TX)</li>
                            <li><code>suresh.reddy@example.com</code> — Realtor (Irving, TX)</li>
                            <li><code>anita.desai@example.com</code> — Realtor (Jersey City, NJ)</li>
                        </ul>
                    </div>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    New to Nivaesa?
                    <Link href="/join" style={{ marginLeft: '6px', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign up!
                    </Link>
                </div>
            </div>
        </div>
    );
}
