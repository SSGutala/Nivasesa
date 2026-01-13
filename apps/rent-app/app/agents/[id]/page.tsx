import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe, Briefcase, CheckCircle, Building, Phone, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ContactAgentForm } from './ContactForm';
import styles from './profile.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAgent(id: string) {
  const profile = await prisma.realtorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });

  return profile;
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { id } = await params;
  const agent = await getAgent(id);

  if (!agent) {
    notFound();
  }

  const languages = agent.languages.split(',').map((l) => l.trim());
  const cities = agent.cities.split(',').map((c) => c.trim());
  const states = agent.states.split(',').map((s) => s.trim());
  const buyerTypes = agent.buyerTypes?.split(',').map((b) => b.trim()) || [];
  const propertyTypes = agent.propertyTypes?.split(',').map((p) => p.trim()) || [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/agents" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Agent Directory
        </Link>

        <div className={styles.content}>
          {/* Profile Section */}
          <div className={styles.profileSection}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.avatar}>
                {agent.user.image ? (
                  <img src={agent.user.image} alt={agent.user.name || 'Agent'} />
                ) : (
                  <span>{(agent.user.name || 'A').charAt(0)}</span>
                )}
              </div>
              <div className={styles.headerInfo}>
                <h1 className={styles.name}>
                  {agent.user.name}
                  {agent.isVerified && (
                    <span className={styles.verifiedBadge}>
                      <CheckCircle size={20} />
                      Verified
                    </span>
                  )}
                </h1>
                <p className={styles.brokerage}>
                  <Building size={18} />
                  {agent.brokerage}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <Briefcase size={20} />
                <div>
                  <span className={styles.statValue}>{agent.experienceYears}</span>
                  <span className={styles.statLabel}>Years Experience</span>
                </div>
              </div>
              <div className={styles.stat}>
                <MapPin size={20} />
                <div>
                  <span className={styles.statValue}>{cities.length}</span>
                  <span className={styles.statLabel}>Cities Served</span>
                </div>
              </div>
              <div className={styles.stat}>
                <Globe size={20} />
                <div>
                  <span className={styles.statValue}>{languages.length}</span>
                  <span className={styles.statLabel}>Languages</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {agent.bio && (
              <div className={styles.section}>
                <h2>About</h2>
                <p className={styles.bio}>{agent.bio}</p>
              </div>
            )}

            {/* Service Areas */}
            <div className={styles.section}>
              <h2>Service Areas</h2>
              <div className={styles.tagGroup}>
                <div className={styles.tagLabel}>States:</div>
                <div className={styles.tags}>
                  {states.map((state) => (
                    <span key={state} className={styles.tag}>
                      {state}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.tagGroup}>
                <div className={styles.tagLabel}>Cities:</div>
                <div className={styles.tags}>
                  {cities.map((city) => (
                    <span key={city} className={styles.tag}>
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className={styles.section}>
              <h2>Languages</h2>
              <div className={styles.tags}>
                {languages.map((lang) => (
                  <span key={lang} className={`${styles.tag} ${styles.languageTag}`}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            {(buyerTypes.length > 0 || propertyTypes.length > 0) && (
              <div className={styles.section}>
                <h2>Specializations</h2>
                {buyerTypes.length > 0 && (
                  <div className={styles.tagGroup}>
                    <div className={styles.tagLabel}>Buyer Types:</div>
                    <div className={styles.tags}>
                      {buyerTypes.map((type) => (
                        <span key={type} className={styles.tag}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {propertyTypes.length > 0 && (
                  <div className={styles.tagGroup}>
                    <div className={styles.tagLabel}>Property Types:</div>
                    <div className={styles.tags}>
                      {propertyTypes.map((type) => (
                        <span key={type} className={styles.tag}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Range */}
            {agent.priceRange && (
              <div className={styles.section}>
                <h2>Price Range</h2>
                <p className={styles.priceRange}>{agent.priceRange}</p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className={styles.contactSection}>
            <div className={styles.contactCard}>
              <h2>Contact {agent.user.name?.split(' ')[0] || 'Agent'}</h2>
              <p className={styles.contactSubtitle}>
                Send a message to express your interest. No commitment required.
              </p>
              <ContactAgentForm agentId={agent.id} agentName={agent.user.name || 'Agent'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
