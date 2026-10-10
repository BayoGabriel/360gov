import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { ContractActivity } from '../types/procurement.types';
import styles from './procurement.module.css';

interface ActivityTabProps {
  entries: ContractActivity[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export function ActivityTab({ entries, loading, error, onRetry }: ActivityTabProps) {
  if (loading) {
    return (
      <p className={styles.status} role="status">
        Loading activity…
      </p>
    );
  }
  if (error || !entries) {
    return (
      <div className={styles.status} role="alert">
        <p>The activity trail could not be loaded.</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }
  if (entries.length === 0) {
    return <p className={styles.status}>No activity recorded yet.</p>;
  }

  return (
    <ul className={styles.activityList}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.activityItem}>
          <Avatar name={entry.actor.name} src={entry.actor.avatarUrl} size={34} />
          <span className={styles.activityMeta}>
            <span className={styles.activityText}>{entry.action}</span>
            {entry.detail ? (
              <span className={styles.activityDetail}>{entry.detail}</span>
            ) : null}
            <span className={styles.activityTime}>
              {entry.actor.name} · {formatListTimestamp(entry.timestamp)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
