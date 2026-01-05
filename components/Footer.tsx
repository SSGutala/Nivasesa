'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/onboarding') || pathname.startsWith('/host') || pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            N I V A E S A
                        </Link>
                        <p className={styles.tagline}>
                            Finding homes built on understanding.
                        </p>
                    </div>

                    <div className={styles.linksCol}>
                        <div className={styles.linkGroup}>
                            <h4>Company</h4>
                            <Link href="/about" className={styles.link}>Our Story</Link>
                            <Link href="#" className={styles.link}>Careers</Link>
                            <Link href="#" className={styles.link}>Press</Link>
                        </div>
                        <div className={styles.linkGroup}>
                            <h4>Service</h4>
                            <Link href="/find-a-realtor" className={styles.link}>Find a Realtor</Link>
                            <Link href="/join-the-network" className={styles.link}>Join as Partner</Link>
                            <Link href="/join-the-network" className={styles.link}>Become an agent</Link>
                        </div>
                        <div className={styles.linkGroup}>
                            <h4>Support</h4>
                            <Link href="#" className={styles.link}>Privacy Policy</Link>
                            <Link href="#" className={styles.link}>Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottomSection}>
                    <div>&copy; {new Date().getFullYear()} Nivaesa Inc. All rights reserved.</div>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
                        <a href="#" className={styles.socialLink}><Facebook size={20} /></a>
                        <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
                        <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
