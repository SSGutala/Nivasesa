'use client';

import { useState, useEffect } from 'react';
import { Ban, UserMinus, UserPlus } from 'lucide-react';
import { blockUserAction, unblockUserAction, isUserBlockedAction } from '@/actions/moderation';
import styles from './BlockButton.module.css';

interface BlockButtonProps {
  userId: string;
  userName?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
  onBlockStatusChange?: (isBlocked: boolean) => void;
}

export default function BlockButton({
  userId,
  userName,
  variant = 'secondary',
  size = 'medium',
  onBlockStatusChange,
}: BlockButtonProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBlockStatus();
  }, [userId]);

  const checkBlockStatus = async () => {
    setIsLoading(true);
    try {
      const result = await isUserBlockedAction(userId);
      if (result.success && result.data) {
        setIsBlocked(result.data.blockedByMe);
      }
    } catch (err) {
      console.error('Error checking block status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await blockUserAction(userId);
      if (result.success) {
        setIsBlocked(true);
        setShowConfirm(false);
        onBlockStatusChange?.(true);
      } else {
        setError(result.error || 'Failed to block user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error blocking user:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnblock = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await unblockUserAction(userId);
      if (result.success) {
        setIsBlocked(false);
        onBlockStatusChange?.(false);
      } else {
        setError(result.error || 'Failed to unblock user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error unblocking user:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => (isBlocked ? handleUnblock() : setShowConfirm(true))}
          className={`${styles.iconButton} ${styles[size]} ${isBlocked ? styles.blocked : ''}`}
          disabled={isUpdating}
          title={isBlocked ? 'Unblock user' : 'Block user'}
        >
          {isBlocked ? <UserPlus /> : <Ban />}
        </button>

        {showConfirm && (
          <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
            <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.confirmIcon}>
                <Ban />
              </div>
              <h3 className={styles.confirmTitle}>Block {userName || 'this user'}?</h3>
              <p className={styles.confirmText}>
                They will no longer be able to message you or see your profile.
              </p>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.confirmActions}>
                <button
                  onClick={() => setShowConfirm(false)}
                  className={styles.confirmCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlock}
                  className={styles.confirmBlock}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Blocking...' : 'Block User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => (isBlocked ? handleUnblock() : setShowConfirm(true))}
        className={`${styles.button} ${styles[variant]} ${styles[size]}`}
        disabled={isUpdating}
      >
        {isBlocked ? (
          <>
            <UserPlus className={styles.buttonIcon} />
            Unblock
          </>
        ) : (
          <>
            <Ban className={styles.buttonIcon} />
            Block
          </>
        )}
      </button>

      {showConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <Ban />
            </div>
            <h3 className={styles.confirmTitle}>Block {userName || 'this user'}?</h3>
            <p className={styles.confirmText}>
              They will no longer be able to message you or see your profile.
            </p>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowConfirm(false)}
                className={styles.confirmCancel}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className={styles.confirmBlock}
                disabled={isUpdating}
              >
                {isUpdating ? 'Blocking...' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
