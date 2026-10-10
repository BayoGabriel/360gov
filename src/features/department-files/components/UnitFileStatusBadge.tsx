import type { UnitFileStatus } from '../types/department-files.types';
import styles from './department-files.module.css';

const LABELS: Record<UnitFileStatus, string> = {
  processing: 'Processing',
  success: 'Success',
  declined: 'Declined',
};

export function UnitFileStatusBadge({ status }: { status: UnitFileStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {LABELS[status]}
    </span>
  );
}
