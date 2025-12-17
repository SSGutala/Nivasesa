'use client';

import { doLogin } from './actions';
import styles from '../find-realtor/form.module.css'; // Reusing form styles
import { useActionState } from 'react';

// We'll define doLogin server action in a separate file or inline? 
// For cleaner architecture, let's put it in app/login/actions.ts
// But for now, I'll assume we can import it. I'll create it next.

const initialState = {
    message: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(doLogin, initialState);

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your dashboard</p>
                </div>

                <form action={formAction} className={styles.form}>
                    {state?.message && (
                        <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{state.message}</div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="realtor@example.com" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="unnecessary-for-demo" />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isPending} style={{ width: '100%' }}>
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className={styles.disclaimer}>
                        Demo: Use <b>raj.patel@example.com</b> and any password.
                    </p>
                </form>
            </div>
        </div>
    );
}
