import type { FileStatus } from '../types/documents.types';
import styles from './documents.module.css';

const STATUS_LABELS: Record<FileStatus, string> = {
  processing: 'Processing',
  success: 'Success',
  declined: 'Declined',
};

export function DocumentStatusBadge({ status }: { status: FileStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
