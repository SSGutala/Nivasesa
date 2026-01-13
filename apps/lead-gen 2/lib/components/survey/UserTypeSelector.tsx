'use client';

import { SurveyUserType } from '../../../actions/survey';
import styles from './survey.module.css';

interface UserType {
    id: SurveyUserType;
    title: string;
    description: string;
    icon: string;
}

const userTypes: UserType[] = [
    {
        id: 'buyer',
        title: 'Home Buyer',
        description: 'Find a realtor to help you buy your next home',
        icon: '🏠',
    },
    {
        id: 'seller',
        title: 'Home Seller',
        description: 'Connect with agents to sell your property',
        icon: '💰',
    },
    {
        id: 'agent',
        title: 'Real Estate Agent',
        description: 'Join our network and get leads from the South Asian community',
        icon: '🤝',
    },
];

interface UserTypeSelectorProps {
    onSelect: (type: SurveyUserType) => void;
    selected?: SurveyUserType;
}

export default function UserTypeSelector({ onSelect, selected }: UserTypeSelectorProps) {
    return (
        <div className={styles.userTypeGrid}>
            {userTypes.map((type) => (
                <button
                    key={type.id}
                    type="button"
                    className={`${styles.userTypeCard} ${selected === type.id ? styles.selected : ''}`}
                    onClick={() => onSelect(type.id)}
                >
                    <span className={styles.userTypeIcon}>{type.icon}</span>
                    <h3 className={styles.userTypeTitle}>{type.title}</h3>
                    <p className={styles.userTypeDescription}>{type.description}</p>
                </button>
            ))}
        </div>
    );
}
