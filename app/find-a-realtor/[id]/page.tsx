import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import styles from './profile.module.css';
import { User, MapPin, Globe, Award, Briefcase, Hash } from 'lucide-react';
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

    const realtor = agent as any; // Cast for now if Prisma types are lagging
    const name = realtor.user?.name || 'Real Estate Professional';

    return (
        <div className={styles.container}>
            {/* LEFT COLUMN: AGENT INFO */}
            <div className={styles.leftCol}>
                <header className={styles.header}>
                    <h1 className={styles.name}>{name}</h1>
                    <span className={styles.brokerage}>{realtor.brokerage}</span>
                </header>

                {/* MOCK PHOTO CONTAINER */}
                <div className={styles.agentPhoto}>
                    <User size={120} />
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <h4>License Number</h4>
                        <p><Hash size={14} style={{ display: 'inline', marginRight: '4px' }} /> {agent.licenseNumber} ({agent.states})</p>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Experience</h4>
                        <p><Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} /> {realtor.experienceYears} Years</p>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Price Range</h4>
                        <p>{realtor.priceRange || 'Contact for details'}</p>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Languages</h4>
                        <div className={styles.chips}>
                            {agent.languages.split(',').map((lang) => (
                                <span key={lang} className={styles.chip}>{lang.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Service Areas</h4>
                        <div className={styles.chips}>
                            {agent.cities.split(',').map((city) => (
                                <span key={city} className={styles.chip}>{city.trim()}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Specialties</h4>
                        <div className={styles.chips}>
                            {(agent.buyerTypes || 'Buyer Agent, Listing Agent').split(',').map((spec) => (
                                <span key={spec} className={styles.chip}>{spec.trim()}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.bioSection}>
                    <h3>About {name.split(' ')[0]}</h3>
                    <div className={styles.bioText}>
                        {realtor.bio || `${name} is a dedicated real estate professional serving the ${realtor.cities} area. With ${realtor.experienceYears} years of experience, they specialize in helping families navigate the complexities of the local market with transparency and care.`}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: STICKY CONTACT FORM */}
            <div className={styles.rightCol}>
                <div className={styles.stickyWrapper}>
                    <ContactAgentForm agentId={realtor.id} agentName={name} />
                </div>
            </div>
        </div>
    );
}
