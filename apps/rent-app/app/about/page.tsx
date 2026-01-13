import styles from './page.module.css';

export default function AboutPage() {
    // Placeholder images - using Unsplash source for realism without external hosting issues
    const imgFamily = "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2670&auto=format&fit=crop"; // Warm group/family
    const imgKeys = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"; // House keys/door
    const imgConversation = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2574&auto=format&fit=crop"; // People talking/trust

    return (
        <main className={styles.container}>
            <h1 className={styles.heroHeading}>Our Story</h1>

            {/* Intro Section with Image */}
            <div className={styles.introSection}>
                <div className={styles.introTextContainer}>
                    <p className={styles.leadText}>
                        Home should feel familiar —<br />
                        even when you’re far from home.
                    </p>
                    <div className={styles.content}>
                        <p>
                            Buying a home in the United States is a major milestone.
                            For many South Asian families, it’s also deeply personal.
                        </p>
                        <p>
                            It’s not just about square footage or price — it’s about trust, communication,
                            family priorities, and feeling understood throughout the process.
                        </p>
                        <p style={{ fontWeight: 600, fontStyle: 'italic' }}>
                            That’s where Nivaesa comes in.
                        </p>
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <img src={imgFamily} alt="Family gathering" className={styles.img} />
                </div>
            </div>

            <div className={styles.divider}></div>

            {/* Why We Exist - Full Width Text Center */}
            <section className={styles.section} style={{ maxWidth: '800px', margin: '0 auto 120px' }}>
                <h2 className={styles.sectionHeading}>Why Nivaesa Exists</h2>
                <div className={styles.content} style={{ textAlign: 'center' }}>
                    <p>We noticed a simple truth:</p>
                    <p style={{ fontSize: '24px', lineHeight: '1.5', fontFamily: 'var(--font-serif)', fontStyle: 'italic', margin: '40px 0' }}>
                        "Many South Asian home buyers in the U.S. prefer working with realtors who understand
                        their cultural context."
                    </p>
                    <p>
                        Shared languages, family dynamics, financial considerations,
                        and communication styles matter. Yet finding the right fit is often harder than it should be.
                        Most people rely on word of mouth, community groups, or informal referrals.
                    </p>
                    <p>
                        The result is inconsistency, guesswork, and missed connections.
                        Nivaesa was created to make this process clearer, calmer, and more reliable.
                    </p>
                </div>
            </section>

            {/* What We Do - Grid with Image */}
            <section className={`${styles.section} ${styles.gridContent} ${styles.reverse}`}>
                <div className={styles.imageCol}>
                    <div className={styles.imageContainer} style={{ height: '600px' }}>
                        <img src={imgConversation} alt="Thoughtful conversation" className={styles.img} />
                    </div>
                </div>
                <div className={styles.textCol}>
                    <h2 className={styles.sectionHeading} style={{ justifyContent: 'flex-start' }}>What We Do</h2>
                    <div className={styles.content}>
                        <p>
                            Nivaesa is a real estate referral marketplace designed to help South Asian home buyers
                            find trusted, licensed realtors who understand their needs.
                        </p>
                        <p><strong>We help buyers:</strong></p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Find realtors by city, language, and experience</li>
                            <li className={styles.listItem}>Make informed connections without pressure</li>
                            <li className={styles.listItem}>Navigate the process with greater confidence</li>
                        </ul>
                        <p><strong>We help realtors:</strong></p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Connect with serious, culturally aligned buyers</li>
                            <li className={styles.listItem}>Focus on relationships, not cold outreach</li>
                            <li className={styles.listItem}>Grow their practice through trust and transparency</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.footerQuote}>
                    <h2 className={styles.sectionHeading}>Our Promise</h2>
                    <p className={styles.quoteText}>
                        "Finding a home is more than a transaction. It’s the beginning of something lasting."
                    </p>
                    <div className={styles.content}>
                        <p>
                            Today, Nivaesa focuses on helping South Asian home buyers and realtors connect more meaningfully.
                            Over time, we aim to thoughtfully expand into services that support the broader homeownership
                            journey — always guided by the same principles: clarity, trust, and integrity.
                        </p>
                    </div>
                    <span className={styles.logoEnd}>N / I / V / A / E / S / A</span>
                </div>
            </section>

        </main>
    );
}
