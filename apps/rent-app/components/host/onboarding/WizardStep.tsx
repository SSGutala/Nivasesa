'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WizardStepProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    variant?: 'split' | 'center';
    sideImage?: string; // Only used for 'split'
}

export function WizardStep({ title, description, children, variant = 'center', sideImage }: WizardStepProps) {

    // -- SPLIT LAYOUT (Airbnb Intro Style) --
    if (variant === 'split') {
        return (
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-160px)]">
                {/* Left Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-lg"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                                {description}
                            </p>
                        )}
                        <div className="w-full">
                            {children}
                        </div>
                    </motion.div>
                </div>

                {/* Right Image/Gradient */}
                <div className="w-full lg:w-1/2 bg-gray-50 relative hidden lg:block">
                    {sideImage ? (
                        <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl">
                            <img src={sideImage} alt="Step preview" className="object-cover w-full h-full" />
                        </div>
                    ) : (
                        <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white/20 text-9xl font-bold select-none overflow-hidden">
                            NIVAESA
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // -- CENTERED LAYOUT (Airbnb Form Style) --
    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center px-4 md:px-8 py-12 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl w-full"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
