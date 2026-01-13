'use client';

import React from 'react';
import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
    steps: { id: number; label: string }[];
    currentStep: number;
    onStepClick: (stepId: number) => void;
    completedSteps: number[];
}

export default function StepIndicator({ steps, currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
    return (
        <div className={styles.stepperContainer}>
            {steps.map((step, index) => {
                const isCurrent = step.id === currentStep;
                const isCompleted = completedSteps.includes(step.id);
                const isLast = index === steps.length - 1;
                const isClickable = isCompleted || step.id <= currentStep;

                return (
                    <React.Fragment key={step.id}>
                        <div
                            className={`${styles.stepWrapper} ${isCurrent ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${isClickable ? styles.clickable : ''}`}
                            onClick={() => isClickable && onStepClick(step.id)}
                        >
                            <div className={styles.circle}>
                                {step.id}
                            </div>
                            <span className={styles.label}>{step.label}</span>
                        </div>
                        {!isLast && (
                            <div className={`${styles.line} ${isCompleted ? styles.lineCompleted : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
