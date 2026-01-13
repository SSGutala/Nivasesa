import styles from './Skeleton.module.css';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
}

export default function Skeleton({ className, width, height, borderRadius }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className || ''}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius || '4px'
            }}
        />
    );
}
