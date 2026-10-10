import type { UserStatus } from '../types/users.types';
import styles from './users.module.css';

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  'in-active': 'In-Active',
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
