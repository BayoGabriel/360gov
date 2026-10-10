import { List } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar } from '../../../shared/components/Avatar/Avatar';
import { formatListTimestamp } from '../../../shared/lib/format-date';
import type { ActivityItem } from '../types/dashboard.types';
import styles from '../dashboard.module.css';
import { PanelCard } from './PanelCard';

export function ActivitiesCard({ items }: { items: ActivityItem[] }) {
  return (
    <PanelCard
      title="Activities Log"
      headerAction={
        <Link to="/reports" className={styles.viewAll}>
          <List size={14} aria-hidden="true" />
          View All
        </Link>
      }
    >
      <ul className={styles.activityList}>
        {items.map((item) => (
          <li key={item.id} className={styles.activityItem}>
            <Avatar name={item.actorName} size={40} />
            <div className={styles.activityBody}>
              <p className={styles.activityName}>{item.actorName}</p>
              <p className={styles.activityHandle}>@{item.actorEmail}</p>
              <p className={styles.activityText}>{item.description}</p>
              <p className={styles.activityDate}>
                {formatListTimestamp(item.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}
