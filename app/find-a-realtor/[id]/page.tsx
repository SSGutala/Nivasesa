import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import styles from './profile.module.css';
import { User, ShieldCheck, Heart, MessageCircle, Star, CheckCircle2 } from 'lucide-react';
import ContactAgentForm from '@/components/ContactAgentForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: PageProps) {
    const { id } = await params;

    const agent = await prisma.realtorProfile.findUnique({
        where: { id },
        include: {
            user: true,
        },
    });

    if (!agent || !agent.isVerified) {
        notFound();
    }

    const realtor = agent as any;
    const name = realtor.user?.name || 'Community Member';

    return (
        <div className={styles.container}>
            {/* LEFT COLUMN: LISTING INFO */}
            <div className={styles.leftCol}>
                <div className={styles.mainInfoSection}>
                    <div className={styles.agentPhotoContainer}>
                        {realtor.user?.image ? (
                            <img src={realtor.user.image} alt={name} className={styles.agentPhoto} />
                        ) : (
                            <div className={styles.agentPhoto} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-subtle)' }}>
                                <User size={80} color="var(--color-text-light)" />
                            </div>
                        )}
                    </div>

                    <div className={styles.detailsArea}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span className={styles.activeBadge}>Active Listing</span>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Posted 2 days ago</span>
                        </div>
                        <h1 className={styles.name}>{realtor.cities.split(',')[0]} Home Stay</h1>

                        <div className={styles.metadata}>
                            <strong>Host:</strong> {name}
                        </div>

                        <div className={styles.areaTags}>
                            {realtor.cities.split(',').map((city: string) => (
                                <span key={city} className={styles.areaTag}>{city.trim()} Specialist</span>
                            ))}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <span className={styles.sectionLabel}>The Space</span>
                            <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>
                                Single Room • Shared Bath • $800/mo
                            </p>
                        </div>

                        <div className={styles.specialtiesSection}>
                            <span className={styles.sectionLabel}>Preferences:</span>
                            <div className={styles.specialtiesList}>
                                {['Vegetarian', 'Non-Smoker', 'Female Preferred', 'Student Friendly'].map((spec) => (
                                    <span key={spec} className={styles.specialtyTag}>{spec}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <h2>About the Space</h2>
                    <div className={styles.bioText}>
                        {realtor.bio || `Welcome to a peaceful home in ${realtor.cities}. We are looking for a responsible roommate who values cleanliness and quiet environments. This space is perfect for students or young professionals looking for a safe and community-focused living arrangement.`}
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <h2>Household Expectations</h2>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                        {[
                            'Quiet hours after 10 PM',
                            'No overnight guests without prior notice',
                            'Shared cleaning schedule for common areas',
                            'Respectful use of shared kitchen and laundry'
                        ].map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                                <CheckCircle2 size={18} color="var(--color-primary)" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.resultsSection}>
                    <h2 className={styles.resultsHeader}>Community Trust</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>Verified</span>
                            <span className={styles.statLabel}>Identity Status</span>
                        </div>
                        <div className={styles.statItem}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Star size={24} fill="var(--color-primary)" color="var(--color-primary)" />
                                <span className={styles.statValue}>4.9</span>
                            </div>
                            <span className={styles.statLabel}>Member Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: EXPRESS INTEREST */}
            <div className={styles.rightCol}>
                <div className={styles.contactCard}>
                    <h2 className={styles.contactHeader}>Express Interest</h2>
                    <span className={styles.contactName}>Starting a conversation with {name}</span>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        Your contact info won't be shared until you both agree to a virtual meet.
                    </p>
                    <ContactAgentForm agentId={realtor.id} agentName={name} />
                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px' }}>
                        <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '12px', margin: 0, color: 'var(--color-text-muted)' }}>
                            <strong>Nivaesa Safety Tip:</strong> Never send money before a virtual meet and greet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
