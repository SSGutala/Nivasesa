'use client';

import { useState } from 'react';
import { doLogin, checkTwoFactorRequired, verifyTwoFactorCode, doLoginWith2FA } from './actions';
import styles from '../find-realtor/form.module.css';
import { useActionState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';

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

                    <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                color: '#1f2937',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'background-color 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd">
                                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                                </g>
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            type="button"
                            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: '#24292e',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1b1f23';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#24292e';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

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
            </div>
        </div>
    );
}
