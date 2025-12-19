import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import styles from './profile.module.css';
import { User, Hash, Briefcase, Star } from 'lucide-react';
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
    const name = realtor.user?.name || 'Real Estate Professional';

    return (
        <div className={styles.container}>
            {/* LEFT COLUMN: AGENT INFO */}
            <div className={styles.leftCol}>
                <div className={styles.mainInfoSection}>
                    <div className={styles.agentPhotoContainer}>
                        {realtor.user?.image ? (
                            <img src={realtor.user.image} alt={name} className={styles.agentPhoto} />
                        ) : (
                            <div className={styles.agentPhoto}>
                                <User size={80} />
                            </div>
                        )}
                    </div>

                    <div className={styles.detailsArea}>
                        <h1 className={styles.name}>{name}</h1>
                        <div className={styles.metadata}>
                            <span><strong>License #:</strong> {realtor.licenseNumber || "21384848"}</span>
                            <span><strong>Issued by:</strong> {realtor.states.split(',')[0] || "VA"}</span>
                        </div>

                        <span className={styles.sectionLabel}>Service Area(s):</span>
                        <div className={styles.areaTags}>
                            {realtor.cities.split(',').map((city: string) => (
                                <span key={city} className={styles.areaTag}>{city.trim()}, {realtor.states.split(',')[0]}</span>
                            ))}
                        </div>

                        <span className={styles.brokerageLabel}>{realtor.brokerage}</span>

                        <div className={styles.priceRangeSection}>
                            <span className={styles.sectionLabel}>Home Price Range:</span>
                            <div className={styles.priceDisplay}>
                                <span className={styles.priceValue}>$300K</span>
                                <span className={styles.priceTo}>to</span>
                                <span className={styles.priceValue}>$1M+</span>
                            </div>
                        </div>

                        <div className={styles.specialtiesSection}>
                            <span className={styles.sectionLabel}>Specialties:</span>
                            <div className={styles.specialtiesList}>
                                {(realtor.buyerTypes || "Buyer's Agent, Listing Agent, Relocation").split(',').map((spec: string) => (
                                    <span key={spec} className={styles.specialtyTag}>{spec.trim()}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <div className={styles.bioText}>
                        {realtor.bio || `${name} is a dedicated real estate professional serving the ${realtor.cities} area. With ${realtor.experienceYears} years of experience, they specialize in helping families navigate the complexities of the local market with transparency and care.`}
                    </div>
                </div>

                <div className={styles.resultsSection}>
                    <h2 className={styles.resultsHeader}>Real results from real customers</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>Total reviews</span>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.ratingRow}>
                                <Star size={18} fill="#111827" />
                                <span>0 Average rating</span>
                            </div>
                        </div>
                        <button className={styles.writeReviewBtn}>Write review</button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className={styles.rightCol}>
                <div className={styles.contactCard}>
                    <h2 className={styles.contactHeader}>Connect with</h2>
                    <span className={styles.contactName}>{name}</span>
                    <ContactAgentForm agentId={realtor.id} agentName={name} />
                </div>
            </div>
        </div>
    );
}
