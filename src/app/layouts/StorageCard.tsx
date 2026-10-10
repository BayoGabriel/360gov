import { useState } from 'react';
import styles from './DashboardSidebar.module.css';

interface StorageCardProps {
  usedPercent: number;
  onUpgrade: () => void;
}

export function StorageCard({ usedPercent, onUpgrade }: StorageCardProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <section className={styles.storageCard} aria-label="Used space">
      <p className={styles.storageTitle}>Used space</p>
      <p className={styles.storageBody}>
        Your team has used {usedPercent}% of your available space. Need more?
      </p>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={usedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
      <div className={styles.storageActions}>
        <button
          type="button"
          className={styles.textButton}
          onClick={() => setDismissed(true)}
        >
          Dismiss
        </button>
        <button
          type="button"
          className={styles.textButtonPrimary}
          onClick={onUpgrade}
        >
          Upgrade plan
        </button>
      </div>
    </section>
  );
}
