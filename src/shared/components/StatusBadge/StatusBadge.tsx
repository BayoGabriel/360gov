import styles from './StatusBadge.module.css';

export type StatusTone = 'info' | 'success' | 'danger' | 'neutral';

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`badge-${tone}`]}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {label}
    </span>
  );
}
