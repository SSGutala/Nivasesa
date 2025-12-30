import Link from 'next/link';
import styles from './page.module.css';

export default function ThankYouPage() {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>&#x2714;&#xFE0F;</div>
                <h1 className={styles.title}>You're on the Waitlist!</h1>
                <p className={styles.subtitle}>
                    Thank you for your interest in Nivasesa. We're building something special for the
                    South Asian community, and we're excited to have you join us.
                </p>

                <div className={styles.nextSteps}>
                    <h2 className={styles.nextStepsTitle}>What Happens Next?</h2>
                    <ul className={styles.stepsList}>
                        <li>
                            <span className={styles.stepNumber}>1</span>
                            <div>
                                <strong>We'll review your submission</strong>
                                <p>Our team will look at your responses to understand your needs better.</p>
                            </div>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>2</span>
                            <div>
                                <strong>We may reach out for a quick call</strong>
                                <p>A 15-minute chat helps us build features that truly serve you.</p>
                            </div>
                        </li>
                        <li>
                            <span className={styles.stepNumber}>3</span>
                            <div>
                                <strong>Get early access when we launch</strong>
                                <p>Waitlist members get first access to the platform.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className={styles.share}>
                    <p>Know someone who would benefit from Nivasesa?</p>
                    <div className={styles.shareButtons}>
                        <a
                            href="https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20waitlist%20for%20Nivasesa%20-%20a%20housing%20platform%20for%20the%20South%20Asian%20community!&url=https://nivasesa.com/survey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.shareButton}
                        >
                            Share on Twitter
                        </a>
                        <a
                            href="https://www.facebook.com/sharer/sharer.php?u=https://nivasesa.com/survey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.shareButton}
                        >
                            Share on Facebook
                        </a>
                    </div>
                </div>

                <Link href="/" className={styles.homeLink}>
                    &#x2190; Back to Home
                </Link>
            </div>
        </main>
    );
}
