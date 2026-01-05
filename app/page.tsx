import Link from 'next/link';

import styles from './page.module.css';
import { ArrowRight, Video, CheckCircle, ChevronDown } from 'lucide-react';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Belong with your community,<br />feel at home.
          </h1>
          <p className={styles.subtitle}>
            The most trusted way to find your next space and roommates.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/explore" className={styles.primaryBtn}>
              Find a Place to Belong <ArrowRight size={20} className={styles.btnIcon} />
            </Link>
            <Link href="/onboarding/host" className={styles.outlineBtn}>
              Offer a Place to Stay
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1: VALUES-DRIVEN HOMES (EDITORIAL STYLE) */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.manifestoHeader}>
            <h2 className={styles.manifestoTitle}>Homes built on shared values, not guesswork.</h2>
            <p className={styles.manifestoSubheading}>In many households, comfort is shaped by more than square footage. Food traditions, language, routines, and expectations define whether a place truly feels like home. Nivaesa brings those details forward — before any conversation begins.</p>
          </div>

          <div className={styles.editorialStack}>
            <div className={styles.editorialBlock}>
              <h3 className={styles.editorialBlockTitle}>Cooking follows shared traditions.</h3>
              <p className={styles.editorialBlockBody}>Some kitchens are strictly vegetarian. Others avoid certain foods entirely. These aren’t preferences — they’re part of how the home operates.</p>
            </div>

            <div className={styles.editorialBlock}>
              <h3 className={styles.editorialBlockTitle}>Language creates ease.</h3>
              <p className={styles.editorialBlockBody}>Homes where Gujarati, Tamil, Telugu, or Hindi are spoken often feel more natural when communication flows effortlessly.</p>
            </div>

            <div className={styles.editorialBlock}>
              <h3 className={styles.editorialBlockTitle}>Daily rhythms matter.</h3>
              <p className={styles.editorialBlockBody}>Quiet weekdays, early mornings, prayer times, or family dinners aren’t rules — they’re patterns worth respecting.</p>
            </div>

            <div className={styles.editorialBlock}>
              <h3 className={styles.editorialBlockTitle}>Family presence is part of the environment.</h3>
              <p className={styles.editorialBlockBody}>In many homes, parents, relatives, and guests are part of everyday life. That context is made clear upfront.</p>
            </div>

            <div className={styles.editorialBlock}>
              <h3 className={styles.editorialBlockTitle}>Professional lifestyles shape the household.</h3>
              <p className={styles.editorialBlockBody}>Some homes are built around work schedules, shared focus, and calm evenings — and that alignment matters.</p>
            </div>

            <p style={{ fontSize: '14px', color: '#999', marginTop: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              These details aren’t restrictions. They’re clarity.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTENTIONAL MATCHING (NOT A MARKETPLACE) */}
      <section className={styles.matchingSection}>
        <div className="container">
          <div className={styles.matchingLayout}>
            <div className={styles.matchingTextContent}>
              <h2 className={styles.sectionTitle}>Matching comes before messaging.</h2>
              <p>Hosts describe how the home actually functions — daily routines, food norms, guest expectations, and shared spaces.</p>
              <p>Guests share who they are, why they’re moving, and how they live — not just budget and dates.</p>
              <p>Conversation only opens when there’s real alignment, reducing awkwardness and wasted time.</p>
            </div>

            <div className={styles.matchingVisual}>
              <div className={styles.intersectionGlow} />
              <div className={`${styles.abstractCard} ${styles.abstractCard1}`} />
              <div className={`${styles.abstractCard} ${styles.abstractCard2}`} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MEET FIRST, DECIDE CALMLY */}
      <section className={styles.meetSection}>
        <div className={styles.meetContainer}>
          <h2 className={styles.sectionTitle}>Meet first. Decide calmly.</h2>
          <p className={styles.meetSubtext}>In many cultures, comfort comes from conversation. Nivaesa encourages a short virtual meet so everyone can ask questions, understand expectations, and move forward with clarity.</p>

          <span className={styles.meetCallout}>Video conversations are part of the vetting process — not an afterthought.</span>

          <div className={styles.videoVisual}>
            <div className={styles.videoVisualImg} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <Video size={64} color="white" strokeWidth={1} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BUILT WITH FAMILIES IN MIND */}
      <section className={styles.familySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 style={{ color: 'white' }}>Built with families in mind — even when they’re not on the call.</h2>
          </div>
          <div className={styles.principlesGrid}>
            {[
              'Clear household expectations upfront',
              'Transparent daily routines and norms',
              'Fewer surprises after move-in',
              'Easier conversations with parents and guardians'
            ].map((item, i) => (
              <div key={i} className={styles.principleBlock}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FAMILIARITY AS A FEELING */}
      <section className={styles.familiarSection}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ marginBottom: '60px' }}>A home should feel familiar.</h2>
          <div>
            <span className={styles.poeticLine}>Cooking shouldn’t feel awkward.</span>
            <span className={styles.poeticLine}>Language shouldn’t feel isolating.</span>
            <span className={styles.poeticLine} style={{ color: '#1a1a1a' }}>Daily routines shouldn’t clash.</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ (REFINED) */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqContainer}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Who is Nivaesa for? <ChevronDown size={20} color="#888" />
              </summary>
              <div className={styles.faqAnswer}>
                Nivaesa is for anyone who values compatibility and shared lifestyle norms in their living situation. While we are built with the specific needs of South Asian communities in mind, the platform is open to everyone who seeks a more transparent and communicative housing search.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Do I need an account to browse homes? <ChevronDown size={20} color="#888" />
              </summary>
              <div className={styles.faqAnswer}>
                No. You can browse all listings and see household norms without an account. You only need to sign up when you’re ready to express interest or contact a host.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Why is a video conversation encouraged? <ChevronDown size={20} color="#888" />
              </summary>
              <div className={styles.faqAnswer}>
                We believe that trust is built through connection. A short video call allows both parties to gauge comfort and vibe in a way that text messages simply cannot.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Can I filter homes by food and language? <ChevronDown size={20} color="#888" />
              </summary>
              <div className={styles.faqAnswer}>
                Yes. Our filters allow you to search based on dietary practices (e.g., Vegetarian kitchen) and languages spoken in the home, ensuring you find a space where you feel comfortable.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Is Nivaesa only for South Asians? <ChevronDown size={20} color="#888" />
              </summary>
              <div className={styles.faqAnswer}>
                Not at all. While we solve specific pain points common in South Asian cultural contexts, our features—like lifestyle matching and clear household norms—benefit anyone looking for a harmonious living environment.
              </div>
            </details>

          </div>
        </div>
      </section>

    </main>
  );
}
