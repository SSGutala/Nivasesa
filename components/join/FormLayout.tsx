'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './FormLayout.module.css';
import StepIndicator from './StepIndicator';

interface FormLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    steps: { id: number; label: string }[];
    currentStep: number;
    onStepClick: (stepId: number) => void;
    completedSteps: number[];
    onBack?: () => void;
    returnUrl?: string | null;
}

export default function FormLayout({
    children,
    title,
    subtitle,
    steps,
    currentStep,
    onStepClick,
    completedSteps,
    onBack,
    returnUrl,
}: FormLayoutProps) {
    const backLinkText = returnUrl ? 'Back to Listings' : 'Back to Home';
    const backLinkHref = returnUrl || '/';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.navigation}>
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className={styles.backButton}
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    ) : (
                        <div className={styles.backButtonPlaceholder} />
                    )}
                    <StepIndicator
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={onStepClick}
                        completedSteps={completedSteps}
                    />
                </div>

                <div className={styles.contentWrapper}>
                    {(title || subtitle) && (
                        <div className={styles.header}>
                            {title && <h1 className={styles.title}>{title}</h1>}
                            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                        </div>
                    )}

                    <div className={styles.formContent}>
                        {children}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href={backLinkHref} className={styles.homeLink}>
                        {backLinkText}
                    </Link>
                </div>
            </div>
        </div>
    );
}
