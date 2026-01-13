'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { ArrowRight, ChevronDown, Home, Users, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function AlphaLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: 'Is this only for South Asians?',
      answer: 'No. While Nivaesa is built with South Asian communities in mind, it is open to everyone who values compatibility, clarity, and consent-based connections.'
    },
    {
      question: 'Is it free?',
      answer: 'Yes, joining and creating your profile is free. We may introduce optional premium features in the future to help boost visibility.'
    },
    {
      question: 'What cities are supported?',
      answer: 'We are launching across Texas, New Jersey, and California, with plans to expand to more cities based on demand.'
    },
    {
      question: 'Is this for short-term or long-term stays?',
      answer: 'Both! Nivaesa supports temporary stays (1-4 weeks), short-term rentals (1-3 months), and long-term housing (6+ months).'
    }
  ];

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find rooms and roommates with shared expectations.
          </h1>
          <p className={styles.heroSubtitle}>
            A trust-first housing platform designed around compatibility, clarity, and consent — built for South Asian communities and open to everyone.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/survey" className={styles.primaryBtn}>
              Join Network <ArrowRight size={20} className={styles.btnIcon} />
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={styles.secondaryBtn}
            >
              Learn How It Works
            </button>
          </div>
        </div>

        <button
          onClick={() => scrollToSection('what-this-is')}
          className={styles.scrollIndicator}
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* What This Is Section */}
      <section id="what-this-is" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What This Is</h2>
            <p>A structured, consent-based platform designed to replace unsafe informal groups.</p>
          </div>

          <div className={styles.threeColumnGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <Home size={32} />
              </div>
              <h3>Find Rooms and Shared Rentals</h3>
              <p>Browse listings for temporary or long-term stays. Filter by location, timing, and household preferences.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <Users size={32} />
              </div>
              <h3>Discover Compatible Roommates</h3>
              <p>Match based on lifestyle, language, and household norms. No more guessing about compatibility.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <Shield size={32} />
              </div>
              <h3>Connect with Consent</h3>
              <p>Express interest without sharing contact information. Connect only when both sides accept.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className={styles.sectionSubtle}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Who It&apos;s For</h2>
            <p>Whether you&apos;re searching for a place or offering one, Nivaesa is built for you.</p>
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.userTypeCard}>
              <h3>Tenants / Roommates</h3>
              <p className={styles.cardDescription}>
                Looking for a room, shared space, or roommate. Temporary stays, internships, or long-term housing. Want compatibility and safety.
              </p>
              <ul className={styles.benefitsList}>
                <li><CheckCircle size={18} /> Find housing that fits your lifestyle</li>
                <li><CheckCircle size={18} /> Filter by language and culture</li>
                <li><CheckCircle size={18} /> No random messages or spam</li>
              </ul>
              <Link href="/survey?type=tenant" className={styles.cardBtn}>
                Join as a Tenant / Roommate
              </Link>
            </div>

            <div className={styles.userTypeCard}>
              <h3>Hosts / Landlords</h3>
              <p className={styles.cardDescription}>
                Have a room or shared living space. Want better-fit tenants. Prefer structured, respectful inquiries.
              </p>
              <ul className={styles.benefitsList}>
                <li><CheckCircle size={18} /> Attract compatible tenants</li>
                <li><CheckCircle size={18} /> Set clear expectations up front</li>
                <li><CheckCircle size={18} /> Reduce mismatches and conflicts</li>
              </ul>
              <Link href="/survey?type=host" className={styles.cardBtn}>
                Join as Host
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>A simple, safe, three-step process to find your next home or roommate.</p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Browse and Filter</h3>
              <p>Search by location, timing, and preferences. View detailed profiles and household expectations.</p>
            </div>

            <div className={styles.stepArrow}>
              <ArrowRight size={32} />
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Express Interest</h3>
              <p>Like a listing or profile. No contact information is shared yet—your privacy is protected.</p>
            </div>

            <div className={styles.stepArrow}>
              <ArrowRight size={32} />
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Connect After Mutual Match</h3>
              <p>Once both sides accept, contact information is shared and you can start communicating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className={styles.sectionSubtle}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Safety & Trust</h2>
            <p>Built with your security and privacy in mind.</p>
          </div>

          <div className={styles.safetyGrid}>
            <div className={styles.safetyItem}>
              <CheckCircle size={24} className={styles.checkIcon} />
              <div>
                <h4>Consent-Based Connections</h4>
                <p>Contact information is only shared after both parties agree to connect.</p>
              </div>
            </div>

            <div className={styles.safetyItem}>
              <CheckCircle size={24} className={styles.checkIcon} />
              <div>
                <h4>Structured Profiles</h4>
                <p>No anonymous DMs. Everyone has a verified profile with clear expectations.</p>
              </div>
            </div>

            <div className={styles.safetyItem}>
              <CheckCircle size={24} className={styles.checkIcon} />
              <div>
                <h4>Clear Household Expectations</h4>
                <p>Know what to expect before you commit. Transparency from the start.</p>
              </div>
            </div>

            <div className={styles.safetyItem}>
              <CheckCircle size={24} className={styles.checkIcon} />
              <div>
                <h4>Replaces Unsafe Informal Groups</h4>
                <p>Say goodbye to unmoderated WhatsApp and Facebook groups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`${styles.faqIcon} ${openFaqIndex === index ? styles.faqIconOpen : ''}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Join early and help shape the platform.</h2>
            <p>Be part of the community from day one. Your feedback will help us build something better.</p>
            <Link href="/survey" className={styles.ctaBtn}>
              Join Network
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
